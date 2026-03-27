import { create } from "zustand";
import {
  deleteRiderRequest,
  getRiderDetailRequest,
  getRiderHistoryRequest,
  getRiderReportsRequest,
  getRidersRequest,
} from "@/api/riders";
import { getApiErrorMessage } from "@/lib/api-error";
import type {
  RiderHistoryItem,
  RiderListItem,
  RiderProfile,
  RiderReportItem,
} from "@/types/rider";

interface RiderStore {
  riders: RiderListItem[];
  selectedRiderProfile: RiderProfile | null;
  selectedRiderHistory: RiderHistoryItem[];
  selectedRiderReports: RiderReportItem[];
  isLoading: boolean;
  isDetailLoading: boolean;
  isHistoryLoading: boolean;
  isReportsLoading: boolean;
  errorMessage: string;
  detailErrorMessage: string;
  historyErrorMessage: string;
  reportsErrorMessage: string;
  fetchRiders: () => Promise<void>;
  fetchRiderDetail: (riderId: string) => Promise<void>;
  fetchRiderHistory: (riderId: string) => Promise<void>;
  fetchRiderReports: (riderId: string) => Promise<void>;
  deleteRider: (riderId: string) => Promise<string>;
}

export const useRiderStore = create<RiderStore>((set) => ({
  riders: [],
  selectedRiderProfile: null,
  selectedRiderHistory: [],
  selectedRiderReports: [],
  isLoading: false,
  isDetailLoading: false,
  isHistoryLoading: false,
  isReportsLoading: false,
  errorMessage: "",
  detailErrorMessage: "",
  historyErrorMessage: "",
  reportsErrorMessage: "",

  fetchRiders: async () => {
    set({
      isLoading: true,
      errorMessage: "",
    });

    try {
      const firstPageResponse = await getRidersRequest();
      let allRiders = firstPageResponse.data.items;
      const { totalPages, limit } = firstPageResponse.data.pagination;

      if (totalPages > 1) {
        const pageRequests = Array.from(
          { length: totalPages - 1 },
          (_, index) => index + 2
        ).map((page) => getRidersRequest({ page, limit }));

        const remainingPages = await Promise.all(pageRequests);

        allRiders = [
          ...allRiders,
          ...remainingPages.flatMap((response) => response.data.items),
        ];
      }

      set({
        riders: allRiders,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        errorMessage: getApiErrorMessage(
          error,
          "Unable to load riders right now."
        ),
      });
    }
  },

  fetchRiderDetail: async (riderId) => {
    set({
      isDetailLoading: true,
      detailErrorMessage: "",
      selectedRiderProfile: null,
    });

    try {
      const response = await getRiderDetailRequest(riderId);

      set({
        selectedRiderProfile: response.data.profile,
        isDetailLoading: false,
      });
    } catch (error) {
      set({
        isDetailLoading: false,
        detailErrorMessage: getApiErrorMessage(
          error,
          "Unable to load this rider right now."
        ),
      });
    }
  },

  fetchRiderHistory: async (riderId) => {
    set({
      isHistoryLoading: true,
      historyErrorMessage: "",
      selectedRiderHistory: [],
    });

    try {
      const response = await getRiderHistoryRequest(riderId);

      set({
        selectedRiderHistory: response.data.items,
        isHistoryLoading: false,
      });
    } catch (error) {
      set({
        isHistoryLoading: false,
        historyErrorMessage: getApiErrorMessage(
          error,
          "Unable to load rider history right now."
        ),
      });
    }
  },

  fetchRiderReports: async (riderId) => {
    set({
      isReportsLoading: true,
      reportsErrorMessage: "",
      selectedRiderReports: [],
    });

    try {
      const response = await getRiderReportsRequest(riderId);

      set({
        selectedRiderReports: response.data.items,
        isReportsLoading: false,
      });
    } catch (error) {
      set({
        isReportsLoading: false,
        reportsErrorMessage: getApiErrorMessage(
          error,
          "Unable to load rider reports right now."
        ),
      });
    }
  },

  deleteRider: async (riderId) => {
    try {
      const response = await deleteRiderRequest(riderId);

      set((state) => ({
        riders: state.riders.filter((rider) => rider._id !== riderId),
        selectedRiderProfile:
          state.selectedRiderProfile?._id === riderId
            ? null
            : state.selectedRiderProfile,
      }));

      return response.message;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "Unable to delete this rider right now.")
      );
    }
  },
}));
