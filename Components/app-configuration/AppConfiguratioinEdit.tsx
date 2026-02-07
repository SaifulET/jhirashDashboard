'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const AppConfigurationEdit = () => {
  const router = useRouter();
  
  // State for all price fields
  const [prices, setPrices] = useState({
    carRegular: '5.00',
    carPremium: '5.00',
    suvRegularCompact: '5.00',
    suvRegularFull: '5.00',
    suvPremiumCompact: '5.00',
    suvPremiumFull: '5.00',
    vanRegularCompact: '5.00',
    vanRegularFull: '5.00',
    vanPremiumCompact: '5.00',
    vanPremiumFull: '5.00',
    perMile: '5.00',
    driverIncentive: '50'
  });

  const handleChange = (field: string, value: string) => {
    setPrices(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save the data to your backend
    console.log('Saving prices:', prices);
    
    // Navigate to the configuration page
    router.push('/pages/app-configuration');
  };

  const handleCancel = () => {
    router.push('/pages/app-configuration');
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] px-[200px] py-[40px]">
      <div className=" bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">App Configuration</h1>
          <p className="text-sm text-gray-500 mt-1">This section is use to set up the price for trip</p>
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
                    value={prices.carRegular}
                    onChange={(e) => handleChange('carRegular', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Premium</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="text" 
                    value={prices.carPremium}
                    onChange={(e) => handleChange('carPremium', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    value={prices.suvRegularCompact}
                    onChange={(e) => handleChange('suvRegularCompact', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Regular (Full)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="text" 
                    value={prices.suvRegularFull}
                    onChange={(e) => handleChange('suvRegularFull', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    value={prices.suvPremiumCompact}
                    onChange={(e) => handleChange('suvPremiumCompact', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Premium (Full)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="text" 
                    value={prices.suvPremiumFull}
                    onChange={(e) => handleChange('suvPremiumFull', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    value={prices.vanRegularCompact}
                    onChange={(e) => handleChange('vanRegularCompact', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Regular (Full)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="text" 
                    value={prices.vanRegularFull}
                    onChange={(e) => handleChange('vanRegularFull', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    value={prices.vanPremiumCompact}
                    onChange={(e) => handleChange('vanPremiumCompact', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Premium (Full)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="text" 
                    value={prices.vanPremiumFull}
                    onChange={(e) => handleChange('vanPremiumFull', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                value={prices.perMile}
                onChange={(e) => handleChange('perMile', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Incentives for Driver */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Incentives for Driver</h2>
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Per trip</label>
            <div className="relative max-w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
              <input 
                type="text" 
                value={prices.driverIncentive}
                onChange={(e) => handleChange('driverIncentive', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button 
            onClick={handleCancel}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2.5 rounded-lg bg-[#240183] text-white hover:opacity-90 transition-opacity font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppConfigurationEdit;