'use client';
import Spinner from '@/app/components/ui/Spinner';
import { handleLoginGoogle } from '@/app/services/login';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import LoginEmailComponent from './LoginEmailComponent';
import { useUserStore } from '@/app/store/userStore';
// import TurnstileWidget from '@/app/components/TurnstileWidget';

const page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { ipLocation, setIpLocation, setUser, setCustomer } = useUserStore();

  async function getLocationIp() {
    try {
      const locationFetch = await fetch('http://ip-api.com/json');
      const locationResult = await locationFetch.json();

      const ipFetch = await fetch('https://api.ipify.org/?format=json');
      const { ip: ipResult } = await ipFetch.json();

      setIpLocation({
        ip: ipResult,
        location: locationResult,
        userAgent: navigator.userAgent,
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    getLocationIp();
  }, []);

  return (
    <>
      {/* <div className='block flex-row bg-gray-800'>
        <div
          className='cf-turnstile'
          data-sitekey='yourSitekey'
          data-callback='javascriptCallback'
        ></div>
      </div>
      <div className='flex h-screen w-full justify-center items-center bg-gray-800'>
        <TurnstileWidget />
      </div> */}
      <div id='login-screen' className='flex h-screen w-full'>
        <div className='h-full hidden md:flex flex-col items-center justify-between py-10 w-[50%] bg-[#18181B] bg-slate-900'>
          <p></p>
          <img
            alt='byScript'
            src='https://i.ibb.co.com/RB9rQy3/Whats-App-Image-2024-05-19-at-16-02-06.jpg'
            className='h-20 w-auto rounded-lg'
          />
          <h3>Ubah Trading Manual Jadi Trading Otomatis 🚀 🚀</h3>
        </div>
        <div className='h-full w-full md:w-[50%] bg-white'>
          <div
            className='flex h-full gap-4 flex-col max-w-[75%]
        lg:max-w-[60%] items-center justify-center mx-auto'
          >
            <h3 className='text-3xl text-slate-900 font-bold text-center'>
              Masuk ke byScript
            </h3>
            <p className='text-slate-600 font-extralight leading-5 text-center font-md'>
              Jika kamu sudah memiliki langganan <i>trading plan</i>, harap
              login dengan email yang sama
            </p>
            <LoginEmailComponent loading={loading} />
            <div className='relative my-4 flex w-full items-center text-xs uppercase text-slate-900'>
              <div className='w-full flex h-0 border-[0.5px] border-slate-300' />
              <span className='bg-background wrap-no-wrap px-2 text-muted-foreground whitespace-nowrap'>
                atau masuk dengan
              </span>
              <div className='w-full flex h-0 border-[0.5px] border-slate-300' />
            </div>

            <button
              className={`w-full flex items-center justify-center gap-2 px-8 py-2 h-11 border-[1px] border-slate-300 bg-white text-slate-800 text-sm rounded-md font-semibold  hover:${
                !loading && 'shadow-xl'
              }`}
              disabled={loading}
              cursor={loading ? 'not-allowed' : 'pointer'}
              onClick={() =>
                handleLoginGoogle({ setLoading, router, ipLocation, setUser, setCustomer })
              }
            >
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <img
                    className='w-5'
                    src={
                      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png'
                    }
                  />
                  <p>Google</p>
                </>
              )}
            </button>
            <p className='text-slate-900 font-extralight  text-center text-sm'>
              Dengan sign in, kamu setuju dengan{' '}
              <u className='cursor-pointer'>Kebijakan Privasi</u> dan{' '}
              <u className='cursor-pointer'>Syarat dan Ketentuan</u> platform
              byScript
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
