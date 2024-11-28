'use client';
import BackButton from '@/app/components/ui/BackButton';
import { getCollectionFirebase } from '@/app/utils/firebaseApi';
import Chart from 'chart.js/auto';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

const page = ({ params }) => {
  const searchParams = useSearchParams();
  const pair = searchParams.get('pair');

  async function fetchData() {
    try {
      console.log('fetching::::', params?.trading_plan_id + '_' + pair);
      const res = await getCollectionFirebase('backtest', [
        {
          field: 'trading_plan_pair',
          operator: '==',
          value: params?.trading_plan_id + '_' + pair,
        },
      ]);
      console.log(res, 'res');
    } catch (error) {
      console.error(error.message);
    }
  }
  useEffect(() => {
    fetchData();
    const ctx = document.getElementById('myChart');

    const mixedChart = new Chart(ctx, {
      data: {
          datasets: [{
              type: 'bar',
              label: 'Bar Dataset',
              data: [10, 20, 30, 40]
          }, {
              type: 'line',
              label: 'Line Dataset',
              data: [50, 50, 50, 50],
          }],
          labels: ['January', 'February', 'March', 'April']
      },
      // options: options
  });
  }, [params?.trading_plan_id, pair]);
  return (
    <div>
      <div className='flex gap-2 '>
        <BackButton />
        <div className='block'>
          <p>Trading plan id : {params.trading_plan_id}</p>
          <p>Pair : {pair}</p>
        </div>
      </div>
      <div className='w-full lg:w-1/2'>
        <canvas id='myChart'></canvas>
      </div>
    </div>
  );
};

export default page;
