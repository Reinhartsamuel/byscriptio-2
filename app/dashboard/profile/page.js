'use client';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { authFirebase } from '../../config/firebase';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useExchangeStore } from '../../store/exchangesStore';
import { useAutotraderStore } from '../../store/autotraderStore';
import { useUserStore } from '../../store/userStore';
import { PricingComponent } from '../../components/PricingComponent';
import { TourProvider } from '@reactour/tour';

const ExchangesComponent = dynamic(() => import('../ExchangesComponent'), {
  ssr: false,
});

const AutotraderBotComponent = dynamic(() => import('../AutotraderBotComponent'), {
  ssr: false,
});

const CombinedTradeHistoryComponent = dynamic(() => import('../../components/CombinedTradeHistoryComponent'), {
  ssr: false,
});

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [showPricing, setShowPricing] = useState(false);
  const router = useRouter();
  const { getExchangeAccounts } = useExchangeStore();
  const { getAutotraders } = useAutotraderStore();
  const { customer } = useUserStore();

  useEffect(() => {
    onAuthStateChanged(authFirebase, (user) => {
      if (!user) {
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

  if (!user) return null;

  return (
    <TourProvider defaultOpen={false}>
      <div className='w-screen min-h-screen flex flex-col mx-auto px-1 lg:px-6'>
        <div className='fixed top-0 left-0 z-[-2] h-screen w-screen dark:bg-neutral-950  bg-[radial-gradient(ellipse_80%_80%_at_50%_-5%,rgba(120,119,198,0.4),rgba(255,255,255,0))]' />
        <div className='mt-10 mx-2 lg:mx-6'>
          <h1 className='text-3xl font-bold text-slate-900 dark:text-slate-100'>
            Profile - {customer?.name}
          </h1>
          <p className='text-slate-100'>asdlaskmd</p>
        </div>
        
        <div className='grid grid-cols-1 lg:grid-cols-2'>
          <ExchangesComponent setShowPricing={setShowPricing} />
          <CombinedTradeHistoryComponent />
        </div>
        
        <div className='mt-6'>
          <AutotraderBotComponent setShowPricing={setShowPricing} />
        </div>

        {showPricing && <PricingComponent />}
      </div>
    </TourProvider>
  );
}