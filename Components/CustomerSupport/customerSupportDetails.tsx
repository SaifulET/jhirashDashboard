'use client';

import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useCustomerSupportStore } from '@/store/customer-support-store';

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const toSentenceCase = (value: string | null | undefined) => {
  if (!value) {
    return 'N/A';
  }

  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const formatComplaint = (value: boolean) => (value ? 'Yes' : 'No');

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'resolved':
    case 'closed':
      return 'bg-[#D7FFEA] text-[#05895A]';
    case 'pending':
    default:
      return 'bg-[#FEE4D6] text-[#E26A02]';
  }
};

const getInitials = (value: string | null | undefined) => {
  if (!value) {
    return 'NA';
  }

  return value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
};

const getJsonPreview = (value: unknown) => {
  if (!value) {
    return 'N/A';
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return 'N/A';
  }
};

const InfoRow: React.FC<{ label: string; value: string | null | undefined }> = ({
  label,
  value,
}) => (
  <div className="rounded-lg bg-gray-50 px-4 py-3">
    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
      {label}
    </p>
    <p className="mt-1 text-sm text-gray-900 break-words">{value || 'N/A'}</p>
  </div>
);

const ReportDetails: React.FC = () => {
  const params = useParams<{ slug: string }>();
  const ticketId = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const selectedTicket = useCustomerSupportStore((state) => state.selectedTicket);
  const isDetailLoading = useCustomerSupportStore((state) => state.isDetailLoading);
  const detailErrorMessage = useCustomerSupportStore(
    (state) => state.detailErrorMessage
  );
  const fetchCustomerSupportDetail = useCustomerSupportStore(
    (state) => state.fetchCustomerSupportDetail
  );
  const clearSelectedTicket = useCustomerSupportStore(
    (state) => state.clearSelectedTicket
  );

  useEffect(() => {
    if (ticketId) {
      void fetchCustomerSupportDetail(ticketId);
    }

    return () => {
      clearSelectedTicket();
    };
  }, [clearSelectedTicket, fetchCustomerSupportDetail, ticketId]);

  return (
    <div className="min-h-screen bg-[#F4F4F6] px-6 py-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <Link href="/pages/customer-support">
              <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#A6AFFF] text-black transition-opacity hover:opacity-90">
                <HugeiconsIcon icon={ArrowLeft02Icon} className="h-5 w-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Report Details
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Review the selected customer support submission and its metadata.
              </p>
            </div>
          </div>

          {selectedTicket && (
            <span
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${getStatusStyles(
                selectedTicket.status
              )}`}
            >
              {toSentenceCase(selectedTicket.status)}
            </span>
          )}
        </div>

        {detailErrorMessage && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {detailErrorMessage}
          </div>
        )}

        {isDetailLoading && (
          <div className="rounded-2xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
            Loading customer support details...
          </div>
        )}

        {!isDetailLoading && selectedTicket && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#DDE2FF] text-sm font-semibold text-[#240183]">
                    {selectedTicket.reportingParty?.profileImage ? (
                      <img
                        src={selectedTicket.reportingParty.profileImage}
                        alt={selectedTicket.reportingParty.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getInitials(selectedTicket.reportingParty?.name)
                    )}
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedTicket.reportingParty?.name || 'Unknown user'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {toSentenceCase(selectedTicket.reportingParty?.role)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl bg-gray-50 px-4 py-3 text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {selectedTicket.reportingParty?.ratingAvg ?? 'N/A'}
                    </div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">
                      Rating
                    </div>
                  </div>
                  <div className="rounded-xl bg-gray-50 px-4 py-3 text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {selectedTicket.reportingParty?.ratingCount ?? 'N/A'}
                    </div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">
                      Ratings
                    </div>
                  </div>
                  <div className="rounded-xl bg-gray-50 px-4 py-3 text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {selectedTicket.reportingParty?.accusedCount ?? 'N/A'}
                    </div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">
                      Accused
                    </div>
                  </div>
                  <div className="rounded-xl bg-gray-50 px-4 py-3 text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {toSentenceCase(selectedTicket.reportingParty?.status)}
                    </div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">
                      Account
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <InfoRow
                  label="Email"
                  value={selectedTicket.reportingParty?.email}
                />
                <InfoRow
                  label="Contact"
                  value={selectedTicket.reportingParty?.phone}
                />
                <InfoRow label="Entry Type" value={selectedTicket.entryType} />
                <InfoRow
                  label="Complaint"
                  value={formatComplaint(selectedTicket.complaint)}
                />
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Ticket Message
              </h3>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <h4 className="text-base font-semibold text-gray-900">
                  {selectedTicket.title}
                </h4>
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                  {selectedTicket.message}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Reported Party
              </h3>

              {selectedTicket.reportedParty ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#FFE7D6] text-sm font-semibold text-[#BC0E01]">
                      {selectedTicket.reportedParty.profileImage ? (
                        <img
                          src={selectedTicket.reportedParty.profileImage}
                          alt={selectedTicket.reportedParty.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        getInitials(selectedTicket.reportedParty.name)
                      )}
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {selectedTicket.reportedParty.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {toSentenceCase(selectedTicket.reportedParty.role)}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <InfoRow
                      label="Email"
                      value={selectedTicket.reportedParty.email}
                    />
                    <InfoRow
                      label="Contact"
                      value={selectedTicket.reportedParty.phone}
                    />
                    <InfoRow
                      label="Rating"
                      value={String(selectedTicket.reportedParty.ratingAvg)}
                    />
                    <InfoRow
                      label="Accused Count"
                      value={String(selectedTicket.reportedParty.accusedCount)}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No reported party attached.</p>
              )}
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Submission Details
              </h3>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <InfoRow label="Ticket ID" value={selectedTicket._id} />
                <InfoRow label="Trip ID" value={selectedTicket.trip?._id ?? null} />
                <InfoRow
                  label="Created At"
                  value={formatDateTime(selectedTicket.createdAt)}
                />
                <InfoRow
                  label="Updated At"
                  value={formatDateTime(selectedTicket.updatedAt)}
                />
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg bg-gray-50 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Trip Payload
                  </p>
                  <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words text-xs text-gray-700">
                    {getJsonPreview(selectedTicket.trip)}
                  </pre>
                </div>

                <div className="rounded-lg bg-gray-50 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Admin Action
                  </p>
                  <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words text-xs text-gray-700">
                    {getJsonPreview(selectedTicket.adminAction)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportDetails;
