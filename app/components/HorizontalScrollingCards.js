'use client';

import React, { useState } from 'react';

const HorizontalScrollingCards = ({ items }) => {
  const [loopedItems, setLoopedItems] = useState([...items, ...items]);

  return (
    <div className="relative w-full overflow-hidden py-8">
      <div className="animate-infinite-scroll flex w-[calc(250px*20)]">
        {loopedItems.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 mx-4 w-[300px] rounded-xl p-6 backdrop-blur-lg border border-white/10"
            style={{
              background: 'linear-gradient(145deg, rgba(30,30,40,0.7) 0%, rgba(45,45,60,0.7) 100%)',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.2)',
            }}
          >
            <div className="flex items-center space-x-4">
              {item.avatar ? (
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full border-2 border-white/20"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-white/20 flex items-center justify-center">
                  <span className="text-white font-bold">{item.name.charAt(0)}</span>
                </div>
              )}
              <div>
                <p className="text-xl font-bold text-white">{item.name}</p>
                <p className="text-sm text-gray-300">{item.title}</p>
              </div>
            </div>
            <p className="mt-4 text-gray-200 italic">"{item.quote}"</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-250px * 10));
          }
        }

        .animate-infinite-scroll {
          animation: scroll 40s linear infinite;
          display: flex;
          width: calc(250px * 20);
        }

        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default HorizontalScrollingCards;
