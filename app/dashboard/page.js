'use client';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { authFirebase } from '../config/firebase';
import { useRouter } from 'next/navigation';

import { useExchangeStore } from '../store/exchangesStore';
import { useAutotraderStore } from '../store/autotraderStore';

import { useUserStore } from '../store/userStore';
import { PricingComponent } from '../components/PricingComponent';
import moment from 'moment';
import { TourProvider, useTour } from '@reactour/tour';
import TradingPlanCTA from '../components/TradingPlansCTA';

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


const page = () =>
// { params }
{
  const [user, setUser] = useState(null);
  
  const router = useRouter();
  const { getExchangeAccounts } = useExchangeStore();
  const { getAutotraders } = useAutotraderStore();
  const { customer, userPackage } = useUserStore();
  const [showPricing, setShowPricing] = useState(false);


  useEffect(() => {
    onAuthStateChanged(authFirebase, (user) => {
      if (!user) {
        // console.log('no user, signing out!!!!');
        authFirebase.signOut();
        return router.push('/auth/login');
      }
      setUser(user);
    });
  }, []);

  useEffect(() => {
    if (user?.email) {
      console.log('calling getExchangeAccounts and getAutotraders')
      getExchangeAccounts(user.email);
      getAutotraders(user.email);
    }
  }, [user]);

  if (!user) {
    return null;
    // } else if (customer && !userPackage) {
  } else if (showPricing) {
    return <PricingComponent />;
  }

  return (
    <>
      <TourProvider defaultOpen={false} className='w-screen bg-red-200' steps={steps}>
        <div className='w-screen min-h-screen flex flex-col mx-auto px-1 lg:px-6 '>
          <div className='fixed top-0 left-0 z-[-2] h-screen w-screen dark:bg-neutral-950  bg-[radial-gradient(ellipse_80%_80%_at_50%_-5%,rgba(120,119,198,0.4),rgba(255,255,255,0))]' />
          <div className='mt-10 mx-2 lg:mx-6'>
            <h1 className='text-3xl font-bold text-slate-900 dark:text-slate-100 flex gap-3'>
              {/* Welcome, {params?.name?.split('-')?.join(' ')}! */}
              Welcome {customer?.name && ', ' + customer?.name}!
              <span>
                <TourButton />
              </span>
            </h1>
            <h3 className='font-light text-sm text-gray-800 dark:text-gray-300 leading--5'>
              Welcome to{' '}
              <span className='font-ecoCoding text-indigo-500'>byScript</span>{' '}
              dashboard.

              {userPackage ? ` Your active subscription is ${userPackage?.productName}${' '}
              until${' '}
              ${moment
                  .unix(userPackage?.expiredAt?.seconds)
                  .format('DD MMMM YYYY')}` : 'You don\'t have any active subscription. Please purchase first.'}
            </h3>
          </div>
          <TradingPlanCTA />
          <div className='block'>
            <div className='mt-4 text-center'>
              <a href='/dashboard/profile' className='text-blue-500 hover:underline'>
                Go to Profile →
              </a>
            </div>
          </div>
        </div>
        {/* <ActivitiesComponent /> */}
      </TourProvider>
    </>
  );
};

export default page;





const steps = [
  {
    selector: '.connect-exchange',
    content: 'You don\'t have any exchange account connected. Click here to connect exchange.',
  },
  {
    selector: '.add-autotrader',
    content: 'Click here to start autotrading by creating an autotrader. ',
  },
  {
    selector: '.trades-history',
    content: 'Monitor trades here.',
  },
  // ...
]

const TourButton = () => {
  const { setIsOpen } = useTour();

  return (
    <button
      onClick={() => setIsOpen(true)}
      className='py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
    >
      Take me to tour! 🚗 🚕 🚀
    </button>
  )
}