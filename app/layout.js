import './globals.css';
import { Suspense } from 'react';
import localfont from 'next/font/local';
import Spinner from './components/ui/Spinner';
import React from 'react';

const ecoCoding = localfont({
  src: [
    {
      path: '../public/fonts/eco_coding_wgl_4_bold.ttf',
      weight: '800',
    },
  ],
  variable: '--font-ecoCoding',
});

export const metadata = {
  title: 'Auto-Trade Made byScript',
  description: 'Fully automated crypto trading. Connect your exchange, activate a proven strategy, and let the system execute — reliably, 24/7.',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' className='dark'>
      <body className={ecoCoding.variable}>
        <Suspense
          fallback={
            <div className='w-full h-screen flex justify-center items-center'>
              <Spinner />
              <p className='text-gray-400 font-ecoCoding'>byScript.io</p>
            </div>
          }
        >
          {children}
        </Suspense>
      </body>
    </html>
  );
}
