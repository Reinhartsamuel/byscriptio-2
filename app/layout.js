import './globals.css';
import { Suspense } from 'react';
import localfont from 'next/font/local';
import Spinner from './components/ui/Spinner';

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
  title: 'byscript',
  description: 'Algorighmic Trading Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={ecoCoding.variable}>
        <Suspense
          fallback={
            <div className='w-full h-screen flex justify-center items-center'>
              <Spinner />
            </div>
          }
        >
          {children}
        </Suspense>
      </body>
    </html>
  );
}
