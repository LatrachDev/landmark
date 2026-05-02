"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface BlogCardProps {
	post: {
		id: string | number;
		title: string;
		description: string;
		image: string;
		created_at?: string;
		category?: string;
	};
	truncateDescription: (text: string, maxLength?: number) => string;
}

const BlogCard = ({ post, truncateDescription }: BlogCardProps) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			whileHover={{ y: -5 }}
			transition={{ duration: 0.3 }}
			className="flex flex-col bg-white h-full p-3 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl border border-gray-100 overflow-hidden group"
		>
			<Link
				href={`/blog/${post.id}`}
				className="block overflow-hidden rounded-xl relative aspect-16/10"
			>
				{post.category && (
					<span className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm text-[#263973] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
						{post.category}
					</span>
				)}
				<Image
					src={post.image}
					alt={post.title}
					fill
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					className="object-cover rounded-xl transition-transform duration-500 group-hover:scale-110"
				/>
			</Link>

			<div className="grow p-3">
				{post.created_at && (
					<div className="text-[9px] text-gray-400 mb-1.5 font-medium uppercase tracking-widest">
						{new Date(post.created_at).toLocaleDateString()}
					</div>
				)}
				<Link href={`/blog/${post.id}`} className="block">
					<h3 className="text-lg md:text-xl font-bold mb-2 text-[#010E26] group-hover:text-[#445EF2] transition-colors leading-tight line-clamp-2">
						{post.title}
					</h3>
				</Link>
				<p className="text-gray-500 text-xs sm:text-sm mb-4 line-clamp-3 leading-relaxed">
					{truncateDescription(post.description, 120)}
				</p>
				<Link
					href={`/blog/${post.id}`}
					className="group/btn relative inline-flex items-center gap-2 text-[#445EF2] text-xs font-bold uppercase tracking-wider overflow-hidden"
				>
					<span className="relative z-10 transition-colors group-hover/btn:text-[#263973]">
						Lire la suite
					</span>
					<svg
						className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2.5}
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						/>
					</svg>
				</Link>
			</div>
		</motion.div>
	);
};

export default BlogCard;
