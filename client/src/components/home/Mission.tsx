"use client";

import React, { useRef, useState, VideoHTMLAttributes } from 'react';
import Image from 'next/image';

import thumbnailSrc from '@/assets/JPG/ThumbnailMission.jpg';
import videoIconSrc from '@/assets/Services/videoIcon2.svg';

// Extend standard div props so you can pass custom classNames or IDs to the container
interface MissionProps extends React.HTMLAttributes<HTMLDivElement> {}

const Mission: React.FC<MissionProps> = ({ className = '', ...props }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className={`container ${className}`} {...props}>
      <h2 
        style={{ fontFamily: 'bodoni' }} 
        className="text-xl sm:text-2xl font-bold tracking-[0.2em] mb-6 uppercase pl-0"
      >
        Notre Mission
      </h2>

      <div className="relative w-full aspect-video overflow-hidden rounded-lg shadow-md">
        {/* Video Element */}
        <video
          ref={videoRef}
          src="/video/LandmarkVideo.mp4" // Changed to a public path string (Recommended)
          poster={thumbnailSrc.src} // Next.js image imports require .src here
          controls={isPlaying} // Only show native controls once the video starts
          className="w-full h-full object-cover rounded-lg"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          Your browser does not support the video tag.
        </video>

        {/* Play Button Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <button
              onClick={handlePlayClick}
              aria-label="Play video"
              className="md:w-28 md:h-28 w-16 h-16 cursor-pointer rounded-full flex items-center justify-center hover:bg-black/40 transition-all"
            >
              <Image
                src={videoIconSrc}
                alt="Play video icon"
                width={80} // Approx w-20
                height={80} // Approx h-20
                className="md:w-20 md:h-20 w-12 h-12 rounded-full"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mission;