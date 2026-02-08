"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SupportTicket {
  id: number;
  reportingParty: string;
  userType: "Driver" | "Rider";
  email: string;
  contact: string;
  status: "Pending" | "Resolved";
  complaint: "Yes" | "No";
}

const ITEMS_PER_PAGE = 5;

const generateMockData = (): SupportTicket[] => {
  const data: SupportTicket[] = [];
  const names = ["Courtney Henry", "Guy Hawkins", "Wade Warren", "Theresa Webb", "Savannah Nguyen"];
  const userTypes: ("Driver" | "Rider")[] = ["Driver", "Rider"];
  const statuses: ("Pending" | "Resolved")[] = ["Pending", "Resolved"];
  const complaints: ("Yes" | "No")[] = ["Yes", "No"];

  for (let i = 1; i <= 100; i++) {
    data.push({
      id: i,
      reportingParty: names[i % names.length],
      userType: userTypes[i % userTypes.length],
      email: "example@gmail.com",
      contact: `(${400 + i}) 555-${String(100 + i).padStart(4, '0')}`,
      status: statuses[i % statuses.length],
      complaint: complaints[i % complaints.length],
    });
  }

  return data;
};

export default function CustomerSupportManagement() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [complaintFilter, setComplaintFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [deleteModalData, setDeleteModalData] = useState<{
    ticketId: number; 
    ticketName: string; 
    position: {x: number, y: number}
  } | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [showComplaintFilter, setShowComplaintFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  
  // Use a Map instead of object for better type safety
  const actionButtonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  // Initialize with generated data
  useEffect(() => {
    setTickets(generateMockData());
  }, []);

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesComplaint = complaintFilter === 'all' || ticket.complaint === complaintFilter;
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesComplaint && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTickets = filteredTickets.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setOpenDropdownId(null);
      setDeleteModalData(null);
      setShowComplaintFilter(false);
      setShowStatusFilter(false);
    }
  };

  const toggleDropdown = (id: number) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
    setDeleteModalData(null); // Close delete modal if open
    setShowComplaintFilter(false);
    setShowStatusFilter(false);
  };

  const handleView = (ticketId: number) => {
    setOpenDropdownId(null);
    setDeleteModalData(null);
    setShowComplaintFilter(false);
    setShowStatusFilter(false);
    router.push(`/pages/customer-support/${ticketId}`);
  };

  const handleDeleteClick = (ticketId: number, ticketName: string) => {
    // Get position from the stored button ref
    const button = actionButtonRefs.current.get(ticketId);
    if (button) {
      const rect = button.getBoundingClientRect();
      setDeleteModalData({
        ticketId,
        ticketName,
        position: {
          x: rect.right - 160, // Position to align with button
          y: rect.bottom + 8 // Position below the button
        }
      });
    }
    setOpenDropdownId(null);
    setShowComplaintFilter(false);
    setShowStatusFilter(false);
  };

  const confirmDelete = () => {
    if (deleteModalData) {
      setTickets(prevTickets => prevTickets.filter(ticket => ticket.id !== deleteModalData.ticketId));
      setDeleteModalData(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalData(null);
  };

  // Ref callback function
  const setActionButtonRef = useCallback((id: number, element: HTMLButtonElement | null) => {
    if (element) {
      actionButtonRefs.current.set(id, element);
    } else {
      actionButtonRefs.current.delete(id);
    }
  }, []);

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Close action dropdown if click is outside
      if (openDropdownId !== null) {
        const actionButton = actionButtonRefs.current.get(openDropdownId);
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
      
      // Close filter dropdowns if click is outside
      if (showComplaintFilter || showStatusFilter) {
        const complaintFilterElement = document.querySelector('[data-complaint-filter]');
        const statusFilterElement = document.querySelector('[data-status-filter]');
        
        if (showComplaintFilter && complaintFilterElement && !complaintFilterElement.contains(target)) {
          setShowComplaintFilter(false);
        }
        
        if (showStatusFilter && statusFilterElement && !statusFilterElement.contains(target)) {
          setShowStatusFilter(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId, deleteModalData, showComplaintFilter, showStatusFilter]);

  const getStatusStyles = (status: "Pending" | "Resolved") => {
    switch (status) {
      case "Pending":
        return "bg-[#FEE4D6] text-[#E26A02]";
      case "Resolved":
        return "bg-[#D7FFEA] text-[#05895A]";
      default:
        return "";
    }
  };

  const getComplaintStyles = (complaint: "Yes" | "No") => {
    switch (complaint) {
      case "Yes":
        return "bg-[#FEE4D6] text-[#E26A02]";
      case "No":
        return "bg-[#D7FFEA] text-[#05895A]";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] p-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Customer Support Management
          </h1>
          <p className="text-gray-600">
            This section will show messages & report from both of the users
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-end gap-3 mb-6">
          {/* Complaint Filter */}
          <div className="relative" data-complaint-filter>
            <button 
              onClick={() => {
                setShowComplaintFilter(!showComplaintFilter);
                setShowStatusFilter(false);
              }}
              className="bg-[#A6AFFF] text-gray-900 px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-[#959FFF] transition-colors"
            >
              Complaint
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            
            {showComplaintFilter && (
              <div className="absolute top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-30">
                <div className="p-2">
                  <button
                    onClick={() => {
                      setComplaintFilter("all");
                      setCurrentPage(1);
                      setShowComplaintFilter(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 transition-colors ${
                      complaintFilter === "all" ? "text-gray-900 font-medium" : "text-gray-600"
                    }`}
                  >
                    All Complaints
                  </button>
                  <button
                    onClick={() => {
                      setComplaintFilter("Yes");
                      setCurrentPage(1);
                      setShowComplaintFilter(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 transition-colors ${
                      complaintFilter === "Yes" ? "text-gray-900 font-medium" : "text-gray-600"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => {
                      setComplaintFilter("No");
                      setCurrentPage(1);
                      setShowComplaintFilter(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 transition-colors ${
                      complaintFilter === "No" ? "text-gray-900 font-medium" : "text-gray-600"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative" data-status-filter>
            <button 
              onClick={() => {
                setShowStatusFilter(!showStatusFilter);
                setShowComplaintFilter(false);
              }}
              className="bg-[#A6AFFF] text-gray-900 px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-[#959FFF] transition-colors"
            >
              Status
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            
            {showStatusFilter && (
              <div className="absolute top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-30">
                <div className="p-2">
                  <button
                    onClick={() => {
                      setStatusFilter("all");
                      setCurrentPage(1);
                      setShowStatusFilter(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 transition-colors ${
                      statusFilter === "all" ? "text-gray-900 font-medium" : "text-gray-600"
                    }`}
                  >
                    All Status
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("Pending");
                      setCurrentPage(1);
                      setShowStatusFilter(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 transition-colors ${
                      statusFilter === "Pending" ? "text-gray-900 font-medium" : "text-gray-600"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("Resolved");
                      setCurrentPage(1);
                      setShowStatusFilter(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 transition-colors ${
                      statusFilter === "Resolved" ? "text-gray-900 font-medium" : "text-gray-600"
                    }`}
                  >
                    Resolved
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    NO.
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Reporting Party
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    User Type
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Contact
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Complaint
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentTickets.map((ticket, index) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {startIndex + index + 1}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {ticket.reportingParty}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {ticket.userType}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {ticket.email}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {ticket.contact}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${getStatusStyles(ticket.status)}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${getComplaintStyles(ticket.complaint)}`}
                      >
                        {ticket.complaint}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="relative">
                        <button 
                          ref={el => setActionButtonRef(ticket.id, el)}
                          onClick={() => toggleDropdown(ticket.id)}
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <svg
                            width="4"
                            height="16"
                            viewBox="0 0 4 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="2" cy="2" r="2" fill="currentColor" />
                            <circle cx="2" cy="8" r="2" fill="currentColor" />
                            <circle cx="2" cy="14" r="2" fill="currentColor" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              No of Results {filteredTickets.length} out of {tickets.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 12L6 8L10 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? "bg-gray-800 text-white border border-gray-800"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Dropdown Menu */}
      {openDropdownId !== null && (() => {
        const button = actionButtonRefs.current.get(openDropdownId);
        if (!button) return null;
        
        const rect = button.getBoundingClientRect();
        const ticket = tickets.find(t => t.id === openDropdownId);
        if (!ticket) return null;
        
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
              onClick={() => handleView(ticket.id)}
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
              onClick={() => handleDeleteClick(ticket.id, ticket.reportingParty)}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Ticket
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
                Delete {deleteModalData.ticketName}&apos;s ticket?
              </h3>
              <p className="text-xs text-gray-600">
                Once deleted, you won&apos;t be able to recover this ticket data.
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