import fetchApi from '@/common';
import VideoCard from '@/components/video/VideoCard';
import { addUserHistory } from '@/features/userSlice';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const History = () => {
    const authStatus = useSelector((state) => state?.auth?.status);
    const user = useSelector((state) => state?.auth?.user);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    // const [history]

    const fetchHistory = async(e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${fetchApi.watchHistory.url}`, {
                method: fetchApi.watchHistory.method
            });

            const dataRes = await response.json()

            if(dataRes?.data){
                dispatch(addUserHistory(dataRes.data))
                setLoading(false)
            }
        } catch (error) {
            console.log(`error while fetching history: ${error}`)
        }finally{
            setLoading(false)
        }
    }

    const history = useSelector((state) => state.user.userHistory)

    console.log(history)
  return (
    <div>
        <div className=''>
            {
                history.map((video) => (
                    <div key={video?._id}>
                        <VideoCard video={video}/>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default History
