'use client';
import React, { useEffect, useState } from 'react';
import Spinner from '../components/ui/Spinner';
import { authFirebase } from '../config/firebase';

import useFetchData from '../hooks/QueryHook';
import PropTypes from 'prop-types';
import useCountDocuments from '../hooks/CountHook';
import ExchangeDrawer from '../components/ExchangeDrawer';
import ExchangeComponent from '../components/ExchangeComponent';
import { useTour } from '@reactour/tour'
import { useExchangeStore } from '../store/exchangesStore';

const ExchangesComponent = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { setIsOpen:setIsTourOpen } = useTour()
  const {exchanges_accounts: exhcnagesFromStore } = useExchangeStore()
  function toggleDrawer() {
    setDrawerOpen(!drawerOpen);
  }

  const [initialLoad, setInitialLoad] = useState(true);

  const {

    error,
  } = useFetchData({
    collectionName: 'exchange_accounts',
    conditions: [
      {
        field: 'email',
        operator: '==',
        value: authFirebase.currentUser?.email,
      },
    ],
    limitQuery: 50,
    dependencies: [authFirebase.currentUser?.email],
  });

  const { count } = useCountDocuments({
    collectionName: 'exchange_accounts',
    conditions: [
      {
        field: 'email',
        operator: '==',
        value: authFirebase.currentUser?.email,
      },
    ],
    dependencies: [authFirebase.currentUser?.email],
  });

  if (!authFirebase.currentUser)
    return (
      <div className='w-full h-screen flex flex-col items-center justify-center'>
        <Spinner />
      </div>
    );

    useEffect(() => {
      if (initialLoad) {
        setInitialLoad(false);
        return;
      }
      if (count === 0) {
        setIsTourOpen(true)
      }
    },[count])

  return (
    <>
      <div className='mx-2 lg:mx-6 mt-10'>
        <ExchangeDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
        <div className='flex items-center gap-4'>
          <h2 className='text-xl text-slate-800 dark:text-slate-200 font-bold'>
            Exhcange
          </h2>
          <button
            onClick={toggleDrawer}
            type='button'
            className='connect-exchange text-white border-2 focus:outline-none focus:ring-4 focus:ring-purple-300 rounded-md text-xs p-2 text-center min-w-[3rem] border-brand_primary'
          >
            Add New
          </button>
        </div>

        <p className='text-[0.75rem] font-light text-slate-800 dark:text-slate-200 mb-4'>
          {count || 0} connected exchange accounts
        </p>
        <div className='grid grid-cols-1 gap-2'>
          {exhcnagesFromStore.map(
            (
              exchange,
              i // dummy data
            ) => (
              <ExchangeComponent key={i} exchange={exchange} />
            )
          )}
        </div>
        {error && <p>{error.message}</p>}
      </div>
    </>
  );
};

export default ExchangesComponent;

ExchangesComponent.propTypes = {
  setShowPricing: PropTypes.func,
};
