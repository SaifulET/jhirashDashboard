'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from '@/public/logo.png';
import { useAuthStore } from '@/store/auth-store';

const NewPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const resetToken = useAuthStore((state) => state.resetToken);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const setNewPassword = useAuthStore((state) => state.setNewPassword);

  useEffect(() => {
    if (isHydrated && !resetToken) {
      router.replace('/auth/forget-password');
    }
  }, [isHydrated, resetToken, router]);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!newPassword || !confirmPassword) {
      setErrorMessage('Please fill in both password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await setNewPassword(newPassword, confirmPassword);
      router.push('/auth/welcome');
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to set the new password right now.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/auth/signin');
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] relative overflow-hidden">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white rounded-xl p-8 w-full max-w-[564px] flex flex-col items-center gap-6 shadow-lg">
          <div className="w-[500px] h-24 flex items-center justify-center">
            <div className="text-center">
              <Image
                src={logo}
                alt="logo"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 w-full max-w-[375px]">
            <h3 className="text-2xl font-semibold text-gray-900 text-center">
              New password
            </h3>
            <p className="text-base text-gray-500 text-center leading-6">
              Set a new password and continue your journey
            </p>
          </div>

          <form
            onSubmit={handleNext}
            className="flex flex-col gap-6 w-full max-w-[500px]"
          >
            <div className="flex flex-col gap-2">
              <label className="text-lg font-semibold text-gray-900">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-[52px] pl-12 pr-12 py-3.5 bg-[#F4F4F6] border border-gray-200 rounded-xl text-base text-gray-500 placeholder-gray-500 focus:outline-none focus:border-[#240183] focus:text-gray-900"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Lock className="w-6 h-6 text-[#262626]" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-6 h-6 text-[#262626]" />
                  ) : (
                    <Eye className="w-6 h-6 text-[#262626]" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-lg font-semibold text-gray-900">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Retype password"
                  className="w-full h-[52px] pl-12 pr-12 py-3.5 bg-[#F4F4F6] border border-gray-200 rounded-xl text-base text-gray-500 placeholder-gray-500 focus:outline-none focus:border-[#240183] focus:text-gray-900"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Lock className="w-6 h-6 text-[#262626]" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-6 h-6 text-[#262626]" />
                  ) : (
                    <Eye className="w-6 h-6 text-[#262626]" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[52px] hover:bg-[#392277] bg-[#240183] rounded-xl flex items-center justify-center px-8 py-3 transition-colors"
            >
              <span className="text-base font-medium text-[#FFD283]">
                {isLoading ? 'Saving...' : 'Next'}
              </span>
            </button>

            {errorMessage && (
              <p className="text-sm text-red-500 text-center">{errorMessage}</p>
            )}

            <button
              type="button"
              onClick={handleBackToLogin}
              className="w-full h-[52px] rounded-xl flex items-center justify-center px-6 py-3.5 transition-colors gap-2"
            >
              <ArrowLeft className="w-6 h-6 text-gray-900" />
              <span className="text-base font-medium text-gray-900">
                Back to Login
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
