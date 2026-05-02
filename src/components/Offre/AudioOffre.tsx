"use client";

import { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
import Image, { StaticImageData } from "next/image";
const Audio1 = "/audio/whatsappaudio1.opus";
const Audio2 = "/audio/whatsappaudio2.opus";
const Audio3 = "/audio/whatsappaudio3.opus";
import CosmarkLogo from "@/assets/Landing/Logos/logo.png";
import BrimoLogo from "@/assets/Landing/Logos/Logo-01.png";
import DarTurkiaLogo from "@/assets/Landing/Logos/dar turkia.png";
import { JSX } from "react/jsx-runtime";

interface AudioTestimonial {
	id: number;
	src: string;
	brandName: string;
	personName: string;
	logo: StaticImageData;
}

// --- Waveform Component ---
interface WaveformProps {
	isPlaying: boolean;
	progress: number;
}

const Waveform = memo(function Waveform({
	isPlaying,
	progress,
}: WaveformProps): JSX.Element {
	const bars = 20;
	const barHeights = [
		40, 60, 30, 70, 50, 80, 35, 65, 45, 75, 55, 85, 40, 60, 50, 70, 45, 65, 55,
		75,
	];

	return (
		<div className="flex items-center gap-1 h-12">
			{Array.from({ length: bars }).map((_, index) => {
				const height = barHeights[index] || 50;
				const isActive = isPlaying && index < Math.floor(progress * bars);

				return (
					<div
						key={index}
						className={`w-1 rounded-full transition-all duration-150 ${isActive ? "bg-cyan-400" : "bg-gray-400"}`}
						style={{
							height: `${height}%`,
							minHeight: "8px",
							maxHeight: "100%",
							animation: isPlaying
								? `waveform ${0.5 + index * 0.1}s ease-in-out infinite`
								: "none",
						}}
					/>
				);
			})}
		</div>
	);
});

// --- AudioCard Component ---
interface AudioCardProps {
	audio: AudioTestimonial;
	index: number;
	isPlaying: boolean;
	onPlay: (index: number) => void;
	onPause: () => void;
	playingIndex: number | null;
}

const AudioCard = memo(function AudioCard({
	audio,
	index,
	isPlaying,
	onPlay,
	onPause,
	playingIndex,
}: AudioCardProps): JSX.Element {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [progress, setProgress] = useState<number>(0);

	useEffect(() => {
		const audioElement = audioRef.current;
		if (!audioElement) return;

		const updateProgress = () => {
			if (audioElement.duration) {
				setProgress(audioElement.currentTime / audioElement.duration);
			}
		};

		audioElement.addEventListener("timeupdate", updateProgress);
		return () => {
			audioElement.removeEventListener("timeupdate", updateProgress);
		};
	}, []);

	useEffect(() => {
		if (playingIndex === index && isPlaying) {
			audioRef.current?.play();
		} else {
			audioRef.current?.pause();
		}
	}, [isPlaying, playingIndex, index]);

	const handlePlayClick = (): void => {
		if (isPlaying && playingIndex === index) {
			onPause();
		} else {
			onPlay(index);
		}
	};

	const isCurrentlyPlaying = isPlaying && playingIndex === index;

	return (
		<div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg">
			{/* Header */}
			<div className="flex items-start justify-between mb-4">
				<div className="flex items-center gap-3">
					<div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden p-1.5 sm:p-2">
						<Image
							src={audio.logo}
							alt={audio.brandName}
							className="w-full h-full object-contain"
						/>
					</div>
					<div>
						<h3
							className="text-base sm:text-lg font-bold text-gray-800"
							style={{ fontFamily: "Jost" }}
						>
							{audio.brandName}
						</h3>
						<p
							className="text-xs sm:text-sm text-gray-500"
							style={{ fontFamily: "Jost" }}
						>
							{audio.personName}
						</p>
					</div>
				</div>
				<div className="text-cyan-400 shrink-0">
					<svg
						className="w-8 h-8 sm:w-10 sm:h-10"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
					</svg>
				</div>
			</div>

			{/* Audio Player */}
			<div className="flex items-center gap-3">
				<button
					onClick={handlePlayClick}
					className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-cyan-400 hover:bg-cyan-500 flex items-center justify-center transition-colors shrink-0"
				>
					{isCurrentlyPlaying ? (
						<svg
							className="w-6 h-6 text-black"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
						</svg>
					) : (
						<svg
							className="w-6 h-6 text-black ml-1"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M8 5v14l11-7z" />
						</svg>
					)}
				</button>

				<div className="flex-1">
					<Waveform isPlaying={isCurrentlyPlaying} progress={progress} />
				</div>
			</div>

			{/* Hidden Audio Element */}
			<audio
				ref={audioRef}
				src={audio.src}
				preload="metadata"
				onEnded={() => {
					setProgress(0);
					onPause();
				}}
			/>
		</div>
	);
});

// --- AudioOffre Component ---
const AudioOffre = memo(function AudioOffre(): JSX.Element {
	const [playingIndex, setPlayingIndex] = useState<number | null>(null);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);

	const audioTestimonials = useMemo<AudioTestimonial[]>(
		() => [
			{
				id: 1,
				src: Audio2,
				brandName: "COSMARK",
				personName: "Mme. Meryam",
				logo: CosmarkLogo,
			},
			{
				id: 2,
				src: Audio1,
				brandName: "Brimo Chicken",
				personName: "M. Ridoine",
				logo: BrimoLogo,
			},
			{
				id: 3,
				src: Audio3,
				brandName: "Dar Turkia",
				personName: "M. Bouchta",
				logo: DarTurkiaLogo,
			},
		],
		[],
	);

	const handlePlay = useCallback(
		(index: number): void => {
			if (playingIndex === index && isPlaying) {
				setIsPlaying(false);
				setPlayingIndex(null);
			} else {
				setPlayingIndex(index);
				setIsPlaying(true);
			}
		},
		[playingIndex, isPlaying],
	);

	const handlePause = useCallback((): void => {
		setIsPlaying(false);
		setPlayingIndex(null);
	}, []);

	return (
		<div className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 relative">
			<div className="container mx-auto max-w-7xl">
				<h2
					className="text-2xl sm:text-3xl text-center md:text-4xl lg:text-5xl font-bold text-white mb-8 sm:mb-12 md:mb-16"
					style={{ fontFamily: "var(--font-jenine)" }}
				>
					سمع آراء بعض من البراندات اللي خدمو معانا
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
					{audioTestimonials.map((audio, index) => (
						<AudioCard
							key={audio.id}
							audio={audio}
							index={index}
							isPlaying={isPlaying}
							onPlay={handlePlay}
							onPause={handlePause}
							playingIndex={playingIndex}
						/>
					))}
				</div>
			</div>

			<style>{`
                @keyframes waveform {
                    0%, 100% { transform: scaleY(0.5); }
                    50% { transform: scaleY(1); }
                }
            `}</style>
		</div>
	);
});

export default AudioOffre;
