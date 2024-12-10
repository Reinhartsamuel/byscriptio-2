'use client';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

const ExchangeComponent = ({ exchange }) => {
  async function getBalance() {
    try {
      const res = await fetch(
        `/api/3commas/accounts/load-balances?$accountId=${exchange?.external_id}`
      );
      const { data } = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    getBalance();
  }, []);
  return (
    <div className='flex flex-col justify-between gap-2 max-w-sm p-4 border rounded-lg shadow border-gray-300 dark:bg-gray-900 dark:border-gray-700 max-h-[6rem]'>
      <div className='flex w-full justify-between'>
        <div className='flex gap-2'>
          <img
            alt={exchange?.exchange_name}
            src={exchange.exchange_thumbnail}
            className='w-[6rem] object-contain bg-gray-800 rounded-md p-1 dark:p-0 dark:bg-gray-200 '
          />
          <span className='bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300'>
            {exchange?.type}
          </span>
        </div>
        <p className='text-gray-600 dark:text-gray-200 text-sm'>
          {exchange?.external_name}
        </p>
      </div>
      <div className='flex w-full justify-between'>
        <p className='text-green-600 dark:text-green-200 text-sm'>connected</p>
        <p className='text-gray-600 dark:text-gray-200 text-sm'>
          {moment.unix(exchange?.createdAt?.seconds).fromNow()}
        </p>
      </div>
      {/* {exchange_accounts?.some(
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
      >
        Connect
      </button>
    )} */}
    </div>
  );
};

export default ExchangeComponent;

ExchangeComponent.propTypes = {
  exchange: PropTypes.any,
};
