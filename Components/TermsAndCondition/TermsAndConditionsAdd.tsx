'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function TermsConditionsEditor() {
  const [content, setContent] = useState('This is awesome');

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'blockquote', 'code-block',
    'align',
    'link', 'image', 'video',
    'color', 'background'
  ];

  const handleCancel = () => {
    console.log('Cancelled');
    // Add your cancel logic here
  };

  const handleSave = () => {
    console.log('Saved content:', content);
    // Add your save logic here
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Terms & Conditions
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Set terms & conditions for the M&S platform.
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
              onClick={handleSave}
              className="px-6 py-2 text-sm font-medium text-[#FFD283] bg-[#240183] rounded-md hover:bg-[#1a0161] transition-colors"
            >
              Save
            </button>
          </div>
        </div>

        {/* Editor Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Write Terms & Conditions
          </h2>
          
          <div className="quill-editor">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              placeholder="Write your terms and conditions here..."
              className="bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}