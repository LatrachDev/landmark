'use client';

import React, { useRef, useEffect, useState } from 'react';

interface VideoCardProps {
    videoUrl: string;
    thumbnailUrl: string;
    title: string;
    views: number | string;
    onVideoPlay: (ref: React.RefObject<HTMLVideoElement | null>) => void;
}

const VideoCard = ({ videoUrl, onVideoPlay, thumbnailUrl, title, views }: VideoCardProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const showControls = () => {
            video.controls = true;
            setIsPlaying(true);
        };

        const hideControls = () => {
            video.controls = false;
            setIsPlaying(false);
        };

        const handleFullscreenChange = () => {
            if (video) {
                if (document.fullscreenElement) {
                    video.style.objectFit = 'contain';
                    video.style.backgroundColor = 'black';
                } else {
                    video.style.objectFit = 'contain';
                    video.style.backgroundColor = 'transparent';
                }
            }
        };

        video.controls = false;
        video.addEventListener('play', showControls);
        video.addEventListener('pause', hideControls);
        video.addEventListener('ended', hideControls);
        video.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            video.removeEventListener('play', showControls);
            video.removeEventListener('pause', hideControls);
            video.removeEventListener('ended', hideControls);
            video.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        return () => {
            if (videoRef.current) {
                videoRef.current.pause();
            }
        };
    }, []);

    const handleVideoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const video = videoRef.current;

        if (video && video.paused) {
            onVideoPlay(videoRef);
            video.play().catch(error => {
                console.error('Error playing video:', error);
            });
        } else if (video && isPlaying) {
            video.pause();
        }
    };

    const handlePlayButtonClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleVideoClick(e);
    };

    const formatViews = (num: number | string) => {
        const n = Number(num);
        if (isNaN(n)) return num;
        if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
        if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
        return n.toString();
    };

    return (
        <div className="flex flex-col">
            <div className="mb-8 relative group">
                {!isPlaying && thumbnailUrl && (
                    <div className="absolute inset-0 z-10">
                        <img
                            src={thumbnailUrl}
                            alt="Video thumbnail"
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-auto object-contain cursor-pointer"
                    onClick={handleVideoClick}
                    playsInline
                    preload="metadata"
                    controlsList="nodownload nofullscreen noremoteplayback"
                    disablePictureInPicture
                    onContextMenu={(e) => e.preventDefault()}
                    poster={thumbnailUrl}
                >
                    Your browser does not support the video tag.
                </video>

                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                    style={{ display: isPlaying ? 'none' : 'flex' }}
                >
                    <div
                        className="pointer-events-auto cursor-pointer p-4"
                        onClick={handlePlayButtonClick}
                    >
                        <svg
                            className="w-16 h-16 text-white opacity-80 hover:scale-110 transition-transform drop-shadow-lg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>
            <h3 className="text-xl font-bold font-['Jost'] mb-3">{title}</h3>
            <div>
                <p className="sm:text-2xl text-2xl text-blue-500 font-bold font-['Jost']">
                    {formatViews(views)} <span className='text-sm'>views</span>
                </p>
            </div>
        </div>
    );
};

export default VideoCard;
