'use client';
import { motion } from 'framer-motion';
import { HeroHighlight, Highlight } from './ui/HeroHighlights';
import React from 'react';

export function HeroHighlightComponent() {

  return (
    <HeroHighlight>
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className='text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto '
      >
        Trading itu sulit, <span className="font-ecoCoding text-indigo-400">byScript</span>{' '}
        bantu kamu tetap profit <br />
        <Highlight className='text-black dark:text-white'>
          apapun kondisi market!
        </Highlight>
      </motion.h1>
      <h3 className='mt-5 mx-auto max-w-4xl text-sm text-center text-slate-400'>
        dengan platform byScript kamu dapat trading dengan otomatis menggunakan
        algoritma, sehingga kamu bisa mendapatkan profit maksimal, bahkan ketika{' '}
        <i>market crash</i> sekalipun 📈📉.
      </h3>
      <div className='w-full flex items-center justify-center mx-auto'>
        <button className='mt-10 relative inline-flex h-20 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50'>
          <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]' />{' '}
          <span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl'>
            <div className='flex items-center'>
              <div className='inline-block text-lg'>
                Daftar Sekarang{' '}
                <span className='inline-block font-200'>gratis 1 bulan</span>
              </div>
            </div>
          </span>{' '}
        </button>
      </div>
    </HeroHighlight>
  );
}
