import formatDuration from '@/helpers/formatDuration'
import getTimeDistance from '@/helpers/getTimeDistance';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

const VideoCard = ({video, name=true}) => {
  const videoLength = formatDuration(parseInt(video?.duration));
  const uploadedTime = getTimeDistance(video?.createdAt)
  const navigate = useNavigate()

  const handdleLink = (e) => {
    e.preventDefault();
    navigate(`channel/${video?.owner?.userName}`)
  }
  return (
    <Link to={`${video?.title}/${video?._id}`} className='bg-black rounded-xl h-full'>
      <div key={video?._id} className='rounded-xl text-white p-1` hover:bg-slate-700'>
        <div className='w-full relative inset-0'>
          <div className='absolute inset-0'>
            <img 
              src={video?.thumbnail} alt={video?.title} className='rounded-xl w-full h-full object-cover mb-1' height={"200px"}
            />
          </div>
          <p className='absolute bottom-1 right-3'>{videoLength}</p>
        </div>
        <div className='flex mt-1'>
          <div onClick={handdleLink} className='mt-1 flex-shrink-0'>
            <img src={video?.owner?.avatar} className='rounded-full w-8 h-8 object-cover'/>
          </div>
          <div className='ml-4'>
            <h2 className='text-lg font-bold line-clamp-2' title={video?.title}>{video?.title}</h2>
            {
              name && (
                <h2 className='text-gray-300'>{video?.owner?.firstName}{" "}{video?.owner?.lastName}</h2>
              )
            }
            <p className='text-gray-400'>{`${video?.views} views | ${uploadedTime}`}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default VideoCard
