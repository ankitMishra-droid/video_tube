import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const PlaylistForm = ({playlist, route}, ref) => {
    const userId = useSelector((state) => state?.user?.user?._id);
    const dispatch = useDispatch() 
    const navigate = useNavigate()

    const dialog = useRef()

    const [showPopup, setShowPopup] = useState(false)
    const [loading, setLoading] = useState(false)

    useImperativeHandle(ref, () => {
        return{
            open(){
                setShowPopup(true)
            },
            close(){
                handleClose()
            }
        }
    }, [])

    useEffect(() => {
        if(showPopup){
            dialog.current.showModal()
        }
    },[showPopup])

    const handleClose = () => {
        dialog.current.close();
        setShowPopup(false)
        if(route) navigate(route)
    }
  return (
    <div>
      
    </div>
  )
}

export default PlaylistForm
