import React, { useEffect, useState } from 'react'
import { setUserDetails } from '@/features/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getUseProfile } from '@/fetchDetails/getUserProfile';

const MyChannel = () => {

  const {status, user} = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null)
  const navigate = useNavigate();
  const location = useLocation();
  const { userName } = useParams();

  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    getUseProfile(dispatch, userName).then((data) => {
      if(data){
        setProfile(data)
      }else{
        setError()
      }
    })
  },[])
  return (
    <div>
      My Channels
    </div>
  )
}

export default MyChannel
