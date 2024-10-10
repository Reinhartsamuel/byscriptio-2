'use client';
import PairImageComponent from '@/app/components/ui/PairImageComponent';
import {
  getSingleDocumentFirebase,
  updateDocumentFirebase,
} from '@/app/utils/firebaseApi';
import { cn } from '@/lib/util';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaBoltLightning } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';
import TradeHistoryComponent from './TradeHistoryComponent';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { IoEnter, IoExit } from 'react-icons/io5';
import Spinner from '@/app/components/ui/Spinner';

// const threeCommasUrl = 'https://app.3commas.io/trade_signal/trading_view';

const page = ({ params }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { handleStartStop } = useStartStopAction({
    setLoading,
    detail,
    setDetail,
  });

  const { handleForce } = useForceAction({ detail, setLoading });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const result = await getSingleDocumentFirebase('dca_bots', params.id);
        // console.log(result, 'this is result detail dca bot');
        setDetail(result);
      } catch (error) {
        console.error(error.message, 'error get detail autotrader dcca bot');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className='w-screen min-h-screen flex flex-col mx-auto px-2 lg:px-5'>
      <div className='my-4 mx-2'>
        <button
          onClick={() => router.push(`/${params.name}`)}
          className='flex items-center text-slate-300 gap-2 hover:scale-110 active:scale-95 transition ease-in-out'
        >
          <FaArrowLeft />
          Dashboard
        </button>
      </div>
      <div className='mt-10 mx-2'>
        <h1 className='text-3xl font-bold text-slate-100'>Detail Autotrader</h1>
        {/* <h3 className='font-extralight text-sm text-slate-400 leading--5'>
          description
        </h3> */}
      </div>

      <div className='w-full flex flex-col items-start gap-2 lg:flex-row'>
        <div className='flex flex-col gap-4 w-full'>
          <div className='rounded-lg bg-gray-800 p-4 shadow-md mx-2 font-sans flex flex-col gap-1'>
            <div className='flex flex-col gap-2 divide-y divide-slate-700'>
            <div className='flex w-full justify-between h-10 items-end'>
                <p className='text-gray-100 font-light text-sm'>Status</p>
                <p
                  className={cn(
                    'font-bold text-sm',
                    detail?.status === 'ACTIVE'
                      ? 'text-green-500'
                      : detail?.status === 'STOPPED'
                      ? 'text-red-500'
                      : detail?.status === 'REQUESTED'
                      ? 'text-orange-500'
                      : 'text-red-100'
                  )}
                >
                  {detail?.status || '-'}
                </p>
              </div>
              <div className='flex w-full justify-between h-10 items-end'>
                <p className='text-gray-100 font-light text-sm'>Created at</p>
                <p className='text-gray-100 font-light text-sm'>
                  {moment
                    .unix(detail?.createdAt?.seconds)
                    .format('HH:mm DD MMMM YYYY')}
                </p>
              </div>
              <div className='flex w-full justify-between h-10 items-end'>
                <p className='text-gray-100 font-light text-sm'>Last updated</p>
                <p className='text-gray-100 font-light text-sm'>
                  {moment
                    .unix(detail?.lastUpdated?.seconds)
                    .format('HH:mm DD MMMM YYYY')}
                </p>
              </div>
              <div className='flex w-full justify-between h-10 items-end'>
                <p className='text-gray-100 font-light text-sm'>Exchange</p>
                <img
                  alt={'exchange'}
                  src={
                    detail?.exchange_name === 'GATE'
                      ? 'https://static.airpackapp.com/fe-next/homepage/prod/_next/static/media/open_sesame_night.47e06968.png?w=750&q=75'
                      : detail?.exchange_thumbnail
                  }
                  className='w-[5rem] object-contain'
                />
              </div>
              <div className='flex w-full justify-between h-10 items-end'>
                <p className='text-gray-100 font-light text-sm'>Trade amount</p>
                <p className='text-gray-100 font-light text-sm'>
                  USD {detail?.tradeAmount}
                </p>
              </div>

              <div className='flex w-full justify-between h-10 items-end'>
                <p className='text-gray-100 font-light text-sm'>
                  Pairs: {detail?.trading_plan_pair?.length}
                </p>
                <div className='flex flex-col justify-center'>
                  {detail?.trading_plan_pair?.map((x, i) => (
                    <div key={i} className='flex gap-2 items-center'>
                      <p className='text-gray-100 font-light text-sm'>
                        {x?.split('_')?.shift()}
                      </p>
                      <p className='text-gray-100 font-light text-sm'>
                        {x?.split('_')?.slice(1)?.join('_')}
                      </p>
                      <PairImageComponent
                        pair={x?.split('_')?.slice(1)?.join('_')}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='flex flex-wrap gap-1 justify-end items-center p-4 md:p-5 border-t border-gray-200 dark:border-gray-600'>
              <button
                onClick={() => handleStartStop('start')}
                disabled={detail?.status === 'ACTIVE'}
                className={cn(
                  'flex items-center w-full justify-center flex-wrap-nowrap gap-2 px-4 py-2 rounded-xl border border-neutral-600 text-white ',
                  detail?.status === 'STOPPED'
                    ? 'cursor-pointer bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-500 transition duration-200'
                    : 'cursor-not-allowed bg-gray-600'
                )}
              >
                <FaBoltLightning />
                <p>Start autotrader</p>
              </button>
              <button
                onClick={() => handleStartStop('stop')}
                disabled={detail?.status === 'STOPPED'}
                className={cn(
                  'flex items-center w-full justify-center flex-wrap-nowrap gap-2 px-4 py-2 rounded-xl border border-neutral-600 text-white',
                  detail?.status === 'ACTIVE'
                    ? 'cursor-pointer bg-red-600 hover:bg-red-700 active:bg-red-500 transition duration-200'
                    : 'cursor-not-allowed  bg-gray-600'
                )}
              >
                <IoMdClose />
                <p>Stop autotrader</p>
              </button>
            </div>
          </div>
          <div className='rounded-lg bg-gray-800 p-4 shadow-md mx-2 font-sans flex flex-col gap-1'>
            <h1>Force Entry / Exit</h1>
            <div className="flex flex-col lg:flex-row gap-2">
              <button
                onClick={() => handleForce('entry')}
                disabled={false}
                className={cn(
                  'flex items-center w-full justify-center flex-wrap-nowrap gap-2 px-4 py-2 rounded-xl border border-neutral-600 text-white cursor-pointer bg-green-600 hover:bg-green-700 active:bg-green-500 transition duration-200'
                )}
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    <IoEnter />
                    <p>Force Entry</p>
                  </>
                )}
              </button>
              <button
                onClick={() => handleForce('exit')}
                disabled={false}
                className={cn(
                  'flex items-center w-full justify-center flex-wrap-nowrap gap-2 px-4 py-2 rounded-xl border border-neutral-600 text-white cursor-pointer bg-red-600 hover:bg-red-700 active:bg-red-500 transition duration-200'
                )}
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    <IoExit />
                    <p>Force Exit</p>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-4 w-full overflow-scroll'>
          <div className='rounded-lg bg-gray-800 p-4 shadow-md mx-2 font-sans flex flex-col gap-1'>
            <h1>Trade History</h1>
            <TradeHistoryComponent
            bot_id={detail?.bot_id}
              text={'sm'}
              trading_plan_pair={detail?.trading_plan_pair}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

function useStartStopAction({ setLoading, detail, setDetail }) {
  async function handleStartStop(action) {
    // return console.log(detail);
    setLoading(true);
    try {
      const body = {
        action,
        bot_id: detail.bot_id,
      };
      const result = await fetch('/api/3commas/bot-activation', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const res = await result.json();
      if (result.status === 200 || res.status === 'success') {
        console.log('id bot:::::::', detail?.id);
        await updateDocumentFirebase('dca_bots', detail?.id, {
          status:
            action === 'start'
              ? 'ACTIVE'
              : action === 'stop'
              ? 'STOPPED'
              : 'invalid status',
        });
        Swal.fire({
          icon: 'success',
          title: `${action} bot success`,
        });
        setDetail({
          ...detail,
          status: action === 'start' ? 'ACTIVE' : 'STOPPED',
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'update bot to 3commas seems failed',
          text: `status code : ${res.status || 'unknown'}`,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: `Error ${action} bot`,
        text: error.message + '!',
      });
    } finally {
      setLoading(false);
    }
  }

  return { handleStartStop };
}

function useForceAction({ detail, setLoading }) {
  const handleForce = async (action) => {
    const { isConfirmed, isDenied } = await Swal.fire({
      title: `Confirm force ${action}?`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: action,
      denyButtonText: 'cancel',
    });

    if (isDenied || !isConfirmed) return;
    setLoading(true);
    try {
      const resultPromise = await Promise.all(
        detail?.trading_plan_pair?.map(async (x) => {
          const sendBodyTo3Commas = {
            message_type: 'bot',
            bot_id: detail?.bot_id,
            email_token: '52c6860e-5814-47ed-a5ae-663d78446439',
            delay_seconds: 0,
            pair: x?.split('_')?.slice(1)?.join('_'),
          };
          if (action === 'exit') {
            sendBodyTo3Commas.action = 'close_at_market_price';
          }
          console.log(sendBodyTo3Commas, 'body to 3commas');
          const res = await fetch('/api/signal/force-entry', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(sendBodyTo3Commas),
          });

          return await res.json();
        })
      );
      console.log(resultPromise,'resultPromise');
      Swal.fire({
        title: 'Success',
        text: `${action} autotrader success`,
        icon: 'success',
      });

    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
  return { handleForce };
}
