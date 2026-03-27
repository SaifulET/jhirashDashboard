import { apiClient } from "@/api/client";
import type { ApiResponse } from "@/types/auth";
import type {
  DashboardAnalyticsData,
  DashboardOverviewData,
} from "@/types/dashboard";

export const getDashboardOverviewRequest = async (params: {
  month: number;
  year: number;
}) => {
  const response = await apiClient.get<ApiResponse<DashboardOverviewData>>(
    "/admin/dashboard/overview",
    {
      params,
    }
  );

  return response.data;
};

export const getDashboardAnalyticsRequest = async (params: { year: number }) => {
  const response = await apiClient.get<ApiResponse<DashboardAnalyticsData>>(
    "/admin/dashboard/analytics",
    {
      params,
    }
  );

  return response.data;
};
