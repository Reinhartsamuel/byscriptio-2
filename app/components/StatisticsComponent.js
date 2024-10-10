'use client';
import CountUp from 'react-countup';
import React, { useEffect, useState } from 'react';
import ScrollTrigger from 'react-scroll-trigger';
const statistics = [
  {
    title: 'Transaction Volume',
    value: 50,
    prefix: 'IDR ',
    suffix: ' B',
  },
  { title: 'Trades', value: '10201', prefix: '', suffix: '' },
  { title: 'Account Growth', value: 'to', prefix: '', suffix: '' },
];

const StatisticsComponent = () => {
  const [counterOn, setCounterOn] = useState(false);
  useEffect(() => {}, []);
  return (
    <ScrollTrigger
      onEnter={() => setCounterOn(true)}
      onExit={() => setCounterOn(false)}
    >
      <div className='flex w-screen justify-evenly h-[10rem] md:w-full'>
        {statistics.map((x, i) => (
          <div className='flex flex-col items-center justify-center' key={i}>
            <h1 className='text-2xl font-bold text-white xl:text-5xl'>
              {/* <CountUp
              start={0}
              end={100}
              duration={5}
              onEnd={() => setCounterOn(true)}
            /> */}
              {counterOn && (
                <CountUp
                  separator={','}
                  start={0}
                  end={parseInt(x?.value) || 100}
                  delay={0}
                  prefix={x?.prefix ?? 'IDR'}
                  suffix={x?.suffix + '+'}
                />
              )}
            </h1>
            <h3 className='text-base/7 text-slate-300'>{x?.title}</h3>
          </div>
        ))}
      </div>
    </ScrollTrigger>
  );
};

export default StatisticsComponent;
