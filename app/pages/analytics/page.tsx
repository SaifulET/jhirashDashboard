import RevenueChart from '@/Components/analytics/RevenueMetrics'
import MonthlyBreakdown from '@/Components/dashboard/MonthlyBreakdown'
import UserOverview from '@/Components/dashboard/UserMatrics'
import React from 'react'

function page() {
  return (
    <div className='px-[200px] py-[40px] bg-[#F4F4F6]'><RevenueChart/>  <UserOverview
          data={[
            { month: 'Jan', rider: 280, driver: 220 },
            { month: 'Feb', rider: 340, driver: 140 },
            { month: 'Feb', rider: 340, driver: 140 },
            { month: 'Feb', rider: 340, driver: 140 },
            { month: 'Feb', rider: 340, driver: 140 },
            { month: 'march', rider: 340, driver: 140 },
            { month: 'march', rider: 340, driver: 140 },
            // ... more data
          ]}
          totalRider={1234}
          totalDriver={1234}
        /></div>
  )
}

export default page