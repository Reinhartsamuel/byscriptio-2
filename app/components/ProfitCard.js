import React from 'react';
import QRCode from 'qrcode.react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import Mascot from '../../public/Mascot 2D transparent bg-min.png';
import logo from "../../public/combination-mini.png";


const ProfitCard = ({
  profitPercent,
  profitUsd,
  entryPrice,
  exitPrice,
  qrValue,
  setShowProfitCard
}) => {
  const isProfit = profitUsd >= 0;
  const profitColor = isProfit ? 'text-green-500' : 'text-red-500';

  return (
    <div className="w-[400px] h-[700px] bg-black grid grid-rows-[auto_auto_1fr_auto] text-white font-sans px-6 py-8 relative">
      {/* Background Grid Pattern */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <div className="relative h-full w-full bg-slate-950 [&>div]:absolute [&>div]:inset-0 [&>div]:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] [&>div]:bg-[size:14px_24px]">
          </div>
        </div>
      </div>

      {/* Result Text */}
      <div className="z-10 text-center mb-2">
        <button onClick={() => setShowProfitCard(false)}>close</button>
        <p className="text-lg font-light">Auto-Trade Result</p>
        <h1 className={`text-5xl font-bold ${profitColor}`}>
          {isProfit ? '+' : '-'}
          {Math.abs(profitPercent).toFixed(2)}%
        </h1>
        <h2 className={`text-2xl font-semibold ${profitColor}`}>
          {isProfit ? '+' : '-'}${Math.abs(profitUsd).toLocaleString()}
        </h2>
      </div>

      {/* Asset Info */}
      <div className="z-10 text-center mb-4">
        <p className="text-green-400 text-xl font-medium">BITCOIN SPOT</p>
      </div>

      {/* Price Table */}
      <div className="z-10 flex justify-between text-lg mb-4 px-2">
        <div>
          <p className="text-gray-300">Entry Price</p>
          <p className="text-gray-300">Exit Price</p>
        </div>
        <div className="text-right">
          <p className="text-white">${entryPrice.toLocaleString()}</p>
          <p className="text-white">${exitPrice.toLocaleString()}</p>
        </div>
      </div>

      {/* Mascot + QR Code */}
      <div className="z-10 flex justify-between items-end mt-auto">
        <Image
          src={Mascot} // Put your mascot image in /public
          alt="mascot"
          width={120}
          height={120}
        />
        <div className="flex flex-col items-center">
          <QRCode value={qrValue} size={100} fgColor="#ffffff" bgColor="#000000" />
          <p className="text-sm mt-2 text-gray-300">Scan to start auto-trading</p>
        </div>
      </div>

      {/* Branding */}
      <Image
        alt="byScript"
        src={logo}
        className="h-8 w-auto rounded-lg"
      />
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
  setShowProfitCard: PropTypes.func,
};

ProfitCard.defaultProps = {
  profitPercent: 0,
  profitUsd: 0,
  entryPrice: 0,
  exitPrice: 0,
  qrValue: '',
};
