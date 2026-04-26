'use client';

import { useRef, useState, useCallback, memo } from 'react';
import Image from 'next/image';
const videoSrc = '/video/LandmarkVideo.mp4';
import thumbnailSrc from '@/assets/JPG/ThumbnailMission.jpg';
import videoIconSrc from '@/assets/Services/videoIcon2.svg';

const MainVideo = memo(function MainVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const handlePlayClick = useCallback((): void => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
    }
  }, []);

  const handleVideoPlay = useCallback((): void => {
    setIsPlaying(true);
    setIsPaused(false);
  }, []);

  const handleVideoPause = useCallback((): void => {
    setIsPaused(true);
  }, []);

  return (
    <div className="container flex justify-center items-center mx-auto w-full">
      <div className="relative w-[95%] sm:w-[80%] aspect-video mb-10 overflow-hidden rounded-lg">
        {/* Video Element */}
        <video
          ref={videoRef}
          src={videoSrc}
          poster={typeof thumbnailSrc === 'string' ? thumbnailSrc : (thumbnailSrc as { src: string }).src}
          controls={isPlaying}
          className="w-full h-full object-cover"
          style={{
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
        >
          Your browser does not support the video tag.
        </video>

        {/* Thumbnail and Play Button Overlay */}
        {(!isPlaying || isPaused) && (
          <>
            {/* Thumbnail Image - only shown when paused */}
            {isPaused && (
              <Image
                src={thumbnailSrc}
                alt="Video thumbnail"
                fill
                className="object-cover"
              />
            )}

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <button
                onClick={handlePlayClick}
                className="md:w-28 md:h-28 w-16 h-16 cursor-pointer rounded-full flex items-center justify-center hover:bg-black/40 transition-all"
              >
                <Image
                  src={videoIconSrc}
                  alt="Play video"
                  width={80}
                  height={80}
                  className="md:w-20 md:h-20 w-12 h-12 rounded-full"
                />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default MainVideo;
