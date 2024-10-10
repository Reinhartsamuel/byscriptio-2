'use client';
import { useState, useEffect } from 'react';
import { getSingleDocumentFirebase } from '../utils/firebaseApi';
import PrevNextButton from '../components/PrevNextButton';

const FormsComponent = (props) => {
  const { data: parentData, setData: setParentData, setIndex } = props;
  const [data, setData] = useState({});
  const toast = (message) => {
    console.log(message);
  };

  const getData = async () => {
    try {
      const result = await getSingleDocumentFirebase(
        'forms',
        'S9lUlEkl81fVfty9bJ43'
      );
      setData(result);
      console.log(result, 'result');
    } catch (error) {
      toast({
        status: 'error',
        description: error.message,
        title: 'Error',
        duration: 5000,
      });
    }
  };

  const handleChange = (arg, value) => {
    arg.answer = value;
    let latestAnswer =
      data?.forms?.map((x) => {
        if (x?.id === arg?.id) {
          return arg;
        } else return x;
      }) || [];
    setData({ ...data, forms: latestAnswer });
  };

  const handleDebug = () => {
    console.log(parentData, 'parentData');
    console.log(
      {
        ...parentData,
        forms: data?.forms || [],
      },
      'ini hasilnya'
    );
    setParentData({
      ...parentData,
      forms: data?.forms || [],
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className='w-2xl pt-20'>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-3xl text-center font-bold'>
          Selamat datang di{' '}
          <span className='bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent font-ecoCoding font-bold'>
            byScript
          </span>
        </h1>
        <p className='text-slate-500 italic'>Lengkapi form di bawah ini</p>
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        {data?.forms?.map((x, i) => (
          <div
            key={i}
            className='block w-full mt-2 p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
          >
            <h2 className='font-bold'>{x?.question}</h2>
            {x?.type === 'text' && (
              // <input
              //   onChange={(e) => handleChange(x, e.target.value)}
              //   className='w-full p-2 pl-10 text-sm text-gray-700'
              // />
              <form class='flex items-center max-w-lg mx-auto'>
                <label for='voice-search' class='sr-only'>
                  Search
                </label>
                <div class='relative w-full'>
                  <div class='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke-width='1.5'
                      stroke='currentColor'
                      class='size-6'
                    >
                      <path
                        stroke-linecap='round'
                        stroke-linejoin='round'
                        d='M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z'
                      />
                    </svg>
                  </div>
                  <input
                    onChange={(e) => handleChange(x, e.target.value)}
                    type='text'
                    className='mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    required
                  />
                </div>
              </form>
            )}
            {x?.type === 'date' && (
              <input
                type='date'
                onChange={(e) => handleChange(x, e.target.value)}
                className='w-full p-2 pl-10 text-sm text-gray-700'
              />
            )}
            {x?.type === 'datetime' && (
              <input
                type='datetime-local'
                onChange={(e) => handleChange(x, e.target.value)}
                className='w-full p-2 pl-10 text-sm text-gray-700'
              />
            )}
            {x?.type === 'checkbox' && (
              <div>
                {x?.options?.map((y, idx) => (
                  <label key={idx} className='flex items-center'>
                    <input
                      type='checkbox'
                      onChange={(e) => handleChange(x, e.target.value)}
                      value={y}
                      // className='mr-2'
                    />
                    {y}
                  </label>
                ))}
              </div>
            )}
            {x?.type === 'radio' && (
              <div>
                {x?.options?.map((y, idx) => (
                  <label key={idx} className='flex items-center'>
                    <input
                      type='radio'
                      onChange={(e) => handleChange(x, e.target.value)}
                      value={y}
                      className='mr-2'
                    />
                    {y}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* <button onClick={handleDebug}>debug</button> */}
     <PrevNextButton setIndex={setIndex} />
    </div>
  );
};

export default FormsComponent;
