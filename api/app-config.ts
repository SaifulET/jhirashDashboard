import { apiClient } from "@/api/client";
import type { ApiResponse } from "@/types/auth";
import type { AppConfig, UpdateAppConfigPayload } from "@/types/app-config";

export const getAppConfigRequest = async () => {
  const response = await apiClient.get<ApiResponse<AppConfig>>("/admin/config/");
  return response.data;
};

export const updateAppConfigRequest = async (payload: UpdateAppConfigPayload) => {
  const response = await apiClient.patch<ApiResponse<AppConfig>>(
    "/admin/config/",
    payload
  );

  return response.data;
};
