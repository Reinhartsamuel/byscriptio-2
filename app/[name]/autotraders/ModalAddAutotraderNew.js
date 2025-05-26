'use client';
import Modal from '@/app/components/ui/Modal';
import React, { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useExchangeStore } from '@/app/store/exchangesStore';
import { authFirebase } from '@/app/config/firebase';
import { cn } from '@/lib/util';
import { useAutotraderStore } from '@/app/store/autotraderStore';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { addDocumentFirebase } from '@/app/utils/firebaseApi';
import PairImageComponent from '@/app/components/ui/PairImageComponent';
import moment from 'moment';
import { useUserStore } from '@/app/store/userStore';
import Tooltip from '@/app/components/ui/Tooltip';
import { FaRegCircleQuestion } from 'react-icons/fa6';
import PropTypes from 'prop-types';
import Spinner from '@/app/components/ui/Spinner';
import { getCollectionFirebase } from '@/app/utils/firebaseApi';
import { addActivityLog } from '@/app/utils/activityLog';

export default function ModalAddAutotraderNew({
  addModal,
  setAddModal,
  setShowPricing,
}) {
  const { exchanges_accounts } = useExchangeStore();
  const { getAutotraders } = useAutotraderStore();
  const { user, customer, ipLocation, userPackage } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [marketType, setMarketType] = useState('spot');
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [tradingPlans, setTradingPlans] = useState([]);
  const [selectedTradingPlan, setSelectedTradingPlan] = useState(null);
  const [pairs, setPairs] = useState([]);
  const [selectedPairConfigs, setSelectedPairConfigs] = useState([
    { pair: null, tradeAmount: '' }
  ]);

  // Reset selections when market type changes
  const handleMarketTypeChange = (type) => {
    console.log('Changing market type to:', type);
    setMarketType(type);
    setSelectedExchange(null);
    setSelectedTradingPlan(null);
    setSelectedPairConfigs([{ pair: null, tradeAmount: '' }]);
  };

  // Fetch trading plans on mount or when marketType changes
  useEffect(() => {
    const fetchTradingPlans = async () => {
      console.log(userPackage, 'userPackage from fetch tradningplans');
      try {
        let _tradingPlans = await getCollectionFirebase('trading_plans', [
          {
            field: 'status',
            operator: '==',
            value: 'ACTIVE'
          },
        ]);
        console.log('Fetched trading _tradingPlans:', _tradingPlans);
        const allTradingPlans = _tradingPlans.filter((tradingPlan) => tradingPlan?.availability === 'all'); // filter by availability to "all"
        const specificTradingPlans = _tradingPlans.filter((tradingPlan) => tradingPlan?.availability === userPackage?.id); // filter by availability specific to my userPackage.id
        _tradingPlans = [...allTradingPlans, ...specificTradingPlans];
        setTradingPlans(_tradingPlans);
      } catch (error) {
        console.error('Error fetching trading plans:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch trading plans',
        });
      }
    };
    if (addModal) fetchTradingPlans();
  }, [marketType, addModal]);

  // Reset pairs when trading plan changes
  useEffect(() => {
    setPairs([]);
    setSelectedPairConfigs([{ pair: null, tradeAmount: '' }]);

    if (selectedTradingPlan) {
      const fetchPairs = async () => {
        try {
          const pairsData = await getCollectionFirebase('trading_plan_pair', [
            {
              field: 'trading_plan_id',
              operator: '==',
              value: selectedTradingPlan.id,
            }
          ]);
          setPairs(pairsData);
          console.log(pairsData, 'pairsData')
        } catch (error) {
          console.error('Error fetching pairs:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch pairs',
          });
        }
      };
      fetchPairs();
    }
  }, [selectedTradingPlan, marketType]);

  const addPairConfig = () => {
    setSelectedPairConfigs([...selectedPairConfigs, { pair: null, tradeAmount: '' }]);
  };

  const removePairConfig = (index) => {
    setSelectedPairConfigs(selectedPairConfigs.filter((_, i) => i !== index));
  };

  const updatePairConfig = (index, field, value) => {
    const newConfigs = [...selectedPairConfigs];
    const newObj = { ...newConfigs[index], [field]: value };
    newConfigs.splice(index, 1, newObj);
    setSelectedPairConfigs(newConfigs);
  };

  const resetState = () => {
    setMarketType('spot');
    setSelectedExchange(null);
    setSelectedTradingPlan(null);
    setSelectedPairConfigs([{ pair: null, tradeAmount: '' }]);
    setPairs([]);
    setTradingPlans([]);
    setLoading(false);
  };

  const handleClose = () => {
    resetState();
    setAddModal(false);
  };

  // Listen for escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && addModal) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [addModal]);

  const handleSubmit = async () => {
    // Validate configurations
    if (!selectedExchange) {
      Swal.fire({
        icon: 'warning',
        text: 'Please select an exchange!',
      });
      return;
    }

    if (!selectedTradingPlan) {
      Swal.fire({
        icon: 'warning',
        text: 'Please select a trading plan!',
      });
      return;
    }

    const invalidConfigs = selectedPairConfigs.filter(
      config => !config.pair || !config.tradeAmount || parseFloat(config.tradeAmount) <= 0
    );

    if (invalidConfigs.length > 0) {
      Swal.fire({
        icon: 'warning',
        text: 'Please fill in all required fields and ensure trade amounts are greater than 0!',
      });
      return;
    }

    // Check trade amounts for free tier
    if (!userPackage) {
      const invalidAmounts = selectedPairConfigs.filter(
        config => parseFloat(config.tradeAmount) > 100
      );

      if (invalidAmounts.length > 0) {
        Swal.fire({
          title: 'Free Tier Limit Exceeded',
          text: 'Free tier only allows maximum $100 of trade amount per pair. Would you like to upgrade?',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Upgrade Now',
          denyButtonText: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            setShowPricing(true);
            handleClose();
          }
        });
        return;
      }
    }

    try {
      setLoading(true);

      // Create autotraders for each configuration
      for (const config of selectedPairConfigs) {
        console.log(config, 'config');

        const autotraderData = {
          uid: authFirebase.currentUser?.uid,
          name: authFirebase.currentUser?.displayName,
          email: authFirebase.currentUser?.email,
          tradeAmount: parseFloat(config.tradeAmount),
          initialInvestment: parseFloat(config.tradeAmount),
          exchange_name: selectedExchange.exchange_name,
          exchange_external_id: selectedExchange.external_id,
          exchange_thumbnail: selectedExchange.exchange_thumbnail,
          status: 'STOPPED',
          trading_plan_pair: [`${selectedTradingPlan.id}_${config.pair.pair}`],
          autotrader_name: moment().format('YYYY-MM-DD') + '-' + moment().unix(),
          marketType,
          resultString: config.pair.pair,
          smart_trade: true,
          autocompound: selectedTradingPlan?.autocompound ? true : false,
        };
        console.log(autotraderData, 'autotraderData');

        await addDocumentFirebase(
          'dca_bots',
          autotraderData,
          'byScript'
        );
      }

      await getAutotraders(authFirebase.currentUser?.email);
      setAddModal(false);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `Successfully created ${selectedPairConfigs.length} autotrader(s)!`,
      });
      resetState();
      await addActivityLog({
        customerId: customer?.id || null,
        uid: user?.id || null,
        ipLocation: ipLocation,
        type: 'CREATE AUTOTRADER',
        userAgent: navigator?.userAgent,
      });
    } catch (error) {
      console.error('Error creating autotraders:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to create autotraders',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={addModal}
      onClose={handleClose}
      title="Create New Autotrader"
    >
      <div className="space-y-8 p-6">
        {/* Market Type Selection */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Market Type
            </h3>
            <Tooltip text="Select the type of market you want to trade in. This will filter available exchanges and trading plans.">
              <FaRegCircleQuestion className="text-gray-400 hover:text-gray-600" />
            </Tooltip>
          </div>
          <p className="text-sm text-gray-500">
            Select the type of market you want to trade in. This will filter available exchanges and trading plans.
          </p>
          <div className="flex space-x-4">
            <label className="relative flex cursor-pointer items-center rounded-lg border p-4 hover:border-indigo-600">
              <input
                type="radio"
                name="marketType"
                value="spot"
                checked={marketType === 'spot'}
                onChange={(e) => handleMarketTypeChange(e.target.value)}
                className="h-4 w-4 text-indigo-50 focus:ring-indigo-500"
              />
              <span className="ml-3 font-medium text-gray-50">Spot</span>
            </label>
            <label className="relative flex cursor-pointer items-center rounded-lg border p-4 hover:border-indigo-600">
              <input
                type="radio"
                name="marketType"
                value="futures"
                checked={marketType === 'futures'}
                onChange={(e) => handleMarketTypeChange(e.target.value)}
                className="h-4 w-4 text-indigo-50 focus:ring-indigo-500"
              />
              <span className="ml-3 font-medium text-gray-50">Futures</span>
            </label>
          </div>
        </div>

        {/* Exchange Selection */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Select Exchange
            </h3>
            <Tooltip text="Only exchanges that support the selected market type are shown. Need to add a new exchange?">
              <FaRegCircleQuestion className="text-gray-400 hover:text-gray-600" />
            </Tooltip>
          </div>
          <p className="text-sm text-gray-500">
            Only exchanges that support {marketType} trading are shown. Need to add a new exchange?
            <button className="ml-1 text-indigo-600 hover:text-indigo-700">Connect Exchange</button>
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {exchanges_accounts?.filter((exchange) => exchange.type?.toLowerCase() === marketType)?.map((exchange) => (
              <label
                key={exchange.id}
                className={cn(
                  'flex cursor-pointer flex-col space-y-2 rounded-lg border p-4 transition-colors',
                  selectedExchange?.id === exchange.id
                    ? 'border-indigo-600 bg-indigo-600'
                    : 'border-gray-200 hover:border-indigo-200'
                )}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="exchange"
                    checked={selectedExchange?.id === exchange.id}
                    onChange={() => setSelectedExchange(exchange)}
                    className="h-4 w-4 text-indigo-600"
                  />
                  <div className='flex gap-2'>
                    <img
                      alt={exchange?.exchange_name}
                      src={exchange.exchange_thumbnail}
                      className='w-[6rem] object-contain bg-gray-400 rounded-md p-1 dark:p-0'
                    />
                    <span className='bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300'>
                      {exchange?.type}
                    </span>
                  </div>
                </div>
                <div className='flex flex-col gap-1 text-sm'>
                  <p className='text-sm text-gray-300'>
                    {exchange?.exchange_external_name}
                  </p>
                  <p className='text-gray-400'>
                    ID: {exchange?.external_id}
                  </p>
                  <p className='text-gray-400'>
                    {moment.unix(exchange?.createdAt?.seconds).fromNow()}
                  </p>
                  <p className='text-gray-400'>
                    {exchange?.external_name}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Trading Plan Selection */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Select Trading Plan
            </h3>
            <Tooltip text="Choose a trading plan that matches your trading style and risk tolerance.">
              <FaRegCircleQuestion className="text-gray-400 hover:text-gray-600" />
            </Tooltip>
          </div>
          <p className="text-sm text-gray-500">
            Choose a trading plan that matches your trading style and risk tolerance.
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {tradingPlans
              ?.filter(plan => plan.marketType?.toLowerCase() === marketType)
              ?.map((plan) => (
                <label
                  key={plan.id}
                  className={cn(
                    'flex cursor-pointer flex-col space-y-2 rounded-lg border p-4 transition-colors',
                    selectedTradingPlan?.id === plan.id
                      ? 'border-indigo-600 bg-indigo-500'
                      : 'border-gray-200 hover:border-indigo-200'
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="tradingPlan"
                      checked={selectedTradingPlan?.id === plan.id}
                      onChange={() => setSelectedTradingPlan(plan)}
                      className="h-4 w-4 text-indigo-600"
                    />
                    <p className='text-lg font-bold text-gray-50'>
                      {plan?.name}
                    </p>
                  </div>
                  {plan.description && (
                    <p className="text-sm text-gray-700">{plan.description}</p>
                  )}
                </label>
              ))}
          </div>
        </div>

        {/* Pair Configuration */}
        {selectedTradingPlan && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Configure Trading Pairs
                </h3>
                <Tooltip text="Configure multiple pairs at once. Each pair will create a separate autotrader with its own trade amount.">
                  <FaRegCircleQuestion className="text-gray-400 hover:text-gray-600" />
                </Tooltip>
              </div>
              <button
                onClick={addPairConfig}
                className="flex items-center space-x-1 rounded-lg bg-indigo-100 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200"
              >
                <span>Add More</span>
                <span className="text-lg">+</span>
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Configure multiple pairs at once. Each pair will create a separate autotrader with its own trade amount.
            </p>

            <div className="space-y-4">
              {selectedPairConfigs.map((config, index) => (
                <div
                  key={index}
                  className="relative rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  {selectedPairConfigs.length > 1 && (
                    <button
                      onClick={() => removePairConfig(index)}
                      className="absolute right-2 top-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}

                  <div className="flex lg:flex-row flex-col gap-4">
                    <div className="flex-1">
                      <label className="mb-2 block text-sm font-medium text-gray-200">
                        Select Pair {index + 1}
                      </label>
                      <Listbox value={config.pair} onChange={(pair) => updatePairConfig(index, 'pair', pair)}>
                        <div className="relative mt-1">
                          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2.5 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-300">
                            {config.pair ? (
                              <div className="flex items-center">
                                <PairImageComponent pair={config.pair?.pair} showUsdt={false} />
                                <span className="ml-2 block truncate text-gray-900">{config.pair?.pair}</span>
                              </div>
                            ) : (
                              <span className="block truncate text-gray-500">Select a pair</span>
                            )}
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {pairs?.map((pair) => (
                                <Listbox.Option
                                  key={pair.id}
                                  className={({ active }) =>
                                    `relative cursor-pointer select-none py-2 pl-3 pr-9 ${active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                                    }`
                                  }
                                  value={pair}
                                >
                                  {({ selected, active }) => (
                                    <div className="flex items-center">
                                      <PairImageComponent pair={pair?.pair} showUsdt={false} />
                                      <span className={`ml-2 block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                        {pair?.pair}
                                      </span>
                                      {selected && (
                                        <span
                                          className={`absolute inset-y-0 right-0 flex items-center pr-3 ${active ? 'text-indigo-600' : 'text-indigo-600'
                                            }`}
                                        >
                                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <label className="mb-2 block text-sm font-medium text-gray-200">
                          Trade Amount
                        </label>
                        <Tooltip text="Enter the trade amount for this pair.">
                          <FaRegCircleQuestion className="text-gray-400 hover:text-gray-600" />
                        </Tooltip>
                      </div>
                      <div className="relative mt-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          value={config.tradeAmount}
                          onChange={(e) => updatePairConfig(index, 'tradeAmount', e.target.value)}
                          placeholder="Enter trade amount"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-7 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                      {!userPackage && (
                        <p className="mt-1 text-xs text-gray-500">
                          Free tier limited to $100 maximum trade amount
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Modal Footer */}
        <div className="flex items-center space-x-2 border-t border-gray-200 p-6">
          <button
            onClick={handleClose}
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:bg-indigo-300"
          >
            {loading && <Spinner size="sm" className="mr-2" />}
            Create Autotrader
          </button>
        </div>
      </div>
    </Modal>
  );
}

ModalAddAutotraderNew.propTypes = {
  addModal: PropTypes.bool,
  setAddModal: PropTypes.func,
  setShowPricing: PropTypes.func,
};
