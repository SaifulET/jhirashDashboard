'use client';

import React, { useEffect, useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { NextPage } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import logo from '@/public/logo.png';
import { useAuthStore } from '@/store/auth-store';

const SignInPage: NextPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const signIn = useAuthStore((state) => state.signIn);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    if (isHydrated && accessToken) {
      const redirectTo = searchParams.get('redirect') || '/pages/dashboard';
      router.replace(redirectTo);
    }
  }, [accessToken, isHydrated, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      await signIn({
        email: email.trim(),
        password,
      });

      const redirectTo = searchParams.get('redirect') || '/pages/dashboard';
      router.replace(redirectTo);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to sign in right now.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/auth/forget-password');
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-[564px] bg-white rounded-xl shadow-lg border border-gray-100 p-8 flex flex-col items-center gap-8">
          <div className="w-full max-w-[500px] h-24 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-black text-black tracking-wider leading-tight">
                <Image
                  src={logo}
                  alt="logo"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
              </h1>
            </div>
          </div>

          <div className="text-center max-w-[266px]">
            <h2 className="text-3xl font-semibold text-[#262626] mb-2 leading-9">
              Welcome Back!
            </h2>
            <p className="text-gray-500 text-base leading-6">
              To login, enter your email address
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[500px] flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-lg font-semibold text-gray-800 leading-6"
              >
                Email
              </label>
              <div className="relative">
                <div className="flex items-center bg-[#F4F4F6] border border-gray-200 rounded-xl px-4 py-3.5 gap-2 h-[52px] focus-within:ring-2 focus-within:ring-[#240183] focus-within:border-[#240183] transition-all duration-200">
                  <Mail
                    className="w-6 h-6 text-[#262626] flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 outline-none text-base leading-6"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-lg font-semibold text-gray-800 leading-6"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="flex items-center bg-[#F4F4F6] border border-gray-200 rounded-xl px-4 py-3.5 gap-2 h-[52px] focus-within:ring-2 focus-within:ring-[#240183] focus-within:border-[#240183] transition-all duration-200">
                  <Lock
                    className="w-6 h-6 text-[#0C0C0C] flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 outline-none text-base leading-6"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#240183] hover:text-[#240183] focus:outline-none transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-6 h-6" strokeWidth={1.5} />
                    ) : (
                      <Eye className="w-6 h-6" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[#5435FF] hover:text-[#2e1572] font-medium text-sm leading-5 transition-colors duration-200"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-[#240183] hover:bg-[#321680] text-[#FFD283] font-medium text-base py-4 px-8 rounded-xl h-[52px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                'Login'
              )}
            </button>

            {errorMessage && (
              <p className="text-sm text-red-500 text-center">{errorMessage}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
