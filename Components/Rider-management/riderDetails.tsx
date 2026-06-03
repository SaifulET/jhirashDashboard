'use client';

import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Mail,
  MapPin,
  Phone,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useRiderStore } from '@/store/rider-store';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Car02Icon,
  Money04Icon,
  Vynil01Icon,
} from '@hugeicons/core-free-icons';
import ProfileImage from '@/Components/common/ProfileImage';

type TabType = 'Profile' | 'History' | 'Reports';

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

const getUserStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
    case 'verified':
      return 'text-green-700 bg-green-100';
    case 'pending':
      return 'text-[#E26A02] bg-[#FEE4D6]';
    case 'denied':
    case 'inactive':
      return 'text-red-700 bg-red-100';
    default:
      return 'text-gray-700 bg-gray-100';
  }
};

const RiderDetailPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Profile');
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionErrorMessage, setActionErrorMessage] = useState('');
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const riderId = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const selectedRiderProfile = useRiderStore(
    (state) => state.selectedRiderProfile
  );
  const isDetailLoading = useRiderStore((state) => state.isDetailLoading);
  const selectedRiderHistory = useRiderStore(
    (state) => state.selectedRiderHistory
  );
  const selectedRiderReports = useRiderStore(
    (state) => state.selectedRiderReports
  );
  const isHistoryLoading = useRiderStore((state) => state.isHistoryLoading);
  const isReportsLoading = useRiderStore((state) => state.isReportsLoading);
  const detailErrorMessage = useRiderStore((state) => state.detailErrorMessage);
  const historyErrorMessage = useRiderStore(
    (state) => state.historyErrorMessage
  );
  const reportsErrorMessage = useRiderStore(
    (state) => state.reportsErrorMessage
  );
  const fetchRiderDetail = useRiderStore((state) => state.fetchRiderDetail);
  const fetchRiderHistory = useRiderStore((state) => state.fetchRiderHistory);
  const fetchRiderReports = useRiderStore((state) => state.fetchRiderReports);
  const deleteRider = useRiderStore((state) => state.deleteRider);

  useEffect(() => {
    if (riderId) {
      void fetchRiderDetail(riderId);
      void fetchRiderHistory(riderId);
      void fetchRiderReports(riderId);
    }
  }, [fetchRiderDetail, fetchRiderHistory, fetchRiderReports, riderId]);

  const handleDeleteRider = async () => {
    if (!riderId) {
      return;
    }

    setIsDeleting(true);
    setActionErrorMessage('');

    try {
      await deleteRider(riderId);
      router.push('/pages/rider-management');
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

  return (
    <div className="flex min-h-screen bg-[#F4F4F6]">
      <div className="flex-shrink-0" />

      <div className="flex-1 mx-[174px] my-[40px]">
        <div>
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <Link href="/pages/rider-management">
                <button className="p-2 bg-[#A6AFFF] hover:bg-[#97a0f5] text-gray-900 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {activeTab === 'History'
                    ? 'Detail of Rider History'
                    : activeTab === 'Reports'
                      ? 'Details of Reports Against the Rider'
                      : 'Detail of Rider'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  This section will show every detail of a particular rider.
                </p>
              </div>
            </div>
            <button
              onClick={() => void handleDeleteRider()}
              disabled={isDeleting || !selectedRiderProfile}
              className="px-6 py-2.5 bg-[#BC0E01] hover:bg-[#a00c01] text-white rounded-lg font-medium transition-colors disabled:opacity-70"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>

          {(actionErrorMessage || detailErrorMessage) && !isDetailLoading && (
            <div className="mx-6 mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {actionErrorMessage || detailErrorMessage}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex">
              <button
                onClick={() => setActiveTab('Profile')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'Profile'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('History')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'History'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                History
              </button>
              <button
                onClick={() => setActiveTab('Reports')}
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
                      Loading rider details...
                    </div>
                  )}

                  {!isDetailLoading && !detailErrorMessage && selectedRiderProfile && (
                    <>
                      <div className="flex items-center gap-8 mb-8">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                            <ProfileImage
                              src={selectedRiderProfile.profileImage}
                              alt={selectedRiderProfile.name}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        <div className="flex-1 items-center justify-center">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getUserStatusStyles(
                              selectedRiderProfile.userStatus
                            )}`}
                          >
                            {toLabelCase(selectedRiderProfile.userStatus)}
                          </span>
                          <h2 className="text-2xl font-semibold text-gray-900 mb-2 mt-3">
                            {selectedRiderProfile.name}
                          </h2>
                          <p className="text-sm text-gray-500">
                            Rider ID: {selectedRiderProfile._id}
                          </p>
                        </div>

                        <div className="flex gap-8">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-50">
                              <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                              <div className="text-3xl font-bold text-gray-900">
                                {selectedRiderProfile.accusedCount}
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
                                {selectedRiderProfile.rating.toFixed(1)}
                              </div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide">
                                Rating
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
                            <span>{selectedRiderProfile.email}</span>
                          </div>
                          <hr />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Phone
                          </label>
                          <div className="flex items-center gap-2 text-gray-900 mb-[12px]">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{selectedRiderProfile.phone}</span>
                          </div>
                          <hr />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Joining Date
                          </label>
                          <div className="flex items-center gap-2 text-gray-900 mb-[12px]">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(selectedRiderProfile.joiningDate)}</span>
                          </div>
                          <hr />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Emergency Contact
                          </label>
                          <div className="flex items-center gap-2 text-gray-900 mb-[12px]">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{selectedRiderProfile.emergency || 'Not provided'}</span>
                          </div>
                          <hr />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Trips Count
                          </label>
                          <div className="text-gray-900 mb-[12px] font-medium">
                            {selectedRiderProfile.tripsCount}
                          </div>
                          <hr />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Saved Places
                          </label>
                          <div className="text-gray-900 mb-[12px] font-medium">
                            {selectedRiderProfile.savedPlacesCount}
                          </div>
                          <hr />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Deletion Timeline
                          </label>
                          <div
                            className={`font-medium mb-[12px] ${
                              selectedRiderProfile.deletion.status.toLowerCase() ===
                              'yes'
                                ? 'text-[#BC0E01]'
                                : 'text-[#05895A]'
                            }`}
                          >
                            {selectedRiderProfile.deletion.daysLeft !== null
                              ? `${selectedRiderProfile.deletion.daysLeft} days left`
                              : 'Not scheduled for deletion'}
                          </div>
                          <hr />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {activeTab === 'History' && (
                <>
                  {isHistoryLoading && (
                    <div className="py-10 text-center text-gray-500">
                      Loading rider history...
                    </div>
                  )}

                  {!isHistoryLoading && historyErrorMessage && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {historyErrorMessage}
                    </div>
                  )}

                  {!isHistoryLoading &&
                    !historyErrorMessage &&
                    selectedRiderHistory.length === 0 && (
                      <div className="py-10 text-center text-gray-500">
                        No trip history found for this rider.
                      </div>
                    )}

                  {!isHistoryLoading &&
                    !historyErrorMessage &&
                    selectedRiderHistory.length > 0 && (
                      <div className="grid grid-cols-3 gap-6">
                        {selectedRiderHistory.map((ride) => (
                          <div
                            key={ride._id}
                            className="bg-[#F4F4F6] rounded-lg p-5"
                          >
                            <div className="flex items-start gap-3 mb-4">
                              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
                                <ProfileImage
                                  src={ride.driver.profileImage}
                                  alt={ride.driver.name}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-gray-900">
                                    {ride.driver.name}
                                  </h3>
                                  <div className="flex items-center gap-1 bg-[#FFF4E6] px-2 py-0.5 rounded">
                                    <Star className="w-3.5 h-3.5 fill-[#E9A906] text-[#E9A906]" />
                                    <span className="text-sm font-medium text-gray-900">
                                      {ride.driver.ratingAvg.toFixed(1)}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500">
                                  {ride.vehicle.brand} {ride.vehicle.model}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
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
                                  <Star className="w-4 h-4 text-[#E9A906] fill-[#E9A906]" />
                                  <span className="font-semibold ml-[10px]">
                                    {ride.driverReview?.rating ?? 'N/A'}
                                  </span>
                                </div>
                                <span className="text-xs flex justify-center text-center text-gray-500 mt-2">
                                  DRIVER RATING
                                </span>
                              </div>
                            </div>

                            <div className="space-y-3 text-sm text-gray-700">
                              <div className="flex items-start gap-3">
                                <HugeiconsIcon
                                  icon={Car02Icon}
                                  className="text-[#6662FF] mt-0.5"
                                />
                                <div>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    Vehicle
                                  </p>
                                  <p className="font-medium">
                                    {ride.vehicle.type} · {ride.vehicle.licensePlate}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-3">
                                <HugeiconsIcon
                                  icon={Vynil01Icon}
                                  className="text-[#6662FF] mt-0.5"
                                />
                                <div>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    Estimated Fare
                                  </p>
                                  <p className="font-medium">
                                    {formatCurrency(
                                      ride.fare.currency,
                                      ride.fare.estimatedFare
                                    )}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[#6662FF] mt-0.5" />
                                <div>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    Final Fare
                                  </p>
                                  <p className="font-medium">
                                    {formatCurrency(
                                      ride.fare.currency,
                                      ride.fare.finalFare
                                    )}
                                  </p>
                                </div>
                              </div>
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
                      Loading rider reports...
                    </div>
                  )}

                  {!isReportsLoading && reportsErrorMessage && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {reportsErrorMessage}
                    </div>
                  )}

                  {!isReportsLoading &&
                    !reportsErrorMessage &&
                    selectedRiderReports.length === 0 && (
                      <div className="py-10 text-center text-gray-500">
                        No reports found for this rider.
                      </div>
                    )}

                  {!isReportsLoading &&
                    !reportsErrorMessage &&
                    selectedRiderReports.length > 0 && (
                      <div className="space-y-4">
                        {selectedRiderReports.map((report, index) => (
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

export default RiderDetailPage;
