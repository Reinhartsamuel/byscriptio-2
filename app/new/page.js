'use client';
import React, { useEffect, useState } from 'react';
import ProfileComponent from './ProfileComponent';
import MeetingBookingComponent from './MeetingBookingComponent';
import SummaryComponent from './SummaryComponent';
import FormsComponent from './FormsComponent';
import { authFirebase } from '../config/firebase';
import { cn } from '@/lib/util';

const options = {
  criterions: [
    {
      id: 1,
      title: 'Saya belum pernah trading crypto',
      description: 'Saya sama sekali baru dalam trading crypto',
      image: './undraw-learn.png',
    },
    {
      id: 2,
      title: 'Saya trader crypto namun sering loss😢',
      description:
        'Saya sudah trading crypto namun lebih banyak cutloss daripada take profit',
      image: './undraw-learn.png',
    },
    {
      id: 3,
      title: 'Saya trader crypto berpengalaman',
      description: 'Saya ingin belajar script trading plan',
      image: './undraw-learn.png',
    },
  ],
  activities: [
    {
      id: 1,
      title: 'Belajar Trading Plan',
      description:
        'Belajar membuat algoritma trading dengan trading plan dengan materi dari byScript',
      image: './undraw-learn.png',
    },
    {
      id: 2,
      title: 'Otomatiskan trading',
      description:
        'Subscribe ke trading plan byScript untuk eksekusi trading otomatis',
      image: './undraw-learn.png',
    },
    {
      id: 3,
      title: 'Jual Trading Plan Saya',
      description: 'Listing trading plan saya di byScript',
      image: './undraw-learn.png',
    },
    {
      id: 4,
      title: 'Mencari tambahan pengashilan dengan program referral',
      description:
        'Mendapatkan pengasilan tambahan dengan program referral byScript',
      image: './undraw-learn.png',
    },
  ],
  balance: [
    {
      id: 1,
      value: 'USD 0 - 100',
      minBalance: 0,
      maxBalance: 100,
    },
    {
      id: 2,
      value: 'USD 100 - 1000',
      minBalance: 100,
      maxBalance: 1000,
    },
    {
      id: 3,
      value: 'USD 1000 - 5000',
      minBalance: 1000,
      maxBalance: 5000,
    },
    {
      id: 4,
      value: '>USD 5000',
      minBalance: 5000,
      maxBalance: null,
    },
  ],
};

const page = () => {
  const [index, setIndex] = useState(0);
  const [data, setData] = useState({
    profile: '',
    name: authFirebase.currentUser?.displayName || '',
    email: authFirebase.currentUser?.email || '',
    phoneNumber: authFirebase.currentUser?.phoneNumber || '',
    minBalance: 0,
    maxBalance: null,
  });

  return (
    <>
      <div className='w-full min-h-screen flex flex-col items-center relative bg-transparent'>
        <div className='absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] -z-10' />
        <div className='w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700'>
          <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700'>
            <div
              className='bg-blue-600 h-2.5 rounded-full'
              style={{ width: `${(index / 3) * 100 + 5}%` }}
            ></div>
          </div>
        </div>

        {/* {index === 0 && <CriterionComponent options={options} setIndex={setIndex} setData={setData} data={data} />}
          {index === 1 && <ActivitiesComponent options={options} setIndex={setIndex} setData={setData} data={data} />}
          {index === 1 && <BalanceComponent options={options} setIndex={setIndex} setData={setData} data={data} />} */}
        {index === 0 && (
          <FormsComponent setIndex={setIndex} setData={setData} data={data} />
        )}
        {index === 1 && (
          <ProfileComponent setIndex={setIndex} setData={setData} data={data} />
        )}
        {index === 2 && (
          <MeetingBookingComponent
            setIndex={setIndex}
            setData={setData}
            data={data}
          />
        )}
        {index === 3 && (
          <SummaryComponent setIndex={setIndex} setData={setData} data={data} />
        )}
        {/* <pre>{JSON.stringify(data, null,2)}</pre> */}
      </div>
    </>
  );
};

export default page;
