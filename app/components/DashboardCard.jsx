
import React from 'react'

export default function DashboardCard({title, icon, iconColor, iconBg, value}) {
  return (
    <>
        <div className='not-last:border-r not-last:border-gray-700 p-2'>
            <div className='flex items-center gap-5'>
                <div className={`w-18 h-18 rounded-full bg-green-100 flex items-center ${iconColor} ${iconBg} justify-center`}>
                    {icon}
                </div>
                <div>
                    <h3 className='text-gray-300 font-semibold text-2xl pb-2'>{title}</h3>
                    <h5 className='text-white text-3xl font-bold'>{value}</h5>
                </div>
            </div>
        </div>  
    </>
  )
}
