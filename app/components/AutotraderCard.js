/* eslint-disable react/prop-types */
'use client'
import { cn } from '@/lib/util';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { RiRobot2Fill } from 'react-icons/ri';
import PairImageComponent from './ui/PairImageComponent';
import { getCollectionFirebase } from '@/app/utils/firebaseApi';

const AutotraderCard = ({ data, handleDetail }) => {
    const [hasActiveTrades, setHasActiveTrades] = useState(false);

    useEffect(() => {
        const checkActiveTrades = async () => {
            if (data?.status === 'ACTIVE' && data?.bot_id) {
                try {
                    const trades = await getCollectionFirebase('3commas_logs', [
                        {
                            field: 'bot_id',
                            operator: '==',
                            value: String(data.bot_id)
                        }
                    ]);
                    setHasActiveTrades(trades.length > 0);
                } catch (error) {
                    console.error('Error checking active trades:', error);
                }
            }
        };

        checkActiveTrades();
    }, [data?.bot_id, data?.status]);

    return (
        <div
            className='w-full rounded-lg bg-gray-200 dark:bg-gray-800 p-4 shadow-md font-sans flex flex-col gap-4 ease-out duration-100 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer'
            onClick={() => handleDetail(data)}
        >
            <div className='flex w-full justify-between'>
                <div className='flex flex-col'>
                    <h4 className='uppercase font-extrabold text-sm text-gray-800 dark:text-slate-200'>
                        {data?.autotrader_name ||
                            moment
                                .unix(data?.createdAt?.seconds)
                                .format('YYYY-MM-DD') +
                            '-' +
                            data?.createdAt?.seconds}
                    </h4>
                </div>
                <p className='text-gray-900 dark:text-slate-200 text-[0.75rem] font-light'>
                    {moment.unix(data?.createdAt.seconds).fromNow()}
                </p>
            </div>
            <div className='w-full flex justify-between items-center rounded-xl bg-slate-100 dark:bg-slate-600 p-2 '>
                <div className='flex gap-1 items-center'>
                    <RiRobot2Fill size={20} color='dark:white red' />
                    <p className='text-gray-900 dark:text-slate-200 text-[1rem]'>
                        Status :{' '}
                        <span
                            className={cn(
                                'font-bold',
                                data?.status === 'ACTIVE'
                                    ? 'text-green-500'
                                    : data?.status === 'STOPPED'
                                        ? 'text-red-500'
                                        : data?.status === 'REQUESTED'
                                            ? 'text-orange-500'
                                            : 'text-red-100'
                            )}
                        >
                            {data?.status || '-'}
                        </span>
                    </p>
                </div>
                <p>{data?.trading_plan_pair?.length || 0} pairs</p>
            </div>
            <div className='flex w-full justify-between'>
                <img
                    alt={'exchange'}
                    src={
                        data?.exchange_name === 'GATE'
                            ? 'https://static.airpackapp.com/fe-next/homepage/prod/_next/static/media/open_sesame_night.47e06968.png?w=750&q=75'
                            : data?.exchange_thumbnail
                    }
                    className='w-[5rem] object-contain'
                />

                {data?.trading_plan_pair?.length === 1 ? (
                    <PairImageComponent
                        pair={data?.trading_plan_pair[0]
                            ?.split('_')
                            ?.slice(1)
                            ?.join('_')}
                    />
                ) : (
                    <p className='uppercase text-gray-200'>
                        {data?.trading_plan_pair?.length || 0} pairs
                    </p>
                )}
            </div>
            {data?.status === 'ACTIVE' && !hasActiveTrades && (
                <p className='text-orange-300 font-thin text-sm italic text-center'>
                    Waiting for BUY signal
                </p>
            )}
             {data?.status === 'STOPPED' && (
                <p className='text-orange-300 font-thin text-sm italic text-center'>
                   Autotrader is stopped, click here and &apos;Start Autotrader&apos;
                </p>
            )}
        </div>
    )
}

export default AutotraderCard;