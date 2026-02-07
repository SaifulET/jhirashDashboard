import MonthlyBreakdown from '@/Components/dashboard/MonthlyBreakdown'
import UserOverview from '@/Components/dashboard/UserMatrics'
import React from 'react'

function page() {
  return (
    <div className='px-[200px] py-[40px] bg-[#F4F4F6]'> <MonthlyBreakdown
          regularVehicles={600}
          premiumVehicles={600}
          total={1200}
        /> <UserOverview
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