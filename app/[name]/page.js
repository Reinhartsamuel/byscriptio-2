'use client';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { authFirebase } from '../config/firebase';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useExchangeStore } from '../store/exchangesStore';
import { useAutotraderStore } from '../store/autotraderStore';
import CombinedTradeHistoryComponent from '../components/CombinedTradeHistoryComponent';

// const SubscriptionComponent = dynamic(() => import('./SubscriptionComponent'), {
//   ssr: false,
// });
// const BillingHistoryComponent = dynamic(
//   () => import('./BillingHistoryComponent'),
//   { ssr: false }
// );
// const ActivitiesComponent = dynamic(() => import('./ActivitiesComponent'), {
//   ssr: false,
// });
const AutotraderBotComponent = dynamic(
  () => import('./AutotraderBotComponent'),
  { ssr: false }
);
const ExchangesComponent = dynamic(() => import('./ExchangesComponent'), {
  ssr: false,
});

const page = ({ params }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { getExchangeAccounts } = useExchangeStore();
  const { getAutotraders } = useAutotraderStore();
  useEffect(() => {
    onAuthStateChanged(authFirebase, (user) => {
      if (!user) {
        console.log('no user, signing out!!!!');
        authFirebase.signOut();
        return router.push('/');
      }
      setUser(user);
    });
  }, []);

  useEffect(() => {
    if (user?.email) {
      getExchangeAccounts(user.email);
      getAutotraders(user.email);
    }
  }, [user]);

  return (
    <>
      <div className='w-screen min-h-screen flex flex-col mx-auto px-1 lg:px-6 '>
        <div className='fixed top-0 left-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-5%,rgba(120,119,198,0.4),rgba(255,255,255,0))]' />
        <div className='mt-10 mx-6'>
          <h1 className='text-3xl font-bold text-slate-100'>
            Selamat datang, {params?.name?.split('-')?.join(' ')}!
          </h1>
          <h3 className='font-extralight text-sm text-gray-300 leading--5'>
            Selamat datang di dashboard byScript. Kamu dapat mengatur
            subscription dan trading plan.
          </h3>
        </div>
        <div className='block'>
          <div className='grid grid-cols-1 lg:grid-cols-2'>
            <ExchangesComponent />
            {/* <div className='grid grid-cols-1 mt-10 mx-6 gap-2 lg:grid-cols-2'>
          <SubscriptionComponent />
          <BillingHistoryComponent />
        </div> */}
            <CombinedTradeHistoryComponent />
          </div>
          <div className=''>
            <AutotraderBotComponent />
          </div>
        </div>
      </div>
      {/* <ActivitiesComponent /> */}
    </>
  );
};

export default page;
