'use client'; // Required for useState/useEffect

import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Changed from react-router-dom
import Image from 'next/image';

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
    <div className="bg-[#FFC300] font-[Jost] sticky py-4 px-4 sm:px-8 lg:px-20 z-50 text-white w-full flex flex-col md:flex-row items-center animate-slide-down">
      <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 w-full">
        <div className="flex items-center gap-2">
          <span className="text-left text-xs md:text-sm font-bold uppercase text-[#010E26] whitespace-nowrap">
            -10 % sur tous nos services, Offre limitée
          </span>
          {/* tablet/desktop: timer next to the text */}
          <span className="hidden md:inline-flex bg-[#000000]/50 py-2 px-4 items-center gap-1 whitespace-nowrap text-[16px]">
            <Image src="/icones/timer.png" alt="timer" width={24} height={24} className="shrink-0" />
            {timeLeft}
          </span>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* mobile: timer fills half the row */}
          <span className="md:hidden bg-[#000000]/50 py-2 px-4 flex-1 inline-flex justify-center items-center gap-1 whitespace-nowrap text-[14px]">
            <Image src="/icones/timer.png" alt="timer" width={20} height={20} className="shrink-0" />
            {timeLeft}
          </span>
          <Link href={'/offre'} className="bg-[#000000] py-2 flex-1 md:flex-none text-center font-bold hover:scale-105 duration-300 text-[#F2F2F2] px-3 md:px-4 cursor-pointer text-[14px] md:text-[16px] transition-colors inline-flex justify-center items-center gap-2 whitespace-nowrap">
            <Image src="/icones/offre.png" alt="offre" width={20} height={20} className="shrink-0" />
            Économisez<span className="hidden min-[380px]:inline">&nbsp;Maintenant</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Promotion;