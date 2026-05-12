import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  clearAuthSession,
  readAuthSession,
  type StoredAuthSession,
  writeAuthSession,
} from "@/lib/auth-storage";
import type { ApiResponse, RefreshTokenResponseData } from "@/types/auth";

type RequestConfig = {
  _retry?: boolean;
  skipAuthToken?: boolean;
  skipAuthRefresh?: boolean;
};

type AuthRequestConfig = InternalAxiosRequestConfig & RequestConfig;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://api.ma3llc.co";

let refreshPromise: Promise<string | null> | null = null;

const syncSessionState = async (session: StoredAuthSession) => {
  writeAuthSession(session);

  if (typeof window === "undefined") {
    return;
  }

  const { useAuthStore } = await import("@/store/auth-store");
  useAuthStore.getState().syncSessionState(session);
};

const clearSessionState = async () => {
  clearAuthSession();

  if (typeof window !== "undefined") {
    const { useAuthStore } = await import("@/store/auth-store");
    useAuthStore.getState().clearSessionState();

    const protectedPath = window.location.pathname.startsWith("/pages");
    const isChangePasswordPage = window.location.pathname === "/auth/changePassword";

    if (protectedPath || isChangePasswordPage || window.location.pathname === "/") {
      window.location.assign("/auth/signin");
    }
  }
};

const refreshAccessToken = async () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const currentSession = readAuthSession();

    if (!currentSession.refreshToken) {
      await clearSessionState();
      return null;
    }

    const response = await axios.post<ApiResponse<RefreshTokenResponseData>>(
      `${API_BASE_URL}/admin/auth/refresh`,
      { refreshToken: currentSession.refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.data.accessToken) {
      await clearSessionState();
      return null;
    }

    const refreshedSession: StoredAuthSession = {
      admin: response.data.data.admin ?? currentSession.admin,
      accessToken: response.data.data.accessToken,
      refreshToken:
        response.data.data.refreshToken ?? currentSession.refreshToken,
    };

    await syncSessionState(refreshedSession);

    return refreshedSession.accessToken;
  })()
    .catch(async (error) => {
      await clearSessionState();
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const requestConfig = config as AuthRequestConfig;

  if (requestConfig.skipAuthToken) {
    return requestConfig;
  }

  const currentSession = readAuthSession();
  let accessToken = currentSession.accessToken;

  // If the access token is missing after a reload but a refresh token exists,
  // try to restore the session before the protected request is sent.
  if (!accessToken && currentSession.refreshToken && !requestConfig.skipAuthRefresh) {
    accessToken = await refreshAccessToken();
  }

  if (accessToken) {
    const headers = AxiosHeaders.from(requestConfig.headers);
    headers.set("Authorization", `Bearer ${accessToken}`);
    requestConfig.headers = headers;
  }

  return requestConfig;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AuthRequestConfig | undefined;

    if (
      !originalRequest ||
      originalRequest.skipAuthRefresh ||
      originalRequest._retry ||
      error.response?.status !== 401
    ) {
      throw error;
    }

    originalRequest._retry = true;

    const accessToken = await refreshAccessToken();

    if (!accessToken) {
      throw error;
    }

    const headers = AxiosHeaders.from(originalRequest.headers);
    headers.set("Authorization", `Bearer ${accessToken}`);
    originalRequest.headers = headers;

    return apiClient(originalRequest);
  }
);

export type { RequestConfig };
