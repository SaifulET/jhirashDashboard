'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical } from 'lucide-react';
import { useRiderStore } from '@/store/rider-store';
import type { RiderListItem } from '@/types/rider';

const ITEMS_PER_PAGE = 5;

const toLabelCase = (value: string) =>
  value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-[#FEE4D6] text-[#E26A02]';
    case 'verified':
    case 'active':
      return 'bg-[#D7FFEA] text-[#05895A]';
    case 'denied':
    case 'inactive':
      return 'bg-[#FEE4DF] text-[#BC0E01]';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getDeletionStatusStyles = (status: string) =>
  status.toLowerCase() === 'yes' ? 'text-[#BC0E01]' : 'text-[#05895A]';

const RiderManagement: React.FC = () => {
  const router = useRouter();
  const riders = useRiderStore((state) => state.riders);
  const isLoading = useRiderStore((state) => state.isLoading);
  const errorMessage = useRiderStore((state) => state.errorMessage);
  const fetchRiders = useRiderStore((state) => state.fetchRiders);
  const deleteRider = useRiderStore((state) => state.deleteRider);
  const [currentPage, setCurrentPage] = useState(1);
  const [userStatusFilter, setUserStatusFilter] = useState<string>('all');
  const [deletionStatusFilter, setDeletionStatusFilter] = useState<string>('all');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [deleteModalRider, setDeleteModalRider] = useState<RiderListItem | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionErrorMessage, setActionErrorMessage] = useState('');
  const actionButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    if (!riders.length && !isLoading) {
      void fetchRiders();
    }
  }, [fetchRiders, isLoading, riders.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (openDropdownId !== null) {
        const actionButton = actionButtonRefs.current[openDropdownId];
        const dropdownElement = document.querySelector('[data-action-dropdown]');

        if (
          actionButton &&
          !actionButton.contains(target) &&
          dropdownElement &&
          !dropdownElement.contains(target)
        ) {
          setOpenDropdownId(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId]);

  const filteredRiders = riders.filter((rider) => {
    const matchesUserStatus =
      userStatusFilter === 'all' ||
      rider.userStatus.toLowerCase() === userStatusFilter;
    const matchesDeletionStatus =
      deletionStatusFilter === 'all' ||
      rider.deletionStatus.toLowerCase() === deletionStatusFilter;

    return matchesUserStatus && matchesDeletionStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredRiders.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRiders = filteredRiders.slice(
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
      setOpenDropdownId(null);
    }
  };

  const handleView = (riderId: string) => {
    setOpenDropdownId(null);
    router.push(`/pages/rider-management/${riderId}`);
  };

  const handleOpenDeleteModal = (rider: RiderListItem) => {
    setOpenDropdownId(null);
    setActionErrorMessage('');
    setDeleteModalRider(rider);
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalRider) {
      return;
    }

    setIsDeleting(true);
    setActionErrorMessage('');

    try {
      await deleteRider(deleteModalRider._id);
      setDeleteModalRider(null);
    } catch (error) {
      setActionErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to delete this rider right now.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] p-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            Rider Management
          </h1>
        </div>

        <div className="flex justify-between">
          <div>
            <p className="text-gray-600">
              This section will display all riders on your app along with their
              history.
            </p>
          </div>

          <div className="flex gap-3 mb-6">
            <div className="relative">
              <select
                value={userStatusFilter}
                onChange={(e) => {
                  setUserStatusFilter(e.target.value.toLowerCase());
                  setCurrentPage(1);
                  setOpenDropdownId(null);
                }}
                className="appearance-none bg-[#A6AFFF] text-gray-800 px-6 py-2.5 rounded-lg font-medium cursor-pointer hover:bg-[#959FFF] transition-colors pr-10"
              >
                <option value="all">User Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="verified">Verified</option>
                <option value="denied">Denied</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <div className="relative">
              <select
                value={deletionStatusFilter}
                onChange={(e) => {
                  setDeletionStatusFilter(e.target.value.toLowerCase());
                  setCurrentPage(1);
                  setOpenDropdownId(null);
                }}
                className="appearance-none bg-[#A6AFFF] text-gray-800 px-6 py-2.5 rounded-lg font-medium cursor-pointer hover:bg-[#959FFF] transition-colors pr-10"
              >
                <option value="all">Deletion Status</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {(errorMessage || actionErrorMessage) && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {actionErrorMessage || errorMessage}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#EBEBEB]">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  NO.
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Rider Name
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Contact
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  User Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Deletion Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && !riders.length && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    Loading riders...
                  </td>
                </tr>
              )}

              {!isLoading && currentRiders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    No riders found for the selected filters.
                  </td>
                </tr>
              )}

              {currentRiders.map((rider) => (
                <tr
                  key={rider._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-700">{rider.no}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                    {rider.riderName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {rider.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {rider.contact}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${getStatusStyles(
                        rider.userStatus
                      )}`}
                    >
                      {toLabelCase(rider.userStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm font-semibold ${getDeletionStatusStyles(
                        rider.deletionStatus
                      )}`}
                    >
                      {toLabelCase(rider.deletionStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        ref={(element) => {
                          actionButtonRefs.current[rider._id] = element;
                        }}
                        onClick={() => toggleDropdown(rider._id)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#A6AFFF] text-gray-900 transition-colors hover:bg-[#959FFF]"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            No of Results {filteredRiders.length} out of {riders.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {'>'}
            </button>
          </div>
        </div>
      </div>

      {openDropdownId !== null &&
        (() => {
          const button = actionButtonRefs.current[openDropdownId];

          if (!button) {
            return null;
          }

          const rect = button.getBoundingClientRect();
          const rider = riders.find((item) => item._id === openDropdownId);

          if (!rider) {
            return null;
          }

          return (
            <div
              className="fixed w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              data-action-dropdown
              style={{
                left: `${rect.right - 160}px`,
                top: `${rect.bottom + 8}px`,
              }}
            >
              <button
                onClick={() => handleView(rider._id)}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                View Details
              </button>
              <button
                onClick={() => handleOpenDeleteModal(rider)}
                className="w-full border-t border-gray-100 text-left px-4 py-3 text-sm text-[#BC0E01] hover:bg-red-50 rounded-b-lg transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Rider
              </button>
            </div>
          );
        })()}

      {deleteModalRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Delete Rider
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete {deleteModalRider.riderName}?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalRider(null)}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleConfirmDelete()}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-lg bg-[#BC0E01] text-white hover:opacity-90 transition-opacity disabled:opacity-70"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderManagement;
