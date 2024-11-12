import fetchApi from '@/common'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import loader from "@/assets/loader.gif"

const About = () => {
  const {user} = useSelector((state) => state?.user)
  const {userName} = useParams()
  const [loading, setLoading] = useState(true)
  const [aboutChannel, setAboutChannel] = useState(null)

  console.log("about: ",user)

  const getAboutDetails = async() => {
    try {
      const response = await fetch(`${fetchApi.getAboutChannel.url}/${user?._id}`, {
        method: fetchApi.getAboutChannel.method
      })

      const dataRes = await response.json();

      if(dataRes.success){
        setAboutChannel(dataRes?.data)
      }
    } catch (error) {
      toast.error("somthing went wrong")
      console.log(error)
    }
  }

  useEffect(() => {
    getAboutDetails().then(() => {
      setLoading(false)
    })
  }, [])

  console.log("about: ",aboutChannel)

  if(loading){
    return (
      <div className='flex justify-center items-center'>
        <img src={loader} alt='loaderGif'/>
      </div>
    )
  }else{
    return (
      <div>
        About
      </div>
    )
  }
}

export default About
