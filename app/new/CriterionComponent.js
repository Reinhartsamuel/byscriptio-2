'use client';
import React from 'react';

const CriterionComponent = ({ options, setIndex, data, setData }) => {
  return (
    <>
      {/* <Fade direction='up' duration={500}> */}
        <div className="max-w-7xl pt-20">
          <div
            className="flex flex-col items-center justify-center"
          >
            <h1 className="text-3xl text-center">
              Selamat datang di{' '}
              <span
                className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text"
              >
                byScript
              </span>
            </h1>
            <p
              className="mt-5 text-xl text-center font-bold"
            >
              Pilih kriteria di bawah ini yang paling cocok denganmu:
            </p>
            <div className="max-w-xl">
              {options?.criterions?.map((item, i) => (
                <div
                  key={i}
                  className="p-5 border-2 border-gray-300 cursor-pointer w-full my-4 hover:scale-101 transition duration-100"
                  onClick={() => setData({...data, profile : item?.title })}
                >
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      checked={data?.profile === item.title}
                      className="w-4 h-4"
                    />
                    <div className="flex flex-col gap-0">
                      <h3 className="font-bold">{item?.title}</h3>
                      <p>{item?.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <div className="flex gap-2">
              {/* <button>{'<'}- prev</button> */}
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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

export default CriterionComponent;