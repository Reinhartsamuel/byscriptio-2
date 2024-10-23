'use client';
import Modal from '@/app/components/ui/Modal';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useExchangeStore } from '@/app/store/exchangesStore';
import { authFirebase } from '@/app/config/firebase';
import Spinner from '@/app/components/ui/Spinner';
import { cn } from '@/lib/util';
import { useAutotraderStore } from '@/app/store/autotraderStore';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {
  addDocumentFirebase,
  getCollectionFirebase,
} from '@/app/utils/firebaseApi';
import PairImageComponent from '@/app/components/ui/PairImageComponent';
import moment from 'moment';
import autotraderRequestTemplate from '@/app/utils/emailHtmlTemplates/autotraderRequestTemplate';
import { addActivityLog } from '@/app/utils/activityLog';
import { useUserStore } from '@/app/store/userStore';

const tradingPlans = [
  { name: 'XMA', id: 'XMA' },
  // { name: 'TESTING2', id: 'TESTING2' },
];

export default function ModalAddAutotrader({ addModal, setAddModal }) {
  const { exchanges_accounts } = useExchangeStore();
  const { getAutotraders } = useAutotraderStore();
  const { user, customer, ipLocation } = useUserStore();
  const [data, setData] = useState({
    uid: authFirebase.currentUser?.uid,
    name: authFirebase.currentUser?.displayName,
    email: authFirebase.currentUser?.email,
    tradeAmount: 0,
    exchange_name: '',
    exchange_thumbnail: '',
    status: 'REQUESTED',
    trading_plan_pair: [],
    autotrader_name: moment().format('YYYY-MM-DD') + '-' + moment().unix(),
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(false);
    if (!data?.exchange_name || !data?.exchange_thumbnail)
      return Swal.fire({ icon: 'warning', text: 'Please select exchange!' });
    if (!data?.tradeAmount)
      return Swal.fire({
        icon: 'warning',
        text: 'Please fill in trade amount!',
      });
    if (data?.trading_plan_pair?.length === 0)
      return Swal.fire({
        icon: 'warning',
        text: 'Please select trading plan and asset pair!',
      });

    const addDataToAutotraderCollection = {
      ...data,
      trading_plan_pair: data.trading_plan_pair.filter(
        (fruit, index) => data.trading_plan_pair.indexOf(fruit) === index
      ),
    };

    // return console.log(addDataToAutotraderCollection,'addDataToAutotraderCollection')
    try {
      setLoading(true);
      await addDocumentFirebase(
        'dca_bots',
        addDataToAutotraderCollection,
        'byScript'
      );
      getAutotraders(data?.email);
      await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: authFirebase.currentUser?.displayName,
          email: authFirebase.currentUser?.email,
          subject: `Request Add Autotrader`,
          htmlContent: autotraderRequestTemplate({
            requestedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            autotrader_name: data?.autotrader_name,
            exchange_thumbnail:
              data?.exchange_name === 'GATE'
                ? 'https://static.airpackapp.com/fe-next/homepage/prod/_next/static/media/open_sesame_night.47e06968.png?w=750&q=75'
                : data?.exchange_thumbnail,
            exchange_name: data?.exchange_name,
            tradeAmount: data?.tradeAmount,
            trading_plan_pair: data?.trading_plan_pair,
            trading_plan_id: extractUniqueStrategies(data?.trading_plan_pair),
          }),
          bcc: [
            { name: 'Reinhart', email: 'reinhartsams@gmail.com' },
            { name: 'Edwin', email: 'edwinfardyanto@gmail.com' },
          ],
        }),
      });

      await addActivityLog({
        customerId: customer?.id || null,
        uid: user?.id || null,
        ipLocation: ipLocation,
        type: 'REQUEST AUTOTRADER',
      });
      Swal.fire({
        icon: 'success',
        text: 'Autotrader requested. We will inform you when autotrader is ACTIVE',
      });
      setAddModal(false);
    } catch (error) {
      Swal.fire({ icon: 'error', text: error.message });
    } finally {
      setLoading(false);
      setData({
        ...data,
        tradeAmount: 0,
        exchange_name: '',
        exchange_thumbnail: '',
      });
    }
  };

  return (
    <Modal open={addModal} onClose={() => setAddModal(false)}>
      <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600'>
        <div className='flex flex-col gap-2'>
          <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
            Add New Autotrader
          </h3>
          <p className='font-extralight text-sm text-slate-400 whitespace-wrap'>
            Silakan pilih exchange yang sudah tersambung. Jika belum ada, kamu
            bisa menambahkan di menu Exchange
          </p>
        </div>
      </div>

      {/* <pre>{JSON.stringify(detail, null, 2)}</pre> */}
      <div className='flex flex-col gap-2 my-10'>
        <div className='flex flex-col gap-1'>
          <p className='text-gray-100 font-bold'>Exchange</p>
          {Array.isArray(exchanges_accounts) &&
          exchanges_accounts?.length > 0 ? (
            exchanges_accounts?.map((exchange, i) => (
              <div className='flex gap-1 items-center mb-4' key={i}>
                <input
                  onChange={(e) => {
                    setData({
                      ...data,
                      exchange_name: JSON.parse(e.target.value)?.exchange_name,
                      exchange_thumbnail: JSON.parse(e.target.value)
                        ?.exchange_thumbnail,
                    });
                  }}
                  checked={data?.exchange_name === exchange?.exchange_name}
                  id='default-radio-2'
                  type='radio'
                  value={JSON.stringify(exchange)}
                  name='default-radio'
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                />
                <img
                  className='w-[6rem] object-contain'
                  src={
                    exchange?.exchange_name === 'GATE'
                      ? 'https://static.airpackapp.com/fe-next/homepage/prod/_next/static/media/open_sesame_night.47e06968.png?w=750&q=75'
                      : exchange?.exchange_thumbnail
                  }
                  alt={exchange?.name || 'gate'}
                />
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='first_name' className='text-gray-100 font-bold'>
            Trade Amount
          </label>
          <div className='flex'>
            <span className='inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600'>
              <p>USD</p>
            </span>
            <input
              type='number'
              className='rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='100'
              onChange={(e) =>
                setData({ ...data, tradeAmount: parseInt(e.target.value) })
              }
            />
          </div>
        </div>
        <TradingPlanSelectComponent data={data} setData={setData} />
      </div>
      <div className='flex flex-wrap gap-1 justify-end items-center p-4 md:p-5 border-t border-gray-200 dark:border-gray-600'>
        <button
          onClick={handleSubmit}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-600 text-white bg-green-600 hover:bg-green-700 active:bg-green-500 transition duration-200',
            loading ? 'opacity-50 cursor-not-allowed whitespace-nowrap' : '',
            'whitespace-nowrap' // add this to prevent text from breaking into a new line
          )}
          disabled={loading}
        >
          {loading ? <Spinner /> : <p>Request autotrader</p>}
        </button>
      </div>
    </Modal>
  );
}

function TradingPlanSelectComponent({ data, setData }) {
  const [selectedTradingPlan, setSelectedTradingPlan] = useState(null);
  const [availPairs, setAvailPairs] = useState([]);
  const [selectedPairs, setSelectedPairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const handleSelectTP = (checked, value) => {
    setSelectedTradingPlan(checked ? JSON.parse(value) : null);
  };

  const handleSelectPair = (checked, value) => {
    if (checked) {
      setSelectedPairs([...selectedPairs, JSON.parse(value)]);
      const tpp = [...data.trading_plan_pair];
      tpp.push(selectedTradingPlan?.name + '_' + JSON.parse(value)?.pair);
      // console.log(tpp, 'tpp');
      setData({ ...data, trading_plan_pair: tpp });
    } else {
      setSelectedPairs(
        selectedPairs.filter((pair) => pair.id !== JSON.parse(value).id)
      );
      const tppToDelete =
        selectedTradingPlan?.name + '_' + JSON.parse(value)?.pair;
      const tpp = data.trading_plan_pair?.filter((x) => x !== tppToDelete);
      // console.log(tpp, 'tpp');
      setData({ ...data, trading_plan_pair: tpp });
    }
  };

  useEffect(() => {
    async function getPairs() {
      if (!selectedTradingPlan?.id) return;
      try {
        // console.log('getting pairs available for', selectedTradingPlan?.id);
        setLoading(true);
        const res = await getCollectionFirebase('trading_plan_pair', [
          {
            field: 'trading_plan_id',
            operator: '==',
            value: selectedTradingPlan?.id,
          },
        ]);
        setAvailPairs(res);
      } catch (error) {
        setErrorMsg(error.message);
      } finally {
        setLoading(false);
      }
    }
    getPairs();
    return () => {
      setErrorMsg('');
    };
  }, [selectedTradingPlan]);
  return (
    <div className='flex gap-2'>
      <div className='block'>
        <p>Trading Plan:</p>
        <div className='grid grid-cols-2'>
          {tradingPlans.map((plan, i) => (
            <div
              key={i}
              className='flex flex-col justify-between gap-2 max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700 max-h-[5rem]'
            >
              <div className='flex gap-1'>
                <input
                  value={JSON.stringify(plan)}
                  type={'checkbox'}
                  onClick={(e) =>
                    handleSelectTP(e.target.checked, e.target.value)
                  }
                />
                <p className='text-lg font-bold'>{plan?.name}</p>
              </div>
              <p className='text-xs font-thin'>See backtest</p>
            </div>
          ))}
        </div>
      </div>
      <div className='block'>
        <p>Pair:</p>
        <div className='flex flex-wrap'>
          {loading ? (
            <Spinner />
          ) : availPairs?.length > 0 ? (
            availPairs?.map((pair, i) => (
              <div
                key={i}
                className='flex flex-col justify-between gap-2 max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700'
              >
                <div className='flex gap-1 items-center'>
                  <input
                    type={'checkbox'}
                    onChange={(e) =>
                      handleSelectPair(e.target.checked, e.target.value)
                    }
                    value={JSON.stringify(pair)}
                  />
                  <p className='text-lg font-bold'>{pair?.pair}</p>
                  <PairImageComponent pair={pair?.pair} />
                </div>
                <p className='text-xs font-thin'>Trading plan: XMA</p>
              </div>
            ))
          ) : (
            <p className='text-xs text-gray-200 italic'>No pair available</p>
          )}
        </div>
        {errorMsg && <p className='text-red-500 text-sm italic'>{errorMsg}</p>}
      </div>
    </div>
  );
}

function extractUniqueStrategies(tradingStrategies) {
  // Use a Set to store unique strategy names
  const uniqueStrategies = new Set();

  // Iterate through the trading strategies
  tradingStrategies.forEach((strategy) => {
    // Extract the strategy name (before the first underscore)
    const strategyName = strategy.split('_')[0];
    uniqueStrategies.add(strategyName);
  });

  // Convert the Set back to an array and join into a string
  const strategyArray = Array.from(uniqueStrategies);
  return strategyArray.length === 1
    ? strategyArray[0]
    : strategyArray.join(', ');
}

ModalAddAutotrader.propTypes = {
  addModal: PropTypes.bool,
  setAddModal: PropTypes.bool,
  loading: PropTypes.bool,
  setLoading: PropTypes.bool,
};

TradingPlanSelectComponent.propTypes = {
  data: PropTypes.object,
  setData: PropTypes.any,
};
