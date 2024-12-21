import SubscriptionCards from '@/components/subscription/SubscriptionCards'
import getUserSubscriber from '@/fetchDetails/getSubscribers'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import loadingGif from "@/assets/loader.gif"
import ChannelEmptySubscriber from '@/components/channels/ChannelEmptySubscriber'

const Subscription = () => {
    const authStatus = useSelector((state) => state.auth.status)
    const userData = useSelector((state) => state.auth.user)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)

    const subscribe = useSelector((state) => state.user.userSubscribed?.channels || [])
    
    useEffect(() => {
        if(userData?._id){
            getUserSubscriber(dispatch, userData?._id).then(() => setLoading(false));
        }
    }, [userData])
    
    if(loading){
        return(
            <div className='flex items-center justify-center mt-16'>
                <img src={loadingGif} className='w-20 h-20' alt='loading_img'/>
            </div>
        )
    }

    return subscribe.length > 0 && authStatus ? (
        <div>
            {subscribe.map((subscriber) => (
                <SubscriptionCards key={subscriber?._id} profile={subscriber}/>
            ))}
        </div>
    ) : (
        <ChannelEmptySubscriber />
    )
}

export default Subscription;
