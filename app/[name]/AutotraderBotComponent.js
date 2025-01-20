/* eslint-disable react/prop-types */
'use client';
import React, { useState } from 'react';
import { authFirebase } from '../config/firebase';
import moment from 'moment';
import { useParams } from 'next/navigation';
import Spinner from '../components/ui/Spinner';
import { cn } from '@/lib/util';
import { RiRobot2Fill } from 'react-icons/ri';
import PairImageComponent from '../components/ui/PairImageComponent';
import ModalDetailAutotrader from './autotraders/ModalDetailAutotrader';
import ModalAddAutotrader from './autotraders/ModalAddAutotrader';
import { useAutotraderStore } from '../store/autotraderStore';
import useCountDocuments from '../hooks/CountHook';
import { useUserStore } from '../store/userStore';
import PropTypes from 'prop-types';
import AutotraderCard from '../components/AutotraderCard';

// const yaitulah = [
//   {
//     id: 'bUxMrYL8hbnVXldEc8tx',
//     createdBy: 'CADyUn6k7qMkhn89ftO4Gr4zGpw2',
//     bot_id: '15455557',
//     uid: 'RomXA3UVAbMZB55BLWzE42Dh3kz2',
//     lastUpdatedBy: {
//       email: 'edwinfardyanto@gmail.com',
//       uid: 'CADyUn6k7qMkhn89ftO4Gr4zGpw2',
//     },
//     autotrader_name: '84_045_REIBKS_12/08/24 $335',
//     tradeAmount: 335,
//     createdAt: {
//       seconds: 1726112639,
//       nanoseconds: 244000000,
//     },
//     exchange_name: 'GATE',
//     name: 'Reinhart Samuel',
//     exchange_thumbnail:
//       'https://3commas.cdn.prismic.io/3commas/9f0f9956-95a9-4b6c-9ed9-4be570d96e52_gateio_logo.svg',
//     email: 'reinhartsams@gmail.com',
//     trading_plan_pair: ['XMA_USDT_ETH'],
//     companyId: 'byscript',
//     status: 'ACTIVE',
//     lastUpdated: {
//       seconds: 1726194874,
//       nanoseconds: 540000000,
//     },
//   },
//   {
//     id: 'bUxMrYL8hbnVXldEc8tx',
//     createdBy: 'CADyUn6k7qMkhn89ftO4Gr4zGpw2',
//     bot_id: '15455557',
//     uid: 'RomXA3UVAbMZB55BLWzE42Dh3kz2',
//     lastUpdatedBy: {
//       email: 'edwinfardyanto@gmail.com',
//       uid: 'CADyUn6k7qMkhn89ftO4Gr4zGpw2',
//     },
//     autotrader_name: '84_045_REIBKS_12/08/24 $335',
//     tradeAmount: 335,
//     createdAt: {
//       seconds: 1726112639,
//       nanoseconds: 244000000,
//     },
//     exchange_name: 'GATE',
//     name: 'Reinhart Samuel',
//     exchange_thumbnail:
//       'https://3commas.cdn.prismic.io/3commas/9f0f9956-95a9-4b6c-9ed9-4be570d96e52_gateio_logo.svg',
//     email: 'reinhartsams@gmail.com',
//     trading_plan_pair: ['XMA_USDT_ETH'],
//     companyId: 'byscript',
//     status: 'ACTIVE',
//     lastUpdated: {
//       seconds: 1726194874,
//       nanoseconds: 540000000,
//     },
//   },
//   {
//     id: 'bUxMrYL8hbnVXldEc8tx',
//     createdBy: 'CADyUn6k7qMkhn89ftO4Gr4zGpw2',
//     bot_id: '15455557',
//     uid: 'RomXA3UVAbMZB55BLWzE42Dh3kz2',
//     lastUpdatedBy: {
//       email: 'edwinfardyanto@gmail.com',
//       uid: 'CADyUn6k7qMkhn89ftO4Gr4zGpw2',
//     },
//     autotrader_name: '84_045_REIBKS_12/08/24 $335',
//     tradeAmount: 335,
//     createdAt: {
//       seconds: 1726112639,
//       nanoseconds: 244000000,
//     },
//     exchange_name: 'GATE',
//     name: 'Reinhart Samuel',
//     exchange_thumbnail:
//       'https://3commas.cdn.prismic.io/3commas/9f0f9956-95a9-4b6c-9ed9-4be570d96e52_gateio_logo.svg',
//     email: 'reinhartsams@gmail.com',
//     trading_plan_pair: ['XMA_USDT_ETH'],
//     companyId: 'byscript',
//     status: 'ACTIVE',
//     lastUpdated: {
//       seconds: 1726194874,
//       nanoseconds: 540000000,
//     },
//   },
//   {
//     id: 'bUxMrYL8hbnVXldEc8tx',
//     createdBy: 'CADyUn6k7qMkhn89ftO4Gr4zGpw2',
//     bot_id: '15455557',
//     uid: 'RomXA3UVAbMZB55BLWzE42Dh3kz2',
//     lastUpdatedBy: {
//       email: 'edwinfardyanto@gmail.com',
//       uid: 'CADyUn6k7qMkhn89ftO4Gr4zGpw2',
//     },
//     autotrader_name: '84_045_REIBKS_12/08/24 $335',
//     tradeAmount: 335,
//     createdAt: {
//       seconds: 1726112639,
//       nanoseconds: 244000000,
//     },
//     exchange_name: 'GATE',
//     name: 'Reinhart Samuel',
//     exchange_thumbnail:
//       'https://3commas.cdn.prismic.io/3commas/9f0f9956-95a9-4b6c-9ed9-4be570d96e52_gateio_logo.svg',
//     email: 'reinhartsams@gmail.com',
//     trading_plan_pair: ['XMA_USDT_ETH'],
//     companyId: 'byscript',
//     status: 'ACTIVE',
//     lastUpdated: {
//       seconds: 1726194874,
//       nanoseconds: 540000000,
//     },
//   },
//   {
//     id: 'bUxMrYL8hbnVXldEc8tx',
//     createdBy: 'CADyUn6k7qMkhn89ftO4Gr4zGpw2',
//     bot_id: '15455557',
//     uid: 'RomXA3UVAbMZB55BLWzE42Dh3kz2',
//     lastUpdatedBy: {
//       email: 'edwinfardyanto@gmail.com',
//       uid: 'CADyUn6k7qMkhn89ftO4Gr4zGpw2',
//     },
//     autotrader_name: '84_045_REIBKS_12/08/24 $335',
//     tradeAmount: 335,
//     createdAt: {
//       seconds: 1726112639,
//       nanoseconds: 244000000,
//     },
//     exchange_name: 'GATE',
//     name: 'Reinhart Samuel',
//     exchange_thumbnail:
//       'https://3commas.cdn.prismic.io/3commas/9f0f9956-95a9-4b6c-9ed9-4be570d96e52_gateio_logo.svg',
//     email: 'reinhartsams@gmail.com',
//     trading_plan_pair: ['XMA_USDT_ETH'],
//     companyId: 'byscript',
//     status: 'ACTIVE',
//     lastUpdated: {
//       seconds: 1726194874,
//       nanoseconds: 540000000,
//     },
//   },
// ];

