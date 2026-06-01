import { apiClient } from "@/api/client";
import type { ApiResponse } from "@/types/auth";
import type {
  RiderDetailResponseData,
  RiderHistoryResponseData,
  RiderReportsResponseData,
  RidersResponseData,
} from "@/types/rider";

export const getRidersRequest = async (params?: {
  page?: number;
  limit?: number;
}) => {
  const response = await apiClient.get<ApiResponse<RidersResponseData>>(
    "/admin/riders",
    {
      params,
    }
  );

  return response.data;
};

export const getRiderDetailRequest = async (riderId: string) => {
  const response = await apiClient.get<ApiResponse<RiderDetailResponseData>>(
    `/admin/riders/${riderId}`
  );

  return response.data;
};

export const deleteRiderRequest = async (riderId: string) => {
  const response = await apiClient.delete<ApiResponse<{ message?: string }>>(
    `/admin/riders/${riderId}`
  );

  return response.data;
};

export const hardDeleteRiderRequest = async (riderId: string) => {
  const response = await apiClient.delete<ApiResponse<{ message?: string }>>(
    `/admin/riders/${riderId}/hard-delete`
  );

  return response.data;
};

export const getRiderHistoryRequest = async (riderId: string) => {
  const response = await apiClient.get<ApiResponse<RiderHistoryResponseData>>(
    `/admin/riders/${riderId}/history`
  );

  return response.data;
};

export const getRiderReportsRequest = async (riderId: string) => {
  const response = await apiClient.get<ApiResponse<RiderReportsResponseData>>(
    `/admin/riders/${riderId}/reports`
  );

  return response.data;
};
