"use client";
// Add this import at the top
import { useMemo } from 'react';
import BackButton from "@/app/components/ui/BackButton";
import { getCollectionFirebase } from "@/app/utils/firebaseApi";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import Papa from "papaparse";
import extractObjectArray from "@/app/utils/extractObjectArray";
import EquityGrowthChart from "./backtest/EquityGrowthChart";
import Spinner from "@/app/components/ui/Spinner";
import PropTypes from "prop-types";
import * as XLSX from "xlsx";
import moment from "moment";
import Chart from 'chart.js/auto';
import RadarChart from './backtest/RadarChart';
import useSumField from '@/app/hooks/SumFieldHook';
import useCountDocuments from '@/app/hooks/CountHook';

//THIS IS BACKTEST PAGE
const BacktestPage = ({ params }) => {
  const searchParams = useSearchParams();
  const pair = searchParams.get("pair");
  const [backtest, setBacktest] = useState([]);
  const [tradesData, setTradesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [headers, setHeaders] = useState([]);
  const chartRef = useRef(null);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await getCollectionFirebase("backtest", [
        {
          field: "trading_plan_pair",
          operator: "==",
          value: params.trading_plan_id,
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
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetsData = {};

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          raw: false,
          cellDates: true,
        });
        sheetsData[sheetName] = jsonData;
      });

      setTradesData(extractObjectArray(sheetsData["List of trades"]));
      setHeaders(sheetsData["List of trades"][0]);
    } catch (error) {
      console.error("Error processing Excel file:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (backtest?.length > 0 && backtest[0]?.url) {
      const fileUrl = backtest[0].url;
      const extensionMatch = fileUrl.match(/\.([^./?#]+)(?:[?#]|$)/i);
      const fileExtension = extensionMatch
        ? extensionMatch[1].toLowerCase()
        : "";

      if (!fileExtension) {
        console.error("No file extension found in URL:", fileUrl);
        return;
      }

      if (["xls", "xlsx"].includes(fileExtension)) {
        processExcelFile(fileUrl);
      } else if (fileExtension === "csv") {
        Papa.parse(fileUrl, {
          download: true,
          delimiter: ",",
          complete: function (results) {
            setTradesData(extractObjectArray(results.data));
            setHeaders(results.data[0]);
          },
        });
      } else {
        alert("Unsupported file format: " + fileExtension);
      }
    }
  }, [backtest]);



  // Inside the component, replace the chart-related useEffect with this:
  useMemo(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      const radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Win Rate (%)', 'Max Drawdown (%)', 'Profit (USD)', 'Loss (USD)'],
          datasets: [{
            data: [
              parseFloat(backtest[0]?.metrics.winRate),
              backtest[0]?.metrics.maxDrawdown,
              parseFloat(backtest[0]?.metrics.pnlUsd),
              parseFloat(backtest[0]?.metrics.averageLoss)
            ],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(255, 255, 255, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: {
                display: true
              },
              suggestedMin: 0,
              suggestedMax: 100
            }
          }
        }
      });

      console.log('Chart initialized:', radarChart);
    }
  }, []); // Empty dependency array ensures this runs only once



  if (loading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );

  return (
    <div className="w-full min-h-screen">
      <div className="flex items-start gap-2 mt-4 mx-4 lg:mx-20">
        <BackButton className="mt-3" />
        <div className="block">
          <p className="text-2xl font-bold text-white" onClick={() => console.log(backtest[0])}>
            Trading plan: {params.trading_plan_id}
          </p>
          <p className="text-md text-gray-100 font-bold underline">{pair}</p>
          {backtest[0]?.createdAt && (
            <p className="text-md text-gray-100">
              Last Updated:{" "}
              {moment.unix(backtest[0]?.createdAt.seconds).fromNow()}
            </p>
          )}
        </div>
      </div>
      <div className="w-full flex flex-col lg:flex-row mt-10 gap-2 lg:mx-4 justify-center items-start">
        <AutoGoldMinerCard data={backtest[0]} tradesData={tradesData} />
        <div className="p-5 w-full rounded-md lg:w-2/3">
          {Array.isArray(tradesData) && tradesData?.length > 0 && (
            <EquityGrowthChart tradesData={tradesData} headers={headers} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BacktestPage;
const AutoGoldMinerCard = ({ data, tradesData }) => {
  const { sum, loading: loadingSum, error: errorSum } = useSumField({
    collectionName: 'dca_bots',
    fieldToSum: 'tradeAmount',
    conditions: [{ field: 'trading_plan_pair', operator: 'array-contains', value: data?.trading_plan_pair || '-' }],
    dependencies: [] // Re-fetch when userId changes
  });

  const { count, loading: loadingCount } = useCountDocuments({
    collectionName: "dca_bots",
    conditions: [{ field: 'trading_plan_pair', operator: 'array-contains', value: data?.trading_plan_pair || '-' }],
  });


  return (
    <div className="bg-gray-800 text-white w-full lg:w-1/3 rounded-lg shadow-md p-4 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-xl font-bold">{data?.trading_plan_pair}</h2>
        </div>
      </div>
      {/* Radar Chart */}
      <div className="mt-4">
        <RadarChart data={backtest[0]?.metrics} key={backtest[0]?.id} />
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <p className="text-sm text-gray-400" onClick={() => console.log(tradesData[0])}>Active Since</p>
          <p className="text-base">{moment(tradesData[tradesData.length - 1]?.['Date/Time'], 'YYYY-MM-DD HH:mm').format('D, MMM YYYY')}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Active Autotrader</p>
          {loadingCount ? <Spinner /> : <p className="text-base">{count}</p>}

        </div>
        <div>
          <p className="text-sm text-gray-400">Remaining Quota</p>
          <p className="text-base">{data?.remainingQuota || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Total Amount Autotrade</p>
          {loadingSum ? <Spinner /> : <p className="text-base">USD {sum}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-lg font-bold mb-2">Description</h3>
        <p className="text-sm mb-2">{data?.description || 'No description'}</p>
      </div>
      {/* <button
        type="button"
        className="w-full focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
        Subscribe Signal
      </button> */}

    </div>
  );
};

BacktestPage.propTypes = {
  params: PropTypes.any,
};
