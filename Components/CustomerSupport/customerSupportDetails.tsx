'use client';

import {  ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

const ReportDetails: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalOption, setModalOption] = useState<'send' | 'resolved'>('send');
  const [message, setMessage] = useState('');

  return (
    <>
      <div className="min-h-screen bg-[#F4F4F6] px-[144px] py-[40px]">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start gap-4">
           <Link href="/pages/customer-support"> <button className="w-10 h-10 rounded-lg text-black bg-[#A6AFFF] flex items-center justify-center hover:opacity-90 transition-opacity">
              <HugeiconsIcon icon={ArrowLeft02Icon} className="w-5 h-5" />
            </button></Link>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                Report Details
              </h1>
              <p className="text-sm text-gray-600">
                This section shows details for admin review or possible action against the reported party.
              </p>
            </div>
          </div>
          <button className="px-[32px] py-[21px] bg-[#BC0E01] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
            Delete
          </button>
        </div>

        {/* Reporting Party Section */}
        <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                REPORTING PARTY (VICTIM)
              </span>
              <span className="px-3 py-1 bg-[#FEE4D6] text-[#E26A02] text-xs font-medium rounded-full">
                Pending
              </span>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
               <Image src="/profile.svg" alt="Tuval Mor" className="w-full h-full object-cover" width={48} height={48}/>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Tuval Mor</h3>
                <p className="text-sm text-gray-600">Rider</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="10" cy="10" r="9" stroke="#DC2626" strokeWidth="2" fill="none" />
                    <path d="M10 6V10" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="10" cy="14" r="0.5" fill="#DC2626" stroke="#DC2626" strokeWidth="1" />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">52</div>
                  <div className="text-xs text-gray-500 uppercase">Accused</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#E9A906] flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 2L12.245 7.5L18 8.26L14 12.14L15.09 18L10 15.27L4.91 18L6 12.14L2 8.26L7.755 7.5L10 2Z"
                      fill="white"
                      stroke="white"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">4.7</div>
                  <div className="text-xs text-gray-500 uppercase">Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Report Message */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">
              Why I am not seeing any driver?
            </h4>
            <p className="text-sm text-gray-600">
              I want to know whats the reason i am not seeing any rider in my area.
            </p>
          </div>

          <div className="mt-4 flex justify-end">
            <button className="px-6 py-2.5 bg-[#A6AFFF] text-black rounded-lg font-medium hover:opacity-90 transition-opacity">
              View Profile
            </button>
          </div>
        </div>

        {/* Reported Party Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <span className="text-sm font-medium text-gray-700">
              REPORTED PARTY (OFFENDER)
            </span>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                              <Image src="/profile.svg" alt="Tuval Mor" className="w-full h-full object-cover" width={48} height={48}/>

              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">David John</h3>
                <p className="text-sm text-gray-600">Driver</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="10" cy="10" r="9" stroke="#DC2626" strokeWidth="2" fill="none" />
                    <path d="M10 6V10" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="10" cy="14" r="0.5" fill="#DC2626" stroke="#DC2626" strokeWidth="1" />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">52</div>
                  <div className="text-xs text-gray-500 uppercase">Accused</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#E9A906] flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 2L12.245 7.5L18 8.26L14 12.14L15.09 18L10 15.27L4.91 18L6 12.14L2 8.26L7.755 7.5L10 2Z"
                      fill="white"
                      stroke="white"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">4.7</div>
                  <div className="text-xs text-gray-500 uppercase">Rating</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2.5 bg-[#2C0075] text-[#FFD283] rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Take Action
            </button>
            <button className="px-6 py-2.5 bg-[#A6AFFF] text-black rounded-lg font-medium hover:opacity-90 transition-opacity">
              View Profile
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0  flex items-center justify-center z-50 bg-gray-500">
          <div className="bg-white rounded-2xl w-[363px] h-[522px] p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Send message to the person or mark as resolved
            </h2>

            {/* Radio Options */}
            <div className="flex items-center gap-6 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="action"
                    value="send"
                    checked={modalOption === 'send'}
                    onChange={() => setModalOption('send')}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      modalOption === 'send'
                        ? 'border-[#2C0075] bg-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {modalOption === 'send' && (
                      <div className="w-3 h-3 rounded-full bg-[#2C0075]" />
                    )}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">Send message</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="action"
                    value="resolved"
                    checked={modalOption === 'resolved'}
                    onChange={() => setModalOption('resolved')}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      modalOption === 'resolved'
                        ? 'border-[#2C0075] bg-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {modalOption === 'resolved' && (
                      <div className="w-3 h-3 rounded-full bg-[#2C0075]" />
                    )}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">Resolved</span>
              </label>
            </div>

            {/* Textarea */}
            <div className="flex-1 mb-6">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Send a message"
                className="w-full h-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#2C0075] focus:border-transparent placeholder:text-gray-400"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setMessage('');
                  setModalOption('send');
                }}
                className="flex-1 px-[32px] py-[21px] bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button onClick={() => {
                  setShowModal(false);
                  setMessage('');
                  setModalOption('send');
                }} className="flex-1 px-[32px] py-[21px] bg-[#2C0075] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportDetails;