'use client'
import React from 'react';
import ProfitCard from "./ProfitCard";
import { useScreenshotStore } from '../store/screenshotStore';
import { useUserStore } from '../store/userStore';

const ShareProfitScreenshot = () => {
  const {
    showProfitCard,
    setShowProfitCard,
    profitCardData,
  } = useScreenshotStore();
  const {customer} = useUserStore();
  const side = () => {
    switch (profitCardData?.requestBody?.market_type) {
      case 'futures':
        switch (profitCardData?.requestBody?.position?.type) {
          case 'buy':
            return 'LONG';
          case 'sell':
            return 'SHORT';
          default:
            return '';
        }
      case 'spot':
        return profitCardData?.requestBody?.position?.type;
      default:
        return '';
    }
  };

  const sideColor = () => {
    switch (profitCardData?.requestBody?.market_type) {
      case 'futures':
        switch (profitCardData?.requestBody?.position?.type) {
          case 'buy':
            return 'text-green-400';
          case 'sell':
            return 'text-red-500';
          default:
            return '';
        }
      case 'spot':
        return profitCardData?.requestBody?.position?.type === 'buy' ? 'bg-green-400' : 'bg-red-500';
      default:
        return '';
    }
  };

  if (showProfitCard) return (
    <div className="fixed top-0 flex flex-col w-full h-screen">
      <div className="absolute inset-0 bg-black bg-opacity-85 z-50 flex justify-center items-center h-screen w-full">
        <ProfitCard
          leverage={profitCardData?.leverage?.value}                     // Number: 10x leverage
          profitPercent={profitCardData?.profit?.percent}               // Number: +8.42%
          profitUsd={profitCardData?.profit?.usd}               // Number: +$3,250.75
          entryPrice={profitCardData?.position?.price?.value}             // Number: BTC entry price
          exitPrice={profitCardData?.data?.current_price?.last}              // Number: BTC exit price
          qrValue={`https://byscript.io/auth/login?c=${customer.id}`} // String: QR code link
          pair={profitCardData?.pair}                   // String: Trading pair
          side={side()}                       // String: "LONG" or "SHORT" or "BUY" or "SELL"
          futures={profitCardData?.requestBody?.market_type === 'futures'}                    // Boolean: true for futures trade
          setShowProfitCard={setShowProfitCard} // Function
          sideColor={sideColor()}
          exchangeThumbnail={profitCardData?.exchange_thumbnail}
        />
      </div>
    </div>
  );
  return <></>
};

export default ShareProfitScreenshot;
