import React from 'react'

const SignUp = () => {
  return (
    <div className='container max-w-md bg-black shadow-md rounded'>
      <div className=''>
        <form className=''>
            <div className=''>
                <label htmlFor='firstName'></label>
                <input type='text' name='firstName' id='firstName' placeholder='Enter...'/>
            </div>
            <div className=''>
                <label htmlFor='lastName'></label>
                <input type='text' name='firstName' id='firstName' placeholder='Enter...'/>
            </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp
