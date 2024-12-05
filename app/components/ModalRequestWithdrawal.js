'use client'
import { cn } from '@/lib/util';
import Modal from './ui/Modal';
import React, { useEffect, useState } from 'react';
import Spinner from './ui/Spinner';
import PropTypes from 'prop-types';
import { priceFormat } from '../utils/priceFormat';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { listBanks } from '../utils/banks';
import { addDocumentFirebase } from '../utils/firebaseApi';
import { useUserStore } from '../store/userStore';
import { useRouter } from 'next/navigation';

export default function ModalRequestWithdrawal({
  data,
  reqWithrawModal,
  setReqWithdrawModal,
}) {
  const [loading, setLoading] = useState(false);
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
   const [accountName, setAccountName] = useState('');
  const { customer } = useUserStore();
  const router = useRouter();

  async function handleAdd () { 
    setLoading(true);
    try {
        if (!customer?.id) throw new Error('no customer');
        const customerWithoutId = JSON.parse(JSON.stringify(customer));
        delete customerWithoutId.id;
        await addDocumentFirebase('affiliate_withdrawals', {
            ...customerWithoutId,
            customerId : customer?.id,
            uid : customer?.uid,
            withdrawAmount : data?.withdrawable,
            bank : bankCode,
            accountNumber,
            paymentStatus : 'REQUESTED',
            receipt:'',
            accountName
        });
        Swal.fire('Success', 'Withdrawal request has been sent, please wait for fund to be transferred to your bank account.', 'success');
        setReqWithdrawModal(false);
        if (!window?.location?.href?.includes('affiliate')) {
          router.push(window?.location?.pathname + '/affiliate')
        }
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    } finally {
        setLoading(false);
    }
  }
  function handleConfirm() {
    if(!bankCode) return Swal.fire('Oops!', 'Please select bank', 'warning');
    if(!accountNumber) return Swal.fire('Oops!', 'Please input bank account', 'warning');
      console.log({
        bank_code: bankCode,
        account_number: accountNumber,
        amount: data?.withdrawable,
      });
      Swal.fire({
        icon: 'question',
        showConfirmButton: true,
        title : 'Confirm Withdraw', 
        text: `Are you sure you want to request withdrawal of ${priceFormat(
          data?.withdrawable
        )} to ${bankCode} ${accountNumber}?`,
        showDenyButton: true,
        denyButtonText : 'Cancel',
        confirmButtonText : 'Yes',
        confirmButtonColor :'green',
        denyButtonColor : '#2d2d2d',
      }).then((result) => {
        if (result.isConfirmed) {
          handleAdd();
        } else if (result.isDenied) {
          Swal.fire('Canceled', '', 'info');
        }
      });

  }
  useEffect(() => {
    async function get() {
      setLoading(true);
      try {
        console.count('getting data');
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    }
    get();
  }, []);

  return (
    <Modal open={reqWithrawModal} onClose={() => setReqWithdrawModal(false)}>
      <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600'>
        <div className='flex flex-col gap-2'>
          <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
            Request Withdrawal
          </h3>
          <p className='font-extralight text-sm text-slate-600 dark:text-slate-400 whitespace-wrap'>
            Your withdrawable balance is Rp {priceFormat(data?.withdrawable)}
          </p>
        </div>
      </div>

      {/* <pre>{JSON.stringify(detail, null, 2)}</pre> */}
      <div className='flex flex-col gap-2 my-10'>
        <div className='flex flex-col gap-1'>
          <p className='text-gray-800 dark:text-gray-100 font-bold'>
            Withdrawal can take up to 2-3 working days. Once disbursed, you will
            be notified.
          </p>
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='first_name' className='text-gray-600 dark:text-gray-200'>
            Your withdrawable balance is{' '}
            <span className='text-green-500'>
              Rp {priceFormat(data?.withdrawable)}
            </span>, admin fee <span className='text-red-500'>Rp {priceFormat(2500)}</span>
          </label>
        </div>
        <div className='flex flex-col gap-1 mt-10'>
          <label htmlFor='first_name' className='text-gray-600 dark:text-gray-400'>
            Select Bank:
          </label>

          <form className='w-full'>
            <label htmlFor='underline_select' className='sr-only'>
              Select Bank:
            </label>
            <select
              onChange={(e) => setBankCode(e.target.value)}
              id='underline_select'
              className='block py-2.5 px-0 w-full text-lg bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer'
            >
              {listBanks.map((x, i) => (
                <option key={i} value={x.bank_code}>
                  {x.name}
                </option>
              ))}
            </select>
          </form>
        </div>
        <div className='flex flex-col gap-1 mt-10'>
          <label htmlFor='first_name' className='text-gray-600 dark:text-gray-400 font-bold'>
            Account Number (no. rekening) :
          </label>
          <div className='flex'>
            <input
              type='number'
              className='rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>
        </div>
        <div className='flex flex-col gap-1 mt-10'>
          <label htmlFor='first_name' className='text-gray-600 dark:text-gray-400 font-bold'>
            Account Name (atas nama) :
          </label>
          <div className='flex'>
            <input
              type='text'
              className='rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className='flex flex-wrap gap-1 justify-end items-center p-4 md:p-5'>
        <button
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-600 text-white bg-green-600 hover:bg-green-700 active:bg-green-500 transition duration-200',
            loading ? 'opacity-50 cursor-not-allowed whitespace-nowrap' : '',
            'whitespace-nowrap' // add this to prevent text from breaking into a new line
          )}
          disabled={loading}
          onClick={handleConfirm}
        >
          {loading ? <Spinner /> : <p>Request Withdraw</p>}
        </button>
      </div>
    </Modal>
  );
}

ModalRequestWithdrawal.propTypes = {
  data: PropTypes.any,
  reqWithrawModal: PropTypes.bool,
  setReqWithdrawModal: PropTypes.func,
};
