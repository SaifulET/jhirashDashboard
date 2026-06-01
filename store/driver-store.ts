import { create } from "zustand";
import {
  deleteDriverRequest,
  getDriverDetailRequest,
  getDriverDocumentDetailRequest,
  getDriverDocumentsRequest,
  getDriverHistoryRequest,
  getDriverReportsRequest,
  getDriversRequest,
  hardDeleteDriverRequest,
  reviewDriverDocumentRequest,
  updateDriverAccountStatusRequest,
} from "@/api/drivers";
import { getApiErrorMessage } from "@/lib/api-error";
import type {
  DriverDocument,
  DriverDocumentDetail,
  DriverHistoryItem,
  DriverListItem,
  DriverProfile,
  DriverReportItem,
  ReviewDriverDocumentPayload,
} from "@/types/driver";

interface DriverStore {
  drivers: DriverListItem[];
  selectedDriverProfile: DriverProfile | null;
  selectedDriverDocuments: DriverDocument[];
  selectedDriverDocumentDetail: DriverDocumentDetail | null;
  selectedDriverHistory: DriverHistoryItem[];
  selectedDriverReports: DriverReportItem[];
  isLoading: boolean;
  isDetailLoading: boolean;
  isDocumentsLoading: boolean;
  isDocumentDetailLoading: boolean;
  isReviewingDocument: boolean;
  isHistoryLoading: boolean;
  isReportsLoading: boolean;
  errorMessage: string;
  detailErrorMessage: string;
  documentsErrorMessage: string;
  documentDetailErrorMessage: string;
  historyErrorMessage: string;
  reportsErrorMessage: string;
  fetchDrivers: () => Promise<void>;
  fetchDriverDetail: (driverId: string) => Promise<void>;
  fetchDriverDocuments: (driverId: string) => Promise<void>;
  fetchDriverDocumentDetail: (driverId: string, type: string) => Promise<void>;
  fetchDriverHistory: (driverId: string) => Promise<void>;
  fetchDriverReports: (driverId: string) => Promise<void>;
  clearDriverDocumentDetail: () => void;
  reviewDriverDocument: (
    driverId: string,
    type: string,
    payload: ReviewDriverDocumentPayload
  ) => Promise<string>;
  updateDriverAccountStatus: (
    driverId: string,
    status: "active" | "suspended" | "pending"
  ) => Promise<string>;
  deleteDriver: (driverId: string) => Promise<string>;
  hardDeleteDriver: (driverId: string) => Promise<string>;
}

