"use client";

import { useEffect } from "react";

import type { Service } from "@/types/service";

interface ServiceDetailClientProps {
	service: Service;
}

export default function ServiceDetailClient({
	service,
}: ServiceDetailClientProps) {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const formatDescription = (text: string) => {
		if (!text) return null;
		const lines = text.split("\n").filter((line) => line.trim() !== "");

		return lines.map((line, index) => {
			if (line.match(/^\d+\.\s+/)) {
				return (
					<h2
						key={index}
						className="text-xl font-bold mt-6 mb-2 text-[#263973]"
					>
						{line}
					</h2>
				);
			}

			if (line.startsWith("#")) {
				return (
					<h2
						key={index}
						className="text-xl font-bold mt-6 mb-2 text-[#263973]"
					>
						{line.replace(/^#+\s*/, "")}
					</h2>
				);
			}

			if (line.match(/^\d+\.\d+\s+/)) {
				return (
					<h3
						key={index}
						className="text-lg font-semibold mt-4 mb-1 text-[#445EF2]"
					>
						{line}
					</h3>
				);
			}

			if (line.startsWith("-") || line.startsWith("*")) {
				return (
					<li
						key={index}
						className="ml-6 list-disc mb-2 text-base leading-relaxed"
					>
						{line.slice(1).trim()}
					</li>
				);
			}

			return (
				<p key={index} className="text-base leading-relaxed mb-4 text-gray-700">
					{line}
				</p>
			);
		});
	};

	return (
		<div className="font-['Jost'] bg-[#f9fafb] text-[#1f2937] min-h-screen flex flex-col">
			<main className="mx-auto w-[90%] px-4 sm:px-6 mt-10 grow">
				<div className="text-sm mb-5 text-gray-500">
					<time dateTime={service.createdAt}>
						Publié le {new Date(service.createdAt).toLocaleDateString()}
					</time>
					<span className="mx-2">•</span>
					<span>Par Landmark Team</span>
				</div>

				<div className="w-full md:h-125 h-75 rounded-2xl overflow-hidden shadow-2xl mb-12 transition-transform duration-500 hover:scale-[1.005]">
					<img
						src={service.imageUrl}
						alt={service.title}
						className="w-full h-full object-cover"
					/>
				</div>

				<div className="max-w-4xl">
					<h1
						style={{ fontFamily: "bodoni" }}
						className="mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#01143a] leading-[1.1] tracking-tight"
					>
						{service.title}
					</h1>

					<div className="prose prose-lg max-w-none text-gray-800 pb-20">
						{formatDescription(service.description)}
					</div>
				</div>
			</main>
		</div>
	);
}
