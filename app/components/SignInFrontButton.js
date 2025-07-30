'use client'
import React from 'react'
import { useUserStore } from '../store/userStore'

const SignInFrontButton = () => {
  const { customer } = useUserStore();
  return (
    <>
      <a href={customer ? '/dashboard' : '/auth/login'}>
        <button className='w-[90%] p-[3px] relative my-5'>
          <div
            className='absolute inset-0 rounded-lg'
            style={{
              background: 'linear-gradient(135deg, var(--brand_primary), black, var(--brand_primary))'
            }}
          />
          <div className='px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white bg-transparent active:bg-violet-700'>
            {customer ? 'My Dashboard' : 'Sign In'}
          </div>
        </button>
      </a>
    </>

  )
}

export default SignInFrontButton