export const useDriverStore = create<DriverStore>((set) => ({
  drivers: [],
  selectedDriverProfile: null,
  selectedDriverDocuments: [],
  selectedDriverDocumentDetail: null,
  selectedDriverHistory: [],
  selectedDriverReports: [],
  isLoading: false,
  isDetailLoading: false,
  isDocumentsLoading: false,
  isDocumentDetailLoading: false,
  isReviewingDocument: false,
  isHistoryLoading: false,
  isReportsLoading: false,
  errorMessage: "",
  detailErrorMessage: "",
  documentsErrorMessage: "",
  documentDetailErrorMessage: "",
  historyErrorMessage: "",
  reportsErrorMessage: "",

  fetchDrivers: async () => {
    set({
      isLoading: true,
      errorMessage: "",
    });

    try {
      const firstPageResponse = await getDriversRequest();
      let allDrivers = firstPageResponse.data.items;
      const { totalPages, limit } = firstPageResponse.data.pagination;

      if (totalPages > 1) {
        const pageRequests = Array.from(
          { length: totalPages - 1 },
          (_, index) => index + 2
        ).map((page) => getDriversRequest({ page, limit }));

        const remainingPages = await Promise.all(pageRequests);

        allDrivers = [
          ...allDrivers,
          ...remainingPages.flatMap((response) => response.data.items),
        ];
      }

      set({
        drivers: allDrivers,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        errorMessage: getApiErrorMessage(
          error,
          "Unable to load drivers right now."
        ),
      });
    }
  },

  fetchDriverDetail: async (driverId) => {
    set({
      isDetailLoading: true,
      detailErrorMessage: "",
      selectedDriverProfile: null,
    });

    try {
      const response = await getDriverDetailRequest(driverId);

      set({
        selectedDriverProfile: response.data.profile,
        isDetailLoading: false,
      });
    } catch (error) {
      set({
        isDetailLoading: false,
        detailErrorMessage: getApiErrorMessage(
          error,
          "Unable to load this driver right now."
        ),
      });
    }
  },

  fetchDriverDocuments: async (driverId) => {
    set({
      isDocumentsLoading: true,
      documentsErrorMessage: "",
      selectedDriverDocuments: [],
    });

    try {
      const response = await getDriverDocumentsRequest(driverId);

      set({
        selectedDriverDocuments: response.data.documents,
        isDocumentsLoading: false,
      });
    } catch (error) {
      set({
        isDocumentsLoading: false,
        documentsErrorMessage: getApiErrorMessage(
          error,
          "Unable to load driver documents right now."
        ),
      });
    }
  },

  fetchDriverDocumentDetail: async (driverId, type) => {
    set({
      isDocumentDetailLoading: true,
      documentDetailErrorMessage: "",
      selectedDriverDocumentDetail: null,
    });

    try {
      const response = await getDriverDocumentDetailRequest(driverId, type);

      set({
        selectedDriverDocumentDetail: response.data,
        isDocumentDetailLoading: false,
      });
    } catch (error) {
      set({
        isDocumentDetailLoading: false,
        documentDetailErrorMessage: getApiErrorMessage(
          error,
          "Unable to load this document right now."
        ),
      });
    }
  },

  fetchDriverHistory: async (driverId) => {
    set({
      isHistoryLoading: true,
      historyErrorMessage: "",
      selectedDriverHistory: [],
    });

    try {
      const response = await getDriverHistoryRequest(driverId);

      set({
        selectedDriverHistory: response.data.items,
        isHistoryLoading: false,
      });
    } catch (error) {
      set({
        isHistoryLoading: false,
        historyErrorMessage: getApiErrorMessage(
          error,
          "Unable to load driver history right now."
        ),
      });
    }
  },

  fetchDriverReports: async (driverId) => {
    set({
      isReportsLoading: true,
      reportsErrorMessage: "",
      selectedDriverReports: [],
    });

    try {
      const response = await getDriverReportsRequest(driverId);

      set({
        selectedDriverReports: response.data.items,
        isReportsLoading: false,
      });
    } catch (error) {
      set({
        isReportsLoading: false,
        reportsErrorMessage: getApiErrorMessage(
          error,
          "Unable to load driver reports right now."
        ),
      });
    }
  },

  clearDriverDocumentDetail: () => {
    set({
      selectedDriverDocumentDetail: null,
      documentDetailErrorMessage: "",
      isDocumentDetailLoading: false,
    });
  },

  reviewDriverDocument: async (driverId, type, payload) => {
    set({
      isReviewingDocument: true,
      documentDetailErrorMessage: "",
    });

    try {
      const response = await reviewDriverDocumentRequest(driverId, type, payload);

      set((state) => ({
        isReviewingDocument: false,
        selectedDriverProfile: state.selectedDriverProfile
          ? {
              ...state.selectedDriverProfile,
              documentsStatus: response.data.driverProfile.documentsStatus,
              requiredActionsCount:
                response.data.driverProfile.requiredActionsCount,
            }
          : state.selectedDriverProfile,
      }));

      return response.message;
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Unable to review this document right now."
      );

      set({
        isReviewingDocument: false,
        documentDetailErrorMessage: message,
      });

      throw new Error(message);
    }
  },

  updateDriverAccountStatus: async (driverId, status) => {
    try {
      const response = await updateDriverAccountStatusRequest(driverId, {
        status,
      });

      set((state) => ({
        drivers: state.drivers.map((driver) =>
          driver._id === driverId
            ? {
                ...driver,
                driverStatus: status,
              }
            : driver
        ),
        selectedDriverProfile:
          state.selectedDriverProfile?._id === driverId
            ? {
                ...state.selectedDriverProfile,
                driverStatus: status,
              }
            : state.selectedDriverProfile,
      }));

      return response.message;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(
          error,
          "Unable to update the driver account status right now."
        )
      );
    }
  },

  deleteDriver: async (driverId) => {
    try {
      const response = await deleteDriverRequest(driverId);

      set((state) => ({
        drivers: state.drivers.filter((driver) => driver._id !== driverId),
        selectedDriverProfile:
          state.selectedDriverProfile?._id === driverId
            ? null
            : state.selectedDriverProfile,
      }));

      return response.message;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(
          error,
          "Unable to delete this driver right now."
        )
      );
    }
  },

  hardDeleteDriver: async (driverId) => {
    try {
      const response = await hardDeleteDriverRequest(driverId);

      set((state) => ({
        drivers: state.drivers.filter((driver) => driver._id !== driverId),
        selectedDriverProfile:
          state.selectedDriverProfile?._id === driverId
            ? null
            : state.selectedDriverProfile,
      }));

      return response.message;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(
          error,
          "Unable to permanently delete this driver right now."
        )
      );
    }
  },
}));
