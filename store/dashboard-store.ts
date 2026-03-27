import { create } from "zustand";
import {
  getDashboardAnalyticsRequest,
  getDashboardOverviewRequest,
} from "@/api/dashboard";
import { getApiErrorMessage } from "@/lib/api-error";
import type {
  DashboardAnalyticsData,
  DashboardOverviewData,
} from "@/types/dashboard";

interface DashboardStore {
  overview: DashboardOverviewData | null;
  analytics: DashboardAnalyticsData | null;
  isLoading: boolean;
  isAnalyticsLoading: boolean;
  errorMessage: string;
  analyticsErrorMessage: string;
  fetchOverview: (month: number, year: number) => Promise<void>;
  fetchAnalytics: (year: number) => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  overview: null,
  analytics: null,
  isLoading: false,
  isAnalyticsLoading: false,
  errorMessage: "",
  analyticsErrorMessage: "",

  fetchOverview: async (month, year) => {
    set({
      isLoading: true,
      errorMessage: "",
    });

    try {
      const response = await getDashboardOverviewRequest({ month, year });

      set({
        overview: response.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        errorMessage: getApiErrorMessage(
          error,
          "Unable to load dashboard overview right now."
        ),
      });
    }
  },

  fetchAnalytics: async (year) => {
    set({
      isAnalyticsLoading: true,
      analyticsErrorMessage: "",
    });

    try {
      const response = await getDashboardAnalyticsRequest({ year });

      set({
        analytics: response.data,
        isAnalyticsLoading: false,
      });
    } catch (error) {
      set({
        isAnalyticsLoading: false,
        analyticsErrorMessage: getApiErrorMessage(
          error,
          "Unable to load dashboard analytics right now."
        ),
      });
    }
  },
}));
