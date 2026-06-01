'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical } from 'lucide-react';
import { usePaymentStore } from '@/store/payment-store';

const ITEMS_PER_PAGE = 5;

const formatCurrency = (currency: string, value: number) => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
};

const formatPercent = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '';
  }

  return `(${Number.isInteger(value) ? value : value.toFixed(2)}%)`;
};

export default function PaymentInformation() {
  const router = useRouter();
  const payments = usePaymentStore((state) => state.payments);
  const paymentSharePercentages = usePaymentStore(
    (state) => state.paymentSharePercentages
  );
  const isLoading = usePaymentStore((state) => state.isLoading);
  const errorMessage = usePaymentStore((state) => state.errorMessage);
  const fetchPayments = usePaymentStore((state) => state.fetchPayments);
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionPaymentId, setOpenActionPaymentId] = useState<string | null>(
    null
  );
  const [actionMenuPosition, setActionMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const actionButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    void fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        !target.closest('[data-payment-action]') &&
        !target.closest('[data-payment-action-menu]')
      ) {
        setOpenActionPaymentId(null);
        setActionMenuPosition(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(payments.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPayments = payments.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleView = (riderId: string, tripId: string) => {
    setOpenActionPaymentId(null);
    setActionMenuPosition(null);
    router.push(
      `/pages/payment-information/${tripId}?riderId=${encodeURIComponent(riderId)}`
    );
  };

  const handleToggleActionMenu = (paymentId: string) => {
    if (openActionPaymentId === paymentId) {
      setOpenActionPaymentId(null);
      setActionMenuPosition(null);
      return;
    }

    const button = actionButtonRefs.current[paymentId];

    if (!button) {
      return;
    }

    const rect = button.getBoundingClientRect();

    setOpenActionPaymentId(paymentId);
    setActionMenuPosition({
      top: rect.bottom + 8,
      left: rect.right - 144,
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] p-8 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">
            Payment Information
          </h1>
          <p className="text-sm text-gray-600">
            This section will show payment information you have earned from this
            app.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <div className="flex items-center justify-between gap-4">
              <span>{errorMessage}</span>
              <button
                onClick={() => void fetchPayments()}
                disabled={isLoading}
                className="shrink-0 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-70"
              >
                {isLoading ? 'Retrying...' : 'Retry'}
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#E8E8EA]">
                <th className="text-left px-6 py-3.5 text-sm font-semibold text-gray-700">
                  NO.
                </th>
                <th className="text-left px-6 py-3.5 text-sm font-semibold text-gray-700">
                  Driver name
                </th>
                <th className="text-left px-6 py-3.5 text-sm font-semibold text-gray-700">
                  Total Fare
                </th>
                <th className="text-left px-6 py-3.5 text-sm font-semibold text-gray-700">
                  Driver gets{formatPercent(paymentSharePercentages?.driverGets)}
                </th>
                <th className="text-left px-6 py-3.5 text-sm font-semibold text-gray-700">
                  Received{formatPercent(paymentSharePercentages?.received)}
                </th>
                <th className="text-left px-6 py-3.5 text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {isLoading && !payments.length && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    Loading payments...
                  </td>
                </tr>
              )}

              {!isLoading && currentPayments.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    No payment records found.
                  </td>
                </tr>
              )}

              {currentPayments.map((payment) => (
                <tr
                  key={payment._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {payment.no}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {payment.driverName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatCurrency(payment.currency, payment.totalFare)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatCurrency(payment.currency, payment.driverGets)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatCurrency(payment.currency, payment.received)}
                  </td>
                  <td className="px-6 py-4">
                    {payment.rider?._id && payment.tripId ? (
                      <div className="inline-block" data-payment-action>
                        <button
                          ref={(element) => {
                            actionButtonRefs.current[payment._id] = element;
                          }}
                          onClick={() => handleToggleActionMenu(payment._id)}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            No of Results {payments.length} out of {payments.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {'<'}
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;

              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-gray-800 text-white border-gray-800'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {'>'}
            </button>
          </div>
        </div>
      </div>

      {openActionPaymentId && actionMenuPosition && (
        <div
          data-payment-action-menu
          className="fixed z-40 w-36 rounded-lg border border-gray-200 bg-white shadow-lg"
          style={{
            top: actionMenuPosition.top,
            left: actionMenuPosition.left,
          }}
        >
          {(() => {
            const activePayment = payments.find(
              (payment) => payment._id === openActionPaymentId
            );

            if (!activePayment || !activePayment.rider?._id || !activePayment.tripId) {
              return null;
            }

            return (
              <button
                onClick={() =>
                  handleView(activePayment.rider!._id, activePayment.tripId!)
                }
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View
              </button>
            );
          })()}
        </div>
      )}
    </div>
  );
}
