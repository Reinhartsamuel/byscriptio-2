'use client';
import Modal from '@/app/components/ui/Modal';
import PairImageComponent from '@/app/components/ui/PairImageComponent';
import Spinner from '@/app/components/ui/Spinner';
import { cn } from '@/lib/util';
import moment from 'moment';
import { FaBoltLightning } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';
import React, { useState } from 'react';
import PropTypes from 'prop-types'; // ES6
import useStartStopAction from '@/app/hooks/startStopActionHook';
import ForceActionComponent from '@/app/components/ForceActionComponent';
import DeleteAutotraderComponent from '@/app/components/DeleteAutotraderComponent';
import TradeHistoryTable from './detail/[id]/TradeHistoryTable';

export default function ModalDetailAutotrader({
  detail,
  openModal,
  setOpenModal,
  setDetail,
}) {
  const [loading, setLoading] = useState(false);

  const { handleStartStop } = useStartStopAction({
    setLoading,
    detail,
    setDetail,
  });

  return (
    <>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div className='w-full flex flex-col items-start gap-2 lg:flex-row'>
          <div className='flex flex-col gap-4 w-full'>
            <div className='rounded-lg dark:bg-gray-800 p-4 shadow-md mx-2 font-sans flex flex-col gap-1'>
              <div className='flex flex-col gap-2 divide-y divide-slate-200 dark:divide-slate-700'>
                <div className='flex w-full justify-between min-h-10 items-end'>
                  <p className='text-gray-400 dark:text-gray-100 font-light text-sm'>ID</p>
                  <p
                    className={cn(
                      'font-light text-sm text-gray-300',

                    )}
                  >
                    {detail?.id}
                  </p>
                </div>
                <div className='flex w-full justify-between min-h-10 items-end'>
                  <p className='text-gray-400 dark:text-gray-100 font-light text-sm'>Trading Plan</p>
                  <p className='font-bold text-sm text-gray-300'>
                    {detail?.trading_plan_pair?.[0]?.split('_')[0]}
                  </p>
                </div>
                <div className='flex w-full justify-between min-h-10 items-end'>
                  <p className='text-gray-400 dark:text-gray-100 font-light text-sm'>Status</p>
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
                <div className='flex w-full justify-between min-h-10 items-end'>
                  <p className='text-gray-400 dark:text-gray-100 font-light text-sm'>Created at</p>
                  <p className='dark:text-gray-100 font-light text-sm'>
                    {moment
                      .unix(detail?.createdAt?.seconds)
                      .format('HH:mm DD MMMM YYYY')}
                  </p>
                </div>
                {/* <div className='flex w-full justify-between min-h-10 items-end'>
                  <p className='text-gray-400 dark:text-gray-100 font-light text-sm'>
                    Last updated
                  </p>
                  <p className='dark:text-gray-100 font-light text-sm'>
                    {moment
                      .unix(detail?.lastUpdated?.seconds)
                      .format('HH:mm DD MMMM YYYY')}
                  </p>
                </div> */}
                <div className='flex w-full justify-between min-h-10 items-end'>
                  <p className='text-gray-400 dark:text-gray-100 font-light text-sm'>Exchange</p>
                  <div className='flex'>
                    <img
                      alt={'exchange'}
                      src={
                        detail?.exchange_name === 'GATE'
                          ? 'https://static.airpackapp.com/fe-next/homepage/prod/_next/static/media/open_sesame_night.47e06968.png?w=750&q=75'
                          : detail?.exchange_thumbnail
                      }
                      className='w-[5rem] object-contain'
                    />
                    {detail?.exchange_external_id &&
                      <p className='ml-1 text-gray-400 dark:text-gray-100 font-light text-sm'>({detail?.exchange_external_id})</p>
                    }
                  </div>

                </div>
                <div className='flex w-full justify-between min-h-10 items-end'>
                  <p className='text-gray-400 dark:text-gray-100 font-light text-sm'>
                    Trade amount
                  </p>
                  <p className='dark:text-gray-100 font-light text-sm'>
                    USD {detail?.tradeAmount}
                  </p>
                </div>

                <div className='flex w-full justify-between min-h-10 items-end'>
                  <p className='text-gray-400 dark:text-gray-100 font-light text-sm'>
                    Pairs: {detail?.trading_plan_pair?.length}
                  </p>
                  <div className='flex flex-col justify-center'>
                    {detail?.trading_plan_pair?.map((x, i) => (
                      <div key={i} className='flex gap-2 items-center'>
                        <p className='dark:text-gray-100 font-light text-sm'>
                          {x?.split('_')?.shift()}
                        </p>
                        <p className='dark:text-gray-100 font-light text-sm'>
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
              <div className='mt-10 flex flex-col gap-2'>
                <h1 className='text-2xl text-gray-700 dark:text-gray-200 font-bold'>Start / stop autotrader</h1>
                <div className='flex gap-2 flex-col lg:flex-row'>
                  <button
                    onClick={() => handleStartStop('start')}
                    disabled={
                      detail?.status === 'ACTIVE' ||
                        detail?.status === 'REQUESTED'
                        ? true
                        : loading
                    }
                    className={cn(
                      'flex items-center w-full justify-center flex-wrap-nowrap gap-2 px-4 py-2 rounded-xl border border-neutral-600 text-white ',
                      (
                        detail?.status === 'ACTIVE' ||
                          detail?.status === 'REQUESTED'
                          ? true
                          : loading
                      )
                        ? 'cursor-not-allowed bg-gray-600'
                        : 'cursor-pointer bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-500 transition duration-200'
                    )}
                  >
                    {loading ? (
                      <Spinner />
                    ) : (
                      <>
                        <FaBoltLightning />
                        <p className='whitespace-nowrap'>Start autotrader</p>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleStartStop('stop')}
                    disabled={loading || detail?.status === 'STOPPED'}
                    className={cn(
                      'flex items-center w-full justify-center flex-wrap-nowrap gap-2 px-4 py-2 rounded-xl border border-neutral-600 text-white',
                      loading || detail?.status === 'STOPPED'
                        ? 'cursor-not-allowed  bg-gray-600'
                        : 'cursor-pointer bg-red-600 hover:bg-red-700 active:bg-red-500 transition duration-200'
                    )}
                  >
                    {loading ? (
                      <Spinner />
                    ) : (
                      <>
                        <IoMdClose />
                        <p className='whitespace-nowrap'>Stop autotrader</p>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='block'>
            <ForceActionComponent detail={detail} />
            <DeleteAutotraderComponent detail={detail} setOpenModal={setOpenModal} />
          </div>
        </div>
        {/* <div className='flex flex-col gap-2 w-full overflow-scroll'> */}
        <TradeHistoryTable
          conditions={[
            {
              field: 'autotrader_id',
              operator: '==',
              value: String(detail.id) || null,
            },
          ]}
        />
        {/* </div> */}
      </Modal>
    </>
  );
}

ModalDetailAutotrader.propTypes = {
  detail: PropTypes.object,
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.any,
  loading: PropTypes.bool,
  setDetail: PropTypes.any,
};
