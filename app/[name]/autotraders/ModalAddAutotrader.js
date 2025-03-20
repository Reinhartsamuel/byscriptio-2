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
  deleteDocumentFirebase,
  getCollectionFirebase,
  updateDocumentFirebase,
} from '@/app/utils/firebaseApi';
import PairImageComponent from '@/app/components/ui/PairImageComponent';
import moment from 'moment';
// import autotraderRequestTemplate from '@/app/utils/emailHtmlTemplates/autotraderRequestTemplate';
import { addActivityLog } from '@/app/utils/activityLog';
import { useUserStore } from '@/app/store/userStore';
// import extractUniqueStrategies from '@/app/utils/extractUniqueStrategies';
import Tooltip from '@/app/components/ui/Tooltip';
import { FaRegCircleQuestion } from 'react-icons/fa6';
import handleError3Commas from '@/app/utils/handleError3Commas';

// const tradingPlans = [
//   { name: 'XMA', id: 'XMA' },
//   // { name: 'TESTING2', id: 'TESTING2' },
// ];

export default function ModalAddAutotrader({
  addModal,
  setAddModal,
  setShowPricing,
}) {
  const { exchanges_accounts } = useExchangeStore();
  const { getAutotraders } = useAutotraderStore();
  const { user, customer, ipLocation, userPackage } = useUserStore();
  const [data, setData] = useState({
    uid: authFirebase.currentUser?.uid,
    name: authFirebase.currentUser?.displayName,
    email: authFirebase.currentUser?.email,
    tradeAmount: 0,
    exchange_name: '',
    exchange_external_id: '',
    exchange_thumbnail: '',
    status: 'STOPPED',
    trading_plan_pair: [],
    autotrader_name: moment().format('YYYY-MM-DD') + '-' + moment().unix(),
  });
  const [loading, setLoading] = useState(false);
  const [marketType, setMarketType] = useState('SPOT');

  const handleSubmit = async () => {
    if (!userPackage && parseInt(data?.tradeAmount) > 100) {
      Swal.fire({
        title: 'You have no paid subscription',
        text: 'Free tier only allows maximum $100 of trade amount. Do you want to proceed to payment?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Continue payment',
        denyButtonText: `Cancel`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          // Swal.fire("Saved!", "", "success");
          setShowPricing(true);
          setAddModal(false);
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info');
        }
      });
    }
    try {
      setLoading(false);
      if (!data?.exchange_name && !data?.exchange_thumbnail)
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

      // Extracting the pairs and removing duplicates
      const extractedPairs = Array.from(
        new Set(
          data.trading_plan_pair.map((pair) => {
            const parts = pair.split('_');
            return `${parts[1]}_${parts[2]}`;
          })
        )
      );

      // Converting the array to a comma-separated string
      let resultString;
      if (extractedPairs.length > 1) {
        resultString = extractedPairs.join(', ');
      } else {
        resultString = extractedPairs[0] || ''; // Handle the case where the array is empty
      }
      const addDataToAutotraderCollection = {
        ...data,
        resultString,
        trading_plan_pair: data.trading_plan_pair.filter(
          (fruit, index) => data.trading_plan_pair.indexOf(fruit) === index
        ),
        exchange_external_id: data?.exchange_external_id || '',
      };
      // return console.log(
      //   addDataToAutotraderCollection,
      //   'addDataToAutotraderCollection'
      // );

      setLoading(true);
      const id = await addDocumentFirebase(
        'dca_bots',
        addDataToAutotraderCollection,
        'byScript'
      );
      // console.log({
      //   name: id,
      //   account_id: data.exchange_external_id,
      //   pairs: resultString,
      //   base_order_volume: parseFloat(data?.tradeAmount),
      //   take_profit: 0,
      //   martingale_volume_coefficient: 10,
      //   martingale_step_coefficient: 10,
      //   max_safety_orders: 0,
      //   max_active_deals: extractedPairs.length,
      //   active_safety_orders_count: 0,
      //   safety_order_step_percentage: 2,
      //   take_profit_type: 'total',
      //   strategy_list: [
      //     {
      //       strategy: 'tv_custom_signal',
      //     },
      //   ],
      //   close_strategy_list: [
      //     {
      //       strategy: 'tv_custom_signal',
      //     },
      //   ],
      //   safety_order_volume: 10,
      //   stop_loss_percentage: 99.9,
      //   start_order_type: 'market',
      //   reinvesting_percentage: 100,
      //   risk_reduction_percentage: 100,
      // }, 'body to create bot')

      if (marketType === 'SPOT') {
        const createBot = await fetch('/api/3commas/bots/create-bot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: id,
            account_id: data.exchange_external_id,
            pairs: resultString,
            base_order_volume: parseFloat(data?.tradeAmount),
            take_profit: 0,
            martingale_volume_coefficient: 10,
            martingale_step_coefficient: 10,
            max_safety_orders: 0,
            max_active_deals: extractedPairs.length,
            active_safety_orders_count: 0,
            safety_order_step_percentage: 2,
            take_profit_type: 'total',
            strategy_list: [
              {
                strategy: 'tv_custom_signal',
              },
            ],
            close_strategy_list: [
              {
                strategy: 'tv_custom_signal',
              },
            ],
            safety_order_volume: 10,
            stop_loss_percentage: 99.9,
            start_order_type: 'market',
            reinvesting_percentage: 100,
            risk_reduction_percentage: 100,
          }),
        });
        const resCreateBot = await createBot.json();
        console.log(resCreateBot, 'resCreateBot');
        if (resCreateBot.error) {
          console.log('deleting because of error');
          await deleteDocumentFirebase('dca_bots', id);
          // return Swal.fire({ icon: 'error', title: 'Error creating bot' });
          return handleError3Commas(resCreateBot);
        } else if (resCreateBot.data) {
          console.log('updating bot_id');
          await updateDocumentFirebase('dca_bots', id, {
            bot_id: resCreateBot.data.id,
          });
        }

      } else if (marketType === 'FUTURES') {
        await updateDocumentFirebase('dca_bots', id, {
          smart_trade: true,
        });
      }

      getAutotraders(data?.email);
      // await fetch('/api/email', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     name: authFirebase.currentUser?.displayName,
      //     email: authFirebase.currentUser?.email,
      //     subject: `Request Add Autotrader`,
      //     htmlContent: autotraderRequestTemplate({
      //       requestedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      //       autotrader_name: data?.autotrader_name,
      //       exchange_thumbnail:
      //         data?.exchange_name === 'GATE'
      //           ? 'https://static.airpackapp.com/fe-next/homepage/prod/_next/static/media/open_sesame_night.47e06968.png?w=750&q=75'
      //           : data?.exchange_thumbnail,
      //       exchange_name: data?.exchange_name,
      //       tradeAmount: data?.tradeAmount,
      //       trading_plan_pair: data?.trading_plan_pair,
      //       trading_plan_id: extractUniqueStrategies(data?.trading_plan_pair),
      //       name: authFirebase.currentUser?.displayName,
      //       email: authFirebase.currentUser?.email,
      //     }),
      //     bcc: [
      //       { name: 'Reinhart', email: 'reinhartsams@gmail.com' },
      //       { name: 'Edwin', email: 'edwinfardyanto@gmail.com' },
      //     ],
      //   }),
      // });

      await addActivityLog({
        customerId: customer?.id || null,
        uid: user?.id || null,
        ipLocation: ipLocation,
        type: 'CREATE AUTOTRADER',
      });
      Swal.fire({
        icon: 'success',
        text: `Autotrader created with id ${id}. `,
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
  function handleClose() {
    setAddModal(false);
    setData({
      uid: authFirebase.currentUser?.uid,
      name: authFirebase.currentUser?.displayName,
      email: authFirebase.currentUser?.email,
      tradeAmount: 0,
      exchange_name: '',
      exchange_thumbnail: '',
      status: 'STOPPED',
      trading_plan_pair: [],
      autotrader_name: moment().format('YYYY-MM-DD') + '-' + moment().unix(),
    });
  }


  return (
    <Modal open={addModal} onClose={handleClose}>
      <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-600'>
        <div className='flex flex-col gap-2'>
          <h3 className='text-xl font-semibold text-white'>
            Add New Autotrader
          </h3>
          <p className='font-light text-sm text-gray-800 dark:text-slate-400 whitespace-wrap'>

          </p>
        </div>
      </div>

      {/* <pre>{JSON.stringify(detail, null, 2)}</pre> */}
      <div className='flex flex-col gap-2 my-10'>
        <div className='flex flex-col gap-2 mb-10'>
          <div className='flex gap-2 items-center'>
            <p className='text-gray-100 font-bold'>Market Type : {marketType}</p>
            <Tooltip text={'Select the exchange to be used for running the autotrader.'} className='mx-1'>
              <FaRegCircleQuestion color={'white'} />
            </Tooltip>
          </div>
          <div className="flex items-center">
            <input id="default-radio-1" type="radio" value="SPOT" name="trading-type" checked={marketType === 'SPOT'} onChange={() => setMarketType('SPOT')} className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 large-radio" />
            <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">One Direction (SPOT)</label>
          </div>
          <div className="flex items-center">
            <input id="default-radio-2" type="radio" value="FUTURES" name="trading-type" checked={marketType === 'FUTURES'} onChange={() => setMarketType('FUTURES')} className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 large-radio" />
            <label htmlFor="default-radio-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Two Directions (FUTURES)</label>
          </div>

        </div>
        <div className='flex flex-col gap-2'>
          <div className='flex gap-2 items-center'>
            <p className='text-gray-100 font-bold'>Exchange</p>
            <Tooltip text={'Select the exchange to be used for running the autotrader.'} className='mx-1'>
              <FaRegCircleQuestion color={'white'} />
            </Tooltip>
          </div>
          {Array.isArray(exchanges_accounts) &&
            exchanges_accounts?.length > 0 ? (
            exchanges_accounts?.filter((x) => x.type === marketType)?.map((exchange, i) => (
              <div key={i} className='flex flex-col lg:flex-row gap-2 p-4 border-2 rounded-md border-gray-700'>
                <div className='flex gap-2'>
                  <input
                    onChange={(e) => {
                      setData({
                        ...data,
                        exchange_name: JSON.parse(e.target.value)?.exchange_name,
                        exchange_thumbnail: JSON.parse(e.target.value)
                          ?.exchange_thumbnail,
                        exchange_external_id:
                          JSON.parse(e.target.value)?.external_id || '',
                      });
                    }}
                    checked={data?.exchange_external_id === exchange?.external_id}
                    id='default-radio-2'
                    type='radio'
                    value={JSON.stringify(exchange)}
                    name='default-radio'
                    className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 large-radio"
                  />
                  <img
                    alt={exchange?.exchange_name}
                    src={exchange.exchange_thumbnail}
                    className='w-[6rem] object-contain bg-gray-400 rounded-md p-1 dark:p-0'
                  />
                  <span className='bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300'>
                    {exchange?.type}
                  </span>
                </div>



                <div className='flex gap-2'>
                  <p className='text-gray-600 dark:text-gray-400 text-sm'>
                    id: {exchange?.external_id}
                  </p>
                  <p className='text-gray-600 dark:text-gray-200 text-sm'>
                    {moment.unix(exchange?.createdAt?.seconds).fromNow()}
                  </p>
                  <p className='text-gray-600 dark:text-gray-200 text-sm'>
                    {exchange?.external_name}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
        <div className='flex flex-col mt-20'>
          <div className='flex'>
            <label
              htmlFor='first_name'
              className='text-gray-800 dark:text-gray-100 font-bold'
            >
              Trade Amount Per Pair
            </label>
            <Tooltip text={'If you want to select 10 pairs and use a total amount of $1000, set the Trade Amount to $100. This means $100 per pair, resulting in $100 x 10 pairs = $1000.'} className='mx-1'>
              <FaRegCircleQuestion color={'white'} />
            </Tooltip>
          </div>
          <p className='text-gray-400 text-sm'>This is the amount to be used for each trade on the selected trading pairs. <br />Example:<br />Trade Amount = $100 means that every trade on the selected pairs will use $100.           </p>
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
          {loading ? <Spinner /> : <p>Create autotrader</p>}
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
  const [tradingPlans, setTradingPlans] = useState([]);

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


  useEffect(() => {
    async function getTradingPlans() {
      const tp = await getCollectionFirebase('trading_plans', [
        {
          field: 'status',
          operator: '==',
          value: 'ACTIVE'
        }
      ])
      setTradingPlans(tp);
      console.log(tp, 'tp');
    }
    getTradingPlans();
  }, []);
  return (
    <div className='flex flex-col lg:flex-row gap-20  mt-10'>
      <div className='block'>
        <div className="flex gap-2">
          <p className='text-white font-bold'>Trading Plan:</p>
          <Tooltip text={'Each trading plan has a unique trading approach and delivers different results.'} className='mx-1'>
            <FaRegCircleQuestion color={'white'} />
          </Tooltip>
        </div>
        <p className='text-gray-300 text-xs'>Choosing a Trading Plan
          Selecting a trading plan <br />means choosing the algorithmic strategy that <br /> will be used to execute trades.
        </p>
        <div className='grid grid-cols-2 2 mt-5'>
          {tradingPlans.map((plan, i) => (
            <div
              key={i}
              className='flex flex-col justify-between gap-2 max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700 max-h-[5rem]'
            >
              <div className='flex gap-2'>
                <input
                  value={JSON.stringify(plan)}
                  type={'checkbox'}
                  onClick={(e) =>
                    handleSelectTP(e.target.checked, e.target.value)
                  }
                  className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 large-checkbox"
                />
                <p className='text-lg font-bold text-black dark:text-white'>
                  {plan?.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='block'>
        <div className="flex gap-2">
          <p className='text-white font-bold'>Pairs</p>
          <Tooltip text={'You can check the backtest results for each pair by clicking the "Backtest" link below each pair.Select the pairs to trade.'}>
            <FaRegCircleQuestion color={'white'} />
          </Tooltip>
        </div>
        <p className='text-gray-300 text-xs'>Select the pairs to trade.
        </p>
        <div className='grid grid-cols-1 grid-rows-3 overflow-scroll lg:grid-cols-4 gap-2 mt-5'>
          {loading ? (
            <Spinner />
          ) : availPairs?.length > 0 ? (
            availPairs?.map((pair, i) => (
              <div
                key={i}
                className='flex flex-col justify-between gap-2 max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700'
              >
                <div className='flex gap-1 justify-between items-center w-full'>
                  <div className='flex items-center gap-2'>
                    <input
                      type={'checkbox'}
                      onChange={(e) =>
                        handleSelectPair(e.target.checked, e.target.value)
                      }
                      value={JSON.stringify(pair)}
                      className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 large-checkbox"
                    />
                    <p className='text-sm font-bold text-black dark:text-white'>
                      {pair?.pair}
                    </p>
                  </div>
                  <PairImageComponent pair={pair?.pair} showUsdt={false} />
                </div>
                <p className='text-xs font-thin text-black dark:text-white'>
                  Trading plan: {selectedTradingPlan?.id}
                </p>
                <a
                  href={`${window.location.pathname}/trading-plan/${pair?.trading_plan_id}?pair=${pair?.pair}`}
                  className='underline text-blue-600 dark:text-blue-400 text-xs'
                  target={'_blank'}
                  rel='noreferrer'
                >
                  See backtest
                </a>
              </div>
            ))
          ) : (
            <p className='text-xs text-dark-800 dark:text-gray-200 italic'>
              No pair available
            </p>
          )}

        </div>
        {errorMsg && <p className='text-red-500 text-sm italic'>{errorMsg}</p>}
      </div>
    </div>
  );
}

ModalAddAutotrader.propTypes = {
  addModal: PropTypes.bool,
  setAddModal: PropTypes.bool,
  loading: PropTypes.bool,
  setLoading: PropTypes.bool,
  setShowPricing: PropTypes.bool,
};

TradingPlanSelectComponent.propTypes = {
  data: PropTypes.object,
  setData: PropTypes.any,
};
