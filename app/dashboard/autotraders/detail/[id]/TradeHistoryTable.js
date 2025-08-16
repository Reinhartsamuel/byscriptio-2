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
import ProfitCard from "@/app/components/ProfitCard";
import { useScreenshotStore } from "@/app/store/screenshotStore";

const TradeHistoryTable = ({
  collectionName = '3commas_logs',
  conditions = [],
  showPair = true,
  showAutotrader = true,
  showExchange = true,
}) => {
  const { data, loadMore, loading, error } = useFetchData({
    collectionName,
    conditions,
    authRequired: true,
    dependencies: [conditions],
    type: 'getDocs',
    limitQuery: 20,
  });

  const { count } = useCountDocuments({
    collectionName,
    conditions,
    authRequired: true,
    dependencies: [conditions]
  });

  if (loading) {
    return (
      <div className='w-full flex justify-center items-center'>
        <Spinner />
      </div>
    );
  }

  if (error) return <p>Error! ::: {error.message}</p>;

  return (
    <div className="w-full h-[calc(100vh-100px)] md:h-[600px] bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="flex-grow overflow-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-800 text-gray-400 text-[0.6rem] lg:text-xs uppercase sticky top-0 z-10">
              <tr>
                <th className="p-3 text-center"></th>
                {showPair && <th className="p-3 text-center">Pair</th>}
                <th className="p-3 text-center">Action</th>
                <th className="p-3 text-center">Profit (%)</th>
                <th className="p-3 text-center">Profit (USD)</th>
                <th className="p-3 text-center">Price</th>
                <th className="p-3 text-center">Status</th>
                {showAutotrader && <th className="p-3 text-center">Autotrader</th>}
                {showExchange && <th className="p-3 text-center">Exchange</th>}
                <th className="p-3 text-center">Timestamp</th>
                <th className="p-3 text-center">Exchange commission</th>
                <th className="p-3 text-center"></th>
              </tr>
            </thead>
            <tbody className="text-gray-300 text-[0.6rem] lg:text-xs">
              {data?.map((trade, index) => (
                <TableRow
                  key={index}
                  trade={trade}
                  showPair={showPair}
                  showAutotrader={showAutotrader}
                  showExchange={showExchange}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-gray-800 border-t border-gray-700 flex justify-center items-center gap-4">
          <span className="text-xs text-gray-400">Total: {count}</span>
          {count !== data?.length && (
            <button
              onClick={loadMore}
              className="px-4 py-2 text-xs bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const TableRow = ({ trade, showPair, showAutotrader, showExchange }) => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => setOpenModal(false);
  const handleOpen = () => setOpenModal(true);

  const actionColor = trade?.action?.includes('BUY') ? 'text-green-600' : 'text-red-600';

  const closeAtMarketPrice = async () => {
    setLoading(true);
    try {
      if (!trade?.smart_trade_id) throw new Error('Invalid smart trade id');

      const res = await fetch('/api/3commas/smart-trade/execute/close-at-market-price-test', {
        method: 'POST',
        body: JSON.stringify({ id: trade.smart_trade_id })
      });

      const result = await res.json();
      if (result.error || result?.data?.error) {
        Swal.fire({
          title: 'Cannot close trade',
          text: result?.data?.error_description || result.error,
          icon: 'error'
        });
      } else if (result?.success) {
        Swal.fire({
          title: 'Trade closed',
          text: `Trade ${trade?.smart_trade_id} closed at market price`,
          icon: 'success'
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr className={cn(
      "bg-gray-900 border-gray-700 hover:bg-gray-700/50 transition-colors",
      trade?.error && "text-red-400"
    )}>
      <td className="p-1">
        <button
          onClick={handleOpen}
          className="p-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <IoEyeOutline />
        </button>
      </td>
      {showPair && (
        <td className="p-1">
          <div className="flex flex-col items-center gap-2">
            <PairImageComponent pair={trade?.pair} width={8} />
            <span>{trade?.pair}</span>
          </div>
        </td>
      )}
      <td className={cn("p-1 font-medium", actionColor)}>{trade?.action}</td>
      <td className={cn(
        "p-1",
        trade?.profit?.percent > 0 ? "text-green-400" : "text-red-400"
      )}>
        {trade?.profit?.percent}%
      </td>
      <td className={cn(
        "p-1",
        trade?.profit?.usd > 0 ? "text-green-400" : "text-red-400"
      )}>
        {!isNaN(parseFloat(trade?.profit?.usd)) ?
          `$ ${parseFloat(trade?.profit?.usd)?.toFixed(3)}` : '-'}
      </td>
      <td className="p-1">
        {trade?.position?.price?.value && `$${trade?.position?.price?.value}`}
      </td>
      <td className={cn("p-1", trade?.error && "text-red-400")}>
        {trade?.error ? 'Error!' : trade?.status?.title}
      </td>
      {showAutotrader && <td className="p-1">{trade?.autotrader_id}</td>}
      {showExchange && (
        <td className="p-1">
          <div className="flex justify-center">
            <img
              src={trade?.exchange_thumbnail}
              alt={trade?.exchange_name}
              className="max-w-20"
            />
          </div>
        </td>
      )}
      <td className="p-1 whitespace-nowrap">
        <div className="flex flex-col">
          <span>
            {moment.unix(trade?.createdAt?.seconds)?.format('DD MMM YYYY HH:mm:ss')}
          </span>
          <span className="text-gray-400">
            {moment.unix(trade?.createdAt?.seconds).fromNow()}
          </span>
        </div>
      </td>
      <td className="p-1">{trade?.data?.commission || 'no data'}</td>
      <td className="p-1">
        {trade?.status_type === 'waiting_targets' && (
          <button
            onClick={closeAtMarketPrice}
            disabled={loading}
            className={cn(
              "px-4 py-2 text-white bg-gray-700 rounded hover:bg-gray-600 transition-colors",
              loading && "opacity-50 cursor-not-allowed"
            )}
          >
            {loading ? <Spinner /> : "Close At Market Price"}
          </button>
        )}
      </td>
      <Modal
        size="2000px"
        open={openModal}
        onClose={handleClose}
        title="Smart Trade Details"
      >
        <div className="">
          <TradeDetails trade={trade} />
        </div>
      </Modal>
    </tr>
  );
};

const TradeDetails = ({ trade }) => {
  const [showRaw, setShowRaw] = useState(false);
  const {
    setShowProfitCard,
    setProfitCardData
  } = useScreenshotStore();

  if (!trade) return null;
  const handleShare = () => {
    setProfitCardData(trade);
    setShowProfitCard(true);
  };

  if (showRaw) {
    return (
      <div className="p-4">
        {authFirebase?.currentUser?.email === 'reinhartsams@gmail.com' && (
          <button
            onClick={() => setShowRaw(false)}
            className="mb-4 px-4 py-2 text-white bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            Hide Raw
          </button>
        )}
        <div className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto max-h-[600px]">
          <pre className="text-sm whitespace-pre-wrap font-mono">
            {JSON.stringify(trade, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  if (trade?.error || trade?.status?.type === 'failed') {
    return (
      <div className="p-4 grid gap-4 text-red-400">
        <div>
          <p className="text-xs text-gray-400">Error:</p>
          <p className="text-sm font-medium">{trade?.error || trade?.status?.error}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Error Description</p>
          <p className="text-sm font-medium">{trade?.error_description}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Attributes</p>
          <ul className="list-disc ml-6 text-sm text-red-300">
            {Object.entries(trade?.error_attributes || {}).map(([key, messages], idx) => (
              <li key={idx}>
                <strong>{key}</strong>: {messages?.join(", ")}
              </li>
            ))}
          </ul>
        </div>
        <TradeBasicInfo trade={trade} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-300">
        <TradeBasicInfo trade={trade} />
      </div>
      <button onClick={handleShare} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Share
      </button>
    </div>
  );
};

const TradeBasicInfo = ({ trade }) => (
  <>
    <div>
      <p className="text-xs text-gray-400">Pair</p>
      <p className="text-sm">{trade?.pair}</p>
    </div>
    <div>
      <p className="text-xs text-gray-400">Action</p>
      <p className="text-sm">{trade?.action}</p>
    </div>
    <div>
      <p className="text-xs text-gray-400">Status</p>
      <p className="text-sm">{trade?.status?.title}</p>
    </div>
    <div>
      <p className="text-xs text-gray-400">Price</p>
      <p className="text-sm">${trade?.position?.price?.value}</p>
    </div>
    <div>
      <p className="text-xs text-gray-400">Trade Amount</p>
      <p className="text-sm">USD {trade?.tradeAmount || '-'}</p>
    </div>
    <div>
      <p className="text-xs text-gray-400">Profit (USD)</p>
      <p className="text-sm text-red-400">${trade?.profit?.usd}</p>
    </div>
    <div>
      <p className="text-xs text-gray-400">Profit (%)</p>
      <p className="text-sm text-red-400">{trade?.profit?.percent}%</p>
    </div>
    <div>
      <p className="text-xs text-gray-400">Exchange Commission</p>
      <p className="text-sm">{trade?.data?.commission || 'no data'}</p>
    </div>
    <div>
      <p className="text-xs text-gray-400">Exchange</p>
      <img
        src={trade?.exchange_thumbnail}
        alt={trade?.exchange_name}
        className="max-w-20"
      />
    </div>
    <div>
      <p className="text-xs text-gray-400">Created At</p>
      <p className="text-sm">
        {trade?.createdAt?.seconds
          ? new Date(trade.createdAt.seconds * 1000).toLocaleString()
          : "N/A"}
      </p>
    </div>

  </>
);

TradeHistoryTable.propTypes = {
  collectionName: PropTypes.string,
  conditions: PropTypes.array,
  showPair: PropTypes.bool,
  showAutotrader: PropTypes.bool,
  showExchange: PropTypes.bool,
};

TableRow.propTypes = {
  trade: PropTypes.object.isRequired,
  showPair: PropTypes.bool.isRequired,
  showAutotrader: PropTypes.bool.isRequired,
  showExchange: PropTypes.bool.isRequired,
};

TradeDetails.propTypes = {
  trade: PropTypes.object.isRequired,
};

TradeBasicInfo.propTypes = {
  trade: PropTypes.object.isRequired,
};

export default TradeHistoryTable;
