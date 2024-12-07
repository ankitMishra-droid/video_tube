import fetchApi from '@/common'
import GuestComponent from '@/components/guest/GuestComponent'
import { setVideo } from '@/features/videoSlice'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import loadingImg from "@/assets/loader.gif";
import VideoPlayer from '@/components/video/VideoPlayer'

const Video = () => {
    const { videoTitle, videoId } = useParams()
    const [loading, setLoading] = useState(true)
    const video = useSelector((state) => state.video.video);
    const dispatch = useDispatch();
    const [error, setError] = useState("")
    const [videos, setVideos] = useState([])
    const status = useSelector(state => state.auth.status)

    const fetchVideo = async() => {
      setError("")
      try {
        const response = await fetch(`${fetchApi.getAllVideos.url}/${videoId}`, {
          method: fetchApi.getAllVideos.method,
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        })

        const resData = await response.json();

        console.log(resData)
        if(resData.data){
          dispatch(setVideo(resData.data))
        }
      } catch (error) {
        setError(
          <GuestComponent 
            title="Video dosen't exist."
            subtitle="User may be deleted or moved."
          />
        )
      } finally{
        setLoading(false)
      }
    }

    useEffect(() => {
      fetchVideo()
    }, [videoId, videoTitle, status])

  return (
    <div>
      {
        loading ? (
          <div className='flex justify-center my-10'>
            <img src={loadingImg} className='w-20 h-20' alt='loadngImg'/>
          </div>
        ) : (
          <div className='flex'>
            <div className='w-full border rounded-md border-black 2xl:w-[70%] p-1'>
              <VideoPlayer key={video?.[0]?._id} videoFile={video?.[0]?.videoFile}/>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Video