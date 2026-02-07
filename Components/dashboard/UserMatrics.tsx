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
  const [selectedYear, setSelectedYear] = useState('2024');
  
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const years = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];

  const maxValue = Math.max(...data.flatMap((d) => [d.rider, d.driver]));
  const chartHeight = 400; // Fixed chart height
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
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 my-[20px]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">User Overview</h2>
          <p className="text-sm text-gray-500">This graph displays the user of this app</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">User Metrics</h3>
          <div className="relative" ref={yearDropdownRef}>
            <button
              onClick={() => setShowYearDropdown(!showYearDropdown)}
              className="px-4 py-2 bg-[#A6AFFF] text-gray-700 rounded-lg text-sm font-medium hover:bg-[#9099FF] transition-colors flex items-center gap-2"
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
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setShowYearDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                      selectedYear === year ? 'bg-[#A6AFFF] text-white' : 'text-gray-700'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="relative">
          <div className="relative h-[400px] pb-8 pt-4 px-4">
            {/* Y-axis grid lines and labels */}
            <div className="absolute left-0 right-0 top-0 bottom-8 flex flex-col justify-between">
              {/* Grid lines */}
              <div className="absolute left-8 right-0 top-0 bottom-0">
                <div className="h-full flex flex-col justify-between">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-t border-gray-100 w-full"></div>
                  ))}
                </div>
              </div>
              
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-gray-400">
                <span>{maxValue}</span>
                <span>{Math.round(maxValue * 0.75)}</span>
                <span>{Math.round(maxValue * 0.5)}</span>
                <span>{Math.round(maxValue * 0.25)}</span>
                <span>0</span>
              </div>
            </div>

            {/* Bars container - positioned to align with Y-axis labels */}
            <div className="absolute left-10 right-0 top-4 bottom-8 flex items-end justify-around">
              {data.map((monthData, index) => (
                <div key={index} className="flex flex-col items-center flex-1 min-w-[60px] h-full">
                  <div className="flex items-end gap-1 w-full justify-center h-full relative">
                    {/* Rider bar */}
                    <div className="relative flex-1 max-w-[20px] group">
                      <div
                        className="bg-[#6662FF] rounded-t-md cursor-pointer hover:opacity-80 transition-opacity w-full"
                        style={{ 
                          height: `${monthData.rider * scale}px`,
                          minHeight: '4px'
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
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-50">
                          <div className="relative">
                            {monthData.rider}
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Driver bar */}
                    <div className="relative flex-1 max-w-[20px] group">
                      <div
                        className="bg-[#FFBA1B] rounded-t-md cursor-pointer hover:opacity-80 transition-opacity w-full"
                        style={{ 
                          height: `${monthData.driver * scale}px`,
                          minHeight: '4px'
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
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-50">
                          <div className="relative">
                            {monthData.driver}
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Month label - positioned at the bottom of the chart area */}
                  <div className="absolute -bottom-7 text-xs text-gray-500">{monthData.month}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#6662FF]"></div>
              <span className="text-sm text-gray-600">Rider</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FFBA1B]"></div>
              <span className="text-sm text-gray-600">Driver</span>
            </div>
          </div>
        </div>
      </div>

      {/* Total Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Total Rider</p>
          <p className="text-2xl font-bold text-gray-900">{totalRider.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">Total Driver</p>
          <p className="text-2xl font-bold text-gray-900">{totalDriver.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;