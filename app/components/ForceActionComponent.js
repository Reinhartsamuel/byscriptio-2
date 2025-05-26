import React, { useState } from 'react';
// import useForceAction from '../hooks/forceActionHook';
import Spinner from './ui/Spinner';
import { IoEnter, IoExit } from 'react-icons/io5';
import { cn } from '@/lib/util';
import PropTypes from 'prop-types'; // ES6
import { IoMdCloseCircleOutline } from 'react-icons/io';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { addDocumentFirebase, getCollectionFirebase } from '../utils/firebaseApi';

export default function ForceActionComponent({ detail }) {
  const [loading, setLoading] = useState(false);
  async function closeAllAtMarketPrice() {
    console.log('running closeAllAtMarketPrice')
    try {
      setLoading(true);
      const findLatestTrade = await getCollectionFirebase(
        '3commas_logs',
        [
          { field: 'autotrader_id', operator: '==', value: detail.id }
        ],
        { field: 'createdAt', direction: 'desc' },
      );
      if (findLatestTrade?.length === 0) {
        Swal.fire({
          title: 'Cannot close trade',
          text: `There is no trade to close`,
          icon: 'warning',
        })
        return;
      }
      await Promise.allSettled(findLatestTrade.map(async (trade) => {
        const res = await fetch(`/api/signal/smart-trade/get?id=${trade.smart_trade_id}`);
        const { data: latestTradeDetail, error } = await res.json();
        if (error) throw new Error(error)
        if (latestTradeDetail?.status?.type === 'waiting_targets' && latestTradeDetail?.id) {
          // close trade here
          const close = await fetch('/api/3commas/smart-trade/execute/close-at-market-price-test', {
            method: 'POST',
            body: JSON.stringify({
              id: latestTradeDetail?.id
            })
          });
          const resultClose = await close.json();
          console.log(resultClose);

          const action = detail?.marketType === 'spot' ?
            'SELL'
            : `CLOSE_${trade?.action}`;
          await addDocumentFirebase('3commas_logs', {
            ...resultClose?.data,
            exchange_external_id: detail?.exchange_external_id,
            exchange_thumbnail: detail?.exchange_thumbnail,
            exchange_name: detail?.exchange_name,
            name: detail.name,
            email: detail.email,
            uid: detail.uid,
            createdAt: new Date(),
            action: action, // add the action from previous trade, not the action from the request, so we can track the action from the previous trade, not the action from the request, s,
            smart_trade_id: latestTradeDetail?.id,
            type: action,
            autotrader_id: detail?.id,
            pair: detail?.trading_plan_pair[0]?.split('_').splice(1).join('_'),
            tradeAmount: detail?.tradeAmount || 0,
          })
          if (!resultClose.error) {
            return resultClose;
          } else {
            throw new Error(resultClose.error + ' ' + resultClose?.error_description);
          }
        } else {
          throw new Error('Cannot close because not waiting targets');
        }

      }));
    } catch (error) {
      console.log(error)
      Swal.fire({
        title: 'Cannot close trade',
        text: error.message,
        icon: 'error',
      })
    } finally {
      setLoading(false);
    }
  }


  async function forceEntry(action) {
    if (detail?.marketType === 'spot' && action === 'sell') return await closeAllAtMarketPrice();
    setLoading(true);
    try {
      const body = {
        autotrader_id: detail.id,
        action: action
      }
      // return console.log(body, 'body to send to force action');
      const res = await fetch('/api/3commas/smart-trade/force-action', {
        method: 'POST',
        body: JSON.stringify(body)
      })
      const result = await res.json();
      // console.log('result:', result);
      if (result?.smart_trade_id) {
        Swal.fire({
          title: `Force ${action} success`,
          text: `Trade created, id : ${result.smart_trade_id}`,
          icon: 'success',
        })
      } else if (result?.error) {
        Swal.fire({
          title: `Error force ${action}`,
          text: `${result.error}
           ${result?.error_attributes ?
            Object.keys(result?.error_attributes)
            ?.map((key) => `${key} : ${result?.error_attributes?.[key]} `) 
            : ''}
            ${result?.error_description || ''}`,
          icon: 'error',
        })
      }
    
    } catch (error) {
      Swal.fire({
        title: `Error force ${action}`,
        text: error.message,
        icon: 'error',
      })
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='rounded-lg dark:bg-gray-800 p-2 lg:p-4 shadow-md mx-2 font-sans flex flex-col gap-1 flex-wrap w-full'>
      <h1 className='text-gray-400 text-sm'>Force Entry</h1>
      <div className='flex flex-row gap-2 justify-between'>
        <button
          onClick={() => forceEntry('buy')}
          disabled={detail?.status !== 'ACTIVE'}
          className={cn(
            'flex items-center w-full justify-center flex-wrap-nowrap gap-2 px-4 py-2 rounded-xl border border-neutral-600 text-white transition duration-200',
            detail?.status === 'ACTIVE'
              ? 'cursor-pointer bg-green-600 hover:bg-green-700 active:bg-green-500'
              : 'cursor-not-allowed bg-gray-600'
          )}
        >
          {loading ? (
            <Spinner />
          ) : (
            <>
              <IoEnter />
              <p className='whitespace-nowrap'>Force Buy</p>
            </>
          )}
        </button>
        {detail?.marketType === 'futures' && <button
          onClick={() => forceEntry('sell')}
          disabled={detail?.status !== 'ACTIVE'}
          className={cn(
            'flex items-center w-full justify-center flex-wrap-nowrap gap-2 px-4 py-2 rounded-xl border border-neutral-600 text-white transition duration-200',
            detail?.status === 'ACTIVE'
              ? 'cursor-pointer bg-red-600 hover:bg-red-700 active:bg-red-500'
              : 'cursor-not-allowed bg-gray-600'
          )}
        >
          {loading ? (
            <Spinner />
          ) : (
            <>
              <IoExit />
              <p className='whitespace-nowrap'>Force Sell</p>
            </>
          )}
        </button>}
      </div>

      <h1 className='text-gray-400 text-sm'>Force Exit</h1>
      <div className='flex flex-row gap-2 justify-between'>
        {detail?.marketType === 'futures' &&
          <button
            onClick={closeAllAtMarketPrice}
            className={cn(
              'flex items-center w-full justify-center flex-wrap-nowrap gap-2 px-4 py-2 rounded-xl border border-neutral-600 text-white transition duration-200 cursor-pointer bg-gray-600 hover:bg-gray-700 active:bg-gray-500'
            )}
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                <IoMdCloseCircleOutline />
                <p className='whitespace-nowrap'>Close all at market price</p>
              </>
            )}
          </button>
        }
        {detail?.marketType === 'spot' && <button
          onClick={() => forceEntry('sell')}
          disabled={detail?.status !== 'ACTIVE'}
          className={cn(
            'flex items-center w-full justify-center flex-wrap-nowrap gap-2 px-4 py-2 rounded-xl border border-neutral-600 text-white transition duration-200',
            detail?.status === 'ACTIVE'
              ? 'cursor-pointer bg-red-600 hover:bg-red-700 active:bg-red-500'
              : 'cursor-not-allowed bg-gray-600'
          )}
        >
          {loading ? (
            <Spinner />
          ) : (
            <>
              <IoExit />
              <p className='whitespace-nowrap'>Force Sell</p>
            </>
          )}
        </button>}


      </div>
    </div>
  );
}

ForceActionComponent.propTypes = {
  detail: PropTypes.any,
};
