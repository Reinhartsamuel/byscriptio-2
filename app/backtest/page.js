import React from 'react'
import moment from 'moment'
import { adminDb } from '@/lib/firebase-admin-config';

async function getBacktests() {
  const arr = [];
  try {
    const querysnapshot = await adminDb
    .collection('backtest')
    .orderBy('createdAt', 'desc')
    .limit(20)
    .get();
    querysnapshot.forEach((doc) => {
      arr.push({ ...doc.data(), id: doc.id });
    });
    return { data: arr };
  } catch (error) {
    return { error }
  }
}

const page = async () => {
  const { data, error } = await getBacktests();
  return (
    <div className="min-h-screen bg-gray-900 px-4">
      <div className='w-full h-screen flex justify-center items-center'>
        <p className='text-gray-400 text-xl italic'>Coming soon 🚀</p>
      </div>
      {/* <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white hover:text-indigo-400 transition-colors duration-300 mb-8">Backtests</h1>
        {error ? (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
            <p className="text-red-500">{error.message}</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {data?.map((x, i) => (
              <a
                href={`announcement/${x?.id}?t=${x?.title}`}
                key={i}
                className='bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-indigo-400 transition-all duration-300'
              >
                <img
                  src={x?.thumbnail}
                  className='w-full object-cover h-48'
                  alt={x?.title}
                />
                <div className="p-4">
                  <h2 className='text-xl font-bold text-slate-100 mb-2'>
                    {x?.trading_plan_pair}
                  </h2>
                  <p className='text-sm text-slate-400'>
                    {moment.unix(x?.createdAt?._seconds).fromNow()}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div> */}
    </div>
  )
}

export default page