import { apiClient } from "@/api/client";
import type { ApiResponse } from "@/types/auth";
import type {
  DriverDetailResponseData,
  DriverDocumentDetail,
  DriverDocumentsResponseData,
  DriverHistoryResponseData,
  DriverReportsResponseData,
  ReviewDriverDocumentPayload,
  ReviewDriverDocumentResponseData,
  DriversResponseData,
} from "@/types/driver";

export const getDriversRequest = async (params?: {
  page?: number;
  limit?: number;
}) => {
  const response = await apiClient.get<ApiResponse<DriversResponseData>>(
    "/admin/drivers",
    {
      params,
    }
  );

  return response.data;
};

export const getDriverDetailRequest = async (driverId: string) => {
  const response = await apiClient.get<ApiResponse<DriverDetailResponseData>>(
    `/admin/drivers/${driverId}`
  );

  return response.data;
};

export const getDriverDocumentsRequest = async (driverId: string) => {
  const response = await apiClient.get<ApiResponse<DriverDocumentsResponseData>>(
    `/admin/drivers/${driverId}/documents`
  );

  return response.data;
};

export const getDriverDocumentDetailRequest = async (
  driverId: string,
  type: string
) => {
  const response = await apiClient.get<ApiResponse<DriverDocumentDetail>>(
    `/admin/drivers/${driverId}/documents/${type}`
  );

  return response.data;
};

export const reviewDriverDocumentRequest = async (
  driverId: string,
  type: string,
  payload: ReviewDriverDocumentPayload
) => {
  const response = await apiClient.patch<
    ApiResponse<ReviewDriverDocumentResponseData>
  >(`/admin/drivers/${driverId}/documents/${type}/review`, payload);

  return response.data;
};

export const updateDriverAccountStatusRequest = async (
  driverId: string,
  payload: { status: "active" | "suspended" | "pending" }
) => {
  const response = await apiClient.patch<ApiResponse<{ message?: string }>>(
    `/admin/drivers/${driverId}/account-status`,
    payload
  );

  return response.data;
};

export const deleteDriverRequest = async (driverId: string) => {
  const response = await apiClient.delete<ApiResponse<{ message?: string }>>(
    `/admin/drivers/${driverId}`
  );

  return response.data;
};

export const hardDeleteDriverRequest = async (driverId: string) => {
  const response = await apiClient.delete<ApiResponse<{ message?: string }>>(
    `/admin/drivers/${driverId}/hard-delete`
  );

  return response.data;
};

export const getDriverHistoryRequest = async (driverId: string) => {
  const response = await apiClient.get<ApiResponse<DriverHistoryResponseData>>(
    `/admin/drivers/${driverId}/history`
  );

  return response.data;
};

export const getDriverReportsRequest = async (driverId: string) => {
  const response = await apiClient.get<ApiResponse<DriverReportsResponseData>>(
    `/admin/drivers/${driverId}/reports`
  );

  return response.data;
};
