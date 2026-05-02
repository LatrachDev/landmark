"use client";

import { useState, useRef, useMemo, useCallback, memo, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";

const Reel1 = "/videos/reels/CosmarkVideo.mp4";
const Reel2 = "/videos/reels/Ikram-Videi-Cp.mp4";
const Reel3 = "/videos/reels/Brimo.mp4";
const Reel4 = "/videos/reels/Darturkia01.mp4";
const Reel5 = "/videos/reels/YassinGlow.mp4";
const Reel6 = "/videos/reels/NatureProducts.mp4";

import Thumbnail1 from "@/assets/Landing/reels/thumbnails/cosmarkThumbnail.jpg";
import Thumbnail2 from "@/assets/Landing/reels/thumbnails/ikramThumbnail.jpg";
import Thumbnail3 from "@/assets/Landing/reels/thumbnails/brimoThumbnail.jpg";
import Thumbnail4 from "@/assets/Landing/reels/thumbnails/darThumbnail.jpg";
import Thumbnail5 from "@/assets/Landing/reels/thumbnails/gymThumbnail.jpg";
import Thumbnail6 from "@/assets/Landing/reels/thumbnails/naturalThumbnail.jpg";
import { StaticImageData } from "next/image";
import { JSX } from "react/jsx-runtime";

interface VideoItem {
	id: number;
	src: string;
	thumbnail: StaticImageData;
	title: string;
	views: string;
}

const Videos = memo(function Videos(): JSX.Element {
	const [playingVideo, setPlayingVideo] = useState<number | null>(null);
	const [loadedVideos, setLoadedVideos] = useState<Set<number>>(new Set([0]));
	const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
	const observerRef = useRef<IntersectionObserver | null>(null);

	const videos = useMemo<VideoItem[]>(
		() => [
			{
				id: 1,
				src: Reel1,
				thumbnail: Thumbnail1,
				title: "COSMARK",
				views: "501k",
			},
			{
				id: 2,
				src: Reel2,
				thumbnail: Thumbnail2,
				title: "IKARM | YouCode",
				views: "150k",
			},
			{
				id: 3,
				src: Reel3,
				thumbnail: Thumbnail3,
				title: "brimo chicken",
				views: "380k",
			},
			{
				id: 4,
				src: Reel4,
				thumbnail: Thumbnail4,
				title: "DAR TURKIA",
				views: "231.6k",
			},
			{
				id: 5,
				src: Reel5,
				thumbnail: Thumbnail5,
				title: "YASSIN GLOW",
				views: "220k",
			},
			{
				id: 6,
				src: Reel6,
				thumbnail: Thumbnail6,
				title: "Nature Products",
				views: "120k",
			},
		],
		[],
	);

	useEffect(() => {
		if (typeof IntersectionObserver === "undefined") return;

		observerRef.current = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const target = entry.target as HTMLElement;
						const index = parseInt(target.dataset.videoIndex || "");
						if (!isNaN(index)) {
							setLoadedVideos((prev) => new Set([...prev, index]));
							observerRef.current?.unobserve(entry.target);
						}
					}
				});
			},
			{ rootMargin: "50px", threshold: 0.1 },
		);

		const timeoutId = setTimeout(() => {
			const containers = document.querySelectorAll("[data-video-index]");
			containers.forEach((el) => observerRef.current?.observe(el));
		}, 100);

		return () => {
			clearTimeout(timeoutId);
			observerRef.current?.disconnect();
		};
	}, [videos.length]);

	const handleVideoClick = useCallback(
		(videoId: number, index: number): void => {
			if (playingVideo === videoId) {
				videoRefs.current[index]?.pause();
				setPlayingVideo(null);
			} else {
				videoRefs.current.forEach((ref, i) => {
					if (i !== index && ref) {
						ref.pause();
						ref.currentTime = 0;
					}
				});
				videoRefs.current[index]?.play();
				setPlayingVideo(videoId);
			}
		},
		[playingVideo],
	);

	const handleVideoEnd = useCallback((): void => {
		setPlayingVideo(null);
	}, []);

	const handleVideoPause = useCallback(
		(videoId: number): void => {
			if (playingVideo === videoId) setPlayingVideo(null);
		},
		[playingVideo],
	);

	return (
		<div className="w-full pb-12 sm:py-10 px-2 sm:px-6 md:px-8 lg:px-12">
			<div className="container mx-auto max-w-7xl">
				<h2
					className="text-2xl sm:text-3xl text-center md:text-4xl lg:text-5xl font-bold text-white mb-8 sm:mb-12 md:mb-16"
					style={{ fontFamily: "var(--font-jenine)" }}
				>
					فيديوهات فاتت 100 ألف مشاهدة
				</h2>

				<div className="relative">
					<style>{`
                        .videos-swiper .swiper-slide { will-change: transform; }
                    `}</style>

					{/* Custom Nav Buttons */}
					<div className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm">
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</div>
					<div className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm">
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</div>

					<Swiper
						modules={[Navigation]}
						navigation={{
							nextEl: ".swiper-button-next-custom",
							prevEl: ".swiper-button-prev-custom",
						}}
						spaceBetween={16}
						slidesPerView={1}
						watchSlidesProgress={true}
						breakpoints={{
							640: { slidesPerView: 1 },
							768: { slidesPerView: 2 },
							1024: { slidesPerView: 3 },
							1280: { slidesPerView: 4 },
						}}
						className="videos-swiper"
					>
						{videos.map((video, index) => (
							<SwiperSlide
								key={video.id}
								className="flex flex-col items-center"
							>
								<div
									data-video-index={index}
									className="relative w-[calc(100vw-10rem)] sm:w-full sm:max-w-[380px] md:max-w-[360px] aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden cursor-pointer group mb-4 shadow-2xl mx-auto will-change-transform"
									onClick={() => handleVideoClick(video.id, index)}
								>
									{loadedVideos.has(index) ? (
										<video
											ref={(el) => {
												videoRefs.current[index] = el;
											}}
											src={video.src}
											poster={(video.thumbnail as StaticImageData).src}
											className="w-full h-full object-cover"
											playsInline
											onEnded={handleVideoEnd}
											onPause={() => handleVideoPause(video.id)}
											preload={index === 0 ? "metadata" : "none"}
											controls={playingVideo === video.id}
											controlsList="nodownload"
											muted={playingVideo !== video.id}
										/>
									) : (
										<div className="w-full h-full bg-gray-800 flex items-center justify-center">
											<Image
												src={video.thumbnail}
												alt={video.title}
												fill
												className="object-cover opacity-50"
											/>
										</div>
									)}

									{/* Thumbnail Overlay */}
									{loadedVideos.has(index) && playingVideo !== video.id && (
										<div className="absolute inset-0 z-10">
											<Image
												src={video.thumbnail}
												alt={video.title}
												fill
												className="object-cover"
											/>
										</div>
									)}

									{/* Play Button */}
									{playingVideo !== video.id && (
										<div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors z-20">
											<div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
												<svg
													className="w-full h-full text-white drop-shadow-lg"
													fill="currentColor"
													viewBox="0 0 24 24"
												>
													<path d="M8 5v14l11-7z" />
												</svg>
											</div>
										</div>
									)}
								</div>

								{/* Video Info */}
								<div className="flex flex-col mt-4 sm:mt-0">
									<p
										className="text-white text-xs sm:text-sm md:text-base uppercase font-semibold mb-2 text-center"
										style={{ fontFamily: "Jost" }}
									>
										{video.title}
									</p>
									<p
										className="text-cyan-400 text-lg sm:text-xl md:text-2xl font-bold text-center"
										style={{ fontFamily: "Jost" }}
									>
										{video.views} views
									</p>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>
		</div>
	);
});

export default Videos;
