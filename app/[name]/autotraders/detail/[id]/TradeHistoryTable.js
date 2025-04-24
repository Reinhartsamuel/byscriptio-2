'use client';

import React, { useState } from 'react';
import moment from 'moment';

import Spinner from '@/app/components/ui/Spinner';
import PairImageComponent from '@/app/components/ui/PairImageComponent';
import PropTypes from 'prop-types';
import useFetchData from '@/app/hooks/QueryHook';
import useCountDocuments from '@/app/hooks/CountHook';
import { cn } from '@/lib/util';
import Modal from '@/app/components/ui/Modal';
import { authFirebase } from '@/app/config/firebase';

const TradeHistoryTable = (props) => {
  const { collectionName = '3commas_logs', conditions = [] } = props;

  const { data, loadMore, loading, error } = useFetchData({
    collectionName,
    conditions,
    authRequired: true,
    dependencies: [conditions],
    type: 'getDocs',
    limitQuery: 10,
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
        <div className='max-h-96 overflow-scroll'>
          <SmartTradesTable trades={data} />
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

function SmartTradesTable({ trades }) {
  const [openModal, setOpenModal] = useState(false);
  const [details, setDetails] = useState(null);
  const [showRaw, setShowRaw] = useState(false);
  const handleClose = () => {
    setOpenModal(false);
  }


  const handleOpen = (trade) => {
    setDetails(trade);
    setOpenModal(true);
  }
  return (
    <div className="overflow-x-auto rounded-xl shadow-lg">
      <table className="min-w-full text-sm text-left text-gray-300 dark:bg-gray-900">
        <thead className="text-xs uppercase bg-gray-800 text-gray-400 whitespace-nowrap">
          <tr>
            <th className="px-4 py-3">Pair</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Profit (USD)</th>
            <th className="px-4 py-3">Profit (%)</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Autotrader</th>
            <th className="px-4 py-3">Exchange</th>
            <th className="px-4 py-3">Timestamp</th>
            <th className="px-4 py-3">Exchange commission</th>
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
                onClick={() => handleOpen(trade)}
              >
                <td className="px-4 py-3 flex flex-col items-center gap-2">
                  <PairImageComponent pair={trade?.pair} width={8} />
                  <p className='text-xs'>{trade?.pair}</p>
                </td>
                <td className={cn("px-4 py-3 font-bold", actionColor())}>{trade?.action}</td>
                <td className="px-4 py-3 text-red-400 whitespace-nowrap">$ {!isNaN(trade?.profit?.usd) ? parseFloat(trade?.profit?.usd)?.toFixed(3) : ''}</td>
                <td className="px-4 py-3 text-red-400">{trade?.profit?.percent}%</td>
                <td className="px-4 py-3">${trade?.position?.price?.value}</td>
                <td
                  className={cn("px-4 py-3 whitespace-nowrap", trade?.error ? "text-red-400" : "")}
                >
                  {trade?.error ? 'Error!' : trade?.status?.title}
                </td>
                <td className="px-4 py-3">{trade?.autotrader_id}</td>
                <td className="px-4 py-3 flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <img
                      src={trade?.exchange_thumbnail}
                      alt={trade?.exchange_name}
                      className="max-w-20"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className=' flex flex-col justify-center'>
                    <p>
                      {moment
                        .unix(trade?.createdAt?.seconds)
                        ?.format('DD MMM YYYY HH:mm:ss')}
                    </p>
                    <p>{moment.unix(trade?.createdAt?.seconds).fromNow()}</p>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <p>{trade?.data ? trade?.data?.commission : 'no data'}</p>
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
          ) : details?.error ? (
            // ERROR VIEW
            <div className="grid grid-cols-1 gap-4 text-red-400">
              <div>
                <p className="text-xs text-gray-400">Error Type</p>
                <p className="text-sm font-medium">{details?.error}</p>
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
                <p className="text-xs text-gray-400">Trade Value</p>
                <p className="text-sm">${details?.position?.price?.value}</p>
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
 
};
TradeHistoryTable.propTypes = {
  bot_id: PropTypes.string,
  trading_plan_pair: PropTypes.string,
  collectionName: PropTypes.string,
  conditions: PropTypes.array,
};
