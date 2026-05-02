"use client";

import { useState } from "react";
import type { Project } from "@/types/project";

interface ProjectCardProps {
	project: Project;
	onProjectClick: (project: Project) => void;
}

export default function ProjectCard({
	project,
	onProjectClick,
}: ProjectCardProps) {
	const [imageLoaded, setImageLoaded] = useState(false);

	return (
		<div className="flex flex-col mb-10 group">
			<div
				className="mb-4 rounded-lg overflow-hidden aspect-square bg-gray-100 relative cursor-pointer"
				onClick={() => onProjectClick(project)}
				onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						onProjectClick(project);
					}
				}}
				tabIndex={0}
				role="button"
				aria-label={`Voir les détails du projet ${project.title}`}
			>
				{!imageLoaded && (
					<div className="absolute inset-0 bg-gray-200 animate-pulse">
						<div className="absolute inset-0 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-[shimmer_1.5s_infinite]" />
					</div>
				)}
				<img
					src={project.thumbnailUrl}
					alt={project.title}
					className={`w-full h-full object-cover absolute inset-0 transition-all duration-300 group-hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
					onLoad={() => setImageLoaded(true)}
				/>
				<div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 hover:bg-black/50 flex items-center justify-center transition-all duration-300 z-10">
					<span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold text-lg">
						Voir les détails
					</span>
				</div>
			</div>

			<h3 className="text-sm sm:text-xl font-bold font-['Jost'] mb-2">
				{project.title}
			</h3>
			<p className="font-['Jost'] text-sm sm:text-base text-[#010E26] mb-3 line-clamp-2">
				{project.description}
			</p>
			<p className="sm:text-2xl text-2xl text-blue-500 font-bold font-['Jost'] mb-4">
				{project.views}% <br />
				<span className="text-[#010E26] text-xs font-light">
					Website views after rebranding
				</span>
			</p>
		</div>
	);
}
