'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  APP_CONFIG_FIELDS,
  formatCurrencyAmount,
  getCurrencySymbol,
} from '@/lib/app-config';
import { useAppConfigStore } from '@/store/app-config-store';
import type { AppConfig, BaseFareKey } from '@/types/app-config';

type AppConfigFormState = Record<BaseFareKey, string> & {
  pricePerMinute: string;
  driverSharePercent: string;
};

const buildFormState = (config: AppConfig): AppConfigFormState => ({
  car_regular: formatCurrencyAmount(config.baseFare.car_regular),
  car_premium: formatCurrencyAmount(config.baseFare.car_premium),
  suv_compact_regular: formatCurrencyAmount(config.baseFare.suv_compact_regular),
  suv_compact_premium: formatCurrencyAmount(config.baseFare.suv_compact_premium),
  suv_full_regular: formatCurrencyAmount(config.baseFare.suv_full_regular),
  suv_full_premium: formatCurrencyAmount(config.baseFare.suv_full_premium),
  van_compact_regular: formatCurrencyAmount(config.baseFare.van_compact_regular),
  van_compact_premium: formatCurrencyAmount(config.baseFare.van_compact_premium),
  van_full_regular: formatCurrencyAmount(config.baseFare.van_full_regular),
  van_full_premium: formatCurrencyAmount(config.baseFare.van_full_premium),
  pricePerMinute: formatCurrencyAmount(config.pricePerMinute),
  driverSharePercent: String(config.driverSharePercent),
});

const parseNumberInput = (value: string, label: string) => {
  const parsedValue = Number(value);

  if (value.trim() === '' || Number.isNaN(parsedValue)) {
    throw new Error(`${label} must be a valid number.`);
  }

  if (parsedValue < 0) {
    throw new Error(`${label} cannot be negative.`);
  }

  return parsedValue;
};

const AppConfigurationEdit = () => {
  const router = useRouter();
  const config = useAppConfigStore((state) => state.config);
  const isLoading = useAppConfigStore((state) => state.isLoading);
  const isSaving = useAppConfigStore((state) => state.isSaving);
  const storeErrorMessage = useAppConfigStore((state) => state.errorMessage);
  const fetchConfig = useAppConfigStore((state) => state.fetchConfig);
  const updateConfig = useAppConfigStore((state) => state.updateConfig);
  const clearError = useAppConfigStore((state) => state.clearError);
  const [formState, setFormState] = useState<AppConfigFormState | null>(null);
  const [localErrorMessage, setLocalErrorMessage] = useState('');

  useEffect(() => {
    if (!config && !isLoading) {
      void fetchConfig();
    }
  }, [config, fetchConfig, isLoading]);

  useEffect(() => {
    if (config) {
      setFormState(buildFormState(config));
    }
  }, [config]);

  const currencySymbol = useMemo(
    () => getCurrencySymbol(config?.currency ?? 'USD'),
    [config?.currency]
  );

  const handleBaseFareChange = (field: BaseFareKey, value: string) => {
    setLocalErrorMessage('');
    clearError();

    setFormState((prevState) =>
      prevState
        ? {
            ...prevState,
            [field]: value,
          }
        : prevState
    );
  };

  const handleInputChange = (
    field: 'pricePerMinute' | 'driverSharePercent',
    value: string
  ) => {
    setLocalErrorMessage('');
    clearError();

    setFormState((prevState) =>
      prevState
        ? {
            ...prevState,
            [field]: value,
          }
        : prevState
    );
  };

  const handleSave = async () => {
    if (!config || !formState) {
      return;
    }

    try {
      const nextBaseFare: Partial<AppConfig['baseFare']> = {};

      (Object.keys(config.baseFare) as BaseFareKey[]).forEach((key) => {
        const parsedValue = parseNumberInput(formState[key], key.replaceAll('_', ' '));

        if (parsedValue !== config.baseFare[key]) {
          nextBaseFare[key] = parsedValue;
        }
      });

      const nextPricePerMinute = parseNumberInput(
        formState.pricePerMinute,
        'Price per minute'
      );
      const nextDriverSharePercent = parseNumberInput(
        formState.driverSharePercent,
        'Driver share percent'
      );

      const payload: {
        baseFare?: Partial<AppConfig['baseFare']>;
        pricePerMinute?: number;
        driverSharePercent?: number;
      } = {};

      if (Object.keys(nextBaseFare).length > 0) {
        payload.baseFare = nextBaseFare;
      }

      if (nextPricePerMinute !== config.pricePerMinute) {
        payload.pricePerMinute = nextPricePerMinute;
      }

      if (nextDriverSharePercent !== config.driverSharePercent) {
        payload.driverSharePercent = nextDriverSharePercent;
      }

      if (Object.keys(payload).length === 0) {
        router.push('/pages/app-configuration');
        return;
      }

      await updateConfig(payload);
      router.push('/pages/app-configuration');
    } catch (error) {
      setLocalErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to validate the form right now.'
      );
    }
  };

  const handleCancel = () => {
    router.push('/pages/app-configuration');
  };

  if (isLoading && !formState) {
    return (
      <div className="min-h-screen bg-[#F4F4F6] px-[200px] py-[40px]">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
          Loading configuration...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F6] px-[200px] py-[40px]">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            App Configuration
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            This section is used to set up trip pricing
          </p>
        </div>

        {(localErrorMessage || storeErrorMessage) && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {localErrorMessage || storeErrorMessage}
          </div>
        )}

        {formState && (
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
                            type="number"
                            step="0.01"
                            min="0"
                            value={formState[field.key]}
                            onChange={(e) =>
                              handleBaseFareChange(field.key, e.target.value)
                            }
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#240183] focus:border-transparent"
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
                    type="number"
                    step="0.01"
                    min="0"
                    value={formState.pricePerMinute}
                    onChange={(e) =>
                      handleInputChange('pricePerMinute', e.target.value)
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#240183] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
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
                    type="number"
                    step="0.01"
                    min="0"
                    value={formState.driverSharePercent}
                    onChange={(e) =>
                      handleInputChange('driverSharePercent', e.target.value)
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#240183] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !formState}
            className="px-6 py-2.5 rounded-lg bg-[#240183] text-white hover:opacity-90 transition-opacity font-medium disabled:opacity-70"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppConfigurationEdit;
