import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import API from '@/utils/API';

import { Tooltip } from 'recharts'
import React, { useEffect, useState } from 'react'
import { AreaChart,Area, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const AdminSales = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    sales: []
  })

  const fetchStats = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await API.get('/order/sales', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (res.data.success) {
        setStats(res.data)
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchStats()
  }, [])
  return (
    <div className='pl-[350px] bg-gray-100 py-10 pr-20 mx-auto px-4'>
      <h1 className='text-center text-3xl'>Stats Matter!</h1>
      <div className='p-6 grid gap-6 lg:grid-cols-4'>
        {/* stats card */}
        <Card className="bg-gray-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className='text-2xl font-bold'>{stats.totalUsers}</CardContent>
        </Card>
         <Card className="bg-gray-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent className='text-2xl font-bold'>{stats.totalProducts}</CardContent>
        </Card>
         <Card className="bg-gray-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent className='text-2xl font-bold'>{stats.totalOrders}</CardContent>
        </Card>
         <Card className="bg-gray-500 text-white shadow">
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent className='text-2xl font-bold'>{stats.totalSales}</CardContent>
        </Card>
        <Card className='lg:col-span-4'>
          <CardHeader>
            <CardTitle>
              Sales (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent style={{height:300}}>
            <ResponsiveContainer width="100%" height='100%'>
              <AreaChart data={stats.sales}>
              <XAxis dataKey='date'></XAxis>
              <YAxis></YAxis>
              <Tooltip></Tooltip>
              <Area type='monotone' dataKey='amount' stroke="#6B7280" fill="#9CA3AF"></Area>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminSales
