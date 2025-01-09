// EquityGrowthChart.jsx
import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import PropTypes from 'prop-types';
import moment from 'moment';
import sortTradesData from '@/app/utils/sortTradesData';
import calculateTradesDataData from '@/app/utils/calcultateTradesData';
import useBreakPointValue from '@/app/hooks/responsiveHook';


const EquityGrowthChart = ({ tradesData, headers }) => {
  const { isMobile, isTablet, isDesktop } = useBreakPointValue()
  // REF FOR CHART
  const chartRef = useRef(null);

  // SORT DATA
  const sortedTradesData = sortTradesData(tradesData);


  // STATES
  const [initialCapital, setInitialCapital] = useState(1000);
  const [dateFilter, setDateFilter] = useState({
    startDate: moment(
      sortedTradesData[0]?.['Date/Time'],
      'YYYY-MM-DD HH:mm'
    ).format('YYYY-MM-DD HH:mm'),
    endDate: moment(
      sortedTradesData[sortedTradesData.length - 1]?.['Date/Time'],
      'YYYY-MM-DD HH:mm'
    ).format('YYYY-MM-DD HH:mm'),
  });
  const [tradesDataWithCumulativeCalc, setTradesDataWithCumulativeCalc] =
    useState(
      calculateTradesDataData({
        tradesData: sortedTradesData,
        dateFilter,
        initialCapital,
      })
    );

  function calculate() {
    // console.log(dateFilter);
    const calculatedData = calculateTradesDataData({
      tradesData: sortedTradesData,
      dateFilter,
      initialCapital,
    });
    setTradesDataWithCumulativeCalc(
      calculatedData.sort((a, b) => a.timestamp - b.timestamp)
    );
  }

  useEffect(() => {
    calculate();
  }, []);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    // console.log(sortedTradesData, 'sortedTradesData');

    // CUMULATIVE PROFIT ===============================================================
    // CUMULATIVE PROFIT ===============================================================
    // CUMULATIVE PROFIT ===============================================================
    const cumulativeProfit = tradesDataWithCumulativeCalc
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((trade) => parseFloat(trade.currentBalance));
    // console.log(cumulativeProfit, 'cumulativeProfit');

    // DRAWDOWN ========================================================================
    // DRAWDOWN ========================================================================
    // DRAWDOWN ========================================================================
    const drawdownData = tradesDataWithCumulativeCalc
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((trade) => parseFloat(trade['Drawdown %']));

    // CONSTANTS
    const labels = tradesDataWithCumulativeCalc
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((trade) =>
        moment(trade['Date/Time'], 'YYYY-MM-DD HH:mm').format('DD MMM YYYY')
      );

    const mixedChart = new Chart(ctx, {
      type: 'bar', // Default type for the main dataset
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Equity Growth (USD)',
            data: cumulativeProfit,
            type: 'line', // Specify this dataset as a line chart
            borderColor: 'rgba(0, 169, 199, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            fill: true,
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
            position: 'left', // Position the y-axis on the left
            ticks: {
              padding: -60, // Adjust padding to move ticks inside
              callback: function(value) {
                return value; // Customize tick labels if needed
              },
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
            ticks : {
              padding : 10
            }
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
  }, [tradesData, tradesDataWithCumulativeCalc]);

  return (
    <div>
      <canvas ref={chartRef}></canvas>
      {/* <pre>{JSON.stringify(equityGrowthPercentage)}</pre> */}
      <div className='border-2'>
        <div className='grid grid-cols-2 lg:grid-cols-4'>
          <div className='flex flex-col p-2 bg-[#5ce1e6] items-center justify-center'>
            <p className='text-black text-sm'>PnL</p>
            <p className='text-gray-800 text-xl font-bold '>
              {(
                (tradesDataWithCumulativeCalc[
                  tradesDataWithCumulativeCalc.length - 1
                ]?.currentBalance /
                  tradesDataWithCumulativeCalc[0]?.currentBalance) *
                100
              )?.toFixed(2)}
              %
            </p>
          </div>
          <div className='flex flex-col p-2 bg-[#0097b2] items-center justify-center'>
            <p className='text-black text-sm'>Win Rate</p>
            <p className='text-gray-800 text-xl font-bold '>
              {(
                (tradesDataWithCumulativeCalc?.filter(
                  (trade) => trade?.['Profit %'] > 0
                ).length /
                  tradesDataWithCumulativeCalc.length) *
                100
              )?.toFixed(2)}{' '}
              %
            </p>
          </div>
          <div className='flex flex-col p-2 bg-red-400 items-center justify-center'>
            <p className='text-black text-sm'>Drawdown</p>
            <p className='text-gray-800 text-xl font-bold '>
              -
              {
                tradesDataWithCumulativeCalc.sort(
                  (a, b) => b['Drawdown %'] - a['Drawdown %']
                )[0]?.['Drawdown %']
              }
              %
            </p>
          </div>
          <div className='flex flex-col p-2 bg-[#cdedff] items-center justify-center'>
            <p className='text-black text-sm'>Total Trades</p>
            <p className='text-gray-800 text-xl font-bold '>
              {tradesDataWithCumulativeCalc?.length}
            </p>
          </div>
        </div>
        {/* <div className='flex flex-col lg:flex-col mx-auto gap-2 w-full items-center justify-center 
        justify-evenly pb-5 pt-5'> */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-2 p-2'>
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
              className='w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
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
              className='w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
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
              className='w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
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
        <button
          onClick={calculate}
          className='w-full bg-[#e0d0ff] hover:bg-blue-300 text-black font-bold py-2 px-4'
        >
          Calculate
        </button>
      </div>
      <div className='overflow-x-auto overflow-y-auto mt-10'>
        <table className='w-full xl:w-3/5 text-xs text-left text-gray-500 dark:text-gray-400 mx-auto'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              {headers?.map((header, index) => (
                <th key={index} scope='col' className='px-2 py-1'>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {tradesData.reverse()?.map((row, rowIndex) => (
              <tr key={rowIndex} className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'>
                {headers?.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className='px-6 py-2 whitespace-nowrap'
                  >
                    {row[column]}
                  </td>
                ))}
                {/* <td   className='px-6 py-2 whitespace-nowrap'>{row['Trade #']}</td>
                <td   className='px-6 py-2 whitespace-nowrap'>{row['Signal']}</td>
                <td   className='px-6 py-2 whitespace-nowrap'>{row['Date/Time']}</td>
                <td   className='px-6 py-2 whitespace-nowrap'>{row['Price']}</td>
                <td   className='px-6 py-2 whitespace-nowrap'>{row['Contracts']}</td>
                <td   className='px-6 py-2 whitespace-nowrap'>{row['Profit USD']}</td>
                <td   className='px-6 py-2 whitespace-nowrap'>{row['Profit %']}</td>
                <td   className='px-6 py-2 whitespace-nowrap'>{row['Cum. Profit %']}</td>
                <td   className='px-6 py-2 whitespace-nowrap'>{row['Run-up USD']}</td>
                <td   className='px-6 py-2 whitespace-nowrap'>{row['Run-up %']}</td>
                <td   className='px-6 py-2 whitespace-nowrap'>{row['Drawdown USD']}</td>
                <td   className='px-6 py-2 whitespace-nowrap'>{row['Drawdown %']}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EquityGrowthChart;

EquityGrowthChart.propTypes = {
  tradesData: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
};
