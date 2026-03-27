'use client'

import MonthlyBreakdown from '@/Components/dashboard/MonthlyBreakdown'
import UserOverview from '@/Components/dashboard/UserMatrics'
import { useDashboardStore } from '@/store/dashboard-store'
import React, { useEffect, useState } from 'react'

function DashboardPage() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const overview = useDashboardStore((state) => state.overview);
  const isLoading = useDashboardStore((state) => state.isLoading);
  const errorMessage = useDashboardStore((state) => state.errorMessage);
  const fetchOverview = useDashboardStore((state) => state.fetchOverview);

  useEffect(() => {
    void fetchOverview(selectedMonth, selectedYear);
  }, [fetchOverview, selectedMonth, selectedYear]);

  const monthlyBreakdown = overview?.monthlyBreakdown;
  const userOverview = overview?.userOverview;

  return (
    <div className='px-[200px] py-[40px] bg-[#F4F4F6] min-h-screen'>
      {errorMessage && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      <MonthlyBreakdown
        currency={monthlyBreakdown?.currency || 'USD'}
        regularVehicles={monthlyBreakdown?.regularVehiclesIncome || 0}
        premiumVehicles={monthlyBreakdown?.premiumVehiclesIncome || 0}
        total={monthlyBreakdown?.totalIncome || 0}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
      />

      {isLoading && !overview && (
        <div className="rounded-2xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
          Loading dashboard overview...
        </div>
      )}

      <UserOverview
        data={
          userOverview?.chart.map((item) => ({
            month: item.label,
            rider: item.rider,
            driver: item.driver,
          })) || []
        }
        totalRider={userOverview?.totals.rider || 0}
        totalDriver={userOverview?.totals.driver || 0}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
    </div>
  )
}

export default DashboardPage
