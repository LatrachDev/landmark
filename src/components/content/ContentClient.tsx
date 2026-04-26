'use client';

import React, { useRef, useCallback } from 'react';
import Link from 'next/link';
import VideoCard from './VideoCard';

interface ContentItem {
    id: string | number;
    video: string;
    thumbnail: string;
    title: string;
    views: number | string;
}

interface ContentClientProps {
    contents: ContentItem[];
}

const ContentClient = ({ contents }: ContentClientProps) => {
    const activeVideoRef = useRef<HTMLVideoElement | null>(null);

    const handleVideoPlay = useCallback((newVideoRef: React.RefObject<HTMLVideoElement | null>) => {
        if (activeVideoRef.current && activeVideoRef.current !== newVideoRef.current) {
            activeVideoRef.current.pause();
        }
        activeVideoRef.current = newVideoRef.current;
    }, []);

    return (
        <section className="px-4 sm:px-10 py-16 bg-white">
            <div className="container w-[90%] mx-auto">
                <div className="mb-12">
                    <h2
                        className="text-xl sm:text-2xl text-[#263973] font-bold uppercase text-left"
                        style={{ fontFamily: 'bodoni' }}
                    >
                        Création de contenu
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {contents.map((content) => (
                        <VideoCard
                            key={content.id}
                            videoUrl={`https://api.Landmark.ma/storage/${content.video}`}
                            thumbnailUrl={`https://api.Landmark.ma/storage/${content.thumbnail}`}
                            title={content.title}
                            views={content.views}
                            onVideoPlay={handleVideoPlay}
                        />
                    ))}
                </div>

                <div className="text-left text-xs sm:text-sm md:text-xl mt-12">
                    <Link
                        href="/projects"
                        className="inline-block border-2 border-gray-800 px-8 py-3 font-['Jost'] uppercase hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        voir tous les projets
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ContentClient;
