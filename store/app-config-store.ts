import { create } from "zustand";
import { getAppConfigRequest, updateAppConfigRequest } from "@/api/app-config";
import { getApiErrorMessage } from "@/lib/api-error";
import type { AppConfig, UpdateAppConfigPayload } from "@/types/app-config";

interface AppConfigStore {
  config: AppConfig | null;
  isLoading: boolean;
  isSaving: boolean;
  errorMessage: string;
  fetchConfig: () => Promise<void>;
  updateConfig: (payload: UpdateAppConfigPayload) => Promise<string>;
  clearError: () => void;
}

export const useAppConfigStore = create<AppConfigStore>((set) => ({
  config: null,
  isLoading: false,
  isSaving: false,
  errorMessage: "",

  fetchConfig: async () => {
    set({
      isLoading: true,
      errorMessage: "",
    });

    try {
      const response = await getAppConfigRequest();

      set({
        config: response.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        errorMessage: getApiErrorMessage(
          error,
          "Unable to load the app configuration right now."
        ),
      });
    }
  },

  updateConfig: async (payload) => {
    set({
      isSaving: true,
      errorMessage: "",
    });

    try {
      const response = await updateAppConfigRequest(payload);

      set({
        config: response.data,
        isSaving: false,
      });

      return response.message;
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Unable to update the app configuration right now."
      );

      set({
        isSaving: false,
        errorMessage: message,
      });

      throw new Error(message);
    }
  },

  clearError: () => {
    set({
      errorMessage: "",
    });
  },
}));
