'use client';
import { cn } from '@/lib/util';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Modal from './ui/Modal';
import { deleteDocumentFirebase, getCollectionFirebase } from '../utils/firebaseApi';
import AutotraderCard from './AutotraderCard';
import Swal from 'sweetalert2/dist/sweetalert2.js';

// const dummyAutotraders  = [{
//   name : 'test',
//   bot_id :12345,
//   exchange_name: 'BINANCE',
//   exchange_thumbnail : 'https://download.logo.wine/logo/Binance/Binance-Logo.wine.png',
//   status : 'ACTIVE',

// }]

const ExchangeComponent = ({ exchange }) => {
  const [showModal, setShowModal] = useState(false);
  const [autotraders, setAutotraders] = useState([]);

  async function getAutotraders() {
    if (
      showModal === false ||
      !exchange?.external_id ||
      exchange?.status === 'REQUESTED'
    ) return;
    try {
      const res = await getCollectionFirebase('dca_bots', [{ field: 'exchange_external_id', operator: '==', value: exchange?.external_id }]);
      setAutotraders(res);
    } catch (error) {
      console.error(error, 'error getAutotraders');
    }
  }

  function onDeletePrompt() {
    if (autotraders?.length > 0) return Swal.fire({
      title: 'Forbidden',
      text: 'You cannot delete this exchange because it has active autotraders',
      icon: 'error'
    })
    Swal.fire({
      title: `Delete exchange ${exchange?.exchange_name} ${exchange?.external_id && `(${exchange?.external_id})`}?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDocumentFirebase('exchange_accounts', exchange?.id)
          .then(() => {
            alert('Success')
            window.location.reload();
          })
      }
    })
  }

  useEffect(() => {
    getAutotraders();
  }, [])
  return (
    <>
      <div onClick={() => {
        setShowModal(true)
        console.log(exchange, 'exchange')
      }} className='flex flex-col justify-between gap-2 cursor-pointer w-full p-4 border rounded-lg shadow bg-gray-900 border-gray-700 max-h-[6rem] hover:scale-105 transition ease-in-out 1s active:scale-95'>
        <div className='flex w-full justify-between'>
          <div className='flex w-full justify-between'>
            <div className='flex gap-2'>
              <img
                alt={exchange?.exchange_name}
                src={exchange.exchange_thumbnail}
                className='w-[6rem] object-contain rounded-md p-1 dark:p-0 bg-gray-400 '
              />
              <span className='bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300'>
                {exchange?.type}
              </span>
            </div>
            <p className='text-gray-600 dark:text-gray-400 text-sm justify-end'>
              {exchange?.id}
            </p>
          </div>

          <p className='text-gray-600 dark:text-gray-200 text-sm'>
            {exchange?.external_name}
          </p>
        </div>
        <div className='flex w-full justify-between'>
          <p className={cn('text-xs', exchange?.status === 'REQUESTED' ? 'text-orange-500' : 'text-green-200')}>{exchange?.status === 'REQUESTED' ? 'Requested' : 'connected'}{'  '}


            <span className='text-gray-200 text-xs'>{moment.unix(exchange?.createdAt?.seconds).fromNow()}</span>
          </p>
         {exchange?.usd_amount &&  <p className='text-gray-200 text-sm'>
            USD {parseInt(exchange?.usd_amount)?.toFixed(2)}
          </p>}
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
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div className='flex flex-col gap-2 w-[90vw] lg:w-[50vw]'>
          <div className='flex w-full justify-between border-b-2 border-gray-700 p-2'>
            <div className='flex items-center gap-2'>
              <img
                alt={exchange?.exchange_name}
                src={exchange.exchange_thumbnail}
                className='w-[6rem] object-contain rounded-md p-1 p-0 bg-gray-400 '
              />
              <span className='text-xs font-medium me-2 px-2.5 py-0.5 rounded bg-blue-900 text-blue-300'>
                {exchange?.type}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <p className='text-red-600 font-bold dark:text-red-700 text-center mx-auto cursor-pointer'>
                💀 Danger!
              </p>
              <button
                onClick={onDeletePrompt}
                type='button'
                className='focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'
              >
                🗑️ Delete Exchange
              </button>
            </div>

          </div>
          <div className='flex gap-2 border-b-2 border-gray-700 p-2'>
            <p className='text-gray-400'>Account id: <span className='text-gray-200 font-bold'>{exchange?.external_id}</span></p>
          </div>
          <div className='flex gap-2 border-b-2 border-gray-700 p-2'>
            <p className='text-gray-400'>Status: </p>
            <span className={cn('ftext-xs font-medium me-2 px-2.5 py-0.5 rounded', exchange?.status === 'REQUESTED' ? 'bg-orange-900 text-orange-300' : 'bg-green-900 text-green-300')}>
              {exchange?.status || 'Connected'}
            </span>
          </div>
          {autotraders?.length > 0 &&
            <div className='flex flex-col gap-5 p-2'>
              <p className='text-gray-400'>Autotraders: </p>
              <div className='grid grid-cols-2 gap-2'>
                {autotraders?.map((autotrader, i) => (
                  <div className='border-2 border-gray-700 rounded' key={i} >
                    <AutotraderCard data={autotrader} handleDetail={() => { }} />
                  </div>
                ))}

              </div>
            </div>
          }
        </div>
      </Modal>
    </>
  );
};

export default ExchangeComponent;

ExchangeComponent.propTypes = {
  exchange: PropTypes.any,
};
