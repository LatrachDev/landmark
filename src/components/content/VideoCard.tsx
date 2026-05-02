'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface VideoCardProps {
    videoUrl: string;
    thumbnailUrl: string;
    title: string;
    views: number | string;
    onVideoPlay: (ref: React.RefObject<HTMLVideoElement | null>) => void;
}

const VideoCard = ({ videoUrl, onVideoPlay, thumbnailUrl, title, views }: VideoCardProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoMounted, setIsVideoMounted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Once the video element is mounted, call play
    useEffect(() => {
        if (!isVideoMounted) return;
        const video = videoRef.current;
        if (!video) return;

        video.controls = false;

        const onPlay = () => { video.controls = true; setIsPlaying(true); };
        const onPause = () => { video.controls = false; setIsPlaying(false); };
        const onEnded = () => { video.controls = false; setIsPlaying(false); };

        video.addEventListener('play', onPlay);
        video.addEventListener('pause', onPause);
        video.addEventListener('ended', onEnded);

        onVideoPlay(videoRef);
        video.play().catch(() => {});

        return () => {
            video.removeEventListener('play', onPlay);
            video.removeEventListener('pause', onPause);
            video.removeEventListener('ended', onEnded);
        };
    }, [isVideoMounted]);

    useEffect(() => {
        return () => { videoRef.current?.pause(); };
    }, []);

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isVideoMounted) {
            // First click: mount the video element and auto-play
            setIsVideoMounted(true);
            return;
        }

        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
        } else {
            onVideoPlay(videoRef);
            video.play().catch(() => {});
        }
    }, [isVideoMounted, isPlaying, onVideoPlay]);

    const formatViews = (num: number | string) => {
        const n = Number(num);
        if (isNaN(n)) return num;
        if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
        if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
        return n.toString();
    };

    return (
        <div className="flex flex-col">
            <div
                className="mb-8 relative group aspect-9/16 overflow-hidden rounded-lg bg-gray-900 cursor-pointer"
                onClick={handleClick}
            >
                {/* Video — only mounted after first click */}
                {isVideoMounted && (
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        className="absolute inset-0 w-full h-full object-cover"
                        playsInline
                        preload="auto"
                        controlsList="nodownload"
                        onContextMenu={(e) => e.preventDefault()}
                    />
                )}

                {/* Thumbnail — shown until playing */}
                {!isPlaying && thumbnailUrl && (
                    <div className="absolute inset-0 z-10">
                        <img
                            src={thumbnailUrl}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Play button */}
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <svg
                            className="w-16 h-16 text-white opacity-80 group-hover:scale-110 transition-transform drop-shadow-lg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                )}
            </div>
            <h3 className="text-xl font-bold font-['Jost'] mb-3">{title}</h3>
            <div>
                <p className="sm:text-2xl text-2xl text-blue-500 font-bold font-['Jost']">
                    {formatViews(views)} <span className="text-sm">views</span>
                </p>
            </div>
        </div>
    );
};

export default VideoCard;
