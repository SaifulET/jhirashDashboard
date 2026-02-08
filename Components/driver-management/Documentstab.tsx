'use client';

import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Car01Icon, File01Icon, IdentityCardIcon, ProfileIcon } from '@hugeicons/core-free-icons';

interface DocumentsTabProps {
  onViewDocument: (type: 'license' | 'vehicle-info' | 'insurance' | 'registration') => void;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ onViewDocument }) => {
  const documents = [
    {
      type: 'license' as const,
      title: 'Driver License',
      status: 'Pending',
      statusColor: 'text-orange-700 bg-orange-100',
      icon: IdentityCardIcon,
      iconBg: 'bg-gray-100'
    },
    {
      type: 'vehicle-info' as const,
      title: 'Vehicle Information',
      status: 'Verified',
      statusColor: 'text-green-700 bg-green-100',
      icon: Car01Icon,
      iconBg: 'bg-gray-100'
    },
    {
      type: 'insurance' as const,
      title: 'Vehicle Insurance',
      status: 'Verified',
      statusColor: 'text-green-700 bg-green-100',
      icon:File01Icon,
      iconBg: 'bg-gray-100'
    },
    {
      type: 'registration' as const,
      title: 'Vehicle Registration',
      status: 'Denied',
      statusColor: 'text-red-700 bg-red-100',
      icon: ProfileIcon,
      iconBg: 'bg-gray-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      {documents.map((doc) => {
        const IconComponent = doc.icon;
        return (
          <div key={doc.type} className="bg-[#ECEBEF] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-medium px-2 py-1 rounded ${doc.statusColor}`}>
                {doc.status}
              </span>
              <div className={`w-10 h-10 rounded-lg ${doc.iconBg} flex items-center justify-center`}>
                <HugeiconsIcon icon={IconComponent} className="w-5 h-5 text-gray-600" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
              {doc.title}
            </h3>

            <button
              onClick={() => onViewDocument(doc.type)}
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