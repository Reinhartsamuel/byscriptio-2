'use client';
import { cn } from '@/lib/util';
import moment from 'moment';
import React, { useState } from 'react';
import Spinner from '../components/ui/Spinner';
import { authFirebase } from '../config/firebase';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import useFetchData from '../hooks/QueryHook';
import { exchanges } from '../dummy';
import Modal from '../components/ui/Modal';
import PropTypes from 'prop-types';
import useCountDocuments from '../hooks/CountHook';
import { FaCode, FaLock } from 'react-icons/fa6';

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

  if (!authFirebase.currentUser)
    return (
      <div className='w-full h-screen flex flex-col items-center justify-center'>
        <Spinner />
      </div>
    );

  return (
    <>
      <div className='mx-6 mt-10'>
        <div className='flex items-center gap-4'>
          <h2 className='text-xl text-bold text-slate-200 font-bold'>
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

        <p className='text-[0.75rem] font-light text-slate-200 mb-4'>
          {counttt || 0} akun exchange tersambung
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
          {exchanges.map(
            (
              exchange,
              i // dummy data
            ) => (
              <div
                key={i}
                className='flex flex-col justify-between gap-2 max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700 max-h-[5rem]'
              >
                <img
                  alt={exchange?.exchange_name}
                  src={exchange.exchange_thumbnail}
                  className='w-[6rem] object-contain'
                />
                {exchange_accounts?.some(
                  (x) => x?.exchange_name === exchange.exchange_name
                ) ? (
                  <div className='flex w-full justify-between'>
                    <p className='text-green-200 text-sm'>connected</p>
                    <p className='text-gray-200 text-sm'>
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
                    className='flex w-full justify-end text-sm underline text-gray-400'
                    onClick={() => setOpenModal(true)}
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

function ModalAddExchange({ openModal, setOpenModal }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const name =
    authFirebase.currentUser?.displayName ||
    authFirebase.currentUser?.email?.split('@')[0];

    const [inputData, setInputData] = useState({
      apiKey : '',
      secret : ''
    })
  const handleSubmit = async () => {
    setLoading(true);
    const inTimeWindow =
      moment(selectedDate).format('HH') >= '11' &&
      moment(selectedDate).format('HH') <= '17' &&
      moment(selectedDate).format('mm') <= '59';
    if (!inTimeWindow)
      return Swal.fire({
        icon: 'error',
        text: 'Silakan pilih waktu Senin-Jumat pukul 11.00 - 17.00',
      });
    try {
      // setLoading(true);
      // console.log(selectedDate);
      const postData = {
        summary: `Onboarding 1 on 1 ${name} bersama byScript`,
        location: 'Online',
        description: 'Connect Exchange',
        start: {
          dateTime: moment(selectedDate)
            // .utcOffset(7 * 60)
            .format('YYYY-MM-DDTHH:mm:ss'),
          timeZone: 'Asia/Jakarta',
        },
        end: {
          dateTime: moment(selectedDate)
            .utcOffset(7 * 60)
            .add(1, 'hours')
            .format(),
          timeZone: 'Asia/Jakarta',
        },
        attendees: [
          // { email: 'edwinfardyanto@gmail.com' },
          { email: authFirebase.currentUser?.email },
        ],
      };
      const res = await fetch('/api/calendar/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      const result = await res.json();
      // console.log(result, 'result create calendar');
      if (result?.data?.htmlLink) {
        Swal.fire({
          icon: 'success',
          title: 'Onboarding Dijadwalkan',
          text: `Harap cek email ${
            authFirebase.currentUser?.email
          } dan hadir pada online meeting pada ${moment(
            result?.data?.start?.dateTime
          ).format('dddd, DD MMMM YYYY, HH:mm')}`,
        });
      } else {
        throw new Error('Error while creating event');
      }
      // console.log(result, 'result');
      await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: {
            email: 'byscript@gmail.com',
            name: 'byScript',
          },
          cc: [
            {
              name: 'Reinhart',
              email: 'reinhartsams@gmail.com',
            },
          ],
          to: [
            {
              name: 'Edwin Ardyanto',
              email: 'edwinfardyanto@gmail.com',
            },
          ],
          subject: `Request Add Exchange : ${name}`,
          htmlContent: `
              <div>
                <p>Request Add Exchange : ${name}, 
                onboarding: ${moment(selectedDate).format(
                  'dddd, DD MMMM YYYY, HH:mm'
                )}</p>
                <a target="_blank" noopener noreferrer href="${
                  result?.data?.htmlLink
                }">${result?.data?.htmlLink}</a>
                Sent automatically from byscript backend
              </div>`,
        }),
      });
    } catch (error) {
      // console.error(error.message, ':::handleSubmit ExhcnagesComponent');
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      });
      console.log(error.message, 'error');
    } finally {
      setOpenModal(false);
      setLoading(false);
    }
  };

  const handleConnectExchange = async () => {
    try {
      console.log('handleConnectExchange');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      });
      console.error(error.message, '::error handleConnectExchange');
    } finally {
      setOpenModal(false);
      setLoading(false);
    }
  };
  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)}>
      <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600'>
        <div className='flex flex-col gap-2'>
          <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
            Connect Exchange
          </h3>
          <p className='font-extralight text-sm text-slate-400'>
            Input API Key and Secret of your exchange account
          </p>
          {/* <p className='font-extralight text-sm text-slate-400'>
            Silakan jadwalkan onboarding untuk connect exhcange, wajib memilih
            jadwal pukul 11.00 - 17.00 Senin - Jumat
          </p> */}
        </div>
      </div>
      {/* <!-- Modal body --> */}
      <div className='p-4 md:p-5 space-y-4'>
        <div className='relative w-full'>
          <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
            <FaCode />
          </div>
          <input
            type='text'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            placeholder='Please enter API Key'
            required
          />
        </div>
        <div className='relative w-full'>
          <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
            <FaLock />
          </div>
          <input
            type='text'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            placeholder='Please enter Secret Key'
            required
          />
        </div>
        {/* <p>Pilih Tanggal dan Waktu:{moment().format('YYYY-MM-DDTHH:mm')}</p>
        <input
          type={'datetime-local'}
          className='bg-gray-500 rounded text-white px-5 py-2'
          min={moment().format('YYYY-MM-DDTHH:mm')}
          onChange={(e) => setSelectedDate(e.target.value)}
        /> */}
      </div>
      {/* <!-- Modal footer --> */}
      <div className='flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600'>
        {/* <button
          onClick={handleSubmit}
          data-modal-hide='default-modal'
          disabled={loading}
          type='button'
          className={cn(
            'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
            loading && 'cursor-not-allowed opacity-50'
          )}
        >
          {loading ? <Spinner /> : 'Request Onboarding'}
        </button> */}
        <button
          onClick={handleConnectExchange}
          data-modal-hide='default-modal'
          disabled={loading}
          type='button'
          className={cn(
            'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
            loading && 'cursor-not-allowed opacity-50'
          )}
        >
          {loading ? <Spinner /> : 'Connect'}
        </button>

        <button
          onClick={() => setOpenModal(false)}
          type='button'
          className='py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
ModalAddExchange.propTypes = {
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
};
