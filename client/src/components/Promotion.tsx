'use client'; // Required for useState/useEffect

import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Changed from react-router-dom

const Promotion = () => {
  const [timeLeft, setTimeLeft] = useState('00 : 00 : 00 : 00');

  useEffect(() => {
    // Check if window exists (safety check for Next.js SSR)
    if (typeof window === 'undefined') return;

    // Load or create promoEndTime from localStorage
    let endTimeStr = localStorage.getItem('promoEndTime');
    let endTime: number;
    if (!endTimeStr) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 6); // 6 days from now
      futureDate.setHours(futureDate.getHours() + 10); // add 10 hours
      futureDate.setMinutes(futureDate.getMinutes() + 36); // add 36 minutes
      endTime = futureDate.getTime();
      localStorage.setItem('promoEndTime', endTime.toString());
    } else {
      endTime = parseInt(endTimeStr);
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft('EXPIRÉ');
        localStorage.removeItem('promoEndTime');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(days).padStart(2, '0')} : ${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#445EF2] font-[Jost] sticky py-4 px-4 z-50 sm:px-20 text-white w-full flex flex-col sm:flex-row items-center">
      <div className="flex-1 flex items-start justify-between gap-1 sm:gap-2 text-xs sm:text-base">
        <div className="w-8/12">
          <span className="text-left mr-2 sm:w-full text-xs sm:text-sm font-bold uppercase">
            -25 % sur tous nos services, Offre Limitée
          </span>
          <span className="sm:bg-gray-700 py-1 sm:w-[170px] text-center inline-block">
            {timeLeft}
          </span>
        </div>
        {/* Updated Link */}
        <Link href={'/offre'} className="bg-gray-100 text-center font-bold hover:bg-gray-200 hover:scale-105 duration-300 text-black px-3 sm:px-4 py-1 cursor-pointer text-xs sm:text-sm transition-colors">
          Économisez Maintenant
        </Link>
      </div>
    </div>
  );
};

export default Promotion;