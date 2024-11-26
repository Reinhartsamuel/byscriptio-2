'use client';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { priceFormat } from '../utils/priceFormat';
import moment from 'moment';
import ModalRequestWithdrawal from './ModalRequestWithdrawal';

const WithdrawableComponent = ({ customer }) => {
  const [data, setData] = useState({});
  const [reqWithdrawalModal, setReqWithdrawModal] = useState(false);

  useEffect(() => {
    async function getWithdrawal() {
      try {
        if (!customer?.id) return;
        const res = await fetch(
          `/api/affiliate/get-withdrawable/?customerId=${customer?.id}`
        );
        const { status, data } = await res.json();
        // console.log(data, 'withdrawal data');
        if (!status) {
          return setData({});
        }
        setData(data);
      } catch (error) {
        console.log(error.message);
      }
    }
    getWithdrawal();
  }, [customer?.id]);
  return (
    <div className='px-2 lg:px-5 w-full font-sans flex flex-col gap-4 cursor-pointer'>
      <div className='flex w-full justify-between'>
        <p className='text-gray-700 dark:text-gray-200 text-sm'>Withdrawable:</p>
        <button
          onClick={() =>
            // Swal.fire({ icon: 'warning', text: 'Withdrawal coming soon' })
            setReqWithdrawModal(true)
          }
          type='button'
          className='py-1 px-2 me-2 mb-2 text-sm font-medium text-green-600 dark:text-green-500 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700  focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
        >
          Withdraw
        </button>
      </div>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <div className='flex w-full justify-between'>
        <h3 className='text-gray-800 dark:text-white text-xl font-bold'>
          Rp {priceFormat(data?.withdrawable)}
        </h3>
        {data?.lastWithdrawal && (
          <p className='text-gray-400 text-sm'>
            Last withdraw {moment.unix(data?.lastWithdrawal?.createdAt?.['_seconds']).format('DD MMM YYYY')}
          </p>
        )}
      </div>
      <ModalRequestWithdrawal
        data={data}
        reqWithrawModal={reqWithdrawalModal}
        setReqWithdrawModal={setReqWithdrawModal}
      />
    </div>
  );
};

export default WithdrawableComponent;

WithdrawableComponent.propTypes = {
  customer: PropTypes.any,
};
