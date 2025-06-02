'use client';
import { IoEyeOutline } from "react-icons/io5";

import React, { useState } from 'react';
import moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import Spinner from '@/app/components/ui/Spinner';
import PairImageComponent from '@/app/components/ui/PairImageComponent';
import PropTypes from 'prop-types';
import useFetchData from '@/app/hooks/QueryHook';
import useCountDocuments from '@/app/hooks/CountHook';
import { cn } from '@/lib/util';
import Modal from '@/app/components/ui/Modal';
import { authFirebase } from '@/app/config/firebase';

const TradeHistoryTable = (props) => {
  const {
    collectionName = '3commas_logs',
    conditions = [],
    showPair = true,
    showAutotrader = true,
    showExchange = true,
  } = props;

  const { data, loadMore, loading, error } = useFetchData({
    collectionName,
    conditions,
    authRequired: true,
    dependencies: [conditions],
    type: 'getDocs',
    limitQuery: 20,
  })
  const { count } = useCountDocuments({
    collectionName,
    conditions,
    authRequired: true,
    dependencies: [conditions]
  })
  if (loading)
    return (
      <div className='w-full flex justify-center items-center'>
        <Spinner />
      </div>
    );
  if (error) return <p>Error! ::: {error.message}</p>;

  return (
    <>
      <div className='p-2 lg:px-4 dark:bg-gray-800 rounded'>
        <div className=' h-[calc(100vh-100px)] md:h-auto lg:max-h-96 overflow-scroll'>
          <SmartTradesTable
            trades={data}
            showPair={showPair}
            showAutotrader={showAutotrader}
            showExchange={showExchange}
          />
          <div className='flex w-full justify-center mt-5 items-center gap-4'>
            <p className='text-xs dark:text-gray-100 font-light'>
              Total: {count}
            </p>
            {count !== data.length &&
              <button
                onClick={loadMore}
                className='text-xs bg-gray-600 px-2 py-1 rounded-md text-white'
              >
                Load More
              </button>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default TradeHistoryTable;

function SmartTradesTable({
  trades,
  showPair,
  showAutotrader,
  showExchange,
}) {
  const [openModal, setOpenModal] = useState(false);
  const [details, setDetails] = useState(null);
  const [showRaw, setShowRaw] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setOpenModal(false);
  }


  const handleOpen = (trade) => {
    setDetails(trade);
    setOpenModal(true);
  }


  async function closeAtMarketPrice(detail) {
    setLoading(true);
    try {
      if (!detail?.smart_trade_id) throw new Error('Invalid smart trade id');
      const res = await fetch(`/api/3commas/smart-trade/execute/close-at-market-price-test`, {
        method: 'POST',
        body: JSON.stringify({
          id: detail.smart_trade_id,
        })
      });
      const result = await res.json();
      const { data, error } = result;
      if (error) throw new Error(error);
      if (data?.error) {
        return Swal.fire({
          title: 'Cannot close trade',
          text: data?.error_description + '' + error + data?.error,
        })
      } else if (result?.success) {
        Swal.fire({
          title: 'Trade closed',
          text: `Trade ${detail?.smart_trade_id} closed at market price`,
          icon: 'success',
        })
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overflow-x-auto w-full rounded-xl shadow-lg">
      <table className="min-w-full text-[0.6rem] lg:text-xs text-center text-gray-300 dark:bg-gray-900 relative">
        <thead className="text-[0.6rem] lg:text-xs uppercase bg-gray-800 text-gray-400 whitespace-nowrap sticky top-0 z-10">
          <tr>
            <th className="px-2 py-1 lg:px-2 lg:py-1"></th>
            {showPair && <th className="px-2 py-1 lg:px-2 lg:py-1">Pair</th>}
            <th className="px-2 py-1 lg:px-2 lg:py-1">Action</th>
            <th className="px-2 py-1 lg:px-2 lg:py-1">Profit (%)</th>
            <th className="px-2 py-1 lg:px-2 lg:py-1">Profit (USD)</th>
            <th className="px-2 py-1 lg:px-2 lg:py-1">Price</th>
            <th className="px-2 py-1 lg:px-2 lg:py-1">Status</th>
            {showAutotrader && <th className="px-2 py-1 lg:px-2 lg:py-1">Autotrader</th>}
            {showExchange && <th className="px-2 py-1 lg:px-2 lg:py-1">Exchange</th>}
            <th className="px-2 py-1 lg:px-2 lg:py-1">Timestamp</th>
            <th className="px-2 py-1 lg:px-2 lg:py-1">Exchange commission</th>
            <th className="px-2 py-1 lg:px-2 lg:py-1"></th>
          </tr>
        </thead>
        <tbody>
          {trades?.map((trade, index) => {
            const actionColor = () => {
              if (trade?.action === 'BUY' || trade?.action === 'FORCE_BUY') return 'text-green-600';
              if (trade?.action === 'SELL' || trade?.action === 'FORCE_SELL') return 'text-red-600';
            }
            return (
              <tr
                key={index}
                className={cn("border-b border-gray-700 hover:bg-gray-800 cursor-pointer active:bg-gray-600", trade?.error && "text-red-400")}

              >
                <td className="px-1 py-[0.5] lg:px-2 lg:py-1 text-red-400 whitespace-nowrap">
                  <button
                    onClick={() => handleOpen(trade)}
                    type="button"
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-[0.6rem] lg:text-xs px-5 py-2.5 me-2 mb-4 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700
                      whitespace-nowrap
                      "
                  >
                    <IoEyeOutline />
                  </button>
                </td>
                {showPair && <td className="px-1 py-[0.5] lg:px-2 lg:py-1 flex flex-col items-center gap-2">
                  <PairImageComponent pair={trade?.pair} width={8} />
                  <p className='text-[0.6rem] lg:text-xs'>{trade?.pair}</p>
                </td>}
                <td className={cn("px-1 py-[0.5] lg:px-2 lg:py-1 font-bold", actionColor())}>{trade?.action}</td>

                <td
                  className={cn("px-1 py-[0.5] lg:px-2 lg:py-1",
                    trade?.profit?.percent ?
                      parseFloat(trade?.profit?.percent) > 0 ? "text-green-400"
                        : 'text-red-400'
                      : "text-gray-300",
                  )}
                >{trade?.profit?.percent}%</td>
                <td
                  className={cn(
                    "px-1 py-[0.5] lg:px-2 lg:py-1 whitespace-nowrap",
                    trade?.profit?.usd ?
                      parseFloat(trade?.profit?.usd) > 0 ? "text-green-400"
                        : 'text-red-400'
                      : "text-gray-300",
                  )

                  }
                >
                  {!isNaN(parseFloat(trade?.profit?.usd)) ? `$ ${parseFloat(trade?.profit?.usd)?.toFixed(3)}` : '-'}
                </td>
                <td className="px-1 py-[0.5] lg:px-2 lg:py-1">{trade?.position?.price?.value && '$' + trade?.position?.price?.value}</td>
                <td
                  className={cn("px-1 py-[0.5] lg:px-2 lg:py-1 whitespace-nowrap", trade?.error ? "text-red-400" : "")}
                >
                  {trade?.error ? 'Error!' : trade?.status?.title}
                </td>
                {showAutotrader && <td className="px-1 py-[0.5] lg:px-2 lg:py-1">{trade?.autotrader_id}</td>}
                {showExchange && <td className="px-1 py-[0.5] lg:px-2 lg:py-1 flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <img
                      src={trade?.exchange_thumbnail}
                      alt={trade?.exchange_name}
                      className="max-w-20"
                    />
                  </div>
                </td>}
                <td className="px-1 py-[0.5] lg:px-2 lg:py-1 whitespace-nowrap">
                  <div className=' flex flex-col justify-center'>
                    <p>
                      {moment
                        .unix(trade?.createdAt?.seconds)
                        ?.format('DD MMM YYYY HH:mm:ss')}
                    </p>
                    <p>{moment.unix(trade?.createdAt?.seconds).fromNow()}</p>
                  </div>
                </td>
                <td className="px-1 py-[0.5] lg:px-2 lg:py-1 whitespace-nowrap">
                  <p>{trade?.data ? trade?.data?.commission : 'no data'}</p>
                </td>
                <td className="flex gap-1 items-center">
                  {(trade?.status_type === 'waiting_targets') &&
                    <button
                      onClick={() => closeAtMarketPrice(trade)}
                      type="button"
                      disabled={loading}
                      className={cn("text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-4 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 whitespace-nowrap",
                        loading && "cursor-not-allowed"
                      )}
                    >
                      {loading ? <Spinner /> : "Close At Market Price"}
                    </button>
                  }
                </td>
              </tr>
            )
          }
          )}
        </tbody>
      </table>
      <Modal size="2000px" open={openModal} onClose={handleClose} title="Smart Trade Details">
        <div className="p-4">
          {authFirebase?.currentUser?.email === 'reinhartsams@gmail.com' &&
            <button
              onClick={() => setShowRaw(prev => !prev)}
              type="button"
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-4 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
              {showRaw ? "Hide Raw" : "Show Raw"}
            </button>

          }
          {showRaw ? (
            <div className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto max-h-[600px]">
              <code className="text-sm whitespace-pre-wrap block font-mono">
                {JSON.stringify(details, null, 2)}
              </code>
            </div>
          ) : details?.error || details?.status?.type === 'failed' ? (
            // ERROR VIEW
            <div className="grid grid-cols-1 gap-4 text-red-400">
              <div>
                <p className="text-xs text-gray-400">Error:</p>
                <p className="text-sm font-medium">{details?.error || details?.status?.error}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Error Description</p>
                <p className="text-sm font-medium">{details?.error_description}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Attributes</p>
                <ul className="list-disc ml-6 text-sm text-red-300">
                  {Object.entries(details?.error_attributes || {}).map(([key, messages], idx) => (
                    <li key={idx}>
                      <strong>{key}</strong>: {messages?.join(", ")}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs text-gray-400">Pair</p>
                <p className="text-sm">{details?.pair}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Exchange</p>
                <div className="flex items-center gap-2">
                  <img
                    src={details?.exchange_thumbnail}
                    alt={details?.exchange_name}
                    className="max-w-20"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400">Created At</p>
                <p className="text-sm">
                  {details?.createdAt?._seconds
                    ? new Date(details.createdAt._seconds * 1000).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          ) : (
            // SUCCESSFUL TRADE VIEW
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-300">
              <div>
                <p className="text-xs text-gray-400">Pair</p>
                <p className="text-sm">{details?.pair}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Action</p>
                <p className="text-sm">{details?.action}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Status</p>
                <p className="text-sm">{details?.status?.title}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Price</p>
                <p className="text-sm">${details?.position?.price?.value}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Trade Amount</p>
                <p className="text-sm">USD {details?.tradeAmount || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Profit (USD)</p>
                <p className="text-sm text-red-400">${details?.profit?.usd}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Profit (%)</p>
                <p className="text-sm text-red-400">{details?.profit?.percent}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Exchange Commission</p>
                <p className="text-xs text-gray-400">{details?.data ? details?.data?.commission : 'no data'} </p>

              </div>
              <div>
                <p className="text-xs text-gray-400">Exchange</p>
                <img
                  src={details?.exchange_thumbnail}
                  alt={details?.exchange_name}
                  className="max-w-20"
                />
              </div>
              <div>
                <p className="text-xs text-gray-400">Created At</p>
                <p className="text-sm">
                  {details?.createdAt?.seconds
                    ? new Date(details.createdAt.seconds * 1000).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          )}
        </div>
      </Modal>

    </div>
  );
}

SmartTradesTable.propTypes = {
  trades: PropTypes.array,
  showPair: PropTypes.bool,
  showAutotrader: PropTypes.bool,
  showExchange: PropTypes.bool,

};
TradeHistoryTable.propTypes = {
  bot_id: PropTypes.string,
  trading_plan_pair: PropTypes.string,
  collectionName: PropTypes.string,
  conditions: PropTypes.array,
  showPair: PropTypes.bool,
  showAutotrader: PropTypes.bool,
  showExchange: PropTypes.bool,
};
