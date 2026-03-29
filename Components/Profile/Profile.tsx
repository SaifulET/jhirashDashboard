'use client';

import React, { useEffect, useState } from 'react';
import { Pencil, User, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export default function PersonalInformation() {
  const router = useRouter();
  const admin = useAuthStore((state) => state.admin);
  const updateName = useAuthStore((state) => state.updateName);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [name, setName] = useState(admin?.name ?? '');
  const [tempName, setTempName] = useState(admin?.name ?? '');

  useEffect(() => {
    const nextName = admin?.name ?? '';
    setName(nextName);
    setTempName(nextName);
  }, [admin?.name]);

  const handleEdit = () => {
    setErrorMessage('');
    setTempName(name);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setErrorMessage('');
    setTempName(name);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setErrorMessage('');

    if (!tempName.trim()) {
      setErrorMessage('Name is required.');
      return;
    }

    setIsSaving(true);

    try {
      await updateName(tempName);
      setName(tempName.trim());
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to update your name right now.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempName(e.target.value);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Personal Information
            </h1>
            <p className="text-gray-600 text-sm">
              This section will show your personal information
            </p>
          </div>

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

        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-[#ECEBEF] p-[20px] rounded-lg">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
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

            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
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
                  value={admin?.email ?? ''}
                  disabled
                  className="w-full bg-white text-gray-900 px-12 py-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#240183] disabled:cursor-not-allowed transition-all"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#ECEBEF] p-[20px] rounded-t-lg">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
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

        {isEditing && (
          <div className="mb-8 rounded-b-lg bg-[#ECEBEF] pb-[20px] pr-[20px]">
            {errorMessage && (
              <p className="px-[20px] pb-4 text-sm text-red-600">{errorMessage}</p>
            )}
            <div className="flex justify-end gap-3">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => void handleSave()}
              disabled={isSaving}
              className="bg-[#240183] text-white px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
          </div>
        )}

        {!isEditing && (
          <div>
            <button
              type="button"
              onClick={() => router.push('/auth/changePassword')}
              className="text-[#6662FF] font-medium inline-flex items-center gap-1 hover:underline"
            >
              Change Password
              <span className="text-lg">&gt;</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
