'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { useParams, useRouter } from 'next/navigation';
import { useLegalContentStore } from '@/store/legal-content-store';
import { legalContentConfigs } from './legal-content-config';
import type {
  LegalContentDelta,
  LegalContentType,
} from '@/types/legal-content';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['blockquote', 'code-block'],
    [{ align: [] }],
    ['link', 'image', 'video'],
    [{ color: [] }, { background: [] }],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'indent',
  'blockquote',
  'code-block',
  'align',
  'link',
  'image',
  'video',
  'color',
  'background',
];

interface LegalContentEditorProps {
  type: LegalContentType;
}

const LegalContentEditor: React.FC<LegalContentEditorProps> = ({ type }) => {
  const config = legalContentConfigs[type];
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const isCreateMode = !slug || slug === 'add';
  const selectedItem = useLegalContentStore((state) => state.selectedItem);
  const isDetailLoading = useLegalContentStore((state) => state.isDetailLoading);
  const isSaving = useLegalContentStore((state) => state.isSaving);
  const detailErrorMessage = useLegalContentStore(
    (state) => state.detailErrorMessage
  );
  const saveErrorMessage = useLegalContentStore((state) => state.saveErrorMessage);
  const fetchLegalContentDetail = useLegalContentStore(
    (state) => state.fetchLegalContentDetail
  );
  const createLegalContent = useLegalContentStore(
    (state) => state.createLegalContent
  );
  const updateLegalContent = useLegalContentStore(
    (state) => state.updateLegalContent
  );
  const clearSelectedItem = useLegalContentStore((state) => state.clearSelectedItem);
  const clearMessages = useLegalContentStore((state) => state.clearMessages);
  const [title, setTitle] = useState(config.defaultTitle);
  const [contentHtml, setContentHtml] = useState('');
  const [contentDelta, setContentDelta] = useState<LegalContentDelta | null>(null);
  const [plainText, setPlainText] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    clearMessages();

    if (!isCreateMode && slug) {
      void fetchLegalContentDetail(type, slug);
    } else {
      clearSelectedItem();
      setTitle(config.defaultTitle);
      setContentHtml('');
      setContentDelta(null);
      setPlainText('');
      setIsPublished(true);
    }

    return () => {
      clearSelectedItem();
    };
  }, [
    clearMessages,
    clearSelectedItem,
    config.defaultTitle,
    fetchLegalContentDetail,
    isCreateMode,
    slug,
    type,
  ]);

  useEffect(() => {
    if (!selectedItem || isCreateMode) {
      return;
    }

    setTitle(selectedItem.title);
    setContentHtml(selectedItem.contentHtml);
    setContentDelta(selectedItem.contentDelta);
    setPlainText(selectedItem.plainText);
    setIsPublished(selectedItem.isPublished);
  }, [isCreateMode, selectedItem]);

  const combinedErrorMessage = useMemo(
    () => saveErrorMessage || detailErrorMessage,
    [detailErrorMessage, saveErrorMessage]
  );

  const handleCancel = () => {
    clearMessages();
    router.push(config.basePath);
  };

  const handleSave = async () => {
    const normalizedTitle = title.trim() || config.defaultTitle;
    const normalizedPlainText = plainText.trim();

    try {
      if (isCreateMode) {
        await createLegalContent(type, {
          type,
          title: normalizedTitle,
          contentHtml,
          contentDelta,
          isPublished,
        });
      } else if (slug) {
        await updateLegalContent(type, slug, {
          title: normalizedTitle,
          contentHtml,
          plainText: normalizedPlainText,
          contentDelta,
          isPublished,
        });
      }

      router.push(config.basePath);
    } catch {
      return;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {config.editorHeading}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {config.editorDescription}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => void handleSave()}
              disabled={isSaving}
              className="px-6 py-2 text-sm font-medium text-[#FFD283] bg-[#240183] rounded-md hover:bg-[#1a0161] transition-colors disabled:opacity-70"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {combinedErrorMessage && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {combinedErrorMessage}
          </div>
        )}

        {isDetailLoading && !isCreateMode ? (
          <div className="bg-white rounded-lg shadow-sm p-10 text-center text-sm text-gray-500">
            Loading content...
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={config.defaultTitle}
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#240183]"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id={`${type}-published`}
                type="checkbox"
                checked={isPublished}
                onChange={(event) => setIsPublished(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#240183] focus:ring-[#240183]"
              />
              <label
                htmlFor={`${type}-published`}
                className="text-sm font-medium text-gray-700"
              >
                Publish immediately
              </label>
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                {config.editorLabel}
              </h2>

              <div className="quill-editor">
                <ReactQuill
                  theme="snow"
                  value={contentHtml}
                  onChange={(
                    html: string,
                    _delta: unknown,
                    _source: string,
                    editor: {
                      getContents: () => LegalContentDelta;
                      getText: () => string;
                    }
                  ) => {
                    setContentHtml(html);
                    setContentDelta(editor.getContents());
                    setPlainText(editor.getText().trim());
                  }}
                  modules={modules}
                  formats={formats}
                  placeholder={config.editorPlaceholder}
                  className="bg-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalContentEditor;
