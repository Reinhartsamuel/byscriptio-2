'use client'
import React from 'react'
import { useUserStore } from '../store/userStore'

const SignInFrontButton = () => {
    const { customer } = useUserStore();
    return (
        <>
            {customer ?
                <a href='/dashboard'>
                    <button className='w-[90%] p-[3px] relative my-5'>
                        <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg' />
                        <div className='px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white bg-transparent active:bg-violet-700'>
                            My Dashboard
                        </div>
                    </button>
                </a>
                :
                <a href='/auth/login'>
                    <button className='w-[90%] p-[3px] relative my-5'>
                        <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg' />
                        <div className='px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white bg-transparent active:bg-violet-700'>
                            Sign In
                        </div>
                    </button>
                </a>
            }
        </>

    )
}

export default SignInFrontButton
