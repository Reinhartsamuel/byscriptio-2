'use client';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { authFirebase } from '../config/firebase';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useExchangeStore } from '../store/exchangesStore';
import { useAutotraderStore } from '../store/autotraderStore';
import CombinedTradeHistoryComponent from '../components/CombinedTradeHistoryComponent';
import { useUserStore } from '../store/userStore';
import { PricingComponent } from '../components/PricingComponent';
import moment from 'moment';

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

const page = () =>
  // { params }
  {
    const [user, setUser] = useState(null);
    const [showPricing, setShowPricing] = useState(false);
    const router = useRouter();
    const { getExchangeAccounts } = useExchangeStore();
    const { getAutotraders } = useAutotraderStore();
    const { customer, userPackage } = useUserStore();
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
        <div className='w-screen min-h-screen flex flex-col mx-auto px-1 lg:px-6 '>
          <div className='fixed top-0 left-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-5%,rgba(120,119,198,0.4),rgba(255,255,255,0))]' />
          <div className='mt-10 mx-2 lg:mx-6'>
            <h1 className='text-3xl font-bold text-slate-100'>
              {/* Welcome, {params?.name?.split('-')?.join(' ')}! */}
              Welcome {customer?.name && ', ' + customer?.name}!
            </h1>
            <h3 className='font-extralight text-sm text-gray-300 leading--5'>
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
          <div className='block'>
            <div className='grid grid-cols-1 lg:grid-cols-2'>
              <ExchangesComponent setShowPricing={setShowPricing} />
              {/* <div className='grid grid-cols-1 mt-10 mx-6 gap-2 lg:grid-cols-2'>
          <SubscriptionComponent />
          <BillingHistoryComponent />
        </div> */}
              <CombinedTradeHistoryComponent />
            </div>
            <div className=''>
              <AutotraderBotComponent setShowPricing={setShowPricing} />
            </div>
          </div>
        </div>
        {/* <ActivitiesComponent /> */}
      </>
    );
  };

export default page;
