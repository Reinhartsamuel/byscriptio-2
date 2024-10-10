'use client';

import React, { useEffect, useState } from 'react';
import Spinner from './ui/Spinner';
import moment from 'moment';
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import PairImageComponent from './ui/PairImageComponent';

const SignalPreviewComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, 'webhooks'),
      orderBy('createdAt', 'desc'),
      where('trading_plan_name', '!=', 'TESTING 3'),
      limit(10)
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const array = [];
        querySnapshot.forEach((doc) => {
          array.push({ id: doc?.id, ...doc?.data() });
        });
        setData(array);
        setLoading(false);
      },
      (error) => {
        console.log(error.message, '::::error onsnapshot');
        setErrorMsg(error.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className='w-full flex justify-center items-center'>
        <Spinner />
      </div>
    );
  if (errorMsg) return <p>Error! ::: {errorMsg}</p>;

  return (
    <>
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full xl:w-3/5 text-xs text-left text-gray-500 dark:text-gray-400 mx-auto'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th scope='col' className='px-2 py-1'>
                Pair
              </th>
              <th scope='col' className='px-2 py-1'>
                Trading Plan
              </th>
              <th scope='col' className='px-2 py-1'>
                Price
              </th>
              <th scope='col' className='px-2 py-1'>
                Timestamp
              </th>
              <th scope='col' className='px-2 py-1'>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((x, i) => (
              <tr
                className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'
                key={i}
              >
                <th
                  scope='row'
                  className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                >
                  <div className='inline-block items-center justify-center gap-2'>
                    <PairImageComponent pair={x?.pair} width={8} />
                    <p>{x?.pair}</p>
                  </div>
                </th>
                <td className='px-6 py-4'>
                  {x?.trading_plan_id?.split('_')[0]}
                </td>
                <td className='px-6 py-4'>${x?.price}</td>
                <td className='px-6 py-4'>
                  {moment
                    .unix(x?.createdAt?.seconds)
                    ?.format('DD MMM YYYY HH:mm:ss')}
                </td>
                <td className='px-6 py-4'>
                  <p
                    className={`text-center text-xl font-bold ${
                      x?.action === 'close_at_market_price'
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}
                  >
                    {x?.action === 'close_at_market_price' ? 'SELL' : 'BUY'}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SignalPreviewComponent;
