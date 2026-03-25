'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import {
  APP_CONFIG_FIELDS,
  formatCurrencyAmount,
  getCurrencySymbol,
} from '@/lib/app-config';
import { useAppConfigStore } from '@/store/app-config-store';

const AppConfiguration = () => {
  const config = useAppConfigStore((state) => state.config);
  const isLoading = useAppConfigStore((state) => state.isLoading);
  const errorMessage = useAppConfigStore((state) => state.errorMessage);
  const fetchConfig = useAppConfigStore((state) => state.fetchConfig);

  useEffect(() => {
    if (!config && !isLoading) {
      void fetchConfig();
    }
  }, [config, fetchConfig, isLoading]);

  const currencySymbol = getCurrencySymbol(config?.currency ?? 'USD');

  return (
    <div className="min-h-screen bg-[#F4F4F6] px-[200px] py-[40px]">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              App Configuration
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              This section is used to set up trip pricing
            </p>
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

        {isLoading && !config && (
          <div className="py-12 text-center text-gray-500">
            Loading configuration...
          </div>
        )}

        {errorMessage && !config && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        {config && (
          <>
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Price by Vehicle
              </h2>

              {APP_CONFIG_FIELDS.map((section) => (
                <div key={section.title} className="mb-6">
                  <h3 className="text-base font-medium text-gray-900 mb-3">
                    {section.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {section.fields.map((field) => (
                      <div key={field.key}>
                        <label className="text-sm text-gray-600 mb-2 block">
                          {field.label}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            {currencySymbol}
                          </span>
                          <input
                            type="text"
                            value={formatCurrencyAmount(config.baseFare[field.key])}
                            readOnly
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Price by Time
              </h2>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Per minute
                </label>
                <div className="relative max-w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {currencySymbol}
                  </span>
                  <input
                    type="text"
                    value={formatCurrencyAmount(config.pricePerMinute)}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Incentives for Driver
              </h2>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Driver share
                </label>
                <div className="relative max-w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    %
                  </span>
                  <input
                    type="text"
                    value={String(config.driverSharePercent)}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AppConfiguration;
