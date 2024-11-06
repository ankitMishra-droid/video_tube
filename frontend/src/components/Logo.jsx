import React from 'react';
import logo from "../assets/logo.png";

const Logo = ({className, width, height}) => {
  return (
    <div className='w-full'>
      <img src={logo} alt='logo' width={width} height={height} className={`${className}`}/>
    </div>
  )
}

export default Logo
