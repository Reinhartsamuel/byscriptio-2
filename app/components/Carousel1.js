'use client';
import { motion } from 'framer-motion';
import React from 'react';
import { ImagesSlider } from './ui/ImageSlider';
import { cn } from '@/lib/util';
ImagesSlider;
export function Carousel1(props) {
  const { children, height } = props;
  const images = [
    'https://byscript-bucket.s3.ap-southeast-2.amazonaws.com/workshop1.webp',
    'https://byscript-bucket.s3.ap-southeast-2.amazonaws.com/workshop2.webp',
    'https://byscript-bucket.s3.ap-southeast-2.amazonaws.com/workshop3.webp',
    'https://byscript-bucket.s3.ap-southeast-2.amazonaws.com/workshop4.webp',
  ];
  return (
    <ImagesSlider className={height ? `h-${height}` : 'h-screen'}images={props?.images || images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className='z-50 flex flex-col justify-center items-center'
      >
        {children && (
          <>
            <motion.p className='font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4'>
              Belajar membuat algoritma trading <br /> bayar sekali,{' '}
              <p className='bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent span'>
                dibimbing setahun
              </p>
            </motion.p>
            <button className='px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4'>
              <span>Join now →</span>
              <div className='absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent' />
            </button>
          </>
        )}
      </motion.div>
    </ImagesSlider>
  );
}
