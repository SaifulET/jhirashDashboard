'use client';

import { useState } from 'react';

interface RevenueMetricsItem {
  month: string;
  amount: number;
}

interface RevenueMetricsProps {
  data?: RevenueMetricsItem[];
  currency?: string;
  totalRevenue?: number;
  selectedYear: number;
  onYearChange: (year: number) => void;
}

const RevenueMetrics: React.FC<RevenueMetricsProps> = ({
  data,
  currency,
  totalRevenue,
  selectedYear,
  onYearChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const safeData = data ?? [];
  const safeCurrency = currency || 'USD';
  const safeTotalRevenue = totalRevenue || 0;

  const years = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];
  const maxValue = Math.max(1, ...safeData.map((item) => item.amount));

  const formatCurrency = (value: number) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: safeCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return `${safeCurrency} ${value.toFixed(2)}`;
    }
  };

  const topLabel = Math.ceil(maxValue);
  const midLabel = Math.ceil(maxValue / 2);

  return (
    <div className="w-full bg-white p-6 rounded-lg">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Revenue Metrics</h2>
          <p className="text-sm text-gray-500 mt-1">
            This section displays your earnings trends and breakdown over time.
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-md font-medium hover:bg-indigo-200 transition-colors flex items-center gap-2"
          >
            {selectedYear}
            <svg
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    onYearChange(Number(year));
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative h-72">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between py-4">
          <span className="text-xs text-gray-500">{topLabel}</span>
          <span className="text-xs text-gray-500">{midLabel}</span>
          <span className="text-xs text-gray-500">0</span>
        </div>

        {/* Chart area */}
        <div className="ml-12 h-full">
          {/* Grid lines */}
          <div className="relative h-full">
            <div className="absolute top-0 left-0 right-0 h-px bg-gray-200"></div>
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
            
            {/* Bars container */}
            <div className="relative h-full flex items-end justify-between px-4">
              {safeData.map((item, index) => {
                const heightPercentage = (item.amount / maxValue) * 100;
                return (
                  <div key={item.month} className="flex flex-col items-center justify-end h-full" style={{ width: '6%' }}>
                    <div
                      className="w-full max-w-[40px] relative cursor-pointer transition-all duration-300 hover:opacity-80"
                      style={{ 
                        height: `${heightPercentage}%`,
                        minHeight: '4px',
                        backgroundColor: '#6662FF',
                        borderRadius: '4px 4px 0 0'
                      }}
                      onMouseEnter={() => setHoveredBar(index)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {hoveredBar === index && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-10">
                          {formatCurrency(item.amount)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* X-axis labels */}
        <div className="ml-12 flex justify-between px-4 mt-2">
          {safeData.map((item) => (
            <div key={item.month} className="flex justify-center" style={{ width: '6%' }}>
              <span className="text-xs text-gray-600">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-[#F7F7FB] px-5 py-4">
        <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
        <p className="text-3xl font-bold text-gray-900">
          {formatCurrency(safeTotalRevenue)}
        </p>
      </div>
    </div>
  );
};

export default RevenueMetrics;
