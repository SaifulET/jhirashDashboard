'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowLeft, Eye } from 'lucide-react';
import DocumentReviewActions from './DocumentReviewActions';
import type { DriverDocumentDetail } from '@/types/driver';

interface DriverLicenseViewProps {
  onBack: () => void;
  detail: DriverDocumentDetail | null;
  isLoading: boolean;
  errorMessage: string;
  isReviewing: boolean;
  onApprove: () => Promise<void>;
  onReject: (reason: string) => Promise<void>;
}

const DriverLicenseView: React.FC<DriverLicenseViewProps> = ({
  onBack,
  detail,
  isLoading,
  errorMessage,
  isReviewing,
  onApprove,
  onReject,
}) => {
  const [selectedImageUrl, setSelectedImageUrl] = React.useState<string | null>(null);
  const items = detail?.items ?? [];
  const rejectionReason =
    items.find((item) => item.rejectionReason)?.rejectionReason ?? null;

  return (
    <div className="bg-white rounded-lg">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#A6AFFF] hover:bg-[#97a0f5] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Detail of Driver License Information
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

        {!isLoading && !errorMessage && detail && (
          <>
            <div className="grid grid-cols-2 gap-6 mb-6">
              {items.map((item) => (
                <div key={item.key} className="space-y-4">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={item.fileUrl}
                      alt={item.key}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => setSelectedImageUrl(item.fileUrl)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-[#A6AFFF] hover:bg-[#97a0f5] text-gray-900 font-medium rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Full View
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <DocumentReviewActions
              status={detail.status}
              rejectionReason={rejectionReason}
              isReviewing={isReviewing}
              errorMessage={errorMessage}
              onApprove={onApprove}
              onReject={onReject}
            />
          </>
        )}
      </div>

      {selectedImageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-gray-100">
              <Image
                src={selectedImageUrl}
                alt="Full View"
                fill
                className="object-contain"
              />
            </div>
            <button
              onClick={() => setSelectedImageUrl(null)}
              className="w-full py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverLicenseView;
