import PropTypes from 'prop-types';
import React from 'react';
import { getCollectionFirebase } from '../utils/firebaseApi';
import moment from 'moment';
import { priceFormat } from '../utils/priceFormat';
import { cn } from '@/lib/util';

const AffiliateWithdrawalListComponent = async ({ customerId }) => {
  let conditions = [];
  if (customerId)
    conditions = [
      {
        field: 'customerId',
        operator: '==',
        value: customerId,
      },
    ];
  const data = await getCollectionFirebase('affiliate_withdrawals', conditions);

  function statusColor(status) {
    switch (status) {
      case 'REQUESTED':
        return 'text-yellow-500';
      case 'REJECTED':
        return 'text-red-500';
      case 'COMPLETED':
        return 'text-green-500';
      default:
        break;
    }
  }
  return (
    <div className='mt-5 w-full rounded-lg bg-gray-800 p-4 shadow-md font-sans flex flex-col gap-4'>
      <p className='text-gray-400 text-sm'>Withdrawal History</p>
      {/* <pre>{JSON.stringify(conditions, null, 2)}</pre>
      <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <div className='overflow-scroll'>
        {data?.length > 0 ? (
          <table className='w-full overflow-scroll text-xs text-left text-gray-500 dark:text-gray-400 mx-auto'>
            <thead className='top-0 right-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope='col' className='px-2 py-1 text-xs whitespace-nowrap'>
                  requested at
                </th>
                <th scope='col' className='px-2 py-1 text-xs whitespace-nowrap'>
                  amount
                </th>
                <th scope='col' className='px-2 py-1 text-xs whitespace-nowrap'>
                  bank
                </th>
                <th scope='col' className='px-2 py-1 text-xs whitespace-nowrap'>
                  account number
                </th>
                <th scope='col' className='px-2 py-1 text-xs whitespace-nowrap'>
                  payment status
                </th>
                <th scope='col' className='px-2 py-1 text-xs whitespace-nowrap'>
                  paid at
                </th>
                <th scope='col' className='px-2 py-1 text-xs whitespace-nowrap'>
                  receipt
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((x, i) => (
                <tr
                  key={i}
                  className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'
                >
                  <td className='px-2 py-1 text-xs font-medium w-auto text-gray-900 dark:text-gray-300 whitespace-nowrap'>
                    {moment
                      .unix(x.createdAt?.seconds)
                      .format('ddd, DD MMM YYYY HH:mm')}
                  </td>
                  <td className='px-2 py-1 text-xs font-medium w-auto text-gray-900 dark:text-gray-300 whitespace-nowrap'>
                    Rp {priceFormat(x?.withdrawAmount)}
                  </td>
                  <td className='px-2 py-1 text-xs font-medium w-auto text-gray-900 dark:text-gray-300 whitespace-nowrap'>
                    {x?.bank}
                  </td>
                  <td className='px-2 py-1 text-xs font-medium w-auto text-gray-900 dark:text-gray-300 whitespace-nowrap'>
                    {x?.accountNumber}
                  </td>
                  <td className='px-2 py-1 text-xs font-medium w-auto text-gray-900 dark:text-gray-300 whitespace-nowrap'>
                    <p
                      className={cn(statusColor(x?.paymentStatus), 'font-bold')}
                    >
                      {x?.paymentStatus}
                    </p>
                  </td>
                  <td className='px-2 py-1 text-xs font-medium w-auto text-gray-900 dark:text-gray-300 whitespace-nowrap'>
                    {x?.paidAt
                      ? moment
                          .unix(x?.paidAt?.seconds)
                          .format('ddd, DD MMM YYYY HH:mm')
                      : 'Unavailable'}
                  </td>
                  <td className='px-2 py-1 text-xs font-medium w-auto text-gray-900 dark:text-gray-300 whitespace-nowrap'>
                    {x?.receipt ? (
                      <a
                        className='underline text-blue-400'
                        href={'https://google.com'}
                        target='_blank'
                        rel='noreferrer'
                      >
                        See receipt
                      </a>
                    ) : (
                      'Unavailable'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className='w-full h-full flex justify-center items-center'>
            <p>No data</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AffiliateWithdrawalListComponent;

AffiliateWithdrawalListComponent.propTypes = {
  customerId: PropTypes.string,
};