const AutotraderBotComponent = ({ setShowPricing }) => {
  const params = useParams();
  const [addModal, setAddModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [detail, setDetail] = useState({});
  const { autotraders: data } = useAutotraderStore();
  const { userPackage } = useUserStore();

  const { count: counttt } = useCountDocuments({
    collectionName: 'dca_bots',
    conditions: [
      {
        field: 'email',
        operator: '==',
        value: authFirebase.currentUser?.email,
      },
    ],
    dependencies: [authFirebase.currentUser?.email],
  });

  if (!authFirebase.currentUser)
    return (
      <div className='w-full h-screen flex flex-col items-center justify-center'>
        <Spinner />
      </div>
    );

  const handleDetail = (data) => {
    setDetailModal(true);
    setDetail(data);
  };

  const handleAddAutotrader = () => {
    // if (!userPackage) return setShowPricing(true);
    setAddModal(true);
  };

  return (
    <div className='mx-2 lg:mx-6 mt-10'>
      <div className='flex items-center gap-4'>
        <h2 className='text-xl text-bold text-slate-800 dark:text-slate-200 font-bold'>
          Autotrader
        </h2>
        <button
          // onClick={() => router.push(`${params?.name}/autotraders/new`)}
          onClick={handleAddAutotrader}
          type='button'
          className='text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 rounded-md text-xs p-2 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 min-w-[3rem]'
        >
          Add New
        </button>
      </div>
      {/* 
      <p>data:{JSON.stringify(data)}</p>
      <br />
      <p>autotraders:{JSON.stringify(autotraders)}</p> */}

      {counttt === 0 ? (
        <p className='text-[0.75rem] font-light text-gray-800 dark:text-slate-200 mb-4'>
          You don&apos;t have any autotrader.
        </p>
      ) : (
        <>
          <p className='text-[0.75rem] font-light text-gray-800 dark:text-slate-200 mb-4'>
            {counttt || 0} autotraders
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {data?.map((x, i) => (
              <AutotraderCard key={i} data={x} handleDetail={handleDetail} />
            ))}
            {/* {data?.length !== counttt && (
              <div className='w-full h-full grid place-items-center'>
                <button>lihat semua</button>
              </div>
            )} */}
          </div>
        </>
      )}
      <ModalAddAutotrader addModal={addModal} setAddModal={setAddModal} setShowPricing={setShowPricing} />
      <ModalDetailAutotrader
        openModal={detailModal}
        setOpenModal={setDetailModal}
        detail={detail}
        setDetail={setDetail}
      />
    </div>
  );
};

export default AutotraderBotComponent;



AutotraderBotComponent.propTypes = {
  setShowPricing: PropTypes.func,
};
