'use client';
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { priceFormat } from '../utils/priceFormat';
import { cn } from '@/lib/util';

const AffiliateeComponent = ({ childrenAffiliate }) => {
  return (
    <div className='mt-5 w-full rounded-lg dark:bg-gray-800 p-4 shadow-md font-sans flex flex-col gap-4  cursor-pointer'>
      <p className='text-gray-700 dark:text-gray-200 text-sm'>
        Purchases by affiliatee
      </p>
      <div className='overflow-scroll'>
        <table className='w-full overflow-scroll text-xs text-left text-gray-500 dark:text-gray-400 mx-auto'>
          <thead className='top-0 right-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              <th scope='col' className='px-2 py-1 text-xs whitespace-nowrap'>
                customer
              </th>

              <th scope='col' className='px-2 py-1 text-xs whitespace-nowrap'>
                payment date
              </th>
              <th scope='col' className='px-2 py-1 text-xs whitespace-nowrap'>
                affiliate purchase
              </th>
              <th scope='col' className='px-2 py-1 text-xs whitespace-nowrap'>
                payment status
              </th>
              <th scope='col' className='px-2 py-1 text-xs whitespace-nowrap'>
                commission
              </th>
              <th scope='col' className='px-2 py-1 text-xs whitespace-nowrap'>
                level
              </th>
            </tr>
          </thead>
          <tbody>
            {childrenAffiliate?.length > 0 ? (
              childrenAffiliate?.map((x, i) => (
                <tr
                  className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'
                  key={i}
                >
                  <td className='px-2 py-1 text-xs font-medium w-auto text-gray-900 dark:text-gray-300'>
                    <div className='w-[15rem] flex gap-2 items-center'>
                      <img
                        className='w-10 h-10 rounded-full'
                        src={
                          x?.photoURL || 'https://avatar.iran.liara.run/public'
                        }
                        alt='Rounded avatar'
                      />
                      <div className='flex flex-col w-fit'>
                        <p>{x?.name}</p>
                        <p>{x?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className='px-2 py-1 text-xs whitespace-nowrap'>
                    {moment
                      .unix(x?.createdAt?.seconds)
                      .format('ddd, DD MMMM YYYY HH:mm')}
                  </td>
                  <td className='px-2 py-1 text-xs whitespace-nowrap'>
                    <div className='flex flex-col gap-2 items-center'>
                      <p className='font-bold text-md'>{x?.productName}</p>
                      <p className='font-bold'> Rp {priceFormat(x?.price)}</p>
                    </div>
                  </td>
                  <td
                    className={cn(
                      'px-2 py-1 text-xs whitespace-nowrap',
                      x?.paymentStatus === 'PAID'
                        ? 'text-green-600 font-bold'
                        : 'text-red-500 font-bold'
                    )}
                  >
                    {x?.paymentStatus}
                  </td>
                  <td className='whitespace-nowrap'>
                    <div className='w-[12rem] flex gap-2 items-center'>
                      <p className='text-green-500 text-lg font-bold align-center whitespace-nowrap'>
                        Rp {priceFormat(x?.affiliateCommission)}{' '}
                        <span className='text-sm font-normal text-gray-400'>
                          ({x?.affiliatePercentage}%)
                        </span>
                      </p>
                    </div>
                  </td>
                  <td className='whitespace-nowrap'>
                    <div className='flex justify-center'>
                      {x?.affiliateLevel}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* <p>customerid : {customer?.id}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
};

export default AffiliateeComponent;

AffiliateeComponent.propTypes = {
  childrenAffiliate: PropTypes.array,
};
