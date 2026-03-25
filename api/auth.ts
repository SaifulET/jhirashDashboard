import type { AxiosRequestConfig } from "axios";
import { apiClient, type RequestConfig } from "@/api/client";
import type {
  ApiResponse,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  RefreshTokenResponseData,
  SetNewPasswordPayload,
  SignInPayload,
  SignInResponseData,
  VerifyCodePayload,
  VerifyCodeResponseData,
} from "@/types/auth";

type ExtendedAxiosConfig = AxiosRequestConfig & RequestConfig;

const publicRequestConfig: ExtendedAxiosConfig = {
  skipAuthToken: true,
  skipAuthRefresh: true,
};

const authOnlyRequestConfig: ExtendedAxiosConfig = {
  skipAuthRefresh: true,
};

export const signInRequest = async (payload: SignInPayload) => {
  const response = await apiClient.post<ApiResponse<SignInResponseData>>(
    "/admin/auth/signin",
    payload,
    publicRequestConfig
  );

  return response.data;
};

export const forgotPasswordRequest = async (payload: ForgotPasswordPayload) => {
  const response = await apiClient.post<ApiResponse<{ message: string }>>(
    "/admin/auth/forgot-password",
    payload,
    publicRequestConfig
  );

  return response.data;
};

export const verifyCodeRequest = async (payload: VerifyCodePayload) => {
  const response = await apiClient.post<ApiResponse<VerifyCodeResponseData>>(
    "/admin/auth/verify-code",
    payload,
    publicRequestConfig
  );

  return response.data;
};

export const setNewPasswordRequest = async (
  payload: SetNewPasswordPayload
) => {
  const response = await apiClient.post<ApiResponse<{ message?: string }>>(
    "/admin/auth/set-new-password",
    payload,
    publicRequestConfig
  );

  return response.data;
};

export const changePasswordRequest = async (
  payload: ChangePasswordPayload
) => {
  const response = await apiClient.post<ApiResponse<{ message?: string }>>(
    "/admin/auth/change-password",
    payload,
    authOnlyRequestConfig
  );

  return response.data;
};

export const logoutRequest = async (refreshToken: string) => {
  const response = await apiClient.post<ApiResponse<{ message?: string }>>(
    "/admin/auth/logout",
    { refreshToken },
    authOnlyRequestConfig
  );

  return response.data;
};

export const refreshTokenRequest = async (refreshToken: string) => {
  const response = await apiClient.post<ApiResponse<RefreshTokenResponseData>>(
    "/auth/refresh",
    { refreshToken },
    publicRequestConfig
  );

  return response.data;
};
