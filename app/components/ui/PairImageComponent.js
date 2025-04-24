'use client'
import { coins } from '@/app/dummy';
import { getSingleDocumentFirebase } from '@/app/utils/firebaseApi';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

const CoinImageComponent = ({ coin, position, width, showUsdt, inset }) => {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      const iconFromDummy = coins.find((x) => x?.symbol === coin)?.icon;
      if (iconFromDummy) {
        setSrc(iconFromDummy);
      } else {
        const getImageFromFirestore = await getSingleDocumentFirebase('logos', coin);
        setSrc(getImageFromFirestore.image);
      }
    };

    fetchImage();
  }, [coin]);

  if (!src) return null;

  return (
    <img
      className={position === 'left' ? 
        `w-${width} h-${width} z-13 rounded-full` : 
        `w-${width} h-${width} rounded-full ${showUsdt && `ml-[${inset}]`}`
      }
      src={src}
      alt={coin}
      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/20'; }}
    />
  );
};

const PairImageComponent = ({
  pair = 'USDT_BTC',
  width = 10,
  showUsdt = true,
}) => {
  const arr = pair.split('_');
  const coinA = arr[1];
  const coinB = arr[0];
  const inset = parseInt(width) < 10 ? '-1rem' : '-0.5rem';

  return (
    <div className='flex justify-center'>
      <CoinImageComponent coin={coinA} position={'left'} width={width} showUsdt={showUsdt} inset={inset} />
      {showUsdt && (
        <CoinImageComponent coin={coinB} position={'right'} width={width} showUsdt={showUsdt} inset={inset} />
      )}
    </div>
  );
};

PairImageComponent.propTypes = {
  pair: PropTypes.string,
  width: PropTypes.number,
  showUsdt: PropTypes.bool,
};

export default PairImageComponent;