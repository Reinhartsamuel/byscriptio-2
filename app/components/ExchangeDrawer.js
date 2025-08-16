'use client';
import React, { useState } from 'react';
import { exchanges } from '../dummy';
import Drawer from './ui/Drawer';
import PropTypes from 'prop-types';
import { IoMdClose } from 'react-icons/io';
import ModalAddExchange from './ModalAddExchange';
//  ${open ? 'visible bg-gray-900 bg-opacity-90' : 'invisible'}
const ExchangeDrawer = ({ drawerOpen, toggleDrawer }) => {
  const [openModal, setOpenModal] = useState(false);
  const [exchangeName, setExchangeName] = useState('');
  const [exchangeThumbnail, setExchangeThumbnail] = useState('');

  function handleAddExchange(x) {
    setExchangeName(x?.exchange_name);
    setExchangeThumbnail(x?.exchange_thumbnail);
    toggleDrawer();
    return setOpenModal(true);
  }
  return (
    <>
     <ModalAddExchange
        openModal={openModal}
        setOpenModal={setOpenModal}
        exchangeName={exchangeName}
        exchangeThumbnail={exchangeThumbnail}
      />
      <Drawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer}>
        <div className='p-4'>
          <h2 className='text-xl font-semibold mb-4 text-gray-800 dark:text-white'>
            Connect Exhange
          </h2>
          <div className='flex flex-col gap-2 overflow-scroll'>
            {exchanges.map((exchange, i) => (
              <div
                key={i}
                className='flex justify-between gap-2 max-w-sm p-4 border rounded-lg shadow border-gray-300 dark:bg-gray-900 dark:border-gray-700 max-h-[8rem]'
              >
                <img
                  alt={exchange?.exchange_name}
                  src={exchange.exchange_thumbnail}
                  className='w-[6rem] object-contain bg-gray-700 rounded-md p-1 dark:p-0  dark:rounded-none'
                />
                <button
                  className='flex w-full justify-end text-sm underline text-gray-600 dark:text-gray-400'
                  onClick={() => handleAddExchange(exchange)}
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={toggleDrawer}
            className='absolute top-2 right-2 p-1 rounded-lg text-gray-700 dark:text-gray-400 dark:bg-gray-600 hover:bg-gray-50 hover:text-gray-600'
          >
            <IoMdClose />
          </button>
        </div>
      </Drawer>
    </>
  );
};

export default ExchangeDrawer;
ExchangeDrawer.propTypes = {
  drawerOpen: PropTypes.bool,
  toggleDrawer: PropTypes.func,
};
