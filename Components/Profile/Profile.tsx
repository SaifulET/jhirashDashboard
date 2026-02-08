'use client';

import React, { useState } from 'react';
import { Pencil, User, Mail } from 'lucide-react';

export default function PersonalInformation() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Harish Smith');
  const [email] = useState('example@ma3.com');
  const [tempName, setTempName] = useState(name);

  const handleEdit = () => {
    setTempName(name);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempName(name);
    setIsEditing(false);
  };

  const handleSave = () => {
    setName(tempName);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempName(e.target.value);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Personal Information
            </h1>
            <p className="text-gray-600 text-sm">
              This section will show your personal information
            </p>
          </div>
          
          {/* Edit Button - Only show when not editing */}
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="bg-[#240183] text-[#FFD283] px-6 py-3 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity font-medium"
            >
              <Pencil size={18} />
              Edit
            </button>
          )}
        </div>

        {/* Form Fields */}
        {!isEditing ? (
          // View Mode - Show both Name and Email
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-[#ECEBEF] p-[20px] rounded-lg">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  disabled
                  className="w-full bg-white text-gray-900 px-12 py-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#240183] disabled:cursor-not-allowed transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  disabled
                  className="w-full bg-white text-gray-900 px-12 py-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#240183] disabled:cursor-not-allowed transition-all"
                />
              </div>
            </div>
          </div>
        ) : (
          // Edit Mode - Show only Name field (editable)
          <div className=" bg-[#ECEBEF] p-[20px] rounded-t-lg">
            <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
              Name
            </label>
            <div className="relative bg-white rounded-lg">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <User size={20} />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={tempName}
                onChange={handleChange}
                className="w-full bg-white text-gray-900 px-12 py-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#240183] transition-all"
              />
            </div>
          </div>
        )}

        {/* Action Buttons - Only show when editing */}
        {isEditing && (
          <div className="flex justify-end gap-3 mb-8 bg-[#ECEBEF] pb-[20px] pr-[20px] rounded-b-lg">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-[#240183] text-white px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Save
            </button>
          </div>
        )}

        {/* Change Password Link - Only show when not editing */}
        {!isEditing && (
          <div>
            <a
              href="#"
              className="text-[#6662FF] font-medium inline-flex items-center gap-1 hover:underline"
            >
              Change Password
              <span className="text-lg">›</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}