'use client';

import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
  where,
} from 'firebase/firestore';
import { authFirebase, db } from '@/app/config/firebase';
import Spinner from '@/app/components/ui/Spinner';
import PairImageComponent from '@/app/components/ui/PairImageComponent';
import PropTypes from 'prop-types';

const TradeHistoryTable = (props) => {
  const { collectionName = '3commas_logs', conditions = [] } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let unsubscribe = () => {};
    if (authFirebase.currentUser?.email) {
      // console.count(authFirebase.currentUser?.email);
      setLoading(true);
      let q = query(
        collection(db, collectionName),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      conditions.forEach((cond) => {
        q = query(q, where(cond.field, cond.operator, cond.value));
      });

      unsubscribe = onSnapshot(
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
          console.log(error, ' errrrrr');
          setErrorMsg(error.message);
          setLoading(false);
        }
      );

      setLoading(false);
    }

    return () => unsubscribe();
  }, [conditions]);

  if (loading)
    return (
      <div className='w-full flex justify-center items-center'>
        <Spinner />
      </div>
    );
  if (errorMsg) return <p>Error! ::: {errorMsg}</p>;

  return (
    <>
      <div className='p-2 lg:px-4 bg-gray-800 rounded'>
        <div className='max-h-96 overflow-scroll'>
          <table className='w-full overflow-scroll text-xs text-left text-gray-500 dark:text-gray-400 mx-auto'>
            <thead className='top-0 right-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope='col' className='px-2 py-1 text-xs'>
                  Pair
                </th>
                <th scope='col' className='px-2 py-1 text-xs'>
                  Trading Plan
                </th>
                <th scope='col' className='px-2 py-1 text-xs'>
                  Action
                </th>
                <th scope='col' className='px-2 py-1 text-xs'>
                  Price
                </th>
                <th scope='col' className='px-2 py-1 text-xs'>
                  Timestamp
                </th>
                <th scope='col' className='px-2 py-1 text-xs'>
                  Autotrader
                </th>
                <th scope='col' className='px-2 py-1 text-xs'>
                  Exchange
                </th>
                {/* <th scope='col' className='px-2 py-1 text-xs'>
                  id
                </th> */}
              </tr>
            </thead>
            <tbody>
              {data?.map((x, i) => {
                const action = () => {
                  if (x?.type === 'autotrade') {
                    return x?.requestBody &&
                      JSON.parse(x?.requestBody)?.action ===
                        'close_at_market_price'
                      ? 'SELL'
                      : 'BUY';
                  } else if (x?.type === 'force_entry') {
                    return 'FORCE BUY';
                  } else if (x?.type === 'force_exit') {
                    return 'FORCE SELL';
                  }
                };
                const actionColor = () => {
                  if (x?.type === 'autotrade') {
                    return x?.requestBody &&
                      JSON.parse(x?.requestBody)?.action ===
                        'close_at_market_price'
                      ? 'text-red-600'
                      : 'text-green-600';
                  } else if (x?.type === 'force_entry') {
                    return 'text-green-600';
                  } else if (x?.type === 'force_exit') {
                    return 'text-red-600';
                  }
                };
                return (
                  <tr
                    className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'
                    key={i}
                  >
                    <td
                      scope='row'
                      className='px-2 py-1 text-xs font-medium text-gray-900 whitespace-nowrap dark:text-gray-300'
                    >
                      <div className='inline-block items-center justify-center gap-2'>
                        <PairImageComponent pair={x?.pair} width={8} />
                        <p>{x?.pair}</p>
                      </div>
                    </td>
                    <td className='px-2 py-1 text-xs'>
                      {x?.trading_plan_id?.split('_')[0]}
                    </td>
                    <td className='px-2 py-1 text-xs whitespace-nowrap'>
                      <p
                        className={`text-center text-md font-bold ${actionColor()}`}
                      >
                        {action()}
                      </p>
                    </td>
                    <td className='px-2 py-1 text-xs'>
                      $
                      {x?.requestBody ? JSON.parse(x?.requestBody)?.price : '-'}
                    </td>
                    <td className='px-2 py-1 text-xs whitespace-nowrap'>
                      <div className=' flex flex-col justify-center'>
                        <p>
                          {moment
                            .unix(x?.createdAt?.seconds)
                            ?.format('DD MMM YYYY HH:mm:ss')}
                        </p>
                        <p>{moment.unix(x?.createdAt?.seconds).fromNow()}</p>
                      </div>
                    </td>
                    <td>{x?.autotrader_name}</td>
                    <td>
                      {' '}
                      <img
                        alt={'exchange'}
                        src={
                          x?.exchange_name === 'GATE'
                            ? 'https://static.airpackapp.com/fe-next/homepage/prod/_next/static/media/open_sesame_night.47e06968.png?w=750&q=75'
                            : x?.exchange_thumbnail
                        }
                        className='w-[5rem] object-contain'
                      />
                    </td>
                    {/* <td className='px-2 py-1 text-xs'>
                      <p className='text-xs'>{x?.id}</p>
                    </td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TradeHistoryTable;

TradeHistoryTable.propTypes = {
  bot_id: PropTypes.string,
  trading_plan_pair: PropTypes.string,
  collectionName: PropTypes.string,
  conditions: PropTypes.array,
};
