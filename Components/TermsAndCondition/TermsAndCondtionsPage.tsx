'use client'
import React, { useState } from 'react';

import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TermsCondition {
  id: string;
  title: string;
  version: string;
  description: string;
  createdDate: string;
  updatedDate: string;
}

// Delete Confirmation Modal Component
const DeleteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <div className="flex flex-col items-center text-center">
          {/* Red circle with power icon */}
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h2 className="text-xl font-semibold mb-2 text-gray-900">
            Are you sure you want to delete this item?
          </h2>
          
          <p className="text-sm text-gray-500 mb-6">
            Once canceled, you wont be able to recover this. Please confirm your action.
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              No
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Terms & Conditions Page Component
const TermsConditionsPage: React.FC = () => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Sample data - replace with actual data fetching
  const [termsConditions, setTermsConditions] = useState<TermsCondition[]>([
    {
      id: '1',
      title: 'User Agreement',
      version: 'Version 1.0',
      description:
        'By using MA3 platform, you agree to comply with all terms and conditions outlined herein. These terms govern your access to and use of our services.',
      createdDate: '2024-01-15',
      updatedDate: '2024-01-15',
    },
  ]);

  const handleEdit = (id: string) => {
    router.push(`/pages/terms-conditions/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedItemId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedItemId) {
      // Perform delete operation
      setTermsConditions((prev) =>
        prev.filter((item) => item.id !== selectedItemId)
      );
      setIsDeleteModalOpen(false);
      setSelectedItemId(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedItemId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Terms & Conditions
          </h1>
          <p className="text-sm text-gray-600">
            Manage terms & conditions for the MA3 platform.
          </p>
        </div>

        {/* Terms List */}
        <div className="space-y-4">
          {termsConditions.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {item.title}
                    </h2>
                    <span className="text-sm text-gray-500">{item.version}</span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-4">
                    {item.description}
                  </p>

                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>Created: {item.createdDate}</span>
                    <span>Updated: {item.updatedDate}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                    aria-label="Edit"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default TermsConditionsPage;