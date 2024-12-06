import DashboardStats from '@/components/dashboard/DashboardStats'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Dashboard = () => {
    const status = useSelector((state) => state.auth.status)
    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch()
    
  return (
    <div>
      <DashboardStats />
    </div>
  )
}

export default Dashboard
