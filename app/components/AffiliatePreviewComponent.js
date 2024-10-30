'use client';
import React, { useEffect, useState } from 'react';
import { FaRegCopy } from 'react-icons/fa6';
import { useUserStore } from '../store/userStore';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import AffiliateeComponent from './AffiliateeComponent';
import useFetchData from '../hooks/QueryHook';
import { priceFormat } from '../utils/priceFormat';
const AffiliatePreviewComponent = () => {
  const { customer } = useUserStore();
  const [realtimeData, setRealtimeData] = useState({});

  async function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      Swal.fire({
        icon: 'success',
        title: 'Copied!',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
      });
    }
  }

  const { data: childrenAffiliate,error } = useFetchData({
    type: 'getDocs',
    collectionName: 'subscriptions',
    conditions: [
      {
        field: 'affiliatorCustomerId',
        operator: '==',
        value: customer?.id || '',
      },
    ],
    authRequired: true,
    dependencies: [customer?.id],
    limitQuery:200
  });

  useEffect(() => {
    let unsub = () => {};
    if (customer?.id) {
      unsub = onSnapshot(doc(db, 'customers', customer.id), (doc) => {
        // console.log('Current data: ', { id: doc.id, ...doc.data() });
        setRealtimeData({ id: doc.id, ...doc.data() });
      });
    }
    return () => unsub();
  }, [customer?.id]);

  return (
    <div className='mt-10 mx-2 lg:mx-6'>
      <h2 className='text-xl my-5 font-bold text-slate-200 font-bold'>
        Affiliate Program
      </h2>
      {error && <p>{error.message}</p>}
      <div className='w-full grid grid-cols-2 lg:grid-cols-4 gap-2'>
        <div className='flex flex-col justify-between gap-2 w-full p-2 lg:p-4 border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700'>
          <p className='text-gray-200 font-light'>Active Referrals</p>
          <h3 className='text-xl font-bold'>
            {realtimeData.activeReferrals || 0}
          </h3>
        </div>
        <div className='flex flex-col justify-between gap-2 w-full p-2 lg:p-4 border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700'>
          <p className='text-gray-200 font-light'>Link Clicks</p>
          <h3 className='text-xl font-bold'>
            {realtimeData.affiliateClicks || 0}
          </h3>
        </div>
        <div className='flex flex-col justify-between gap-2 w-full p-2 lg:p-4 border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700'>
          <p className='text-gray-200 font-light'>Conversion</p>
          <h3 className='text-xl font-bold'>Rp {priceFormat(childrenAffiliate?.filter((x) => x?.paymentStatus === 'PAID')?.reduce((a, b) => a + b?.price, 0) || 0)}</h3>
        </div>
        <div className='flex flex-col justify-between gap-2 w-full p-2 lg:p-4 border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700'>
          <p className='text-gray-200 font-light'>Income</p>
          <h3 className='text-xl font-bold'>{realtimeData.income || 0}</h3>
        </div>
      </div>

      <div className='mt-5 w-full rounded-lg bg-gray-800 p-4 shadow-md font-sans flex flex-col gap-4  cursor-pointer'>
        <p
          className='text-gray-400 text-sm'
          onClick={() => console.log(customer)}
        >
          Share your link:
        </p>
        <div className='flex gap-2'>
          <input
            readOnly
            className='bg-gray-50 border border-gray-200 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            value={`${window.location.origin}/auth/login?c=${customer?.id}`}
          />
          <button
            onClick={() =>
              copyTextToClipboard(
                `${window.location.origin}/auth/login?c=${customer?.id}`
              )
            }
            className='ease-out duration-100 hover:scale-105 hover:shadow-lg active:scale-95 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'
          >
            <FaRegCopy />
          </button>
        </div>
      </div>
      <AffiliateeComponent childrenAffiliate={childrenAffiliate} />
    </div>
  );
};

export default AffiliatePreviewComponent;
