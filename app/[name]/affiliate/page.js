'use client';
// const AffiliateWithdrawalListComponent = dynamic(() => import('@/app/components/AffiliateWithdrawalListComponent'), {
//   ssr: false,
// });
// const AffiliateeComponent = dynamic(() => import( '@/app/components/AffiliateeComponent'), {
//   ssr: false,
// });
// const WithdrawableComponent = dynamic(() => import('@/app/components/WithdrawableComponent'), {
//   ssr: false,
// });

import AffiliateWithdrawalListComponent from '@/app/components/AffiliateWithdrawalListComponent';
import AffiliateeComponent from '@/app/components/AffiliateeComponent';
import WithdrawableComponent from '@/app/components/WithdrawableComponent';


import { priceFormat } from '@/app/utils/priceFormat';
import React from 'react';
import { useUserStore } from '@/app/store/userStore';
import useFetchData from '@/app/hooks/QueryHook';
import { FaRegCopy } from 'react-icons/fa6';
import { PricingComponent } from '@/app/components/PricingComponent';
import useCountDocuments from '@/app/hooks/CountHook';
import dynamic from 'next/dynamic';
import { copyTextToClipboard } from '@/app/utils/copyTextToClipboard';
// import { FaRegCopy } from 'react-icons/fa6';

const page = async () => {
  const { customer, userPackage } = useUserStore();

  const { data: childrenAffiliate, error } = useFetchData({
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
    limitQuery: 200,
    dependencies: [customer?.id],
  });

  const { count: totalReferral } = useCountDocuments({
    conditions: [
      {
        field: 'affiliatorCustomerId',
        operator: '==',
        value: customer?.id || '',
      },
    ],
    dependencies: [customer?.id],
    authRequired: true,
  });
  const { count: activeReferrals } = useCountDocuments({
    conditions: [
      {
        field: 'affiliatorCustomerId',
        operator: '==',
        value: customer?.id || '',
      },
      { field: 'paymentStatus', operator: '==', value: 'PAID' },
      { field: 'expiredAt', operator: '>', value: new Date() },
    ],
    collectionName: 'subscriptions',
    dependencies: [customer?.id],
    authRequired: true,
  });

  if (!customer) return <></>;

  if (customer && !userPackage) {
    return <PricingComponent />;
  }

  return (
    <div className='w-screen min-h-screen flex flex-col mx-auto px-1 lg:px-6 '>
      <div className='fixed top-0 left-0 z-[-2] h-screen w-screen dark:bg-neutral-950  bg-[radial-gradient(ellipse_80%_80%_at_50%_-5%,rgba(120,119,198,0.4),rgba(255,255,255,0))]' />
      <h2 className='text-xl my-5 font-bold text-gray-800 dark:text-gray-100 font-bold'>
        Affiliate Program
      </h2>
      {error && <p className='text-red-500'>{error.message}</p>}
      <div className='flex w-full grid grid-cols-1 lg:grid-cols-3 divide-x divide-gray-500'>
        <div className='px-2 lg:px-5'>
          <p className='text-gray-800 dark:text-gray-400 font-light'>
            Total Referal
          </p>
          <h3 className='text-gray-800 dark:text-white text-xl font-bold'>{totalReferral || 0}</h3>
        </div>
        <div className='px-2 lg:px-5'>
          <p className='text-gray-800 dark:text-gray-400 font-light'>
            Active Referrals
          </p>
          <h3 className='text-gray-800 dark:text-white text-xl font-bold'>{activeReferrals}</h3>
        </div>
        <div className='px-2 lg:px-5'>
          <p className='text-gray-800 dark:text-gray-400 font-light'>Income</p>
          <h3 className='text-gray-800 dark:text-white text-xl font-bold'>
            Rp{' '}
            {priceFormat(
              childrenAffiliate
                ?.filter((x) => x?.paymentStatus === 'PAID')
                ?.reduce((a, b) => a + b?.price, 0) || 0
            )}
          </h3>
        </div>
      </div>
      <div className='mt-2 lg:mt-5 p-2 flex w-full grid grid-cols-1 lg:grid-cols-2 divide-x divide-gray-500 border border-[2px] border-gray-400 dark:border-gray-700'>
        <div className='w-full p-4 shadow-md font-sans flex flex-col gap-4  cursor-pointer'>
          <p
            className='text-gray-700 dark:text-gray-200 text-sm'
            onClick={() => console.log(customer)}
          >
            Share your link:
          </p>
          <div className='flex gap-2'>
            <input
              readOnly
              className='bg-gray-50 border border-gray-200 text-gray-500 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              value={`https://byscript.io/auth/login?c=${customer?.id}`}
            />
            <button
              onClick={() =>
                copyTextToClipboard(
                  `https://byscript.io/auth/login?c=${customer?.id}`
                )
              }
              className='ease-out duration-100 hover:scale-105 hover:shadow-lg active:scale-95 text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'
            >
              <FaRegCopy color={'gray'} />
            </button>
          </div>
        </div>
        <WithdrawableComponent customer={customer} />
      </div>
      <div className='grid grid-cols-1 gap-0'>
        {customer?.id && (
          <AffiliateeComponent childrenAffiliate={childrenAffiliate} />
        )}
        {customer?.id && (
          <AffiliateWithdrawalListComponent customerId={customer?.id} />
        )}
      </div>
    </div>
  );
};

export default page;
