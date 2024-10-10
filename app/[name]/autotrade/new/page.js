'use client';
import SignalPreviewComponent from '@/app/components/SignalPreviewComponent';
import { coins } from '@/app/dummy';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';

const page = ({ params }) => {
  const [pair, setPair] = useState({
    coinA: '',
    coinB: '',
  });
  const router = useRouter();

  return (
    <div className='w-screen min-h-screen flex flex-col mx-auto px-5'>
      <div className='my-4 mx-2'>
        <button
          onClick={() => router.push(`/${params.name}`)}
          className='flex items-center text-slate-300 gap-2 hover:scale-110 active:scale-95 transition ease-in-out'
        >
          <FaArrowLeft color={'red'} />
          Dashboard
        </button>
      </div>
      <div className='mt-10 mx-2'>
        <h1 className='text-3xl font-bold text-slate-100'>Setup Autotrade</h1>
        <h3 className='font-extralight text-sm text-slate-400 leading--5'>
          Silakan isi data di bawah ini dengan lengkap.
        </h3>
      </div>

      <div className='w-full flex flex-col items-start gap-2 lg:flex-row'>
        <div className='flex flex-col gap-4 w-full'>
          <div className='rounded-lg bg-gray-800 p-4 shadow-md mx-2 font-sans flex flex-col gap-1'>
            <h2>1. Pilih Pair</h2>
            <AutoCompleteSearchComponent
              setPair={setPair}
              pair={pair}
              coinIndex={'coinA'}
            />
            <AutoCompleteSearchComponent
              setPair={setPair}
              pair={pair}
              coinIndex={'coinB'}
            />
            <h2 className='mt-10'>2. Nominal Trading</h2>
            <div className='relative mb-6'>
              <div className='absolute inset-y-0 start-0 flex items-center px-3 pointer-events-none'>
                <h4 className='font-bold'>USD</h4>
              </div>
              <input
                type='number'
                id='input-group-1'
                className='bg-gray-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [appearance:textfield] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-16 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                placeholder='10'
              />
            </div>
            <h2 className='mt-10 cursor-pointer'>3. Pilih Trading Plan</h2>
            <div className='flex items-center ps-4 border border-gray-200 dark:border-gray-600 rounded cursor-pointer'>
              <input
                id='bordered-radio-1'
                type='radio'
                value=''
                name='bordered-radio'
                className='cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
              />
              <label
                htmlFor='bordered-radio-1'
                className='w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer'
              >
                Vertexmax
              </label>
            </div>
            <div className='flex items-center ps-4 border border-gray-200 dark:border-gray-600 rounded cursor-pointer'>
              <input
                id='bordered-radio-2'
                type='radio'
                value=''
                name='bordered-radio'
                className='cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
              />
              <label
                htmlFor='bordered-radio-2'
                className='w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer'
              >
                Sniper
              </label>
            </div>
          </div>
          <button className='p-[3px] mx-2 relative active:scale-95 transition ease-in-out duration-100'>
            <div className='absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg' />
            <div className='px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white transition duration-300 ease-in-out hover:bg-transparent'>
              Buat Autotrade
            </div>
          </button>
        </div>

        <div className='flex flex-col gap-4 w-full'>
          <div className='rounded-lg bg-gray-800 p-4 shadow-md mx-2 font-sans flex flex-col gap-1'>
            <div className='flex flex-col sm:flex-row w-full  justify-between mx-2'>
              <div className='flex flex-col gap-0'>
                <p className='text-xs font-thin text-white lg:text-sm'>
                  Detail Trading Plan
                </p>
                <h2 className='font-bold text-xl leading-2 text-white'>
                  Vertexmax
                </h2>
              </div>
              <button className='inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50'>
                Lihat Hasil Backtest
              </button>
            </div>
            <ul className='w-full text-sm my-10 font-medium text-gray-900 bg-white border border-gray-400 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200'>
              <li className='w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600 '>
                <div className='flex justify-between items-center px-3 py-4'>
                  <h3> Net Profit</h3>
                  <h3 className='font-bold text-green-500'>xx</h3>
                </div>
              </li>
              <li className='w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600 '>
                <div className='flex justify-between items-center px-3 py-4'>
                  <h3>Percent Profitable</h3>
                  <h3 className='font-bold text-green-500'>xx</h3>
                </div>
              </li>
              <li className='w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600 '>
                <div className='flex justify-between items-center px-3 py-4'>
                  <h3>Max Drawdown</h3>
                  <h3 className='font-bold text-red-600'>xx</h3>
                </div>
              </li>
              <li className='w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600 '>
                <div className='flex justify-between items-center px-3 py-4'>
                  <h3>Backtest Pair</h3>
                  <h3>xx</h3>
                </div>
              </li>
            </ul>
          </div>
          <div className='rounded-lg bg-gray-800 p-4 shadow-md mx-2 font-sans flex flex-col gap-1'>
            <h1>Live Signal Terakhir</h1>
            <SignalPreviewComponent text={'sm'} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

function AutoCompleteSearchComponent(props) {
  const { pair, coinIndex, setPair } = props;
  const [suggestions, setSuggestions] = useState([]);
  const [suggestOn, setSuggestOn] = useState('coinA');

  const getSuggestion = (event) => {
    const { value } = event.target;
    if (value?.length < 2) return setSuggestions([]);
    let suggestions = coins.filter((x) =>
      x?.symbol?.includes(value?.toUpperCase())
    );
    if (suggestions?.length === 0) {
      suggestions = coins.filter((x) =>
        x?.name?.toLowerCase()?.includes(value?.toLowerCase())
      );
      console.log('masuk sini');
    }

    console.log(suggestions, 'suggestions');
    setSuggestions(suggestions);
    setSuggestOn(coinIndex);
  };

  const handleSelect = (coin) => {
    setSuggestions([]);
    setPair({ ...pair, [coinIndex]: coin });
  };
  return (
    <div className='flex flex-col'>
      <form className='w-full mx-auto'>
        <label
          htmlFor='default-search'
          className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'
        >
          Search
        </label>
        <div className='relative'>
          <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
            <svg
              className='w-4 h-4 text-gray-500 dark:text-gray-400'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 20 20'
            >
              <path
                stroke='currentColor'
                stroke-linecap='round'
                stroke-linejoin='round'
                strokeWidth='2'
                d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
              />
            </svg>
          </div>
          <input
            type='search'
            id='default-search'
            className='block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            placeholder={`Silakan pilih ${
              coinIndex === 'coinA' ? 'coin 1' : 'coin 2'
            }`}
            onChange={getSuggestion}
            required
          />
          <button className='text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
            <div className='flex gap2'>
              <p className='font-bold'>
                {coinIndex === 'coinA' ? 'Coin 1' : 'Coin 2'}{' '}
                {pair[coinIndex] ? ` : ${pair[coinIndex]?.symbol}` : ''}
              </p>
              {pair[coinIndex]?.icon && (
                <img src={pair[coinIndex]?.icon} className='w-5 h-5 ml-2' />
              )}
            </div>
          </button>
        </div>
      </form>
      {suggestions?.length > 0 &&
        suggestOn === coinIndex &&
        suggestions?.map((x, i) => (
          <div
            key={i}
            className=' bg-gray-100 p-4 border-b-2 border-slate-100 flex gap-2 hover:bg-gray-200 cursor-pointer active:bg-gray-300'
            onClick={() => handleSelect(x)}
          >
            <img src={x?.icon} className='w-5 h-5' />
            <p className='text-slate-900'>
              {x?.name} (<strong>{x?.symbol}</strong>)
            </p>
          </div>
        ))}
    </div>
  );
}
