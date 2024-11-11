import React from 'react'
import notFound from "../assets/not.jpg"
import { Button } from './ui/button'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <div className='h-screen w-full bg-black/95 overflow-y-auto flex flex-col items-center justify-center'>
      <div className='rounded-xl overflow-hidden'>
        <img src={notFound} className='sm::w-96 sm:h-96 w-auto p-2 rounded-xl' alt='404 not found'/>
      </div>
      <div className='mt-5'>
        <Button onClick={() => {window.location.replace("/")}}>
            Back To Home
        </Button>
      </div>
    </div>
  )
}

export default PageNotFound
