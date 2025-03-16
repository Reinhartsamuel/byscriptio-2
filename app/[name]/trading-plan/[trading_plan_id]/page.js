'use client';
import BackButton from '@/app/components/ui/BackButton';
import { getCollectionFirebase } from '@/app/utils/firebaseApi';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import extractObjectArray from '@/app/utils/extractObjectArray';
import EquityGrowthChart from './backtest/EquityGrowthChart';
import Spinner from '@/app/components/ui/Spinner';
import PropTypes from 'prop-types';
import * as XLSX from 'xlsx';
import moment from 'moment';

//THIS IS BACKTEST PAGE
const BacktestPage = ({ params }) => {
  const searchParams = useSearchParams();
  const pair = searchParams.get('pair');
  const [backtest, setBacktest] = useState([]);
  const [tradesData, setTradesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [headers, setHeaders] = useState([]);

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

  const processExcelFile = async (url) => {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();

      // Parse Excel data
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetsData = {};

      // Iterate through all sheets
      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          raw: false,
          cellDates: true
        });
        sheetsData[sheetName] = jsonData;
      });

      // Assuming 'List of trades' is the sheet name containing the trades data
      setTradesData(extractObjectArray(sheetsData['List of trades']));
      setHeaders(sheetsData['List of trades'][0]);
    } catch (error) {
      console.error('Error processing Excel file:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (backtest?.length > 0 && backtest[0]?.url) {
      const fileUrl = backtest[0].url;

      // Extract extension using regex, matching the last .ext before any query params
      const extensionMatch = fileUrl.match(/\.([^./?#]+)(?:[?#]|$)/i);
      const fileExtension = extensionMatch ? extensionMatch[1].toLowerCase() : '';

      if (!fileExtension) {
        console.error('No file extension found in URL:', fileUrl);
        return;
      }

      if (['xls', 'xlsx'].includes(fileExtension)) {
        processExcelFile(fileUrl);
      } else if (fileExtension === 'csv') {
        Papa.parse(fileUrl, {
          download: true,
          delimiter: ',',
          complete: function (results) {
            setTradesData(extractObjectArray(results.data));
            setHeaders(results.data[0]);
          },
        });
      } else {
        alert('Unsupported file format: ' + fileExtension);
      }
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
      <div className='flex gap-2 mx-4 lg:mx-20'>
        {/* <BackButton /> */}
        <div className='block'>
          <p className='text-2xl font-bold text-white'>Trading plan id : {params.trading_plan_id}</p>
          <p className='text-md text-gray-100 font-bold underline'>{pair}</p>
          {backtest[0]?.createdAt &&
            <p className='text-md text-gray-100'>
              Last Updated: {moment.unix(backtest[0]?.createdAt.seconds).fromNow()}
            </p>
          }
        </div>
      </div>
      <div className='w-full flex justify-center items-center'>
        <div className='w-full lg:w-3/4 mx-auto'>
          {Array.isArray(tradesData) && tradesData?.length > 0 && (
            <EquityGrowthChart tradesData={tradesData} headers={headers} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BacktestPage;

BacktestPage.propTypes = {
  params: PropTypes.any
}
