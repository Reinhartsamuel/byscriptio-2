// EquityGrowthChart2.jsx
import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import PropTypes from 'prop-types';
import moment from 'moment';
import sortTradesData from '@/app/utils/sortTradesData';
import calculateTradesDataData from '@/app/utils/calcultateTradesData';

const EquityGrowthChart2 = ({ tradesData }) => {
  // REF FOR CHART
  const chartRef = useRef(null);

  // SORT DATA
  const sortedTradesData = sortTradesData(tradesData)


  // STATES
  const [initialCapital, setInitialCapital] = useState(1000);
  const [dateFilter, setDateFilter] = useState({
    startDate: moment(sortedTradesData[0]?.['Date/Time'], 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm'),
    endDate: moment(sortedTradesData[sortedTradesData.length - 1]?.['Date/Time'],'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm'),
  });
  const [tradesDataWithCumulativeCalc, setTradesDataWithCumulativeCalc] =
    useState(calculateTradesDataData({
      tradesData: sortedTradesData,
      dateFilter,
      initialCapital
    }));


  function calculate() {
    console.log(dateFilter);
    const calculatedData = calculateTradesDataData({
      tradesData: sortedTradesData,
      dateFilter,
      initialCapital
    });
    setTradesDataWithCumulativeCalc(calculatedData);
    console.log(calculatedData, 'calculatedData');
  }


  useEffect(() => {

  },[])

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    // console.log(sortedTradesData, 'sortedTradesData');

    // CUMULATIVE PROFIT ===============================================================
    // CUMULATIVE PROFIT ===============================================================
    // CUMULATIVE PROFIT ===============================================================
    const cumulativeProfit = tradesDataWithCumulativeCalc.map((trade) =>
      parseFloat(trade['Cum. Profit USDT'] || trade['Cum. Profit USD'])
    );
    // console.log(cumulativeProfit, 'cumulativeProfit');

    // DRAWDOWN ========================================================================
    // DRAWDOWN ========================================================================
    // DRAWDOWN ========================================================================
    const drawdownData = tradesDataWithCumulativeCalc.map((trade) =>
      parseFloat(trade['Drawdown %'])
    );

    // BUY AND HOLD ====================================================================
    // BUY AND HOLD ====================================================================
    // BUY AND HOLD ====================================================================
    const buyAndHoldEquity = tradesDataWithCumulativeCalc.map(
      (trade) =>
        parseFloat(
          (trade['Price USDT'] || trade['Price USD']) /
            (tradesDataWithCumulativeCalc[0]['Price USDT'] ||
              tradesDataWithCumulativeCalc[0]['Price USD'])
        ) * 100
    );

    // CONSTANTS
    const labels = tradesDataWithCumulativeCalc.map((trade) => trade['Date/Time']);
    const percentageInset = 100;
    const equityGrowthPercentage =
      Array.isArray(cumulativeProfit) && cumulativeProfit?.length > 0
        ? cumulativeProfit.map(
            (profit) => (profit / initialCapital) * 100 + percentageInset
          )
        : [];
    const mixedChart = new Chart(ctx, {
      type: 'bar', // Default type for the main dataset
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Equity Growth (%)',
            data: equityGrowthPercentage,
            type: 'line', // Specify this dataset as a line chart
            borderColor: 'rgba(0, 169, 199, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            fill: true,
          },
          {
            label: 'Buy and Hold (%)',
            data: buyAndHoldEquity,
            type: 'line', // Specify this dataset as a bar chart
            backgroundColor: 'rgba(240, 64, 24, 0.5)',
            borderColor: 'rgba(240, 64, 24, 1)',
            borderWidth: 1,
          },
          {
            label: 'Drawdowns (%)',
            data: drawdownData,
            type: 'bar', // Specify this dataset as a bar chart
            backgroundColor: 'rgba(255, 99, 132, 0.3)',
            borderColor: 'rgba(255, 99, 132, 0.3)',
            borderWidth: 1,
            yAxisID: 'drawdown-y', // Link to the secondary y-axis
          },
        ],
      },
      options: {
        legend: {
          onHover: function (e) {
            e.target.style.cursor = 'pointer';
          },
        },
        hover: {
          onHover: function (e) {
            var point = this.getElementAtEvent(e);
            if (point.length) e.target.style.cursor = 'pointer';
            else e.target.style.cursor = 'default';
          },
        },
        elements: {
          point: {
            radius: 1,
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Equity Growth (%)',
            },
          },
          'drawdown-y': {
            // Secondary y-axis for drawdowns
            type: 'linear',
            position: 'right',
            beginAtZero: false,
            title: {
              display: true,
              text: 'Drawdowns (%)',
            },
            grid: {
              drawOnChartArea: true, // Do not draw grid lines for the secondary axis
            },
            reverse: true, // Reverse the drawdown-y-axis
          },
          x: {
            title: {
              display: true,
              text: 'Date',
            },
            reverse: false, // Reverse the x-axis
          },
        },
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: true,
            text: 'Equity Growth and Drawdowns Chart',
          },
        },
      },
    });

    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      mixedChart.destroy();
    };
  }, [tradesData, initialCapital, dateFilter.startDate, dateFilter.endDate]);

  return (
    <div>
      <canvas ref={chartRef} width='400' height='200'></canvas>
      {/* <pre>{JSON.stringify(equityGrowthPercentage)}</pre> */}
      <div className='grid grid-cols-2 lg:grid-cols-3'>
        <div className='flex flex-col p-2 bg-red-500 items-center justify-center'>
          <p className='text-xl font-bold '>xx</p>
        </div>
        <div className='flex flex-col p-2 bg-green-500 items-center justify-center'>
          <p className='text-xl font-bold '>yy</p>
        </div>
        <div className='flex flex-col p-2 bg-orange-500 items-center justify-center'>
          <p className='text-xl font-bold '>zz</p>
        </div>
      </div>
      <div className='p-4 border-2 border-gray-600 dark:border-gray-500 grid grid-cols-2 lg:grid-cols-3'>
        <div className='flex flex-col gap-4 items-center'>
          <div>
            <label
              htmlFor='date_from'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Date From
            </label>
            <input
              min={moment(
                sortedTradesData[0]?.['Date/Time'],
                'YYYY-MM-DD HH:mm'
              ).format('YYYY-MM-DD')}
              max={moment(
                sortedTradesData[sortedTradesData.length - 1]?.['Date/Time'],
                'YYYY-MM-DD HH:mm'
              ).format('YYYY-MM-DD')}
              type='date'
              id='date_from'
              className='w-[11rem] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder={dateFilter.startDate}
              required
              onChange={(e) =>
                setDateFilter({
                  ...dateFilter,
                  startDate: moment(e.target.value, 'YYYY-MM-DD').format(
                    'YYYY-MM-DD'
                  ),
                })
              }
              value={dateFilter.startDate}
            />
          </div>
          <div>
            <label
              htmlFor='date_to'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Date To
            </label>
            <input
              min={moment(
                sortedTradesData[0]?.['Date/Time'],
                'YYYY-MM-DD HH:mm'
              ).format('YYYY-MM-DD')}
              max={moment(
                sortedTradesData[sortedTradesData.length - 1]?.['Date/Time'],
                'YYYY-MM-DD HH:mm'
              ).format('YYYY-MM-DD')}
              type='date'
              id='date_to'
              className='w-[11rem] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder={dateFilter.endDate}
              required
              onChange={(e) =>
                setDateFilter({
                  ...dateFilter,
                  endDate: moment(e.target.value, 'YYYY-MM-DD').format(
                    'YYYY-MM-DD'
                  ),
                })
              }
              value={dateFilter.endDate}
            />
          </div>
        </div>
        <div className='flex flex-col gap-4 items-center'>
          <div>
            <label
              htmlFor='initial_capital'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Initial Capital (USD)
            </label>
            <input
              onChange={(e) => setInitialCapital(parseFloat(e.target.value))}
              type='number'
              id='initial_capital'
              className='w-[11rem] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder={initialCapital}
              value={initialCapital}
              required
            />
          </div>
          <div>
            <label
              htmlFor='autotrade_period'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Autotrade Period
            </label>
            <input
              // type='text'
              id='autotrade_period'
              className='cursor-not-allowed w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder={moment(dateFilter.endDate).diff(
                moment(dateFilter.startDate),
                'days'
              )}
              value={
                moment(dateFilter.endDate).diff(
                  moment(dateFilter.startDate),
                  'days'
                ) + ' days'
              }
              required
              disabled
            />
          </div>
        </div>
        <div className='flex flex-col gap-4 items-center'>
          <div>
            <label
              htmlFor='bnh_roi'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Buy and Hold ROI (USD)
            </label>
            <input
              type='number'
              id='bnh_roi'
              className='w-[11rem] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='John'
              required
            />
          </div>
          <div>
            <label
              htmlFor='autotrade_roi'
              className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Autotrade ROI (USD)
            </label>
            <input
              type='text'
              id='autotrade_roi'
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='John'
              required
            />
          </div>
        </div>
      </div>
      <button
        onClick={calculate}
        className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      >
        Calculate
      </button>
    </div>
  );
};

export default EquityGrowthChart2;

EquityGrowthChart2.propTypes = {
  tradesData: PropTypes.array.isRequired,
};
