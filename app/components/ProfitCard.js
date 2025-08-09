import PropTypes from 'prop-types';
import Image from 'next/image';
import { IoMdClose } from 'react-icons/io';
import { QRCodeCanvas } from 'qrcode.react';
import _ from 'lodash';
import NeonRobot from '../../public/NeonRobot.png';
import React from 'react';
import logo_combination_transparent from '@/public/logo_combination_transparent.png';
import { cn } from '@/lib/util';
import { useScreenshotStore } from '../store/screenshotStore';

export default function ProfitCard({
  profitPercent,
  profitUsd,
  pair,
  futures,
  side,
  sideColor,
  leverage,
  entryPrice,
  exitPrice,
  qrValue
}) {
  const isProfit = profitUsd >= 0;
  const profitColor = isProfit ? 'text-brand_primary' : 'text-red-500';
  const isPositive = profitPercent >= 0;
  const { setShowProfitCard } = useScreenshotStore();
  const pairNameWithSlash = () => {
    if (!pair) return '';
    if (!pair?.includes('_')) return '';
    const coins = pair?.split('_');
    return `${coins[1]}/${coins[0]}`;
  }

  return (
    <div className="relative flex items-center justify-center min-h-[100dvh] w-full bg-black overflow-y-auto">
      {/* Background Image */}
      {/* <Image
        src={NeonRobot}
        alt="NeonRobot"
        fill
        priority
        className="absolute inset-0 object-cover z-0 w-full md:aspect-[9/16]"
      />*/}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0 " />

      {/* Card Content */}
      <div
        className="
          relative z-10
          w-full
          sm:max-w-[500px]
          md:aspect-[9/16] md:h-auto md:w-auto
          px-4 sm:px-6 md:px-8
          py-6 sm:py-8 md:py-10
          flex flex-col justify-between
          min-h-[100dvh] sm:min-h-[unset] md:min-h-0
        "
        style={{ backgroundImage: `url(${NeonRobot.src})`, backgroundSize: 'contain' }}
      >
        {/* Close Button */}
        <button
          onClick={() => setShowProfitCard(false)}
          className="absolute top-3 right-3 p-1 rounded-lg text-gray-200 bg-gray-800/70 hover:bg-gray-700"
        >
          <IoMdClose size={20} />
        </button>

        {/* Main Content */}
        <div>
          <p className="text-brand_primary text-center font-thin text-2xl sm:text-3xl md:text-4xl mt-2">
            Auto-trade Result
          </p>

          <div className="flex flex-col mt-8 sm:mt-10 text-center">
            <p className={cn(profitColor, 'font-bold mt-3 text-4xl sm:text-5xl md:text-6xl')}>
              {isPositive && '+'}{profitPercent}%
            </p>
            <p className={cn(profitColor, 'font-bold text-2xl sm:text-3xl md:text-4xl')}>
              {isPositive && '+'}{profitUsd} USDT
            </p>
          </div>

          <p className="text-slate-200 font-extralight mt-10 text-lg sm:text-xl md:text-2xl text-center">
            {pairNameWithSlash()} {futures ? 'Futures' : 'Spot'}{' '}
            <span className={cn(sideColor)}>{_.capitalize(side || '')}</span>
            {leverage > 1 ? ` ${leverage}x` : ''}
          </p>

          <div className="text-white flex flex-col gap-2 text-sm sm:text-base md:text-lg mt-6 sm:mt-8 mx-6">
            <div className="flex justify-between">
              <p>Entry Price</p>
              <p>${entryPrice}</p>
            </div>
            <div className="flex justify-between">
              <p>Exit Price</p>
              <p>${exitPrice}</p>
            </div>
          </div>
        </div>

        {/* QR & Logo Section */}
        <div className="flex self-start flex-col items-center mt-8 pb-6 sm:pb-8">
          <QRCodeCanvas
            value={qrValue}
            size={100}
            level="H"
            fgColor="#000000"
            bgColor="#ffffff"
            marginSize={2}
            style={{ borderRadius: '10%' }}
          />
          <p className="text-white text-sm sm:text-base md:text-lg mt-2 text-center">
            Scan to start<br />auto-trading
          </p>
        </div>

        {/* Logo */}
        <div className="mt-auto flex justify-center pb-4 sm:pb-6">
          <Image
            src={logo_combination_transparent}
            alt="logo"
            className="w-2/3 sm:w-1/2"
          />
        </div>
      </div>

      <style jsx global>{`
        @media only screen
          and (min-device-width: 768px)
          and (max-device-width: 834px)
          and (orientation: portrait) {
          .ipad\\:aspect-[9\\/16] {
            aspect-ratio: 9 / 16;
          }
        }
      `}</style>
    </div>
  );
}

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
