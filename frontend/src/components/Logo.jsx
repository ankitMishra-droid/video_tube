import React from 'react'
import logo from "../assets/icons/logo1.png"

const Logo = ({className, w, h}) => {
  return (
    <div>
      <img src={logo} width={w} height={h} className={className}/>
    </div>
  )
}

export default Logo
