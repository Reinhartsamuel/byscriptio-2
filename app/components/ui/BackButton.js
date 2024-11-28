'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6';

const BackButton = () => {
    const router = useRouter();
  return (
    <button onClick={() => router.back()}>
        <FaArrowLeftLong />
    </button>
  )
}

export default BackButton