/* eslint-disable react/prop-types */
'use client';
import React, { useState } from 'react';
import { authFirebase } from '../config/firebase';
import Spinner from '../components/ui/Spinner';
import ModalDetailAutotrader from './autotraders/ModalDetailAutotrader';
import ModalAddAutotrader from './autotraders/ModalAddAutotrader';
import { useAutotraderStore } from '../store/autotraderStore';
import useCountDocuments from '../hooks/CountHook';
import PropTypes from 'prop-types';
import AutotraderCard from '../components/AutotraderCard';

const AutotraderBotComponent = ({ setShowPricing }) => {
  const [addModal, setAddModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [detail, setDetail] = useState({});
  const { autotraders: data } = useAutotraderStore();

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
    // console.log(data);
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
