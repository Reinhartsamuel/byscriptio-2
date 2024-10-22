'use client';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // ES6
import {
  deleteDocumentFirebase,
  getCollectionFirebase,
} from '../utils/firebaseApi';
import Spinner from './ui/Spinner';
import Swal from 'sweetalert2/dist/sweetalert2.js';

const DeleteAutotraderComponent = ({ detail }) => {
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setShowDelete(false);
    return () => setShowDelete(false);
  }, []);

  async function getLatestSignal(bot_id) {
    setLoading(true);
    try {
      return (
        (await getCollectionFirebase(
          '3commas_logs',
          [{ field: 'bot_id', operator: '==', value: bot_id }],
          { field: 'createdAt', direction: 'desc' },
          3
        )) || []
      );
      // console.log(findLastSignal, 'findLastSignal');
    } catch (error) {
      console.error(error.message, 'error getLatestSignal');
      return 'error';
    } finally {
      setLoading(false);
    }
  }

  async function deleteAutotrader() {
    setLoading(true);
    console.log(`deleting id ${detail.id}`);
    try {
      await deleteDocumentFirebase('dca_bots', detail.id);
      // await getAutotraders()
      window.location.reload()
      Swal.fire({
        title: 'Deleted!',
        text: 'autotrader has been deleted.',
        icon: 'success',
      });
    } catch (error) {
      return Swal.fire({
        icon: 'error',
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function promptDeleteAutotrader() {
    try {
      // check if autotrader is on STOPPED state
      // if not, DO NOT DELETE!!
      if (detail?.status !== 'STOPPED') {
        throw new Error(
          'Autotrader has to be on STOPPED state before deleting.'
        );
      }

      // check if autotrader has any active orders
      // if yes, DO NOT DELETE!!
      if (detail.bot_id) {
        const findLastSignal = await getLatestSignal(detail.bot_id);
        const lastAction =
          findLastSignal[0]?.response?.value?.action === 'close_at_market_price'
            ? 'SELL'
            : 'BUY';
        if (lastAction !== 'SELL') {
          throw new Error(
            `You have a ${lastAction} order on ${findLastSignal[0]?.response?.value?.pair}. Please close it first.`
          );
        }
      }

      // PROCEED with deletion
      Swal.fire({
        title: 'Are you sure to delete this autotrader?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ba0109',
        cancelButtonColor: '#444444',
        confirmButtonText: 'Delete autotrader',
      }).then((result) => {
        if (result.isConfirmed) {
          deleteAutotrader();
        }
      });
    } catch (error) {
      console.error(error.message);
      return Swal.fire({
        icon: 'error',
        text: error.message,
      });
    }
  }
  return (
    <div className='border-[0.1rem] border-red-900 rounded-lg p-2 '>
      <div className='flex flex-col items-center'>
        <p className='text-red-700 text-center mx-auto cursor-pointer'>
          danger!
        </p>
        {showDelete ? (
          loading ? (
            <div className='w-full flex justify-center items-center'>
              <Spinner />
            </div>
          ) : (
            <button
              onClick={promptDeleteAutotrader}
              type='button'
              className='focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'
            >
              Delete autotrader
            </button>
          )
        ) : (
          <button
            onClick={() => setShowDelete(true)}
            type='button'
            className='text-gray-300 text-sm '
          >
            Delete Autotrader
          </button>
        )}
      </div>
    </div>
  );
};

export default DeleteAutotraderComponent;

DeleteAutotraderComponent.propTypes = {
  detail: PropTypes.any,
};