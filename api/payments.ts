import { apiClient } from "@/api/client";
import type { ApiResponse } from "@/types/auth";
import type {
  PaymentSharePercentages,
  RiderPaymentsResponseData,
  RiderPaymentTripDetailResponseData,
} from "@/types/payment";

export const getRiderPaymentsRequest = async (params?: {
  page?: number;
  limit?: number;
}) => {
  const response = await apiClient.get<ApiResponse<RiderPaymentsResponseData>>(
    "/admin/riders/payments",
    {
      params,
    }
  );

  return response.data;
};

export const getPaymentSharePercentagesRequest = async () => {
  const response = await apiClient.get<ApiResponse<PaymentSharePercentages>>(
    "/admin/config/payment-share"
  );

  return response.data;
};

export const getRiderPaymentTripDetailRequest = async (
  riderId: string,
  tripId: string
) => {
  const response = await apiClient.get<
    ApiResponse<RiderPaymentTripDetailResponseData>
  >(`/admin/riders/${riderId}/history/${tripId}`);

  return response.data;
};
