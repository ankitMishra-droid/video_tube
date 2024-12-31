import React from 'react'

const GuestComponent = ({icon, title = "Please Sign in", subtitle = "", route, guest = true}) => {
  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <div>
        <p>{title}</p>
      </div>
      <div>{subtitle}</div>
    </div>
  )
}

export default GuestComponent
