import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import logo_combination_transparent from "../../public/logo_combination_transparent.png";
import NeonRobot from '../../public/NeonRobot.png';
import { cn } from '@/lib/util';
import { IoMdClose } from 'react-icons/io';
import _ from 'lodash';
import { useScreenshotStore } from '../store/screenshotStore';


const ProfitCard = ({
  profitPercent = 12,
  profitUsd = 512,
  entryPrice = 321321,
  exitPrice = 12123,
  qrValue,
  pair,
  futures = false,
  side = 'long',
  sideColor,
  leverage = 12,
}) => {
  const isProfit = profitUsd >= 0;
  const profitColor = isProfit ? 'text-green-500' : 'text-red-500';
  const isPositive = profitPercent >= 0;
  const {
    setShowProfitCard,
  } = useScreenshotStore();

  return (
    <div className="h-screen w-full md:w-[700px] flex flex-col text-white font-sans px-6 py-8 relative">
      <button
        onClick={() => setShowProfitCard(false)}
        className='z-20 absolute top-2 right-2 p-1 rounded-lg text-gray-700 dark:text-gray-400 dark:bg-gray-600 hover:bg-gray-50 hover:text-gray-600'
      >
        <IoMdClose />
      </button>
      <Image
        src={NeonRobot}
        alt="NeonRobot"
        layout="fill"
        objectFit="cover"
        className="-z-2"
      />

      <div className='z-2 absolute bottom-5 left-5 flex w-full justfiy-center'>
        <Image
          src={logo_combination_transparent}
          alt="logo"
          objectFit=""
          className="w-3/5 mx-auto"
        />
      </div>
      <div className="z-10 w-full justify-center">
        <p className='text-white text-3xl font-thin mx-auto text-center mt-5'>Auto-trade Result</p>
        <div className='flex flex-col mt-10  text-center'>
          <p className={cn(profitColor, 'text-6xl font-bold mt-5')}>
            {isPositive && '+'}{profitPercent}%
          </p>
          <p className={cn(profitColor, 'text-4xl font-bold')}>
            {isPositive && '+'}{profitUsd} USDT
          </p>
          <p className='text-slate-200 text-4xl font-extralight mt-[4rem]'>
            {pair}
            {' '}
            {futures ? 'Futures' : 'Spot'}
            {' '}
            <span className={cn(sideColor)}>
              {_.capitalize(side || '')}
            </span>
            {leverage > 1 ? ` ${leverage}x` : ''}
          </p>
          <div className=' flex flex-col gap-2 text-4xl mx-[12%] mt-[2rem] text-center'>
            <div className='flex flex-row justify-between w-full px-3 gap-2'>
              <p>Entry Price</p>
              <p>${entryPrice}</p>
            </div>
            <div className='flex flex-row justify-between w-full px-3 gap-2'>
              <p>Exit Price</p>
              <p>${exitPrice}</p>
            </div>
          </div>
        </div>

        <div className='flex mt-20 mx-[10%]'>
          <div className='flex flex-col items-center'>
            <QRCodeCanvas
              value={qrValue}
              size={120}
              level="H"
              fgColor="#000000"
              bgColor="#ffffff"
              marginSize={2}
              style={{
                borderRadius: '10%'
              }}
            />
            <p className='text-xl mt-1'>Scan to start<br /> auto-trading</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitCard;

ProfitCard.propTypes = {
  profitPercent: PropTypes.number.isRequired,
  profitUsd: PropTypes.number.isRequired,
  entryPrice: PropTypes.number.isRequired,
  exitPrice: PropTypes.number.isRequired,
  qrValue: PropTypes.string.isRequired,
  pair: PropTypes.string.isRequired,
  leverage: PropTypes.number.isRequired,
  side: PropTypes.string.isRequired,
  futures: PropTypes.bool.isRequired,
  sideColor: PropTypes.string.isRequired,
};
