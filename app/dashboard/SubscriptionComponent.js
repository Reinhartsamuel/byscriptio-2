import React from 'react';
import { FaGear } from 'react-icons/fa6';

const SubscriptionComponent = () => {
  return (
    <div className='rounded-lg bg-gray-800 p-4 shadow-md   font-sans flex flex-col gap-1'>
      <h2 className='text-xl text-bold text-slate-100 font-bold'>Credit</h2>
      <p className='text-gray-200 text-sm font-thin'>
        Kamu sedang berlangganan <strong>Subscription 3 Bulan</strong>{' '}
        (berakhir 12 Agustus 2024).
      </p>
      <button className='w-full p-[3px] relative mt-5'>
        <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg' />
        <div className='px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white bg-transparent active:bg-violet-700 flex gap-2 items-center justify-center'>
          <FaGear />
          <p>Atur langganan</p>
        </div>
      </button>
    </div>
  );
};

export default SubscriptionComponent;
