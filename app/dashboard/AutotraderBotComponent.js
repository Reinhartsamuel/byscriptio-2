/* eslint-disable react/prop-types */
'use client';
import React, { useState } from 'react';
import { authFirebase } from '../config/firebase';
import Spinner from '../components/ui/Spinner';
import ModalDetailAutotrader from './autotraders/ModalDetailAutotrader';
import { useAutotraderStore } from '../store/autotraderStore';
import useCountDocuments from '../hooks/CountHook';
import PropTypes from 'prop-types';
// import AutotraderCard from '../components/AutotraderCard';
import ModalAddAutotraderNew from './autotraders/ModalAddAutotraderNew';
import moment from 'moment';

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
          id='add-autotrader'
          className='text-white border-2 focus:outline-none focus:ring-4 focus:ring-purple-300 rounded-md text-xs p-2 text-center min-w-[3rem] border-brand_primary'
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
          <div className="overflow-x-auto w-full rounded-xl shadow-lg">
            <table className="min-w-full text-sm text-left text-gray-300 dark:bg-gray-900">
              <thead className="text-xs uppercase bg-gray-800 text-gray-400 whitespace-nowrap">
                <tr>
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Pair</th>
                  <th className="px-4 py-3">Trading Plan</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created at</th>
                  <th className="px-4 py-3">Exchange</th>
                  <th className="px-4 py-3">Budget ($)</th>
                  <th className="px-4 py-3">Initial Budget</th>
                  <th className="px-4 py-3">Autocompound</th>
                  <th className="px-4 py-3">PnL ($)</th>
                  <th className="px-4 py-3">PnL (%)</th>
                  <th className="px-4 py-3">Last Signal</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((x, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-700 hover:bg-gray-800 cursor-pointer active:bg-gray-600"
                    onClick={() => handleDetail(x)}
                  >
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3">{x.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {x.trading_plan_pair[0].split('_').slice(-2).join('_')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{x.trading_plan_pair[0].split('_')[0]}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded ${x.status === 'ACTIVE' ? 'text-green-400' : x.status === 'STOPPED' ? 'text-red-400' : 'text-yellow-400'}`}>
                        {x.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{moment.unix(x.createdAt.seconds).format('D MMM YYYY HH:mm')}</td>
                    <td className="px-4 py-3">{x.exchange_name}</td>
                    <td className="px-4 py-3">{x.tradeAmount || '-'}</td>
                    <td className="px-4 py-3">{x.initialInvestment || '-'}</td>
                    <td className="px-4 py-3">{x.autocompound ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3">{x.pnl || '-'}</td>
                    <td className="px-4 py-3">{x.pnl_percentage || '-'}</td>
                    <td className="px-4 py-3">
                      {x?.lastSignal ?
                      `${x?.lastSignal?.position?.type?.toUpperCase()} ${moment.unix(parseInt(x?.lastSignal?.timestamp)/1000).fromNow()}` :
                        '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {/* <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {data?.map((x, i) => (
              <AutotraderCard key={i} data={x} handleDetail={handleDetail} />
            ))}
          </div>
        </>
      )} */}
      <ModalAddAutotraderNew addModal={addModal} setAddModal={setAddModal} setShowPricing={setShowPricing} />
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
