'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import DocumentReviewActions from './DocumentReviewActions';
import type { DriverDocumentDetail } from '@/types/driver';

interface VehicleInfoViewProps {
  onBack: () => void;
  detail: DriverDocumentDetail | null;
  isLoading: boolean;
  errorMessage: string;
  isReviewing: boolean;
  onApprove: () => Promise<void>;
  onReject: (reason: string) => Promise<void>;
}

const VehicleInfoView: React.FC<VehicleInfoViewProps> = ({
  onBack,
  detail,
  isLoading,
  errorMessage,
  isReviewing,
  onApprove,
  onReject,
}) => {
  const vehicle = detail?.vehicle;

  return (
    <div className="bg-white rounded-lg">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#A6AFFF] hover:bg-[#97a0f5] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Detail of Vehicle Information
            </h2>
            <p className="text-sm text-gray-500">
              This section shows every detail of the selected document.
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="py-10 text-center text-gray-500">
            Loading document details...
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && vehicle && detail && (
          <>
            <div className="space-y-6 mb-8">
              <div className="grid grid-cols-2 gap-x-16">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Brand
                  </label>
                  <div className="text-gray-900 mb-3">{vehicle.brand}</div>
                  <hr />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Model
                  </label>
                  <div className="text-gray-900 mb-3">{vehicle.model}</div>
                  <hr />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-16">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Year
                  </label>
                  <div className="text-gray-900 mb-3">{vehicle.year}</div>
                  <hr />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Type
                  </label>
                  <div className="text-gray-900 mb-3">{vehicle.type}</div>
                  <hr />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-16">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Seats
                  </label>
                  <div className="text-gray-900 mb-3">{vehicle.seats}</div>
                  <hr />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    License Plate
                  </label>
                  <div className="text-gray-900 mb-3">{vehicle.licensePlate}</div>
                  <hr />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-16">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Size
                  </label>
                  <div className="text-gray-900 mb-3">{vehicle.size}</div>
                  <hr />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Tier
                  </label>
                  <div className="text-gray-900 mb-3">{vehicle.tier}</div>
                  <hr />
                </div>
              </div>
            </div>

            <DocumentReviewActions
              status={detail.status}
              isReviewing={isReviewing}
              errorMessage={errorMessage}
              onApprove={onApprove}
              onReject={onReject}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default VehicleInfoView;
