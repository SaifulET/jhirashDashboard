'use client'
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';

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
  const [payments, setPayments] = useState<Payment[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [deleteModalData, setDeleteModalData] = useState<{
    paymentId: number; 
    paymentName: string; 
    position: {x: number, y: number}
  } | null>(null);
  const actionButtonRefs = useRef<{[key: number]: HTMLButtonElement | null}>({});

  // Initialize with generated payments
  useEffect(() => {
    setPayments(generatePayments());
  }, []);

  const totalPages = Math.ceil(payments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPayments = payments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setOpenDropdownId(null);
      setDeleteModalData(null);
    }
  };

  const toggleDropdown = (id: number) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
    setDeleteModalData(null);
  };
const router = useRouter();
  const handleView = (paymentId: number) => {
    setOpenDropdownId(null);
    setDeleteModalData(null);
    // Add your navigation logic here
router.push(`/pages/payment-information/${paymentId}`);
    console.log('View payment details:', paymentId);
  };

  const handleDeleteClick = (paymentId: number, paymentName: string) => {
    const button = actionButtonRefs.current[paymentId];
    if (button) {
      const rect = button.getBoundingClientRect();
      setDeleteModalData({
        paymentId,
        paymentName,
        position: {
          x: rect.right - 160,
          y: rect.bottom + 8
        }
      });
    }
    setOpenDropdownId(null);
  };

  const confirmDelete = () => {
    if (deleteModalData) {
      setPayments(prevPayments => prevPayments.filter(payment => payment.id !== deleteModalData.paymentId));
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
      
      if (openDropdownId !== null) {
        const actionButton = actionButtonRefs.current[openDropdownId];
        const dropdownElement = document.querySelector('[data-action-dropdown]');
        
        if (actionButton && !actionButton.contains(target) && 
            dropdownElement && !dropdownElement.contains(target)) {
          setOpenDropdownId(null);
        }
      }
      
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

  return (
    <div className="min-h-screen bg-[#F4F4F6] p-8 relative">
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
                    <div className="relative">
                      <button 
                        ref={el => {
                          if (el) {
                            actionButtonRefs.current[payment.id] = el;
                          }
                        }}
                        onClick={() => toggleDropdown(payment.id)}
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
            No of Results {payments.length} out of {payments.length}
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

      {/* Action Dropdown Menu */}
      {openDropdownId !== null && (() => {
        const button = actionButtonRefs.current[openDropdownId];
        if (!button) return null;
        
        const rect = button.getBoundingClientRect();
        const payment = payments.find(p => p.id === openDropdownId);
        if (!payment) return null;
        
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
              onClick={() => handleView(payment.id)}
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
              onClick={() => handleDeleteClick(payment.id, payment.name)}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Payment
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
                Delete {deleteModalData.paymentName}?
              </h3>
              <p className="text-xs text-gray-600">
                Once deleted, you wont be able to recover this payment data.
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
}