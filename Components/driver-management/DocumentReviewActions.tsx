'use client';

import React, { useState } from 'react';

interface DocumentReviewActionsProps {
  status: string;
  rejectionReason?: string | null;
  isReviewing: boolean;
  errorMessage?: string;
  onApprove: () => Promise<void>;
  onReject: (reason: string) => Promise<void>;
}

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'verified':
    case 'approved':
      return 'text-green-700 bg-green-100';
    case 'denied':
    case 'rejected':
      return 'text-red-700 bg-red-100';
    case 'pending':
      return 'text-orange-700 bg-orange-100';
    default:
      return 'text-gray-700 bg-gray-100';
  }
};

const toLabelCase = (value: string) =>
  value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

const DocumentReviewActions: React.FC<DocumentReviewActionsProps> = ({
  status,
  rejectionReason,
  isReviewing,
  errorMessage,
  onApprove,
  onReject,
}) => {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [reason, setReason] = useState(rejectionReason ?? '');
  const [localErrorMessage, setLocalErrorMessage] = useState('');

  const handleReject = async () => {
    if (!reason.trim()) {
      setLocalErrorMessage('Please provide a rejection reason.');
      return;
    }

    setLocalErrorMessage('');
    await onReject(reason.trim());
    setShowRejectForm(false);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-center mb-4">
        <span
          className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusStyles(
            status
          )}`}
        >
          {toLabelCase(status)}
        </span>
      </div>

      {rejectionReason && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          Rejection reason: {rejectionReason}
        </div>
      )}

      {(localErrorMessage || errorMessage) && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {localErrorMessage || errorMessage}
        </div>
      )}

      {showRejectForm && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rejection reason
          </label>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#240183]"
            placeholder="Image is blurry. Please upload a clearer photo."
          />
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => {
                setShowRejectForm(false);
                setLocalErrorMessage('');
              }}
              className="px-8 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={isReviewing}
              className="px-8 py-2.5 bg-[#BC0E01] hover:bg-[#a00c01] text-white font-medium rounded-lg transition-colors disabled:opacity-70"
            >
              {isReviewing ? 'Submitting...' : 'Submit Rejection'}
            </button>
          </div>
        </div>
      )}

      {!showRejectForm && (
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowRejectForm(true)}
            disabled={isReviewing}
            className="px-8 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg transition-colors disabled:opacity-70"
          >
            Decline
          </button>
          <button
            onClick={() => void onApprove()}
            disabled={isReviewing}
            className="px-8 py-2.5 bg-[#10B981] hover:bg-[#0ea572] text-white font-medium rounded-lg transition-colors disabled:opacity-70"
          >
            {isReviewing ? 'Updating...' : 'Accept'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentReviewActions;
