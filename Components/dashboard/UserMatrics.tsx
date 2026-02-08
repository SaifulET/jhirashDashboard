'use client';

import React, { useState, useRef, useEffect } from 'react';

interface MonthData {
  month: string;
  rider: number;
  driver: number;
}

interface UserOverviewProps {
  data: MonthData[];
  totalRider: number;
  totalDriver: number;
}

const UserOverview: React.FC<UserOverviewProps> = ({ data, totalRider, totalDriver }) => {
  const [hoveredBar, setHoveredBar] = useState<{
    type: 'rider' | 'driver' | null;
    value: number;
    month: string;
    index: number;
  } | null>(null);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [selectedYear, setSelectedYear] = useState('Year');
  
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const years = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];

  const maxValue = Math.max(...data.flatMap((d) => [d.rider, d.driver]));
  const chartHeight = 240;
  const scale = chartHeight / maxValue;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
        setShowYearDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-[#F5F5F5] rounded-2xl  my-[20px]">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">User Overview</h2>
        <p className="text-sm text-gray-500">This graph displays the user of this app</p>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl p-6">
        {/* Chart Header with Year Dropdown */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-semibold text-gray-900">User Metrics</h3>
          <div className="relative z-20" ref={yearDropdownRef}>
            <button
              onClick={() => setShowYearDropdown(!showYearDropdown)}
              className="px-4 py-2 bg-[#C5C9FF] text-gray-700 rounded-lg text-sm font-medium hover:bg-[#B5B9FF] transition-colors flex items-center gap-2"
            >
              {selectedYear}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {showYearDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-30">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setShowYearDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                      selectedYear === year ? 'bg-[#C5C9FF] text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chart Container */}
        <div className="relative">
          <div className="relative h-[280px]">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-10 w-12 flex flex-col justify-between text-xs text-gray-400 py-2">
              <span>{maxValue}</span>
              <span>{Math.round(maxValue * 0.75)}</span>
              <span>{Math.round(maxValue * 0.5)}</span>
              <span>{Math.round(maxValue * 0.25)}</span>
              <span>0</span>
            </div>

            {/* Grid lines */}
            <div className="absolute left-12 right-0 top-2 bottom-10">
              <div className="h-full flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-t border-dashed border-gray-200 w-full"></div>
                ))}
              </div>
            </div>

            {/* Bars container */}
            <div className="absolute left-12 right-0 top-2 bottom-10 flex items-end justify-between px-4">
              {data.map((monthData, index) => (
                <div key={index} className="flex flex-col items-center h-full">
                  <div className="flex items-end justify-center gap-1.5 h-full">
                    {/* Rider bar */}
                    <div className="relative w-5 group">
                      <div
                        className="bg-[#6366F1] rounded-t-md cursor-pointer hover:opacity-80 transition-opacity w-full"
                        style={{ 
                          height: `${Math.min(monthData.rider * scale, chartHeight)}px`,
                          minHeight: monthData.rider > 0 ? '3px' : '0'
                        }}
                        onMouseEnter={() => {
                          setHoveredBar({ type: 'rider', value: monthData.rider, month: monthData.month, index });
                        }}
                        onMouseLeave={() => {
                          if (hoveredBar?.index === index && hoveredBar?.type === 'rider') {
                            setHoveredBar(null);
                          }
                        }}
                      />
                      {hoveredBar?.type === 'rider' && hoveredBar?.index === index && (
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-50">
                          <div className="relative">
                            Rider: {monthData.rider.toLocaleString()}
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Driver bar */}
                    <div className="relative w-5 group">
                      <div
                        className="bg-[#FBBF24] rounded-t-md cursor-pointer hover:opacity-80 transition-opacity w-full"
                        style={{ 
                          height: `${Math.min(monthData.driver * scale, chartHeight)}px`,
                          minHeight: monthData.driver > 0 ? '3px' : '0'
                        }}
                        onMouseEnter={() => {
                          setHoveredBar({ type: 'driver', value: monthData.driver, month: monthData.month, index });
                        }}
                        onMouseLeave={() => {
                          if (hoveredBar?.index === index && hoveredBar?.type === 'driver') {
                            setHoveredBar(null);
                          }
                        }}
                      />
                      {hoveredBar?.type === 'driver' && hoveredBar?.index === index && (
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-50">
                          <div className="relative">
                            Driver: {monthData.driver.toLocaleString()}
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Month labels */}
            <div className="absolute left-12 right-0 bottom-0 flex items-center justify-between px-4">
              {data.map((monthData, index) => (
                <div key={index} className="flex flex-col items-center w-12">
                  <div className="h-2 w-px bg-gray-300"></div>
                  <span className="text-xs text-gray-500 mt-1">{monthData.month}</span>
                </div>
              ))}
            </div>

            {/* X-axis line */}
            <div className="absolute left-12 right-0 bottom-8 border-t border-gray-300"></div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#6366F1]"></div>
              <span className="text-sm text-gray-600">Rider</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FBBF24]"></div>
              <span className="text-sm text-gray-600">Driver</span>
            </div>
          </div>
        </div>
      </div>

      {/* Total Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-2xl p-6">
          <p className="text-sm text-gray-500 mb-2">Total Rider</p>
          <p className="text-3xl font-bold text-gray-900">{totalRider.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-6">
          <p className="text-sm text-gray-500 mb-2">Total Driver</p>
          <p className="text-3xl font-bold text-gray-900">{totalDriver.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;