import React, { useEffect, useState } from 'react'
import ChannelEmptySubscriber from './ChannelEmptySubscriber'
import { useDispatch, useSelector } from 'react-redux'
import getUserSubscriber from '@/fetchDetails/getSubscribers'

const ChannelSubscribed = () => {
    const user = useSelector(state => state?.user?.user)

    console.log(user?._id)

    const dispatch = useDispatch()
    const [filter, setFilter] = useState(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        getUserSubscriber(dispatch, user?._id).then(() => {
            setLoading(false)
        })
    }, [user])

    const data = useSelector(state => state.user.userSubscribed);

    console.log(data)
  return (
    <div>
      <ChannelEmptySubscriber />
    </div>
  )
}

export default ChannelSubscribed
