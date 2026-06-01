'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical } from 'lucide-react';
import { useDriverStore } from '@/store/driver-store';
import type { DriverListItem } from '@/types/driver';

const ITEMS_PER_PAGE = 5;

const toLabelCase = (value: string) =>
  value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const getDriverStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-[#D7FFEA] text-[#05895A]';
    case 'suspended':
      return 'bg-[#FEE4DF] text-[#BC0E01]';
    case 'pending':
      return 'bg-[#FEE4D6] text-[#E26A02]';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getDeletionStatusStyles = (status: string) =>
  status.toLowerCase() === 'yes' ? 'text-[#BC0E01]' : 'text-[#05895A]';

const normalizeDriverStatus = (
  status: string
): 'active' | 'suspended' | 'pending' => {
  if (status === 'active' || status === 'suspended' || status === 'pending') {
    return status;
  }

  return 'pending';
};

const DriverManagement: React.FC = () => {
  const router = useRouter();
  const drivers = useDriverStore((state) => state.drivers);
  const isLoading = useDriverStore((state) => state.isLoading);
  const errorMessage = useDriverStore((state) => state.errorMessage);
  const fetchDrivers = useDriverStore((state) => state.fetchDrivers);
  const updateDriverAccountStatus = useDriverStore(
    (state) => state.updateDriverAccountStatus
  );
  const hardDeleteDriver = useDriverStore((state) => state.hardDeleteDriver);
  const [currentPage, setCurrentPage] = useState(1);
  const [driverStatusFilter, setDriverStatusFilter] = useState<string>('all');
  const [deletionStatusFilter, setDeletionStatusFilter] = useState<string>('all');
  const [openActionDriverId, setOpenActionDriverId] = useState<string | null>(null);
  const [actionMenuPosition, setActionMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [statusModalDriver, setStatusModalDriver] = useState<DriverListItem | null>(
    null
  );
  const [deleteModalDriver, setDeleteModalDriver] = useState<DriverListItem | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] = useState<
    'active' | 'suspended' | 'pending'
  >('active');
  const [isMutating, setIsMutating] = useState(false);
  const [actionErrorMessage, setActionErrorMessage] = useState('');
  const actionButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    if (!drivers.length && !isLoading) {
      void fetchDrivers();
    }
  }, [drivers.length, fetchDrivers, isLoading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        !target.closest('[data-driver-action]') &&
        !target.closest('[data-driver-action-menu]')
      ) {
        setOpenActionDriverId(null);
        setActionMenuPosition(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      const matchesDriverStatus =
        driverStatusFilter === 'all' ||
        driver.driverStatus.toLowerCase() === driverStatusFilter;
      const matchesDeletionStatus =
        deletionStatusFilter === 'all' ||
        driver.deletionStatus.toLowerCase() === deletionStatusFilter;

      return matchesDriverStatus && matchesDeletionStatus;
    });
  }, [deletionStatusFilter, driverStatusFilter, drivers]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDrivers.length / ITEMS_PER_PAGE)
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentDrivers = filteredDrivers.slice(
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

  const handleView = (driverId: string) => {
    router.push(`/pages/driver-management/${driverId}`);
  };

  const handleToggleActionMenu = (driverId: string) => {
    if (openActionDriverId === driverId) {
      setOpenActionDriverId(null);
      setActionMenuPosition(null);
      return;
    }

    const button = actionButtonRefs.current[driverId];

    if (!button) {
      return;
    }

    const rect = button.getBoundingClientRect();

    setOpenActionDriverId(driverId);
    setActionMenuPosition({
      top: rect.bottom + 8,
      left: rect.right - 176,
    });
  };

  const handleOpenStatusModal = (driver: DriverListItem) => {
    setOpenActionDriverId(null);
    setActionMenuPosition(null);
    setActionErrorMessage('');
    setStatusModalDriver(driver);
    setSelectedStatus(normalizeDriverStatus(driver.driverStatus.toLowerCase()));
  };

  const handleOpenDeleteModal = (driver: DriverListItem) => {
    setOpenActionDriverId(null);
    setActionMenuPosition(null);
    setActionErrorMessage('');
    setDeleteModalDriver(driver);
  };

  const handleSubmitStatusUpdate = async () => {
    if (!statusModalDriver) {
      return;
    }

    setIsMutating(true);
    setActionErrorMessage('');

    try {
      await updateDriverAccountStatus(statusModalDriver._id, selectedStatus);
      setStatusModalDriver(null);
    } catch (error) {
      setActionErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to update the driver status right now.'
      );
    } finally {
      setIsMutating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalDriver) {
      return;
    }

    setIsMutating(true);
    setActionErrorMessage('');

    try {
      await hardDeleteDriver(deleteModalDriver._id);
      setDeleteModalDriver(null);
    } catch (error) {
      setActionErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to permanently delete this driver right now.'
      );
    } finally {
      setIsMutating(false);
    }
  };

  const renderPaginationButton = (pageNum: number) => (
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

  return (
    <div className="min-h-screen bg-[#F4F4F6] p-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            Driver Management
          </h1>
        </div>

        <div className="flex justify-between gap-6 mb-6">
          <div>
            <p className="text-gray-600">
              This section displays all drivers on your app along with their
              status and account history.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <select
                value={driverStatusFilter}
                onChange={(e) => {
                  setDriverStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-[#A6AFFF] text-gray-800 px-6 py-2.5 rounded-lg font-medium cursor-pointer hover:bg-[#959FFF] transition-colors pr-10"
              >
                <option value="all">Driver Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
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
                  setDeletionStatusFilter(e.target.value);
                  setCurrentPage(1);
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

        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px]">
              <thead>
                <tr className="bg-[#EBEBEB]">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    NO.
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Driver Name
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Contact
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Driver Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Deleted
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Rating
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Reports
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Joined
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading && !drivers.length && (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-6 py-10 text-center text-sm text-gray-500"
                    >
                      Loading drivers...
                    </td>
                  </tr>
                )}

                {!isLoading && currentDrivers.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-6 py-10 text-center text-sm text-gray-500"
                    >
                      No drivers found for the selected filters.
                    </td>
                  </tr>
                )}

                {currentDrivers.map((driver: DriverListItem) => (
                  <tr
                    key={driver._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">{driver.no}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      {driver.driverName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {driver.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {driver.contact}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${getDriverStatusStyles(
                          driver.driverStatus
                        )}`}
                      >
                        {toLabelCase(driver.driverStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-semibold ${getDeletionStatusStyles(
                          driver.deletionStatus
                        )}`}
                      >
                        {toLabelCase(driver.deletionStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {driver.rating.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {driver.reportsCount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(driver.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-block" data-driver-action>
                        <button
                          ref={(element) => {
                            actionButtonRefs.current[driver._id] = element;
                          }}
                          onClick={() => handleToggleActionMenu(driver._id)}
                          className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#A6AFFF] hover:bg-[#959FFF] text-gray-900 transition-colors"
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
        </div>

        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            No of Results {filteredDrivers.length} out of {drivers.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {'<'}
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
              let pageNum;

              if (totalPages <= 5) {
                pageNum = index + 1;
              } else if (currentPage <= 3) {
                pageNum = index + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + index;
              } else {
                pageNum = currentPage - 2 + index;
              }

              return renderPaginationButton(pageNum);
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

      {openActionDriverId && actionMenuPosition && (
        <div
          data-driver-action-menu
          className="fixed z-40 w-44 rounded-lg border border-gray-200 bg-white shadow-lg"
          style={{
            top: actionMenuPosition.top,
            left: actionMenuPosition.left,
          }}
        >
          {(() => {
            const activeDriver = drivers.find(
              (driver) => driver._id === openActionDriverId
            );

            if (!activeDriver) {
              return null;
            }

            return (
              <>
                <button
                  onClick={() => {
                    setOpenActionDriverId(null);
                    setActionMenuPosition(null);
                    handleView(activeDriver._id);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => handleOpenStatusModal(activeDriver)}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
                >
                  Status Update
                </button>
                <button
                  onClick={() => handleOpenDeleteModal(activeDriver)}
                  className="w-full px-4 py-3 text-left text-sm text-[#BC0E01] hover:bg-red-50 transition-colors border-t border-gray-100"
                >
                  Delete
                </button>
              </>
            );
          })()}
        </div>
      )}

      {statusModalDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Update Driver Status
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Change the account status for {statusModalDriver.driverName}.
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(
                  e.target.value as 'active' | 'suspended' | 'pending'
                )
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#240183]"
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setStatusModalDriver(null)}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleSubmitStatusUpdate()}
                disabled={isMutating}
                className="px-5 py-2.5 rounded-lg bg-[#240183] text-white hover:opacity-90 transition-opacity disabled:opacity-70"
              >
                {isMutating ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModalDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Permanently Delete Driver
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              This will permanently delete {deleteModalDriver.driverName} and
              their account records. This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalDriver(null)}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleConfirmDelete()}
                disabled={isMutating}
                className="px-5 py-2.5 rounded-lg bg-[#BC0E01] text-white hover:opacity-90 transition-opacity disabled:opacity-70"
              >
                {isMutating ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverManagement;
