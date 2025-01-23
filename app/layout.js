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
  title: 'byScript, first ever algorithmic trading platform in Indonesia',
  description: 'Discover byScript.io, the ultimate marketplace for algorithmic trading tools. Connect your exchange accounts, automate trades with advanced strategies, and explore customizable trading plans. Perfect for crypto enthusiasts and traders seeking reliable, profitable solutions. Start automating your trades today!',
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
