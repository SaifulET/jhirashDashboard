'use client';

import { useState } from 'react';

const RevenueMetrics = () => {
  const [selectedYear, setSelectedYear] = useState('Year');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const years = ['2024', '2023', '2022', '2021', '2020'];
  
  const monthlyData = [
    { month: 'JAN', value: 35000 },
    { month: 'FEB', value: 38000 },
    { month: 'MAR', value: 36000 },
    { month: 'APR', value: 37000 },
    { month: 'MAY', value: 38500 },
    { month: 'JUN', value: 39000 },
    { month: 'JUL', value: 38000 },
    { month: 'AUG', value: 37500 },
    { month: 'SEP', value: 37000 },
    { month: 'OCT', value: 38000 },
    { month: 'NOV', value: 37500 },
    { month: 'DEC', value: 38000 },
  ];

  const maxValue = 80000;

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
                    setSelectedYear(year);
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
          <span className="text-xs text-gray-500">80k</span>
          <span className="text-xs text-gray-500">40k</span>
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
              {monthlyData.map((data, index) => {
                const heightPercentage = (data.value / maxValue) * 100;
                return (
                  <div key={data.month} className="flex flex-col items-center justify-end h-full" style={{ width: '6%' }}>
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
                          ${data.value.toLocaleString()}
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
          {monthlyData.map((data) => (
            <div key={data.month} className="flex justify-center" style={{ width: '6%' }}>
              <span className="text-xs text-gray-600">{data.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueMetrics;