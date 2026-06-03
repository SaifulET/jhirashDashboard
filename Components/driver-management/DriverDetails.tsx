'use client';

import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Star,
  ShieldCheck,
  ClipboardList,
} from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Money04Icon } from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useDriverStore } from '@/store/driver-store';
import DocumentsTab from './Documentstab';
import DriverLicenseView from './DriverLicenseView';
import VehicleInfoView from './VehicleInfoView';
import VehicleInsuranceView from './VehicleInsuranceView';
import VehicleRegistrationView from './VehicleRegistrationView';
import ProfileImage from '@/Components/common/ProfileImage';

type TabType = 'Profile' | 'Documents' | 'History' | 'Reports';
type DocumentViewType =
  | 'license'
  | 'vehicle-info'
  | 'insurance'
  | 'registration'
  | null;

const documentTypeMap: Record<
  Exclude<DocumentViewType, null>,
  string
> = {
  license: 'driver_license',
  'vehicle-info': 'vehicle_information',
  insurance: 'vehicle_insurance',
  registration: 'vehicle_registration',
};

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

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

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

const getDriverStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'text-green-700 bg-green-100';
    case 'inactive':
      return 'text-red-700 bg-red-100';
    default:
      return 'text-gray-700 bg-gray-100';
  }
};

const DriverDetails = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Profile');
  const [documentView, setDocumentView] = useState<DocumentViewType>(null);
  const params = useParams<{ slug: string }>();
  const driverId = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const selectedDriverProfile = useDriverStore(
    (state) => state.selectedDriverProfile
  );
  const isDetailLoading = useDriverStore((state) => state.isDetailLoading);
  const detailErrorMessage = useDriverStore((state) => state.detailErrorMessage);
  const selectedDriverDocuments = useDriverStore(
    (state) => state.selectedDriverDocuments
  );
  const isDocumentsLoading = useDriverStore(
    (state) => state.isDocumentsLoading
  );
  const documentsErrorMessage = useDriverStore(
    (state) => state.documentsErrorMessage
  );
  const selectedDriverDocumentDetail = useDriverStore(
    (state) => state.selectedDriverDocumentDetail
  );
  const isDocumentDetailLoading = useDriverStore(
    (state) => state.isDocumentDetailLoading
  );
  const isReviewingDocument = useDriverStore(
    (state) => state.isReviewingDocument
  );
  const selectedDriverHistory = useDriverStore(
    (state) => state.selectedDriverHistory
  );
  const isHistoryLoading = useDriverStore((state) => state.isHistoryLoading);
  const selectedDriverReports = useDriverStore(
    (state) => state.selectedDriverReports
  );
  const isReportsLoading = useDriverStore((state) => state.isReportsLoading);
  const documentDetailErrorMessage = useDriverStore(
    (state) => state.documentDetailErrorMessage
  );
  const historyErrorMessage = useDriverStore((state) => state.historyErrorMessage);
  const reportsErrorMessage = useDriverStore((state) => state.reportsErrorMessage);
  const fetchDriverDetail = useDriverStore((state) => state.fetchDriverDetail);
  const fetchDriverDocuments = useDriverStore(
    (state) => state.fetchDriverDocuments
  );
  const fetchDriverDocumentDetail = useDriverStore(
    (state) => state.fetchDriverDocumentDetail
  );
  const clearDriverDocumentDetail = useDriverStore(
    (state) => state.clearDriverDocumentDetail
  );
  const reviewDriverDocument = useDriverStore(
    (state) => state.reviewDriverDocument
  );
  const fetchDriverHistory = useDriverStore((state) => state.fetchDriverHistory);
  const fetchDriverReports = useDriverStore((state) => state.fetchDriverReports);

  useEffect(() => {
    if (driverId) {
      void fetchDriverDetail(driverId);
      void fetchDriverDocuments(driverId);
      void fetchDriverHistory(driverId);
      void fetchDriverReports(driverId);
    }
  }, [
    driverId,
    fetchDriverDetail,
    fetchDriverDocuments,
    fetchDriverHistory,
    fetchDriverReports,
  ]);

  const handleViewDocument = (type: DocumentViewType) => {
    if (!type || !driverId) {
      return;
    }

    setDocumentView(type);
    void fetchDriverDocumentDetail(driverId, documentTypeMap[type]);
  };

  const handleBackToDocuments = () => {
    setDocumentView(null);
    clearDriverDocumentDetail();
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);

    if (tab !== 'Documents') {
      setDocumentView(null);
      clearDriverDocumentDetail();
    }
  };

  const handleApproveDocument = async () => {
    if (!driverId || !documentView) {
      return;
    }

    const type = documentTypeMap[documentView];

    await reviewDriverDocument(driverId, type, {
      status: 'verified',
    });
    await fetchDriverDocuments(driverId);
    await fetchDriverDocumentDetail(driverId, type);
  };

  const handleRejectDocument = async (reason: string) => {
    if (!driverId || !documentView) {
      return;
    }

    const type = documentTypeMap[documentView];

    await reviewDriverDocument(driverId, type, {
      status: 'denied',
      rejectionReason: reason,
    });
    await fetchDriverDocuments(driverId);
    await fetchDriverDocumentDetail(driverId, type);
  };

  return (
    <div className="flex min-h-screen bg-[#F4F4F6]">
      <div className="flex-shrink-0" />

      <div className="flex-1 mx-[174px] my-[40px]">
        <div>
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <Link href="/pages/driver-management">
                <button className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#A6AFFF] hover:bg-[#97a0f5] transition-colors">
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {activeTab === 'History'
                    ? 'Detail of Driver History'
                    : activeTab === 'Reports'
                      ? 'Details of Reports Against the Driver'
                      : activeTab === 'Documents'
                        ? 'Details of Vehicle Documents'
                        : 'Detail of Driver'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  This section will show every detail of a particular driver.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex">
              <button
                onClick={() => handleTabChange('Profile')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'Profile'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => handleTabChange('Documents')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'Documents'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => handleTabChange('History')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'History'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                History
              </button>
              <button
                onClick={() => handleTabChange('Reports')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'Reports'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Reports
              </button>
            </div>

            <div className="px-8 py-4">
              {activeTab === 'Profile' && (
                <>
                  {isDetailLoading && (
                    <div className="py-10 text-center text-gray-500">
                      Loading driver details...
                    </div>
                  )}

                  {!isDetailLoading && detailErrorMessage && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {detailErrorMessage}
                    </div>
                  )}

                  {!isDetailLoading && !detailErrorMessage && selectedDriverProfile && (
                    <>
                      <div className="flex items-center gap-8 mb-8">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                            <ProfileImage
                              src={selectedDriverProfile.profileImage}
                              alt={selectedDriverProfile.name}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        <div className="flex-1 items-center justify-center">
                          <div className="flex gap-2 mb-3">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getDriverStatusStyles(
                                selectedDriverProfile.driverStatus
                              )}`}
                            >
                              {toLabelCase(selectedDriverProfile.driverStatus)}
                            </span>
                          </div>
                          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            {selectedDriverProfile.name}
                          </h2>
                          <p className="text-sm text-gray-500">
                            Driver ID: {selectedDriverProfile._id}
                          </p>
                        </div>

                        <div className="flex gap-6">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-50">
                              <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                              <div className="text-3xl font-bold text-gray-900">
                                {selectedDriverProfile.accusedCount}
                              </div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide">
                                Accused
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#FFF4E6]">
                              <Star className="w-6 h-6 text-[#E9A906] fill-[#E9A906]" />
                            </div>
                            <div>
                              <div className="text-3xl font-bold text-gray-900">
                                {selectedDriverProfile.rating.toFixed(1)}
                              </div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide">
                                Rating
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#EEF4FF]">
                              <ShieldCheck className="w-6 h-6 text-[#240183]" />
                            </div>
                            <div>
                              <div className="text-3xl font-bold text-gray-900">
                                {selectedDriverProfile.requiredActionsCount}
                              </div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide">
                                Actions
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-16 gap-y-6">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Email
                          </label>
                          <div className="flex items-center gap-2 text-gray-900 mb-[12px]">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{selectedDriverProfile.email}</span>
                          </div>
                          <hr />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Phone
                          </label>
                          <div className="flex items-center gap-2 text-gray-900 mb-[12px]">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{selectedDriverProfile.phone}</span>
                          </div>
                          <hr />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Joining Date
                          </label>
                          <div className="flex items-center gap-2 text-gray-900 mb-[12px]">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(selectedDriverProfile.joiningDate)}</span>
                          </div>
                          <hr />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Emergency Contact
                          </label>
                          <div className="flex items-center gap-2 text-gray-900 mb-[12px]">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{selectedDriverProfile.emergency || 'Not provided'}</span>
                          </div>
                          <hr />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Documents Status
                          </label>
                          <div className="flex items-center gap-2 text-gray-900 mb-[12px]">
                            <ClipboardList className="w-4 h-4 text-gray-400" />
                            <span>{toLabelCase(selectedDriverProfile.documentsStatus)}</span>
                          </div>
                          <hr />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Deletion Timeline
                          </label>
                          <div
                            className={`mb-[12px] font-medium ${
                              selectedDriverProfile.deletion.status.toLowerCase() ===
                              'yes'
                                ? 'text-[#BC0E01]'
                                : 'text-[#05895A]'
                            }`}
                          >
                            {selectedDriverProfile.deletion.daysLeft !== null
                              ? `${selectedDriverProfile.deletion.daysLeft} days left`
                              : 'Not scheduled for deletion'}
                          </div>
                          <hr />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {activeTab === 'Documents' && (
                <>
                  {documentView === null && (
                    <DocumentsTab
                      documents={selectedDriverDocuments}
                      isLoading={isDocumentsLoading}
                      errorMessage={documentsErrorMessage}
                      onViewDocument={handleViewDocument}
                    />
                  )}
                  {documentView === 'license' && (
                    <DriverLicenseView
                      onBack={handleBackToDocuments}
                      detail={selectedDriverDocumentDetail}
                      isLoading={isDocumentDetailLoading}
                      errorMessage={documentDetailErrorMessage}
                      isReviewing={isReviewingDocument}
                      onApprove={handleApproveDocument}
                      onReject={handleRejectDocument}
                    />
                  )}
                  {documentView === 'vehicle-info' && (
                    <VehicleInfoView
                      onBack={handleBackToDocuments}
                      detail={selectedDriverDocumentDetail}
                      isLoading={isDocumentDetailLoading}
                      errorMessage={documentDetailErrorMessage}
                      isReviewing={isReviewingDocument}
                      onApprove={handleApproveDocument}
                      onReject={handleRejectDocument}
                    />
                  )}
                  {documentView === 'insurance' && (
                    <VehicleInsuranceView
                      onBack={handleBackToDocuments}
                      detail={selectedDriverDocumentDetail}
                      isLoading={isDocumentDetailLoading}
                      errorMessage={documentDetailErrorMessage}
                      isReviewing={isReviewingDocument}
                      onApprove={handleApproveDocument}
                      onReject={handleRejectDocument}
                    />
                  )}
                  {documentView === 'registration' && (
                    <VehicleRegistrationView
                      onBack={handleBackToDocuments}
                      detail={selectedDriverDocumentDetail}
                      isLoading={isDocumentDetailLoading}
                      errorMessage={documentDetailErrorMessage}
                      isReviewing={isReviewingDocument}
                      onApprove={handleApproveDocument}
                      onReject={handleRejectDocument}
                    />
                  )}
                </>
              )}

              {activeTab === 'History' && (
                <>
                  {isHistoryLoading && (
                    <div className="py-10 text-center text-gray-500">
                      Loading driver history...
                    </div>
                  )}

                  {!isHistoryLoading && historyErrorMessage && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {historyErrorMessage}
                    </div>
                  )}

                  {!isHistoryLoading && !historyErrorMessage && selectedDriverHistory.length === 0 && (
                    <div className="py-10 text-center text-gray-500">
                      No trip history found for this driver.
                    </div>
                  )}

                  {!isHistoryLoading && !historyErrorMessage && selectedDriverHistory.length > 0 && (
                    <div className="grid grid-cols-3 gap-6">
                      {selectedDriverHistory.map((ride) => (
                        <div
                          key={ride._id}
                          className="bg-[#F4F4F6] rounded-lg p-5"
                        >
                          <div className="flex items-start justify-between mb-4 gap-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                Trip #{ride._id.slice(-6).toUpperCase()}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {formatDateTime(ride.createdAt)}
                              </p>
                            </div>
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded ${
                                ride.status.toLowerCase() === 'completed'
                                  ? 'text-green-700 bg-green-100'
                                  : 'text-red-700 bg-red-100'
                              }`}
                            >
                              {toLabelCase(ride.status)}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-gray-700 bg-white px-4 py-3 rounded-lg">
                              <div className="flex items-center">
                                <HugeiconsIcon
                                  icon={Money04Icon}
                                  className="text-[#047049]"
                                />
                                <span className="font-semibold ml-[10px]">
                                  {formatCurrency(
                                    ride.fare.currency,
                                    ride.fare.total
                                  )}
                                </span>
                              </div>
                              <span className="text-xs flex justify-center text-center text-gray-500 mt-2">
                                TOTAL FARE
                              </span>
                            </div>
                            <div className="text-gray-700 bg-white px-4 py-3 rounded-lg">
                              <div className="flex items-center">
                                <HugeiconsIcon
                                  icon={Money04Icon}
                                  className="text-[#240183]"
                                />
                                <span className="font-semibold ml-[10px]">
                                  {formatCurrency(
                                    ride.fare.currency,
                                    ride.fare.driverGets
                                  )}
                                </span>
                              </div>
                              <span className="text-xs flex justify-center text-center text-gray-500 mt-2">
                                DRIVER GETS
                              </span>
                            </div>
                          </div>

                          <div className="text-gray-700 bg-white px-4 py-3 rounded-lg">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-[#E9A906] fill-[#E9A906]" />
                              <span className="font-semibold ml-[10px]">
                                {ride.riderRating !== null ? ride.riderRating : 'N/A'}
                              </span>
                            </div>
                            <span className="text-xs flex justify-center text-center text-gray-500 mt-2">
                              RIDER RATING
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'Reports' && (
                <>
                  {isReportsLoading && (
                    <div className="py-10 text-center text-gray-500">
                      Loading driver reports...
                    </div>
                  )}

                  {!isReportsLoading && reportsErrorMessage && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {reportsErrorMessage}
                    </div>
                  )}

                  {!isReportsLoading &&
                    !reportsErrorMessage &&
                    selectedDriverReports.length === 0 && (
                      <div className="py-10 text-center text-gray-500">
                        No reports found for this driver.
                      </div>
                    )}

                  {!isReportsLoading &&
                    !reportsErrorMessage &&
                    selectedDriverReports.length > 0 && (
                      <div className="space-y-4">
                        {selectedDriverReports.map((report, index) => (
                          <div
                            key={report._id || `${report.createdAt || 'report'}-${index}`}
                            className="bg-[#F4F4F6] rounded-lg p-5"
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
                                <ProfileImage
                                  alt={report.reporterName || 'Reporter'}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {report.reporterName || 'Unknown Reporter'}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {report.reporterRole || 'User'}
                                </p>
                                {report.createdAt && (
                                  <p className="text-xs text-gray-400 mt-1">
                                    {formatDateTime(report.createdAt)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed mt-[10px]">
                              {report.comment ||
                                report.reason ||
                                'No report description provided.'}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDetails;
