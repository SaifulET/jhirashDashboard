'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

type UserStatus = 'Pending' | 'Verified' | 'Denied';
type DeletionStatus = 'Yes' | 'No';

interface Driver {
  id: number;
  name: string;
  email: string;
  contact: string;
  userStatus: UserStatus;
  deletionStatus: DeletionStatus;
}

const ITEMS_PER_PAGE = 5;

// Mock data - 100 drivers
const generateDrivers = (): Driver[] => {
  const drivers: Driver[] = [];
  const names = ['Courtney Henry', 'Guy Hawkins', 'Wade Warren', 'Theresa Webb', 'Savannah Nguyen', 'Brooklyn Simmons', 'Kristin Watson', 'Kathryn Murphy'];
  const statuses: UserStatus[] = ['Pending', 'Verified', 'Denied'];
  const deletionStatuses: DeletionStatus[] = ['Yes', 'No'];

  for (let i = 1; i <= 100; i++) {
    drivers.push({
      id: i,
      name: names[i % names.length],
      email: 'example@gmail.com',
      contact: `(${200 + i}) 555-${String(100 + i).padStart(4, '0')}`,
      userStatus: statuses[i % statuses.length],
      deletionStatus: deletionStatuses[i % deletionStatuses.length],
    });
  }

  return drivers;
};

