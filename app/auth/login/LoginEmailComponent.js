'use client';

import Spinner from '@/app/components/ui/Spinner';
import { cn } from '@/lib/util';
import { useState } from 'react';
import React from 'react'

export default function LoginEmailComponent() {
  const [loading, setLoading] = useState(false);
  // const handleLoginEmail = async () => {

  // };
  return (
    <div className='flex flex-col w-full gap-2'>
      <input
        type='email'
        className='flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50
          text-slate-800
          '
        id='email'
        placeholder='name@example.com'
      />
      <input
        type='password'
        className='flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50
          text-slate-800
          '
        id='password'
        placeholder='password'
      />
      <button
        className={cn(
          'w-full px-8 py-2 h-11  bg-black text-white text-sm rounded-md hover:bg-black/[0.8] hover:shadow-lg',
          loading && 'disabled'
        )}
      >
        {loading ? <Spinner /> : 'Masuk dengan Email'}
      </button>
    </div>
  );
}
