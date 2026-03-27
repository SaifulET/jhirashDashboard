'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLegalContentStore } from '@/store/legal-content-store';
import { legalContentConfigs } from './legal-content-config';
import type { LegalContentItem, LegalContentType } from '@/types/legal-content';

const EMPTY_LEGAL_CONTENT_ITEMS: LegalContentItem[] = [];

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const DeleteModal: React.FC<{
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ isOpen, isDeleting, onClose, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <div className="flex flex-col items-center text-center">
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
            Once deleted, you won&apos;t be able to recover this. Please confirm
            your action.
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
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium disabled:opacity-70"
            >
              {isDeleting ? 'Deleting...' : 'Yes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LegalContentListProps {
  type: LegalContentType;
}

const LegalContentList: React.FC<LegalContentListProps> = ({ type }) => {
  const router = useRouter();
  const config = legalContentConfigs[type];
  const itemsByType = useLegalContentStore((state) => state.itemsByType);
  const isListLoading = useLegalContentStore((state) => state.isListLoading);
  const isDeleting = useLegalContentStore((state) => state.isDeleting);
  const listErrorMessage = useLegalContentStore((state) => state.listErrorMessage);
  const deleteErrorMessage = useLegalContentStore(
    (state) => state.deleteErrorMessage
  );
  const fetchLegalContents = useLegalContentStore(
    (state) => state.fetchLegalContents
  );
  const deleteLegalContent = useLegalContentStore(
    (state) => state.deleteLegalContent
  );
  const clearMessages = useLegalContentStore((state) => state.clearMessages);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const items = itemsByType[type] ?? EMPTY_LEGAL_CONTENT_ITEMS;

  useEffect(() => {
    void fetchLegalContents(type);
  }, [fetchLegalContents, type]);

  const selectedItem = useMemo(
    () => items.find((item) => item._id === selectedItemId) || null,
    [items, selectedItemId]
  );

  const handleEdit = (id: string) => {
    router.push(`${config.basePath}/${id}`);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItemId) {
      return;
    }

    try {
      await deleteLegalContent(type, selectedItemId);
      setSelectedItemId(null);
    } catch {
      return;
    }
  };

  const handleDeleteCancel = () => {
    setSelectedItemId(null);
    clearMessages();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {(listErrorMessage || deleteErrorMessage) && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {deleteErrorMessage || listErrorMessage}
          </div>
        )}

        {!isListLoading && items.length === 0 && (
          <div className="min-h-[70vh] flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-[471px] min-h-[288px] flex flex-col items-center justify-center p-8 text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                {config.addCardTitle}
              </h1>
              <p className="text-sm text-gray-600 mb-6">
                {config.addCardDescription}
              </p>
              <button
                onClick={() => router.push(`${config.basePath}/add`)}
                className="bg-[#240183] text-[#FFD283] px-6 py-2.5 rounded-md font-medium flex items-center gap-2 hover:bg-[#1a0161] transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 3.33334V12.6667M3.33333 8H12.6667"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Add
              </button>
            </div>
          </div>
        )}

        {(isListLoading || items.length > 0) && (
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                {config.pageTitle}
              </h1>
              <p className="text-sm text-gray-600">{config.pageDescription}</p>
            </div>
            <button
              onClick={() => router.push(`${config.basePath}/add`)}
              className="shrink-0 bg-[#240183] text-[#FFD283] px-5 py-2.5 rounded-md font-medium flex items-center gap-2 hover:bg-[#1a0161] transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 3.33334V12.6667M3.33333 8H12.6667"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Add
            </button>
          </div>
        )}

        {isListLoading && (
          <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
            Loading legal contents...
          </div>
        )}

        {!isListLoading && items.length > 0 && (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {item.title}
                      </h2>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          item.isPublished
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {item.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                      {item.plainText || 'No content preview available.'}
                    </p>

                    <div className="flex gap-4 text-xs text-gray-500 flex-wrap">
                      <span>Created: {formatDate(item.createdAt)}</span>
                      <span>Updated: {formatDate(item.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedItemId(item._id)}
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
        )}
      </div>

      <DeleteModal
        isOpen={Boolean(selectedItem)}
        isDeleting={isDeleting}
        onClose={handleDeleteCancel}
        onConfirm={() => void handleDeleteConfirm()}
      />
    </div>
  );
};

export default LegalContentList;
