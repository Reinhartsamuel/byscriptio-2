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
  async function closeAtMarketPrice() {
    console.log('running closeAtMarketPrice')
    try {
      setLoading(true);
      const findLatestTrade = await getCollectionFirebase(
        '3commas_logs',
        [
          { field: 'autotrader_id', operator: '==', value: detail.id }
        ],
        { field: 'createdAt', direction: 'desc' },
        1
      );
      if (findLatestTrade?.length === 0) {
        Swal.fire({
          title: 'Cannot close trade',
          text: `There is no trade to close`,
          icon: 'warning',
        })
        return;
      }

      const res = await fetch(`/api/signal/smart-trade/get?id=${findLatestTrade[0].smart_trade_id}`);
      const { data: latestTradeDetail, error } = await res.json();
      if (error) {
        console.log(error, 'error finding latestTradeDetiail')
      }
      console.log(latestTradeDetail, 'latestTradeDetail');
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
          'FORCE_SELL'
          : `CLOSE_${findLatestTrade[0]?.action}`;
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
        })
        if (!resultClose.error) {
          Swal.fire({
            title: 'Success',
            text: `Close at market price success`,
            icon: 'success',
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: `Close at market price failed`,
            icon: 'error',
          });
        }
      } else {
        Swal.fire({
          title: 'Cannot close trade',
          text: `There is no trade to close`,
          icon: 'warning',
        })
      }
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
    if (detail?.marketType === 'spot' && action === 'sell') return await closeAtMarketPrice();
    setLoading(true);
    try {
      const body = {
        autotrader_id: detail.id,
        action: action
      }
      console.log(body, 'body to send to force action');
      const res = await fetch('/api/3commas/smart-trade/force-action', {
        method: 'POST',
        body: JSON.stringify(body)
      })
      const { data, error } = await res.json();
      if (error) throw new Error(error);
      Swal.fire({
        icon: 'success',
        title: `Force ${action} success with id : ${data?.id || data?.data?.id}`,
      })
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
      <h1 className='text-gray-700 dark:text-gray-200'>Force Entry / Exit</h1>
      <div className='flex flex-row gap-2 justify-between'>

        {detail?.type === 'futures' &&
          <button
            onClick={closeAtMarketPrice}
            className={cn(
              'flex items-center w-full justify-center flex-wrap-nowrap gap-2 px-4 py-2 rounded-xl border border-neutral-600 text-white transition duration-200 cursor-pointer bg-gray-600 hover:bg-gray-700 active:bg-gray-500'
            )}
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                <IoMdCloseCircleOutline />
                <p className='whitespace-nowrap'>Close at market price</p>
              </>
            )}
          </button>
        }

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
        <button
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
        </button>
      </div>
    </div>
  );
}

ForceActionComponent.propTypes = {
  detail: PropTypes.any,
};
