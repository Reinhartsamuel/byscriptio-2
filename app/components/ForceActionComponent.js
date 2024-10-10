import React, { useState } from 'react'
import useForceAction from '../hooks/forceActionHook';
import Spinner from './ui/Spinner';
import { IoEnter, IoExit } from 'react-icons/io5';
import { cn } from '@/lib/util';
import PropTypes from 'prop-types'; // ES6

export default function ForceActionComponent({ detail }) {
    const [loading, setLoading] = useState(false);
    const [selectedPair, setSelectedPair] = useState('');
    const { handleForce } = useForceAction({ detail, setLoading, pair:selectedPair });
  
    return (
      <div className='rounded-lg bg-gray-800 p-4 shadow-md mx-2 font-sans flex flex-col gap-1 flex-wrap'>
        <h1>Force Entry / Exit</h1>
        <div className='flex flex-col gap-0'>
          {detail?.trading_plan_pair?.map((j, i) => (
            <div className='flex items-center mb-4' key={i}>
              <input
                id='default-radio-1'
                type='radio'
                checked={selectedPair === j?.split('_')?.slice(1)?.join('_')}
                value={j}
                onChange={(e) => {
                  console.log(e.target.checked);
                  console.log(e.target.value?.split('_')?.slice(1)?.join('_'), 'test changee')
                  if (e.target.checked) return setSelectedPair(e.target.value?.split('_')?.slice(1)?.join('_'))
                    setSelectedPair('')
                }}
                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
              />
              <label
                htmlFor=''
                className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
              >
                {j?.split('_')?.slice(1)?.join('_')}
              </label>
            </div>
          ))}
        </div>
  
        <div className='flex flex-col lg:flex-row gap-2'>
          <button
            onClick={() => handleForce('entry')}
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
                <p className='whitespace-nowrap'>Force Entry</p>
              </>
            )}
          </button>
          <button
            onClick={() => handleForce('exit')}
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
                <p className='whitespace-nowrap'>Force Exit</p>
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