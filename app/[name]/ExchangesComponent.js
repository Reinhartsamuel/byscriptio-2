'use client';
import moment from 'moment';
import React, { useState } from 'react';
import Spinner from '../components/ui/Spinner';
import { authFirebase } from '../config/firebase';

import useFetchData from '../hooks/QueryHook';
import PropTypes from 'prop-types';
import useCountDocuments from '../hooks/CountHook';
import ExchangeDrawer from '../components/ExchangeDrawer';
import ExchangeComponent from '../components/ExchangeComponent';

const ExchangesComponent = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  function toggleDrawer() {
    setDrawerOpen(!drawerOpen);
  }

  const {
    data: exchange_accounts,
    // loading,
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

  const { count: counttt } = useCountDocuments({
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

  return (
    <>
      <div className='mx-2 lg:mx-6 mt-10'>
        <ExchangeDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
        <div className='flex items-center gap-4'>
          <h2 className='text-xl font-bold text-slate-800 dark:text-slate-200 font-bold'>
            Exhcange
          </h2>
          <button
            onClick={toggleDrawer}
            type='button'
            className='text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 rounded-md text-xs p-2 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 min-w-[3rem]'
          >
            Add New
          </button>
        </div>

        <p className='text-[0.75rem] font-light text-slate-800 dark:text-slate-200 mb-4'>
          {counttt || 0} connected exchange accounts
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {exchange_accounts.map(
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
