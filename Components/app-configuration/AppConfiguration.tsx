import Link from 'next/link';
import React from 'react';

const AppConfiguration = () => {
  return (
    <div className="min-h-screen bg-[#F4F4F6] px-[200px] py-[40px]">
      <div className=" bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">App Configuration</h1>
            <p className="text-sm text-gray-500 mt-1">This section is use to set up the price for trip</p>
          </div>
          <Link href="/pages/app-configuration/slug">
          
           <button className="bg-[#240183] text-[#FFD283] px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
            Edit
          </button>
          
          </Link>
         
        </div>

        {/* Price by Vehicle */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Price by Vehicle</h2>
          
          {/* Car Section */}
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-3">Car</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Regular</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="text" 
                    value="5.00" 
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Premium</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="text" 
                    value="5.00" 
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SUV Section */}
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-3">SUV</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Regular (Compact)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="text" 
                    value="5.00" 
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Regular (Full)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="text" 
                    value="5.00" 
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Premium (Compact)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="text" 
                    value="5.00" 
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Premium (Full)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="text" 
                    value="5.00" 
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Van Section */}
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-3">Van</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Regular (Compact)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="text" 
                    value="5.00" 
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Regular (Full)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="text" 
                    value="5.00" 
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Premium (Compact)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="text" 
                    value="5.00" 
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Premium (Full)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="text" 
                    value="5.00" 
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price by mile */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Price by mile</h2>
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Per mile</label>
            <div className="relative max-w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input 
                type="text" 
                value="2.00" 
                readOnly
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Incentives for Driver */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Incentives for Driver</h2>
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Per trip</label>
            <div className="relative max-w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
              <input 
                type="text" 
                value="40" 
                readOnly
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppConfiguration;