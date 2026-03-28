"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomerSupportStore } from "@/store/customer-support-store";
import type { CustomerSupportItem } from "@/types/customer-support";

const ITEMS_PER_PAGE = 5;

const toSentenceCase = (value: string | null | undefined) => {
  if (!value) {
    return "N/A";
  }

  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "resolved":
    case "closed":
      return "bg-[#D7FFEA] text-[#05895A]";
    case "pending":
    default:
      return "bg-[#FEE4D6] text-[#E26A02]";
  }
};

const getComplaintStyles = (complaint: string) => {
  switch (complaint.toLowerCase()) {
    case "yes":
      return "bg-[#FEE4D6] text-[#E26A02]";
    case "no":
    default:
      return "bg-[#D7FFEA] text-[#05895A]";
  }
};

export default function CustomerSupportManagement() {
  const router = useRouter();
  const tickets = useCustomerSupportStore((state) => state.tickets);
  const isLoading = useCustomerSupportStore((state) => state.isLoading);
  const errorMessage = useCustomerSupportStore((state) => state.errorMessage);
  const fetchCustomerSupports = useCustomerSupportStore(
    (state) => state.fetchCustomerSupports
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [complaintFilter, setComplaintFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [showComplaintFilter, setShowComplaintFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const actionButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    void fetchCustomerSupports();
  }, [fetchCustomerSupports]);

  const filteredTickets = useMemo(
    () =>
      tickets.filter((ticket) => {
        const matchesComplaint =
          complaintFilter === "all" ||
          ticket.complaint.toLowerCase() === complaintFilter;
        const matchesStatus =
          statusFilter === "all" || ticket.status.toLowerCase() === statusFilter;

        return matchesComplaint && matchesStatus;
      }),
    [complaintFilter, statusFilter, tickets]
  );

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTickets = filteredTickets.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const closeMenus = useCallback(() => {
    setOpenDropdownId(null);
    setShowComplaintFilter(false);
    setShowStatusFilter(false);
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      closeMenus();
    }
  };

  const handleView = (ticketId: string) => {
    closeMenus();
    router.push(`/pages/customer-support/${ticketId}`);
  };

  const setActionButtonRef = useCallback(
    (id: string, element: HTMLButtonElement | null) => {
      if (element) {
        actionButtonRefs.current.set(id, element);
      } else {
        actionButtonRefs.current.delete(id);
      }
    },
    []
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (openDropdownId !== null) {
        const actionButton = actionButtonRefs.current.get(openDropdownId);
        const dropdownElement = document.querySelector("[data-action-dropdown]");

        if (
          actionButton &&
          !actionButton.contains(target) &&
          dropdownElement &&
          !dropdownElement.contains(target)
        ) {
          setOpenDropdownId(null);
        }
      }

      if (showComplaintFilter) {
        const complaintFilterElement = document.querySelector(
          "[data-complaint-filter]"
        );

        if (
          complaintFilterElement &&
          !complaintFilterElement.contains(target)
        ) {
          setShowComplaintFilter(false);
        }
      }

      if (showStatusFilter) {
        const statusFilterElement = document.querySelector("[data-status-filter]");

        if (statusFilterElement && !statusFilterElement.contains(target)) {
          setShowStatusFilter(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId, showComplaintFilter, showStatusFilter]);

  const activeDropdownTicket = openDropdownId
    ? tickets.find((ticket) => ticket._id === openDropdownId) || null
    : null;

  return (
    <div className="min-h-screen bg-[#F4F4F6] p-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Customer Support Management
          </h1>
          <p className="text-gray-600">
            This section shows support tickets and reports from users.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-end gap-3 mb-6">
          <div className="relative" data-complaint-filter>
            <button
              onClick={() => {
                setShowComplaintFilter((current) => !current);
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
                  {[
                    { value: "all", label: "All Complaints" },
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setComplaintFilter(option.value);
                        setCurrentPage(1);
                        setShowComplaintFilter(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 transition-colors ${
                        complaintFilter === option.value
                          ? "text-gray-900 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative" data-status-filter>
            <button
              onClick={() => {
                setShowStatusFilter((current) => !current);
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
                  {[
                    { value: "all", label: "All Status" },
                    { value: "pending", label: "Pending" },
                    { value: "resolved", label: "Resolved" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setStatusFilter(option.value);
                        setCurrentPage(1);
                        setShowStatusFilter(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 transition-colors ${
                        statusFilter === option.value
                          ? "text-gray-900 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

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
                {!isLoading && currentTickets.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-10 px-6 text-center text-sm text-gray-500"
                    >
                      {tickets.length === 0
                        ? "No customer support items found."
                        : "No customer support items match the selected filters."}
                    </td>
                  </tr>
                )}

                {currentTickets.map((ticket: CustomerSupportItem) => (
                  <tr
                    key={ticket._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm text-gray-900">{ticket.no}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {ticket.reportingPartyName || "Unknown"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {toSentenceCase(ticket.userType)}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {ticket.email || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {ticket.contact || "N/A"}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${getStatusStyles(
                          ticket.status
                        )}`}
                      >
                        {toSentenceCase(ticket.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${getComplaintStyles(
                          ticket.complaint
                        )}`}
                      >
                        {toSentenceCase(ticket.complaint)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="relative">
                        <button
                          ref={(element) => setActionButtonRef(ticket._id, element)}
                          onClick={() =>
                            setOpenDropdownId((current) =>
                              current === ticket._id ? null : ticket._id
                            )
                          }
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                          aria-label="Open actions"
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

                {isLoading && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-10 px-6 text-center text-sm text-gray-500"
                    >
                      Loading customer support items...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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

      {openDropdownId !== null && activeDropdownTicket && (() => {
        const button = actionButtonRefs.current.get(openDropdownId);

        if (!button) {
          return null;
        }

        const rect = button.getBoundingClientRect();

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
              onClick={() => handleView(activeDropdownTicket._id)}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
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
          </div>
        );
      })()}
    </div>
  );
}
