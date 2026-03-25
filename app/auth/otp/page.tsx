'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

const OTPVerification: React.FC = () => {
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const forgotPasswordEmail = useAuthStore((state) => state.forgotPasswordEmail);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const verifyResetCode = useAuthStore((state) => state.verifyResetCode);
  const resendResetCode = useAuthStore((state) => state.resendResetCode);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
      setFocusedIndex(0);
    }
  }, []);

  useEffect(() => {
    if (isHydrated && !forgotPasswordEmail) {
      router.replace('/auth/forget-password');
    }
  }, [forgotPasswordEmail, isHydrated, router]);

  const handleOtpChange = (index: number, value: string) => {
    const sanitizedValue = value.replace(/\D/g, '');

    if (sanitizedValue.length <= 1) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = sanitizedValue;
      setOtpValues(newOtpValues);

      if (sanitizedValue && index < 3) {
        const nextIndex = index + 1;
        if (inputRefs.current[nextIndex]) {
          inputRefs.current[nextIndex]?.focus();
          setFocusedIndex(nextIndex);
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prevIndex = index - 1;
      if (inputRefs.current[prevIndex]) {
        inputRefs.current[prevIndex]?.focus();
        setFocusedIndex(prevIndex);
      }
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pastedValue = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 4)
      .split('');

    if (!pastedValue.length) {
      return;
    }

    const nextOtpValues = [...otpValues];

    pastedValue.forEach((value, index) => {
      nextOtpValues[index] = value;
    });

    setOtpValues(nextOtpValues);

    const nextFocusIndex = Math.min(pastedValue.length, 4) - 1;
    inputRefs.current[nextFocusIndex]?.focus();
    setFocusedIndex(nextFocusIndex);
  };

  const handleNext = async () => {
    const code = otpValues.join('');

    if (code.length !== 4) {
      setErrorMessage('Please enter the 4-digit verification code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setResendMessage('');

    try {
      await verifyResetCode(code);
      router.push('/auth/setnewpassword');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to verify the code.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setErrorMessage('');
    setResendMessage('');

    try {
      const message = await resendResetCode();
      setOtpValues(['', '', '', '']);
      inputRefs.current[0]?.focus();
      setFocusedIndex(0);
      setResendMessage(message);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to resend the code.'
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/auth/signin');
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] relative overflow-hidden">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white rounded-xl p-[20px] w-full max-w-[564px] flex flex-col items-center gap-6 shadow-lg">
          <div className="flex flex-col items-center gap-1 w-full max-w-[427px] mb-[20px]">
            <h3 className="text-[28px] font-semibold text-gray-900 text-center">
              Verify Code
            </h3>
            <p className="text-base text-gray-500 text-center leading-6">
              We sent an OTP code to your email <br />{' '}
              {forgotPasswordEmail || 'your email'}. Enter the code <br /> below
              to verify
            </p>
          </div>

          <div className="flex flex-col gap-6 w-full max-w-[500px]">
            <div className="flex gap-[8px] justify-center">
              {otpValues.map((value, index) => (
                <div key={index}>
                  <input
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onFocus={() => handleFocus(index)}
                    onBlur={handleBlur}
                    onPaste={handlePaste}
                    className={`w-[48px] h-[56px] px-4 py-4 rounded-xl border-2 text-center text-base font-normal ${
                      focusedIndex === index || value
                        ? ' border-[#240183] text-gray-900'
                        : ' border-gray-200 text-gray-500'
                    } focus:outline-none focus:border-[#240183] focus:text-gray-900`}
                    placeholder=""
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={isLoading || otpValues.join('').length !== 4}
              className="w-full h-[52px] bg-[#240183] hover:bg-[#331781] rounded-xl flex items-center justify-center px-8 py-5 transition-colors disabled:opacity-70"
            >
              <span className="text-base font-medium text-[#FFD283]">
                {isLoading ? 'Verifying...' : 'Next'}
              </span>
            </button>

            <div className="text-center">
              <p className="text-base text-gray-500">
                Don&apos;t receive OTP?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-[#240183] hover:underline"
                >
                  {isResending ? 'Sending...' : 'Resend again'}
                </button>
              </p>
            </div>

            {resendMessage && (
              <p className="text-sm text-green-600 text-center">{resendMessage}</p>
            )}

            {errorMessage && (
              <p className="text-sm text-red-500 text-center">{errorMessage}</p>
            )}

            <button
              onClick={handleBackToLogin}
              className="w-full h-[52px] rounded-xl flex items-center justify-center px-6 py-3.5 transition-colors gap-2"
            >
              <ArrowLeft className="w-6 h-6 text-gray-900" />
              <span className="text-base font-medium text-gray-900">
                Back to Login
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
