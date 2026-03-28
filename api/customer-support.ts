import { apiClient } from "@/api/client";
import type { ApiResponse } from "@/types/auth";
import type {
  CustomerSupportDetailResponseData,
  CustomerSupportListResponseData,
} from "@/types/customer-support";

export const getCustomerSupportsRequest = async (params?: {
  page?: number;
  limit?: number;
}) => {
  const response = await apiClient.get<ApiResponse<CustomerSupportListResponseData>>(
    "/admin/customer-support",
    {
      params,
    }
  );

  return response.data;
};

export const getCustomerSupportDetailRequest = async (entryId: string) => {
  const response = await apiClient.get<ApiResponse<CustomerSupportDetailResponseData>>(
    `/admin/customer-support/${entryId}`
  );

  return response.data;
};
