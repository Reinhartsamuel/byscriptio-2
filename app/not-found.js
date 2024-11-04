import Link from 'next/link';
import React from 'react';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center h-screen w-full'>
      <div className='flex flex-col gap-2 items-center'>
          <div className='flex gap-2'>
            <img
              alt='byScript'
              src='https://i.ibb.co.com/RB9rQy3/Whats-App-Image-2024-05-19-at-16-02-06.jpg'
              className='h-8 w-auto rounded-lg'
            />
            <h2 className='text-3xl font-ecoCoding'>byScript.io</h2>
          </div>
          <p className='text-gray-300 text-sm'>Could not find requested resource</p>
          <Link href='/' className='text-blue-300'>
            Return Home
          </Link>
      </div>
    </div>
  );
}
