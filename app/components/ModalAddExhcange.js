import { cn } from '@/lib/util';
import React, { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { copyTextToClipboard } from '../utils/copyTextToClipboard';
import Modal from './ui/Modal';
import { FaRegCopy } from 'react-icons/fa6';
import PropTypes from 'prop-types';
import { onCheck3CApi } from '../services/checkExchangesOn3Commas';

export default function ModalAddExchange({
  openModal,
  setOpenModal,
  exchangeName,
  exchangeThumbnail,
}) {
  const { customer } = useUserStore();
  const [loading, setLoading] = useState(false);
  const lowercaseExchangeName = exchangeName && exchangeName.toLowerCase();

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
        <p className='text-center text-md lg:text-xl font-bold text-gray-800 dark:text-gray-200'>
          <span className='italic text-red-500 underline'>IMPORTANT! </span>
          {'   '}Please make sure to copy this id and paste on &quot;Name&quot;
          input field, otherwise your exhcange will not be connected!!
        </p>
        <a
          className='text-gray-800 dark:text-gray-200 underline text-sm font-light hover:text-blue-500'
          href={`https://docs.byscript.io/exchange/${
            lowercaseExchangeName === 'gate' ? 'gate.io' : lowercaseExchangeName
          }`}
          target='_blank'
          rel='noopener noreferrer'
        >
          {' '}
          How to connect my {exchangeName} exhcange?
        </a>
        <div className='flex gap-2 items-center'>
          <h3 className='text-xl font-bold text-yellow-500 dark:text-yellow-300'>
            {customer?.id}
          </h3>
          <button
            onClick={() => copyTextToClipboard(customer?.id || '')}
            className='ease-out duration-100 hover:scale-105 hover:shadow-lg active:scale-95 text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'
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
                'https://client.3commas.io/signup/byscript_exchange_connect-6c8cbefd',
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
              'underline focus:ring-4 focus:outline-none font-medium rounded-lg text-lg font-light text-black dark:text-white px-5 py-2.5 text-center',
              loading && 'cursor-not-allowed'
            )}
            onClick={() =>
              onCheck3CApi({
                setLoading,
                customer,
                exchangeName,
                exchangeThumbnail,
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
    </Modal>
  );
}
ModalAddExchange.propTypes = {
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  exchangeName: PropTypes.string.isRequired,
  exchangeThumbnail: PropTypes.string.isRequired,
};
