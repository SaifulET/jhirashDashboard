import { create } from "zustand";
import {
  getCustomerSupportDetailRequest,
  getCustomerSupportsRequest,
} from "@/api/customer-support";
import { getApiErrorMessage } from "@/lib/api-error";
import type {
  CustomerSupportDetailItem,
  CustomerSupportItem,
  CustomerSupportPagination,
} from "@/types/customer-support";

const DEFAULT_LIMIT = 10;

interface CustomerSupportStore {
  tickets: CustomerSupportItem[];
  selectedTicket: CustomerSupportDetailItem | null;
  pagination: CustomerSupportPagination | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  errorMessage: string;
  detailErrorMessage: string;
  fetchCustomerSupports: () => Promise<void>;
  fetchCustomerSupportDetail: (ticketId: string) => Promise<void>;
  clearSelectedTicket: () => void;
}

export const useCustomerSupportStore = create<CustomerSupportStore>((set, get) => ({
  tickets: [],
  selectedTicket: null,
  pagination: null,
  isLoading: false,
  isDetailLoading: false,
  errorMessage: "",
  detailErrorMessage: "",

  fetchCustomerSupports: async () => {
    set({
      isLoading: true,
      errorMessage: "",
    });

    try {
      const firstPageResponse = await getCustomerSupportsRequest({
        page: 1,
        limit: DEFAULT_LIMIT,
      });
      let allTickets = firstPageResponse.data.items;
      const firstPagination = firstPageResponse.data.pagination;

      if (firstPagination.totalPages > 1) {
        const pageRequests = Array.from(
          { length: firstPagination.totalPages - 1 },
          (_, index) => index + 2
        ).map((page) =>
          getCustomerSupportsRequest({
            page,
            limit: firstPagination.limit || DEFAULT_LIMIT,
          })
        );

        const remainingPages = await Promise.all(pageRequests);

        allTickets = [
          ...allTickets,
          ...remainingPages.flatMap((response) => response.data.items),
        ];
      }

      set({
        tickets: allTickets,
        pagination: {
          ...firstPagination,
          total: allTickets.length,
          totalPages: Math.max(
            1,
            Math.ceil(allTickets.length / (firstPagination.limit || DEFAULT_LIMIT))
          ),
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        errorMessage: getApiErrorMessage(
          error,
          "Unable to load customer support items right now."
        ),
      });
    }
  },

  fetchCustomerSupportDetail: async (ticketId) => {
    set({
      isDetailLoading: true,
      detailErrorMessage: "",
      selectedTicket: null,
    });

    try {
      const response = await getCustomerSupportDetailRequest(ticketId);

      set({
        selectedTicket: response.data.item,
        isDetailLoading: false,
      });
    } catch (error) {
      set({
        isDetailLoading: false,
        detailErrorMessage: getApiErrorMessage(
          error,
          "Unable to load this customer support item right now."
        ),
      });
    }
  },

  clearSelectedTicket: () => {
    set({
      selectedTicket: null,
      detailErrorMessage: "",
      isDetailLoading: false,
    });
  },
}));
