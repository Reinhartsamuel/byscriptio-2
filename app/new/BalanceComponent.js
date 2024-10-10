'use client';
import React from 'react';

const BalanceComponent = ({ data, setData, options, setIndex }) => {
  return (
    <>
      {/* <Fade direction='up' duration={500}> */}
      <div className='max-w-7xl pt-20'>
        <div className='flex flex-col items-center'>
          <p className='text-xl font-bold'>Trading balance:</p>
          <p className='text-gray-200'>
            Berapa jumlah dana yang kamu punya di dalam wallet exchange?
          </p>
          <div className='max-w-xl mt-10'>
            {options?.balance?.map((item, i) => (
              <div
                key={i}
                className='p-5 border-2 border-gray-300 cursor-pointer w-full my-4 hover:scale-101 transition duration-100'
                onClick={() =>
                  setData({
                    ...data,
                    minBalance: item?.minBalance ?? null,
                    maxBalance: item?.maxBalance ?? null,
                  })
                }
              >
                <div className='flex gap-2'>
                  <input
                    type='checkbox'
                    checked={
                      data?.minBalance === item.minBalance &&
                      data?.maxBalance === item.maxBalance
                    }
                    className='w-4 h-4'
                  />
                  <div className='flex flex-col gap-0'>
                    <h3 className='font-bold'>{item?.value}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='flex justify-end'>
          <div className='flex gap-2'>
            <button
              className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded'
              onClick={() => setIndex((prev) => prev - 1)}
            >
              {'<'}- Kembali
            </button>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              onClick={() => setIndex((prev) => prev + 1)}
            >
              Lanjut -{'>'}
            </button>
          </div>
        </div>
      </div>
      {/* </Fade> */}
    </>
  );
};

export default BalanceComponent;
