'use client'
import React, { useState } from 'react';

interface Payment {
  id: number;
  name: string;
  totalFare: number;
  driverGets: number;
  received: number;
}

const ITEMS_PER_PAGE = 5;

const generatePayments = (): Payment[] => {
  const payments: Payment[] = [];
  const names = [
    'Courtney Henry',
    'Guy Hawkins',
    'Wade Warren',
    'Theresa Webb',
    'Savannah Nguyen',
    'Brooklyn Simmons',
    'Kristin Watson',
    'Kathryn Murphy'
  ];

  for (let i = 1; i <= 100; i++) {
    const totalFare = 5.00;
    const driverGets = 3.00;
    const received = 2.00;
    
    payments.push({
      id: i,
      name: names[i % names.length],
      totalFare,
      driverGets,
      received,
    });
  }

  return payments;
};

export default function PaymentInformation() {
  const [currentPage, setCurrentPage] = useState(1);

  const allPayments = generatePayments();
  const totalPages = Math.ceil(allPayments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPayments = allPayments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">Payment Information</h1>
          <p className="text-sm text-gray-600">
            This section will show payment information you have earned from this app.
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#E8E8EA]">
                <th className="text-left px-6 py-3.5 text-sm font-semibold text-gray-700">NO.</th>
                <th className="text-left px-6 py-3.5 text-sm font-semibold text-gray-700">Driver name</th>
                <th className="text-left px-6 py-3.5 text-sm font-semibold text-gray-700">Total Fare</th>
                <th className="text-left px-6 py-3.5 text-sm font-semibold text-gray-700">Driver gets(60%)</th>
                <th className="text-left px-6 py-3.5 text-sm font-semibold text-gray-700">Received(40%)</th>
                <th className="text-left px-6 py-3.5 text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentPayments.map((payment, index) => (
                <tr
                  key={payment.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-700">{startIndex + index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{payment.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">${payment.totalFare.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">${payment.driverGets.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">${payment.received.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <button className="text-gray-600 hover:text-gray-800 text-xl font-bold leading-none">
                      ⋮
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            No of Results {allPayments.length} out of {allPayments.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}