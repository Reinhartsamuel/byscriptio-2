import { cn } from '@/lib/util';
import React, { useState, useMemo } from 'react';
import { useUserStore } from '../store/userStore';
import { copyTextToClipboard } from '../utils/copyTextToClipboard';
import Modal from './ui/Modal';
import { FaRegCopy } from 'react-icons/fa6';
import PropTypes from 'prop-types';
import { onCheck3CApi } from '../services/checkExchangesOn3Commas';
import generateRandomString from '../utils/generateRandomString';

export default function ModalAddExchange({
  openModal,
  setOpenModal,
  exchangeName,
  exchangeThumbnail,
}) {
  const { customer } = useUserStore();
  const [loading, setLoading] = useState(false);
  // const [openDialogue, setOpenDialogue] = useState(false);
  const newlyCreatedId = useMemo(() => generateRandomString(), [openModal]);
  const lowercaseExchangeName = exchangeName ? (exchangeName || '').toLowerCase() : '';

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)}>
      <div className='flex justify-between p-4 md:p-5 border-b rounded-t border-gray-600'>
        <div className='flex flex-col gap-2 w-full items-center'>
          <h3 className='text-2xl font-semibold text-gray-800 dark:text-white'>
            Connect Exchange {exchangeName}
          </h3>
          <p className='font-light text-sm text-gray-500 dark:text-gray-200'>
            You will be redirected to byScript exchange portal
          </p>
        </div>
      </div>
      {/* <!-- Modal body --> */}
      <div className='p-4 md:p-5 space-y-4 flex flex-col items-center'>
        <p className='text-center text-xl lg:text-4xl font-bold text-gray-800 dark:text-gray-200'>
          <span className='italic text-red-500 underline'>IMPORTANT! </span><br />
          {'   '}Please follow below steps!
        </p>
        <ul className='list-decimal text-white items-center flex flex-col'>
          <li>Please copy this unique id below:</li>
          <li>Click &quot;Continue to exchange portal&quot;</li>
          <li>On the &quot;Name&quot; input, please paste the below id</li>
          <li>After connecting your exchange, please click <span className='text-green-400'>I already connected my exhcange</span> below.</li>
        </ul>
        <a
          className='text-gray-400 underline text-sm font-light hover:text-blue-500'
          href={`https://docs.byscript.io/exchange/${lowercaseExchangeName === 'gate' ? 'gate.io' : lowercaseExchangeName
            }`}
          target='_blank'
          rel='noopener noreferrer'
        >
          {' '}
          How to connect my {exchangeName} exhcange?
        </a>
        <div className='flex gap-2 items-center'>
          <h3 className='text-2xl lg:text-5xl font-bold text-yellow-500 dark:text-yellow-300'>
            {newlyCreatedId}
          </h3>
          <button
            onClick={() => copyTextToClipboard(newlyCreatedId)}
            className='ease-out duration-100 hover:scale-105 hover:shadow-lg active:scale-95 text-white border-[1px] border-gray-100 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-lg px-5 py-2.5 me-2 mb-2'
          >
            <FaRegCopy color={'gray'} />
          </button>
        </div>

        <div className='flex gap-2 flex-col lg:flex-row'>
          <button
            data-modal-hide='default-modal'
            type='button'
            className={cn(
              'text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-lg px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800'
            )}
            onClick={() =>
              window.open(
                'https://exchange.byscript.io/signup/byscript_exchange_connect',
                '_blank'
              )
            }
          >
            Continue to Exchange Portal
          </button>
          <button
            data-modal-hide='default-modal'
            type='button'
            className={cn(
             'text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-lg px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800',
              loading && 'cursor-not-allowed'
            )}
            onClick={() =>
              onCheck3CApi({
                setLoading,
                customer,
                exchangeName,
                exchangeThumbnail,
                newlyCreatedId
              })
            }
            disabled={loading}
          >
            {loading ? 'Loading...' : 'I already connected my exchange'}
          </button>
        </div>
        <img
          src={'./paste-here.png'}
          className='sm:w-full lg:w-3/4 object-contain'
        />
      </div>
      {/* <Modal open={openDialogue} onClose={() => setOpenDialogue(false)}>
        test
      </Modal> */}
    </Modal>
  );
}
ModalAddExchange.propTypes = {
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  exchangeName: PropTypes.string.isRequired,
  exchangeThumbnail: PropTypes.string.isRequired,
};