const DriverManagement: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [userStatusFilter, setUserStatusFilter] = useState<string>('all');
  const [deletionStatusFilter, setDeletionStatusFilter] = useState<string>('all');
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [deleteModalData, setDeleteModalData] = useState<{
    driverId: number; 
    driverName: string; 
    position: {x: number, y: number}
  } | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const actionButtonRefs = useRef<{[key: number]: HTMLButtonElement | null}>({});

  // Initialize with generated drivers
  useEffect(() => {
    setDrivers(generateDrivers());
  }, []);

  // Filter drivers
  const filteredDrivers = drivers.filter((driver) => {
    const matchesUserStatus = userStatusFilter === 'all' || driver.userStatus === userStatusFilter;
    const matchesDeletionStatus = deletionStatusFilter === 'all' || driver.deletionStatus === deletionStatusFilter;
    return matchesUserStatus && matchesDeletionStatus;
  });

  const totalPages = Math.ceil(filteredDrivers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDrivers = filteredDrivers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setOpenDropdownId(null);
      setDeleteModalData(null);
    }
  };

  const toggleDropdown = (id: number) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
    setDeleteModalData(null); // Close delete modal if open
  };

  const handleView = (driverId: number) => {
    setOpenDropdownId(null);
    setDeleteModalData(null);
    router.push(`/pages/driver-management/${driverId}`);
  };

  const handleDeleteClick = (driverId: number, driverName: string) => {
    // Get position from the stored button ref
    const button = actionButtonRefs.current[driverId];
    if (button) {
      const rect = button.getBoundingClientRect();
      setDeleteModalData({
        driverId,
        driverName,
        position: {
          x: rect.right - 160, // Position to align with button
          y: rect.bottom + 8 // Position below the button
        }
      });
    }
    setOpenDropdownId(null);
  };

  const confirmDelete = () => {
    if (deleteModalData) {
      setDrivers(prevDrivers => prevDrivers.filter(driver => driver.id !== deleteModalData.driverId));
      setDeleteModalData(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalData(null);
  };

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Close action dropdown if click is outside
      if (openDropdownId !== null) {
        const actionButton = actionButtonRefs.current[openDropdownId];
        const dropdownElement = document.querySelector('[data-action-dropdown]');
        
        if (actionButton && !actionButton.contains(target) && 
            dropdownElement && !dropdownElement.contains(target)) {
          setOpenDropdownId(null);
        }
      }
      
      // Close delete modal if click is outside
      if (deleteModalData) {
        const deleteModal = document.querySelector('[data-delete-modal]');
        if (deleteModal && !deleteModal.contains(target)) {
          setDeleteModalData(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId, deleteModalData]);

  const getStatusStyles = (status: UserStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-[#FEE4D6] text-[#E26A02]';
      case 'Verified':
        return 'bg-[#D7FFEA] text-[#05895A]';
      case 'Denied':
        return 'bg-[#FEE4DF] text-[#BC0E01]';
      default:
        return '';
    }
  };

  const getDeletionStatusStyles = (status: DeletionStatus) => {
    return status === 'Yes' ? 'text-[#BC0E01]' : 'text-[#05895A]';
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] p-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Driver Management</h1>
        </div>
        
        <div className='flex justify-between'>
          <div>
            <p className="text-gray-600">This section will display all drivers on your app along with their history.</p>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex gap-3 mb-6">
            <div className="relative">
              <select
                value={userStatusFilter}
                onChange={(e) => {
                  setUserStatusFilter(e.target.value);
                  setCurrentPage(1);
                  setOpenDropdownId(null);
                  setDeleteModalData(null);
                }}
                className="appearance-none bg-[#A6AFFF] text-gray-800 px-6 py-2.5 rounded-lg font-medium cursor-pointer hover:bg-[#959FFF] transition-colors pr-10"
              >
                <option value="all">User Status</option>
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Denied">Denied</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div className="relative">
              <select
                value={deletionStatusFilter}
                onChange={(e) => {
                  setDeletionStatusFilter(e.target.value);
                  setCurrentPage(1);
                  setOpenDropdownId(null);
                  setDeleteModalData(null);
                }}
                className="appearance-none bg-[#A6AFFF] text-gray-800 px-6 py-2.5 rounded-lg font-medium cursor-pointer hover:bg-[#959FFF] transition-colors pr-10"
              >
                <option value="all">Deletion Status</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#EBEBEB]">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">NO.</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Driver name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Contact</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">User Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Deletion Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentDrivers.map((driver, index) => (
                <tr key={driver.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-700">{startIndex + index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">{driver.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{driver.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{driver.contact}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${getStatusStyles(driver.userStatus)}`}>
                      {driver.userStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold ${getDeletionStatusStyles(driver.deletionStatus)}`}>
                      {driver.deletionStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                     <button 
  ref={el => {
    if (el) {
      actionButtonRefs.current[driver.id] = el;
    }
  }}
  onClick={() => toggleDropdown(driver.id)}
  className="text-gray-600 hover:text-gray-800 text-xl font-bold w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
>
  ⋮
</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
              ‹
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
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Action Dropdown Menu */}
      {openDropdownId !== null && (() => {
        const button = actionButtonRefs.current[openDropdownId];
        if (!button) return null;
        
        const rect = button.getBoundingClientRect();
        const driver = drivers.find(d => d.id === openDropdownId);
        if (!driver) return null;
        
        return (
          <div 
            className="fixed w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            data-action-dropdown
            style={{
              left: `${rect.right - 160}px`,
              top: `${rect.bottom + 8}px`
            }}
          >
            <button
              onClick={() => handleView(driver.id)}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Details
            </button>
            <div className="border-t border-gray-200"></div>
            <button
              onClick={() => handleDeleteClick(driver.id, driver.name)}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Driver
            </button>
          </div>
        );
      })()}

      {/* Delete Confirmation Modal */}
      {deleteModalData && (
        <div 
          className="fixed bg-white rounded-lg shadow-xl border border-gray-200 z-50 w-64 p-4"
          data-delete-modal
          style={{
            left: `${deleteModalData.position.x}px`,
            top: `${deleteModalData.position.y}px`
          }}
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 bg-[#B91C1C] rounded-full flex-shrink-0 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Delete {deleteModalData.driverName}?
              </h3>
              <p className="text-xs text-gray-600">
                Once deleted, you wont be able to recover this drivers data.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={cancelDelete}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 px-3 py-2 bg-[#B91C1C] text-white text-sm rounded-lg font-medium hover:bg-[#991B1B] transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverManagement;