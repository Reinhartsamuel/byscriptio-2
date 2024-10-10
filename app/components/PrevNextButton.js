import React from 'react';

const PrevNextButton = ({ setIndex, nextFunction }) => {
  return (
    <>
      {' '}
      <div className='flex justify-end mt-10'>
        <div className='flex'>
          <button
            type='button'
            className='text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'
            onClick={() => setIndex((prev) => prev - 1)}
          >
            ⬅️ Kembali
          </button>
          <button
            onClick={
              nextFunction
                ? () => nextFunction()
                : () => setIndex((prev) => prev + 1)
            }
            className='text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'
          >
            Lanjut ➡️
          </button>
        </div>
      </div>
    </>
  );
};

export default PrevNextButton;
