'use client';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { priceFormat } from '../utils/priceFormat';
import moment from 'moment';

const WithdrawableComponent = ({ customer }) => {
  const [data, setData] = useState({});
  useEffect(() => {
    async function getWithdrawal() {
      try {
        const res = await fetch(
          `/api/affiliate/get-withdrawable/?customerId=${customer?.id}`
        );
        const data = await res.json();
        setData(data);
      } catch (error) {
        console.log(error.message);
      }
    }
    getWithdrawal();
  }, []);
  return (
    <div className='mt-5 w-full rounded-lg bg-gray-800 p-4 shadow-md font-sans flex flex-col gap-4  cursor-pointer'>
      <div className='flex w-full justify-between'>
        <p className='text-gray-400 text-sm'>Withdrawable:</p>
        <button
          onClick={() =>
            Swal.fire({ icon: 'warning', text: 'Withdrawal not available' })
          }
          type='button'
          className='py-1 px-2 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
        >
          Withdraw
        </button>
      </div>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <div className="flex w-full justify-between">
          <h3 className='text-xl font-bold'>
            Rp {priceFormat(data?.withdrawable)}
          </h3>
          <p className='text-gray-400 text-sm'>Last withdraw {moment(data?.paidAt).format('DD MMM YYYY')}
          </p>
      </div>
    </div>
  );
};

export default WithdrawableComponent;

WithdrawableComponent.propTypes = {
  customer: PropTypes.any,
};
