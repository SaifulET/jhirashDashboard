import { create } from "zustand";
import {
  getPaymentSharePercentagesRequest,
  getRiderPaymentTripDetailRequest,
  getRiderPaymentsRequest,
} from "@/api/payments";
import { getApiErrorMessage } from "@/lib/api-error";
import type {
  PaymentSharePercentages,
  RiderPaymentItem,
  RiderPaymentTripDetailResponseData,
} from "@/types/payment";

interface PaymentStore {
  payments: RiderPaymentItem[];
  paymentSharePercentages: PaymentSharePercentages | null;
  selectedTripDetail: RiderPaymentTripDetailResponseData | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  errorMessage: string;
  detailErrorMessage: string;
  fetchPayments: () => Promise<void>;
  fetchTripDetail: (riderId: string, tripId: string) => Promise<void>;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  payments: [],
  paymentSharePercentages: null,
  selectedTripDetail: null,
  isLoading: false,
  isDetailLoading: false,
  errorMessage: "",
  detailErrorMessage: "",

  fetchPayments: async () => {
    set({
      isLoading: true,
      errorMessage: "",
    });

    try {
      const [firstPageResponse, sharePercentagesResponse] = await Promise.all([
        getRiderPaymentsRequest(),
        getPaymentSharePercentagesRequest(),
      ]);
      let allPayments = firstPageResponse.data.items;
      const { totalPages, limit } = firstPageResponse.data.pagination;

      if (totalPages > 1) {
        const pageRequests = Array.from(
          { length: totalPages - 1 },
          (_, index) => index + 2
        ).map((page) => getRiderPaymentsRequest({ page, limit }));

        const remainingPages = await Promise.all(pageRequests);

        allPayments = [
          ...allPayments,
          ...remainingPages.flatMap((response) => response.data.items),
        ];
      }

      set({
        payments: allPayments,
        paymentSharePercentages: sharePercentagesResponse.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        errorMessage: getApiErrorMessage(
          error,
          "Unable to load payment information right now."
        ),
      });
    }
  },

  fetchTripDetail: async (riderId, tripId) => {
    set({
      isDetailLoading: true,
      detailErrorMessage: "",
      selectedTripDetail: null,
    });

    try {
      const response = await getRiderPaymentTripDetailRequest(riderId, tripId);

      set({
        selectedTripDetail: response.data,
        isDetailLoading: false,
      });
    } catch (error) {
      set({
        isDetailLoading: false,
        detailErrorMessage: getApiErrorMessage(
          error,
          "Unable to load this payment trip right now."
        ),
      });
    }
  },
}));
