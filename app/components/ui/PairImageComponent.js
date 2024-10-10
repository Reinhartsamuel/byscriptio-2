import { coins } from '@/app/dummy';

const PairImageComponent = ({ pair = 'USDT_BTC', width = 10 }) => {
  const arr = pair.split('_');
  const coinA = arr[1];
  const coinB = arr[0];
  const inset = parseInt(width) < 10 ? '-1rem' : '-0.5rem'
  return (
    <div className='flex justify-center'>
      <img
        // className={`w-10 h-10 z-13 rounded-full`}
        className={`w-${width} h-${width} z-13 rounded-full`}
        src={getImage(coinA)}
        alt={coinA}
      />
      <img
        // className={`w-10 h-10 rounded-full ml-[-0.8rem]`}
        className={`w-${width} h-${width} rounded-full ml-[${inset}]`}
        src={getImage(coinB)}
        alt={coinB}
      />
    </div>
  );
};

function getImage(id) {
  return coins.find((x) => x?.symbol === id)?.icon;
}

export default PairImageComponent;
