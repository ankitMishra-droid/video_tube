import DashboardStats from '@/components/dashboard/DashboardStats'
import { getDashboardStats } from '@/fetchDetails/getDashBoard';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Dashboard = () => {
    const status = useSelector((state) => state.auth.status);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const stats = useSelector((state) => state.dashboard.stats)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      getDashboardStats(dispatch, user?._id).then(() => setLoading(false))
    },[])
    
  return (
    <div>
      <DashboardStats stats={stats}/>
    </div>
  )
}

export default Dashboard
