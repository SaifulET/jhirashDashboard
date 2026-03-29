import { create } from "zustand";
import {
  changeNameRequest,
  changePasswordRequest,
  forgotPasswordRequest,
  logoutRequest,
  setNewPasswordRequest,
  signInRequest,
  verifyCodeRequest,
} from "@/api/auth";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  clearAuthSession,
  clearPasswordResetState,
  readAuthSession,
  readPasswordResetState,
  type StoredAuthSession,
  writeAuthSession,
  writePasswordResetState,
} from "@/lib/auth-storage";
import type { Admin } from "@/types/auth";

interface AuthStore {
  admin: Admin | null;
  accessToken: string | null;
  refreshToken: string | null;
  forgotPasswordEmail: string;
  resetToken: string | null;
  isHydrated: boolean;
  hydrateAuth: () => void;
  syncSessionState: (session: StoredAuthSession) => void;
  clearSessionState: () => void;
  signIn: (payload: { email: string; password: string }) => Promise<string>;
  requestPasswordReset: (email: string) => Promise<string>;
  verifyResetCode: (code: string) => Promise<string>;
  resendResetCode: () => Promise<string>;
  setNewPassword: (
    newPassword: string,
    confirmPassword: string
  ) => Promise<string>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => Promise<string>;
  updateName: (name: string) => Promise<string>;
  logout: () => Promise<void>;
  clearPasswordResetFlow: () => void;
}

const emptySession: StoredAuthSession = {
  admin: null,
  accessToken: null,
  refreshToken: null,
};

const emptyPasswordResetFlow = {
  forgotPasswordEmail: "",
  resetToken: null as string | null,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...emptySession,
  ...emptyPasswordResetFlow,
  isHydrated: false,

  hydrateAuth: () => {
    const session = readAuthSession();
    const passwordResetFlow = readPasswordResetState();

    set({
      ...session,
      forgotPasswordEmail: passwordResetFlow.email,
      resetToken: passwordResetFlow.resetToken,
      isHydrated: true,
    });
  },

  syncSessionState: (session) => {
    writeAuthSession(session);

    set({
      ...session,
      isHydrated: true,
    });
  },

  clearSessionState: () => {
    clearAuthSession();

    set({
      ...emptySession,
      isHydrated: true,
    });
  },

  signIn: async ({ email, password }) => {
    try {
      const response = await signInRequest({ email, password });
      const session: StoredAuthSession = {
        admin: response.data.admin,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };

      writeAuthSession(session);
      clearPasswordResetState();

      set({
        ...session,
        ...emptyPasswordResetFlow,
        isHydrated: true,
      });

      return response.message;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "Unable to sign in. Please try again.")
      );
    }
  },

  requestPasswordReset: async (email) => {
    try {
      const response = await forgotPasswordRequest({ email });

      writePasswordResetState({
        email,
        resetToken: null,
      });

      set({
        forgotPasswordEmail: email,
        resetToken: null,
      });

      return response.message;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(
          error,
          "Unable to send the verification code right now."
        )
      );
    }
  },

  verifyResetCode: async (code) => {
    const { forgotPasswordEmail } = get();

    if (!forgotPasswordEmail) {
      throw new Error("Please enter your email again to continue.");
    }

    try {
      const response = await verifyCodeRequest({
        email: forgotPasswordEmail,
        code,
      });

      writePasswordResetState({
        email: forgotPasswordEmail,
        resetToken: response.data.resetToken,
      });

      set({
        resetToken: response.data.resetToken,
      });

      return response.message;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "The verification code is not valid.")
      );
    }
  },

  resendResetCode: async () => {
    const { forgotPasswordEmail } = get();

    if (!forgotPasswordEmail) {
      throw new Error("Please enter your email again to continue.");
    }

    try {
      const response = await forgotPasswordRequest({
        email: forgotPasswordEmail,
      });

      writePasswordResetState({
        email: forgotPasswordEmail,
        resetToken: null,
      });

      set({
        resetToken: null,
      });

      return response.message;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(
          error,
          "Unable to resend the verification code right now."
        )
      );
    }
  },

  setNewPassword: async (newPassword, confirmPassword) => {
    const { resetToken } = get();

    if (!resetToken) {
      throw new Error("Your reset session has expired. Please request a new code.");
    }

    try {
      const response = await setNewPasswordRequest({
        resetToken,
        newPassword,
        confirmPassword,
      });

      clearPasswordResetState();

      set({
        ...emptyPasswordResetFlow,
      });

      return response.message;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(
          error,
          "Unable to set the new password. Please try again."
        )
      );
    }
  },

  changePassword: async (
    currentPassword,
    newPassword,
    confirmPassword
  ) => {
    try {
      const response = await changePasswordRequest({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      return response.message;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(
          error,
          "Unable to change the password. Please try again."
        )
      );
    }
  },

  updateName: async (name) => {
    const normalizedName = name.trim();

    if (!normalizedName) {
      throw new Error("Name is required.");
    }

    try {
      const response = await changeNameRequest({
        name: normalizedName,
      });
      const currentSession = readAuthSession();
      const fallbackAdmin = get().admin ?? currentSession.admin;
      const nextAdmin =
        response.data?.admin ??
        (fallbackAdmin
          ? {
              ...fallbackAdmin,
              name: response.data?.name ?? normalizedName,
            }
          : null);

      if (nextAdmin) {
        const nextSession = {
          ...currentSession,
          admin: nextAdmin,
        };

        writeAuthSession(nextSession);

        set({
          admin: nextAdmin,
          accessToken: nextSession.accessToken,
          refreshToken: nextSession.refreshToken,
          isHydrated: true,
        });
      }

      return response.message;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(
          error,
          "Unable to update your name right now."
        )
      );
    }
  },

  logout: async () => {
    const { refreshToken } = get();

    try {
      if (refreshToken) {
        await logoutRequest(refreshToken);
      }
    } catch {
      // Clear the local session even if the API logout request fails.
    } finally {
      clearAuthSession();
      clearPasswordResetState();

      set({
        ...emptySession,
        ...emptyPasswordResetFlow,
        isHydrated: true,
      });
    }
  },

  clearPasswordResetFlow: () => {
    clearPasswordResetState();

    set({
      ...emptyPasswordResetFlow,
    });
  },
}));
