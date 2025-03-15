'use client'

import React, { useEffect, useState } from 'react'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function BarChartDashboard({budgetList}) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className='border rounded-lg p-5'>
        <h2 className='font-bold text-lg'>Activity</h2>
        <div className="h-[300px] w-[730px] animate-pulse bg-gray-200" />
      </div>
    )
  }

  return (
    <div className='border rounded-lg p-5'>
      <h2 className='font-bold text-lg'>Activity</h2>
      <ResponsiveContainer width={'95%'} height={300} >
      <BarChart
        data={budgetList}
      >
        <XAxis dataKey='name'/>
        <YAxis/>
        <Tooltip/>
        <Legend/>
        <Bar dataKey='totalSpend' stackId="a" fill="#FF9999"/>
        <Bar dataKey='amount' stackId="a" fill="#FFE8E8"/>
      </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BarChartDashboard