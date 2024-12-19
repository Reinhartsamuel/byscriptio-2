'use client';
import BackButton from '@/app/components/ui/BackButton';
import { getCollectionFirebase } from '@/app/utils/firebaseApi';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import extractObjectArray from '@/app/utils/extractObjectArray';
import EquityGrowthChart from './backtest/EquityGrowthChart';
import Spinner from '@/app/components/ui/Spinner';

//THIS IS BACKTEST PAGE
const BacktestPage = ({ params }) => {
  const searchParams = useSearchParams();
  const pair = searchParams.get('pair');
  const [backtest, setBacktest] = useState([]);
  const [tradesData, setTradesData] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await getCollectionFirebase('backtest', [
        {
          field: 'trading_plan_pair',
          operator: '==',
          value: params?.trading_plan_id + '_' + pair,
        },
      ]);
      setBacktest(res);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (backtest?.length > 0) {
      Papa.parse(backtest[0]?.url, {
        download: true,
        delimiter: ',',
        complete: function (results) {
          setTradesData(extractObjectArray(results.data).sort((a, b) => Number(a['Trade #']) -Number(b['Trade #'])));
          // console.log(extractObjectArray(results.data).sort((a, b) => Number(a['Trade #']) -Number(b['Trade #'])), 'sourceeeee');
        },
      });
    }
  }, [backtest]);

  if (loading)
    return (
      <div className='w-full h-screen flex justify-center items-center'>
        <Spinner />
      </div>
    );

  return (
    <div className='w-full min-h-screen'>
      <div className='flex gap-2 '>
        <BackButton />
        <div className='block'>
          <p>Trading plan id : {params.trading_plan_id}</p>
          <p>Pair : {pair}</p>
        </div>
      </div>
      <div className='w-full lg:w-3/4 mx-auto'>
        {Array.isArray(tradesData) && tradesData?.length > 0 && (
          <EquityGrowthChart tradesData={tradesData} />
        )}
      </div>
    </div>
  );
};

export default BacktestPage;
