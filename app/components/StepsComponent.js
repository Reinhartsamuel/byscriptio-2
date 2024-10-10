'use client';
import React from 'react';
import Image from 'next/image';
import { TracingBeam } from './ui/TracingBeam';

export function StepsComponent() {
  return (
    <TracingBeam className='px-6'>
      <div className='max-w-2xl mx-auto antialiased pt-4 relative'>
        {dummyContent.map((item, index) => (
          <div key={`content-${index}`} className='mb-[10rem]'>
            <h2 className='bg-black text-white rounded-full text-sm w-fit px-4 py-1 mb-4'>
              {item.badge}
            </h2>

            <p className={'text-xl mb-4'}>{item.title}</p>

            <div className='text-sm  prose prose-sm dark:prose-invert'>
              {item?.image && (
                <img
                  src={item.image}
                  alt='blog thumbnail'
                  height='1000'
                  width='1000'
                  className='rounded-lg mb-10 object-cover'
                />
              )}
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </TracingBeam>
  );
}

const dummyContent = [
  {
    title: 'Daftar akun Crypto Exchange',
    description: (
      <>
        <p>
         Sebelum kamu melakukan trading algoritma dengan byScript, kamu harus sudah mempunyai akun exchange yang akan dipasang bot dari byscript. Juka belum punya, silakan daftar di 
         <i>centralized crypto exchange</i> favorit kamu
        </p>
        <div className='w-full flex justify-center items-center mt-5'>
          <button className='w-[90%] mx-auto relative inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50'>
            <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]' />
            <span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-3 text-sm font-medium text-white backdrop-blur-3xl'>
              Daftar sekarang
            </span>
          </button>
        </div>
      </>
    ),
    // badge: "React",
    image:'https://byscript-bucket.s3.ap-southeast-2.amazonaws.com/iScreen Shoter - 20240730061230965.webp'
  },
  {
    title: 'Atur jadwal onboarding via Google Meet dengan tim byScript',
    description: (
      <>
        <p>
         Kamu akan kami undang untuk profiling risiko dan memilih trading plan yang sesuai dengan profil risiko kamu.
         Kamu juga akan menentukan aset atau pair yang akan kamu autotrade.
        </p>
      </>
    ),
    image:
      'https://firebasestorage.googleapis.com/v0/b/saudagar-staging.appspot.com/o/transfer-receipt%2FKrTqD6lD4yQtTW0SyKe2pFTUFbx2%2FWhatsApp%20Image%202024-07-03%20at%2016.47.07%20(1).jpeg?alt=media&token=adc17bb9-b5fd-4164-ad9a-ffc1f5a4b731',
  },
  {
    title: 'Aktivasi Autotrade',
    description: (
      <>
        <p>
          Setelah kamu mendaftar akun exchange dan memilih pair coin yang akan ditradingkan, kamu sudah tingal duduk santai dan 
          autotrade akan berjalan secara otomatis.
        </p>
        <h3 className='text-lg font-bold'>Happy Trading!💰💰</h3>
      </>
    ),
    image:
      'https://public.bnbstatic.com/image/cms/article/body/202107/77dff25762eae3e8f92e42c9d9ae0da5.png'
  },
];
