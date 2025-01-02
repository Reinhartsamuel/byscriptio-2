import StatisticsComponent from './components/StatisticsComponent';
// import { HeroHighlightComponent } from './components/HeroHighlightsComponent';
import { ImageGallery } from './components/ImageGallery';
import SignalPreviewComponent from './components/SignalPreviewComponent';
import { StepsComponent } from './components/StepsComponent';
import { PricingComponent } from './components/PricingComponent';
import { TestimonialsComponent } from './components/TestimonialsComponent';
import Navbar from './components/ui/Navbar';
import Footer from './components/Footer';
import React from 'react';
import { Compare } from './components/ui/Compare';
import { EXCHANGE_LOGOS } from './dummy';
import { GlowWrapper } from './components/ui/GlowWrapper';
import VideoPlayer from './components/ui/VideoPlayer';

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
            First Ever{' '}
            <span className='italic text-slate-200'>Algorithmic Trading</span>{' '}
            Platform in Indonesia
          </h1>
          <div className='mt-10'>
            <a target='_blank' rel='noreferrer' href='https://docs.byscript.io/'>
              <button className='w-[90%] mx-auto relative inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50'>
                <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]' />
                <span className='inline-flex lg:text-xl h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-3 text-sm font-medium text-white backdrop-blur-3xl'>
                  Docs
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

      <div className=' md:hidden'>
        <StatisticsComponent />
      </div>
      {/* EXCHANGES LOGO */}
      <div className='w-full mx-auto bg-slate-50 xl:px-20 overflow-hidden'>
        <div className='flex flex-nowrap justify-center items-center infinite-scroll py-5'>
          {EXCHANGE_LOGOS.map((exchange, i) => (
            <img
              key={i}
              className='w-[10rem]'
              src={
                exchange.src
              }
              alt={
                exchange.alt}
            />
          ))}
        </div>

      </div>

      {/* <HeroHighlightComponent /> */}
      <div className='w-full min-h-screen flex flex-col items-center justify-center relative'>
        <h1 className='text-center text-3xl text-slate-100 mb-10'>"by<span className='font-ecoCoding'>Script</span> not only gives
          <span className='text-orange-500 font-bold'> singals</span>, but also{' '}
          <br />
          <span className='text-blue-500 italic underline'>automated trading</span>,
          <br />
          <span className='text-lg'>while you sleep, drive, work, play with your child, anything."</span>
        </h1>

        <GlowWrapper glowColor="blue">
          <div className='lg:w-[80vw]'>
            <Compare
              firstImage='https://firebasestorage.googleapis.com/v0/b/byscript-io.appspot.com/o/chart-before.jpeg?alt=media&token=2a4fcc3f-f090-4d63-b8a1-4a40826d975d'
              secondImage='https://firebasestorage.googleapis.com/v0/b/byscript-io.appspot.com/o/chart-after.jpeg?alt=media&token=10872ef8-deba-4782-b885-0379e8323071'
              firstImageClassName='object-cover object-left-top'
              secondImageClassname='object-cover object-left-top'
              className='h-[500px] w-2xl md:h-[500px] md:w-2xl'
              slideMode='hover'
            />
          </div>
        </GlowWrapper>
      </div>


      <div className='w-full min-h-screen pb-10 mt-20 inline-block items-center justify-center mx-auto bg-white dark:bg-black'>
        <h1 className='text-3xl mt-10 font-bold text-center mx-auto md:text-5xl lg:text-7xl text-black dark:text-white'>
          LIVE SIGNAL 📣📈📉
        </h1>
        <h3 className='text-center mx-auto text-black dark:text-white'>
          Not only giving signals, but also fully automated trade in your exchanges
        </h3>
        <SignalPreviewComponent />
      </div>

      <div className='w-full min-h-screen relative flex flex-col items-center justify-center mx-auto'>
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]" />
        <h1 className='text-3xl font-bold text-center mx-auto md:text-5xl lg:text-7xl text-black dark:text-white'>
          How this even works?
        </h1>
        <h3 className='text-center mx-auto text-black dark:text-white mb-10'>
          How you can connect your exchanges, what are autotraders, and how trade is executed on byScript
        </h3>
        <VideoPlayer url={'https://www.youtube.com/watch?v=QABiomlggFk'}  />
      </div>
      <div className='w-full min-h-screen'>
      <GlowWrapper glowColor="blue">
            <Compare
              firstImage='https://firebasestorage.googleapis.com/v0/b/byscript-io.appspot.com/o/chart-before.jpeg?alt=media&token=2a4fcc3f-f090-4d63-b8a1-4a40826d975d'
              secondImage='https://firebasestorage.googleapis.com/v0/b/byscript-io.appspot.com/o/chart-after.jpeg?alt=media&token=10872ef8-deba-4782-b885-0379e8323071'
              firstImageClassName='object-cover object-left-top'
              secondImageClassname='object-cover object-left-top'
              className='h-[500px] w-2xl md:h-[500px] md:w-2xl'
              slideMode='hover'
            />
        </GlowWrapper>
      </div>

      {/* <div className='w-full my-1000 flex flex-col my-[20rem]'>
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
      </div> */}
      <TestimonialsComponent />

      <div className='min-h-screen' id='pricing'>
        <PricingComponent />
      </div>

      <Footer />
    </>
  );
}
