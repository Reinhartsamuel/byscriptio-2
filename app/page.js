import StatisticsComponent from './components/StatisticsComponent';
import { HeroHighlightComponent } from './components/HeroHighlightsComponent';
import { ImageGallery } from './components/ImageGallery';
import SignalPreviewComponent from './components/SignalPreviewComponent';
import { StepsComponent } from './components/StepsComponent';
import { PricingComponent } from './components/PricingComponent';
import { TestimonialsComponent } from './components/TestimonialsComponent';
import Navbar from './components/ui/Navbar';
import Footer from './components/Footer';
import React from 'react';

export default function Home() {
  return (
    <>
      <Navbar />
      {/* <div className="absolute top-0 z-[-20] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]" /> */}
      <div className=' w-full pt-10 inline-block md:flex items-center justify-center lg:px-20 z-20'>
        <div className='absolute  -z-10 size-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]' />
        <div className='w-full md:w-2/3 text-center items-center justify-center'>
          <h1 className='text-4xl font-bold text-white xl:text-8xl'>
            Algorithmic Trading with{' '}
            <span className='bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent font-ecoCoding font-bold'>
              byScript
            </span>
          </h1>
          <h1 className='text-md align-left text-slate-200 mt-5'>
            Platform{' '}
            <span className='italic text-slate-200'>Algorithmic Trading</span>{' '}
            pertama di Indonesia, Bantu Kamu Traders Cuan Trading Otomatis Pake
            Algoritma
          </h1>
          <div className='mt-10'>
            <a href='/new'>
              <button className='w-[90%] mx-auto relative inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50'>
                <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]' />
                <span className='inline-flex lg:text-xl h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-3 text-sm font-medium text-white backdrop-blur-3xl'>
                  Connect Exchange
                </span>
              </button>
            </a>
            <a href='/auth/login'>
              <button className='w-[90%] p-[3px] relative my-5'>
                <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg' />
                <div className='px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white bg-transparent active:bg-violet-700'>
                  Sign In
                </div>
              </button>
            </a>
            <div className='hidden md:block'>
              <StatisticsComponent />
            </div>
          </div>
        </div>
        <div className='w-400 md:w-1/2 mx-auto'>
          <div className='w-full h-full flex justify-center'>
            <img
              src={
                'https://byscript-bucket.s3.ap-southeast-2.amazonaws.com/xma.webp'
              }
              className='lg:px-20'
            />
          </div>
        </div>
      </div>

      <div className='mt-40 md:hidden'>
        <StatisticsComponent />
      </div>
      {/* EXCHANGES LOGO */}
      <div className='w-full mx-auto flex flex-wrap justify-center items-center bg-slate-50 xl:px-20'>
        <img
          className='w-[10rem] mt-10'
          src={
            'https://3commas.cdn.prismic.io/3commas/9f0f9956-95a9-4b6c-9ed9-4be570d96e52_gateio_logo.svg'
          }
          alt={'gateio'}
        />
        <img
          className='w-[10rem] mt-10'
          src={
            'https://3commas.cdn.prismic.io/3commas/3671e430-78b2-47d9-ae24-4dfbbbbe3a7d_binance_logo.svg'
          }
          alt={'binance'}
        />
        <img
          className='w-[10rem] mt-10'
          src={
            'https://3commas.cdn.prismic.io/3commas/1e2874ba-6b40-41f6-9a08-cf016fc6e850_okx_logo.svg'
          }
          alt={'okx'}
        />
        <img
          className='w-[10rem] mt-10'
          src={
            'https://3commas.cdn.prismic.io/3commas/f0739090-3719-40a8-9427-a541475733e5_bybit_logo.svg'
          }
          alt={'bybit'}
        />
        <img
          className='w-[10rem] mt-10'
          src={
            'https://images.prismic.io/3commas/de1e3082-4fef-4741-a010-a6ea0cc59c3a_1+1.png?auto=compress,format'
          }
          alt={'bitget'}
        />
        <img
          className='w-[10rem] mt-10'
          src={
            'https://3commas.cdn.prismic.io/3commas/b83d7a6a-46ae-4129-86a2-a25c008ec770_kraken_logo.svg'
          }
          alt={'kraken'}
        />
        <img
          className='w-[10rem] mt-10'
          src={
            'https://3commas.cdn.prismic.io/3commas/c25996fe-36cd-46de-a500-525650431bad_kucoin_logo.svg'
          }
          alt={'htx'}
        />
        <img
          className='w-[10rem] mt-10'
          src={
            'https://3commas.cdn.prismic.io/3commas/2b94565b-8045-4e46-bd67-382737c72f5c_bitstamp_logo.svg'
          }
          alt={'bitstamp'}
        />
        <img
          className='w-[10rem] mt-10'
          src={
            'https://3commas.cdn.prismic.io/3commas/d6eee03c-fe78-4a1b-9ec3-7fc76ade66d1_gemini_logo.svg'
          }
          alt={'gemini'}
        />
        <img
          className='w-[10rem] mt-10'
          src={
            'https://3commas.cdn.prismic.io/3commas/386bba0c-1585-456f-ae68-350973d143ca_bitfinex_logo.svg'
          }
          alt={'bitfinex'}
        />
        <img
          className='w-[10rem] mt-10 mb-10'
          src={
            'https://3commas.cdn.prismic.io/3commas/33f66756-3f61-480a-bdb9-c2e69182efc1_coinbase_logo.svg'
          }
          alt={'coinbase'}
        />
      </div>

      <HeroHighlightComponent />

      <div className='w-full h-screen mt-20 inline-block items-center justify-center mx-auto bg-transparent'>
        <h1 className='text-3xl mt-10 font-bold text-center mx-auto md:text-5xl lg:text-7xl'>
          LIVE SIGNAL 📣📈📉
        </h1>
        <h3 className='text-center mx-auto'>
          Signal live dari trading plan byscript, otomatis dari algoritma yang
          kami kembangkan
        </h3>
        <SignalPreviewComponent />
      </div>

      <div className='w-full my-1000 flex flex-col my-[20rem]'>
        <h1 className='text-2xl mt-10 font-bold text-center mx-auto md:text-6xl'>
          Cara mengaktifkan autotrade
        </h1>
        <StepsComponent />
      </div>

      <div className='w-full mt-20 inline-block items-center justify-center'>
        <h1 className='text-2xl mt-10 font-bold text-center mx-auto md:text-6xl'>
          Gabung komunitas byScript
        </h1>
        <h3 className='text-center mb-10 text-red'>
          50+ member sudah menggunakan trading otomatis, 40 member sudah{' '}
          <i>break-even point</i> (BEP) tinggal kamu
        </h3>
        <ImageGallery />
      </div>
      <TestimonialsComponent />

      <div className='min-h-screen' id='pricing'>
        <PricingComponent />
      </div>

      <Footer />
    </>
  );
}
