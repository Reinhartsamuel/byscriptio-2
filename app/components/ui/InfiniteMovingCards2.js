'use client';

import { cn } from '@/lib/util';
import React, { useEffect, useState } from 'react';

export const InfiniteMovingCards2 = ({
  items,
  direction = 'left',
  speed = 'fast',
  pauseOnHover = true,
  className,
}) => {
  const containerRef = React.useRef(null);
  const scrollerRef = React.useRef(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === 'left') {
        containerRef.current.style.setProperty(
          '--animation-direction',
          'forwards'
        );
      } else {
        containerRef.current.style.setProperty(
          '--animation-direction',
          'reverse'
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === 'fast') {
        containerRef.current.style.setProperty('--animation-duration', '20s');
      } else if (speed === 'normal') {
        containerRef.current.style.setProperty('--animation-duration', '40s');
      } else {
        containerRef.current.style.setProperty('--animation-duration', '80s');
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        'scroller relative z-20  max-w-7xl overflow-hidden  [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]',
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          ' flex min-w-full shrink-0 gap-2 py-2 w-max flex-nowrap',
          start && 'animate-scroll ',
          pauseOnHover && 'hover:[animation-play-state:paused]'
        )}
      >
        {items.map((item, idx) => (
          // <li
          //   className='w-[350px] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-700 px-8 py-6 md:w-[450px]'
          //   style={{
          //     background:
          //       'linear-gradient(180deg, var(--slate-800), var(--slate-900)',
          //   }}
          //   key={item.name}
          // >
          //   <blockquote>
          //     <div
          //       aria-hidden='true'
          //       className='user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]'
          //     ></div>
          //     <span className=' relative z-20 text-sm leading-[1.6] text-gray-100 font-normal'>
          //       {item.quote}
          //     </span>
          //     <div className='relative z-20 mt-6 flex flex-row items-center gap-2'>
          //       <img
          //         src={
          //           item.avatar ||
          //           'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'
          //         }
          //         alt={item.name}
          //         className='h-10 w-10 object-cover rounded-full'
          //       />
          //       <span className='flex flex-col gap-1'>
          //         <span className=' text-sm leading-[1.6] text-gray-400 font-normal'>
          //           {item.name}
          //         </span>
          //         <span className=' text-sm leading-[1.6] text-gray-400 font-normal'>
          //           {item.title}
          //         </span>
          //       </span>
          //     </div>
          //   </blockquote>
          // </li>
          <div
            key={idx}
            className="
            bg-gray-800
            text-white
            rounded-lg p-4
            m-2 flex items-center
            space-x-4 scroll-snap-
            align-start
            min-w-xs
            "
          >
            <img src={item.image} alt={item.name} className="w-8 h-8 rounded-full" />
            <div>
              <p className="text-xl font-bold">{item.pairName}</p>
              <p className={`${item.pnl > 0 ? "text-green-500" : "text-red-500"}`}>
                {item.pnl > 0 ? `+${item.pnl}%` : `${item.pnl}%`}
              </p>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};
