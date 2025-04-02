/* eslint-disable react/prop-types */
'use client'
import { cn } from '@/lib/util';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { RiRobot2Fill } from 'react-icons/ri';
import PairImageComponent from './ui/PairImageComponent';
import { countDocumentsFirebase, getCollectionFirebase } from '@/app/utils/firebaseApi';


async function getActiveTrades(botData) {
    const resultPromise = await Promise.allSettled(
        botData.trading_plan_pair?.map(async (pair) => {
            // console.log(pair.split('_')[1], " pair.split('_')[1]")
            // search for history of trades in 3commas_logs 
            return await countDocumentsFirebase('3commas_logs', [
                {
                    field: 'bot_id',
                    operator: '==',
                    value: String(botData.bot_id)
                },
                {
                    field: 'pair',
                    operator: '==',
                    value: pair.split('_')[1] + '_' + pair.split('_')[2]
                },
            ])
        })
    )
    // console.log(resultPromise, 'resultPromise')
    // console.log(botData.trading_plan_pair.length,'botData.trading_plan_pair.length')
    return {
        pairLength: botData.trading_plan_pair.length,
        hasHistoryTrades: resultPromise.filter((x) => x.value > 0).length,
        waitingForBuyTrades: resultPromise.filter((x) => x.value === 0).length
    }
}


const AutotraderCard = ({ data, handleDetail }) => {
    const [hasActiveTrades, setHasActiveTrades] = useState(false);
    const [activeTrades, setActiveTrades] = useState({
        pairLength: 0,
        hasHistoryTrades: 0,
        waitingForBuyTrades: 0
    });

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
                    ],
                    {field : 'createdAt', direction : 'desc'},
                    1
                );
                // console.log(trades, 'checktrades')
                    setHasActiveTrades(trades.length > 0);
                } catch (error) {
                    console.error('Error checking active trades:', error);
                }

                const checkActiveTrades = await getActiveTrades(data);
                // console.log(checkActiveTrades, 'checkActiveTrades')
                setActiveTrades(checkActiveTrades);
            }
        };

        checkActiveTrades();
    }, [data?.bot_id, data?.status]);

    return (
        <div
            className='w-full rounded-lg bg-gray-200 dark:bg-gray-800 p-4 shadow-md font-sans flex flex-col gap-1 ease-out duration-100 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer'
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
                    <p className='text-slate-200 text-[1rem]'>
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
                <div className='flex gap-1'>
                    <p className='text-slate-200 text-[1rem]'>{data?.trading_plan_pair?.length || 0} pairs</p>
                    <p className='text-slate-200'>{data?.trading_plan_pair?.[0].split('_')[0]}</p>
                </div>
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
            <div className='mt-0'>
                {data?.status === 'ACTIVE' && !hasActiveTrades && (
                    <div className='flex gap-1 items-center'>
                        <p className='text-orange-300 font-thin text-sm italic text-center'>
                            Waiting for BUY signal
                        </p> 
                        <p className='text-green-600 text-center'>{activeTrades.hasHistoryTrades}/{activeTrades.pairLength}</p>
                    </div>
                )}
                {data?.status === 'STOPPED' && (
                    <p className='text-orange-300 font-thin text-sm italic text-center'>
                        Autotrader is stopped, click here and &apos;Start Autotrader&apos;
                    </p>
                )}
            </div>


        </div>
    )
}

export default AutotraderCard;