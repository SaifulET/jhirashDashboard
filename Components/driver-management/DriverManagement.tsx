'use client';

import React, { useState } from 'react';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [userStatusFilter, setUserStatusFilter] = useState<string>('all');
  const [deletionStatusFilter, setDeletionStatusFilter] = useState<string>('all');

  const allDrivers = generateDrivers();

  // Filter drivers
  const filteredDrivers = allDrivers.filter((driver) => {
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
    }
  };

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
    <div className="min-h-screen bg-[#F4F4F6] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">Driver Management</h1>
         
        </div>
<div className='flex justify-between'>
            <div><p className="text-gray-600">This section will display all drivers on your app along with their history.</p></div>
            {/* Filter Buttons */}
        <div className="flex gap-3 mb-6">
          <div className="relative">
            <select
              value={userStatusFilter}
              onChange={(e) => {
                setUserStatusFilter(e.target.value);
                setCurrentPage(1);
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
                    <button className="text-gray-600 hover:text-gray-800 text-xl font-bold">⋮</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            No of Results {filteredDrivers.length} out of {allDrivers.length}
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
    </div>
  );
};

export default DriverManagement;