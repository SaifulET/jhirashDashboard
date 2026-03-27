'use client'

import RevenueChart from '@/Components/analytics/RevenueMetrics'
import UserOverview from '@/Components/dashboard/UserMatrics'
import { useDashboardStore } from '@/store/dashboard-store'
import React, { useEffect, useState } from 'react'

function AnalyticsPage() {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const analytics = useDashboardStore((state) => state.analytics);
  const isAnalyticsLoading = useDashboardStore((state) => state.isAnalyticsLoading);
  const analyticsErrorMessage = useDashboardStore(
    (state) => state.analyticsErrorMessage
  );
  const fetchAnalytics = useDashboardStore((state) => state.fetchAnalytics);

  useEffect(() => {
    void fetchAnalytics(selectedYear);
  }, [fetchAnalytics, selectedYear]);

  const revenueMetrics = analytics?.revenueMetrics;
  const userMetrics = analytics?.userMetrics;

  return (
    <div className='px-[200px] py-[40px] bg-[#F4F4F6] min-h-screen'>
      {analyticsErrorMessage && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {analyticsErrorMessage}
        </div>
      )}

      <RevenueChart
        data={
          revenueMetrics?.chart.map((item) => ({
            month: item.label,
            amount: item.amount,
          })) || []
        }
        currency={revenueMetrics?.currency || 'USD'}
        totalRevenue={revenueMetrics?.totalRevenue || 0}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />

      {isAnalyticsLoading && !analytics && (
        <div className="mt-6 rounded-2xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
          Loading analytics...
        </div>
      )}

      <UserOverview
        data={
          userMetrics?.chart.map((item) => ({
            month: item.label,
            rider: item.rider,
            driver: item.driver,
          })) || []
        }
        totalRider={userMetrics?.totals.rider || 0}
        totalDriver={userMetrics?.totals.driver || 0}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
    </div>
  )
}

export default AnalyticsPage
