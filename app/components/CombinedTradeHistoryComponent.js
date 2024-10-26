'use client';
import React from 'react';
import useCountDocuments from '../hooks/CountHook';
import { authFirebase } from '../config/firebase';
import TradeHistoryTable from '../[name]/autotraders/detail/[id]/TradeHistoryTable';

const CombinedTradeHistoryComponent = () => {
  const { count } = useCountDocuments({
    collectionName: '3commas_logs',
    conditions: [
      {
        field: 'email',
        operator: '==',
        value: authFirebase.currentUser?.email,
      },
    ],
    authRequired: true,
    dependencies: [authFirebase.currentUser?.email],
  });
  return (
    <div className='mx-2 lg:mx-6   mt-10 overflow-x-auto shadow-md sm:rounded-lg'>
      <div className='flex items-center gap-4'>
        <h2 className='text-xl text-bold text-slate-200 font-bold'>
          Trade History
        </h2>
      </div>
      <p className='text-[0.75rem] font-light text-slate-200 mb-4'>
        {count || 0} signals
      </p>
      <TradeHistoryTable
        conditions={[
          {
            field: 'email',
            operator: '==',
            value: authFirebase.currentUser?.email || '',
          },
        ]}
      />
    </div>
  );
};

export default CombinedTradeHistoryComponent;
