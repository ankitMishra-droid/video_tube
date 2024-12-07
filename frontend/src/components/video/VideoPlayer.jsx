import React from 'react'

const VideoPlayer = ({videoFile}) => {
  return (
    <div>
      <video className='rounded-xl w-full max-h-[70vh]' controls autoPlay>
        <source src={videoFile} type='video/mp4'/>
      </video>
    </div>
  )
}

export default VideoPlayer
