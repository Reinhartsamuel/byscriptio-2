'use client';
import moment from 'moment';
import React, { useState } from 'react';
import Spinner from '../components/ui/Spinner';
import { authFirebase } from '../config/firebase';

import useFetchData from '../hooks/QueryHook';
import { exchanges } from '../dummy';
import PropTypes from 'prop-types';
import useCountDocuments from '../hooks/CountHook';
import ModalAddExchange from '../components/ModalAddExhcange';

const ExchangesComponent = () => {
  const [openModal, setOpenModal] = useState(false);

  // const [loading, setLoading] = useState(false);
  // const [exchanges, setExchanges] = useState([]);
  // const [data, setData] = useState({ exchanges: [{}], count: 0 });

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
    limitQuery: 5,
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

  function handleAddExchange() {
    return setOpenModal(true);
    // if (!userPackage) return setShowPricing(true);
    // if (window)
    //   window.open(
    //     'https://client.3commas.io/signup/byscript_exchange_connect-6c8cbefd',
    //     '_blank'
    //   );
    // setOpenModal(true);
  }

  if (!authFirebase.currentUser)
    return (
      <div className='w-full h-screen flex flex-col items-center justify-center'>
        <Spinner />
      </div>
    );

  return (
    <>
      <div className='mx-2 lg:mx-6 mt-10'>
        <div className='flex items-center gap-4'>
          <h2 className='text-xl font-bold text-slate-800 dark:text-slate-200 font-bold'>
            Exhcange
          </h2>
          {/* <button
            onClick={() => setOpenModal(true)}
            type='button'
            className='text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 rounded-md text-lg p-2 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 min-w-[3rem]'
          >
            +
          </button> */}
        </div>

        <p className='text-[0.75rem] font-light text-slate-800 dark:text-slate-200 mb-4'>
          {counttt || 0} connected exchange accounts
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
          {exchanges.map(
            (
              exchange,
              i // dummy data
            ) => (
              <div
                key={i}
                className='flex flex-col justify-between gap-2 max-w-sm p-4 border rounded-lg shadow border-gray-300 dark:bg-gray-900 dark:border-gray-700 max-h-[6rem]'
              >
                <img
                  alt={exchange?.exchange_name}
                  src={exchange.exchange_thumbnail}
                  className='w-[6rem] object-contain bg-gray-800 rounded-md p-1 dark:p-0 dark:bg-transparent dark:rounded-none'
                />
                {exchange_accounts?.some(
                  (x) => x?.exchange_name === exchange.exchange_name
                ) ? (
                  <div className='flex w-full justify-between'>
                    <p className='text-green-600 dark:text-green-200 text-sm'>
                      connected
                    </p>
                    <p className='text-gray-600 dark:text-gray-200 text-sm'>
                      {moment
                        .unix(
                          exchange_accounts?.find(
                            (x) => x?.exchange_name === exchange.exchange_name
                          )?.createdAt?.seconds
                        )
                        .fromNow()}
                    </p>
                  </div>
                ) : (
                  <button
                    className='flex w-full justify-end text-sm underline text-gray-600 dark:text-gray-400'
                    onClick={handleAddExchange}
                  >
                    Connect
                  </button>
                )}
              </div>
            )
          )}
        </div>

        {error && <p>{error.message}</p>}
      </div>

      <ModalAddExchange openModal={openModal} setOpenModal={setOpenModal} />
    </>
  );
};

export default ExchangesComponent;

ExchangesComponent.propTypes = {
  setShowPricing: PropTypes.func,
};
