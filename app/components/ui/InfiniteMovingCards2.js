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
  }, [items]);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      // Only duplicate once for performance - sufficient for infinite scroll
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
        containerRef.current.style.setProperty('--animation-duration', '30s');
      } else if (speed === 'normal') {
        containerRef.current.style.setProperty('--animation-duration', '50s');
      } else {
        containerRef.current.style.setProperty('--animation-duration', '100s');
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
          'flex min-w-full shrink-0 gap-2 py-2 w-max flex-nowrap transform-gpu will-change-transform',
          start && 'animate-scroll',
          pauseOnHover && 'hover:[animation-play-state:paused]'
        )}
      >
        {items.map((item, idx) => (
          <div
            key={`${idx}-${item.pairName || idx}`}
            className="
            bg-gray-800
            text-white
            rounded-lg p-4
            m-2 flex items-center
            space-x-4
            min-w-[200px]
            flex-shrink-0
            transform-gpu
            will-change-transform
            "
          >
            <img 
              src={item.image} 
              alt={item.name || 'Trading pair'} 
              className="w-8 h-8 rounded-full object-cover" 
              loading="lazy"
            />
            <div>
              <p className="text-lg font-bold truncate">{item.pairName || 'N/A'}</p>
              <p className={`text-sm ${item.pnl > 0 ? "text-green-500" : "text-red-500"}`}>
                {item.pnl > 0 ? `+${Math.abs(item.pnl)}%` : `${item.pnl}%`}
              </p>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};
