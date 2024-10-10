'use client';
import React from 'react';
import { Fade } from 'react-awesome-reveal';

const ActivitiesComponent = ({ data, options, setIndex, setData }) => {
  return (
    <>
      <Fade direction='up' duration={500}>
        <div className="max-w-7xl pt-20">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold">Aktivitas:</h2>
            <div className="max-w-xl mt-10">
              {options?.criterions?.map((item, i) => (
                <div
                  key={i}
                  className="p-5 border-2 border-gray-300 cursor-pointer w-full my-4 hover:scale-101 transition duration-100"
                  onClick={() => setData((prev) => ({...prev, activity : item?.title }))}
                >
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      checked={data?.activity === item.title}
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
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={() => setIndex((prev) => prev - 1)}
              >
                {'<'}- Kembali
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setIndex((prev) => prev + 1)}
              >
                Lanjut -{'>'}
              </button>
            </div>
          </div>
        </div>
      </Fade>
    </>
  );
};

export default ActivitiesComponent;