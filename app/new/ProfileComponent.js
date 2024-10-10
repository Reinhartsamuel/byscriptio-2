'use client';
import React from 'react';
import Cities from '../config/cititesAndRegions.json';

const ProfileComponent = ({ setIndex, data, setData }) => {
  const handlePhone = (e) => {
    let phone = '62' + e.target.value;

    if (phone.startsWith('620')) phone = '62' + phone.slice(3);
    if (phone.startsWith('+')) phone = phone.slice(1);

    setData({ ...data, phoneNumber: phone });
  };

  const validate = () => {
    if (!data?.name || !data?.email || !data?.phoneNumber)
      console.log('Data belum lengkap!');

    setIndex((prev) => prev + 1);
  };

  return (
    <div className='max-w-7xl pt-20'>
      <div className='flex flex-col'>
        <p className='text-xl font-bold text-center mt-5'>
          Isi data diri kamu dengan benar:
        </p>

        <div className='block w-full mt-2 p-6 bg-white border border-gray-200 rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700'>
          <div>
            <p>Nama Lengkap</p>
            <input
              className='mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='Masukkan nama anda'
              onChange={(e) => setData({ ...data, name: e.target.value })}
              value={data?.name}
            />
          </div>
          <div>
            <p>Email</p>
            <input
              className='mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='Masukkan email'
              type='email'
              onChange={(e) => setData({ ...data, email: e.target.value })}
              value={data?.email}
            />
          </div>
          <div>
            <p>Nomor Telepon (WA aktif)</p>
            <div className='flex relative'>
              <span className='bg-gray-100 absolute left-0 top-0 bottom-0 text-gray-900 mt-2 rounded-l-lg flex justify-center items-center px-2'>
                +62
              </span>
              <input
                className='mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-20 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                type='tel'
                placeholder='Masukkan nomor telepon'
                onChange={handlePhone}
              />
            </div>
          </div>
          <div>
            <p>Kota</p>
            <select
              onChange={(e) => setData({ ...data, city: e.target.value })}
              className='mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            >
              {Cities?.map((x, i) => (
                <option key={i} value={`${x?.type} ${x?.city_name}`}>
                  {x?.city_name} ({x?.type})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='flex justify-end mt-10'>
          <div className='flex'>
            <button
              className='text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'
              onClick={() => setIndex((prev) => prev - 1)}
            >
              ⬅️ Kembali
            </button>
            <button
              className='text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'
              onClick={validate}
            >
              Lanjut ➡️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
