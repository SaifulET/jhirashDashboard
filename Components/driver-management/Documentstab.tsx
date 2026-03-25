'use client';

import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Car01Icon,
  File01Icon,
  IdentityCardIcon,
  ProfileIcon,
} from '@hugeicons/core-free-icons';
import type { DriverDocument } from '@/types/driver';

type DocumentViewType =
  | 'license'
  | 'vehicle-info'
  | 'insurance'
  | 'registration';

interface DocumentsTabProps {
  documents: DriverDocument[];
  isLoading: boolean;
  errorMessage: string;
  onViewDocument: (type: DocumentViewType) => void;
}

const documentMeta: Record<
  string,
  {
    type: DocumentViewType;
    icon: typeof IdentityCardIcon;
  }
> = {
  driver_license: {
    type: 'license',
    icon: IdentityCardIcon,
  },
  vehicle_information: {
    type: 'vehicle-info',
    icon: Car01Icon,
  },
  vehicle_insurance: {
    type: 'insurance',
    icon: File01Icon,
  },
  vehicle_registration: {
    type: 'registration',
    icon: ProfileIcon,
  },
};

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'verified':
    case 'approved':
    case 'active':
      return 'text-green-700 bg-green-100';
    case 'denied':
    case 'rejected':
      return 'text-red-700 bg-red-100';
    case 'pending':
    case 'in review':
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

const DocumentsTab: React.FC<DocumentsTabProps> = ({
  documents,
  isLoading,
  errorMessage,
  onViewDocument,
}) => {
  if (isLoading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading driver documents...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
        {errorMessage}
      </div>
    );
  }

  if (!documents.length) {
    return (
      <div className="py-10 text-center text-gray-500">
        No document data found for this driver.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {documents.map((doc) => {
        const meta = documentMeta[doc.key];

        if (!meta) {
          return null;
        }

        return (
          <div key={doc.key} className="bg-[#ECEBEF] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${getStatusStyles(
                  doc.status
                )}`}
              >
                {toLabelCase(doc.status)}
              </span>
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <HugeiconsIcon
                  icon={meta.icon}
                  className="w-5 h-5 text-gray-600"
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
              {doc.title}
            </h3>

            <p className="text-sm text-gray-500 text-center mb-6">
              {doc.itemCount} item{doc.itemCount === 1 ? '' : 's'}
            </p>

            <button
              onClick={() => onViewDocument(meta.type)}
              className="w-full py-2.5 bg-[#A6AFFF] hover:bg-[#97a0f5] text-gray-900 font-medium rounded-lg transition-colors"
            >
              View
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default DocumentsTab;
