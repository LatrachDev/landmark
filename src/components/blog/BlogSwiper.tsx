"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import BlogCard from "@/components/blog/BlogCard";
import type { Blog } from "@/types/blog";

interface BlogSwiperProps {
	posts: Blog[];
}

const truncateText = (text: string, maxLength = 100) => {
	if (!text) return "";
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength) + "...";
};

export default function BlogSwiper({ posts }: BlogSwiperProps) {
	return (
		<Swiper
			modules={[Navigation]}
			spaceBetween={24}
			slidesPerView={1}
			breakpoints={{
				640: { slidesPerView: 1.2 },
				768: { slidesPerView: 2 },
				1024: { slidesPerView: 3 },
			}}
			navigation
			className="overflow-visible!"
		>
			{posts.map((post) => (
				<SwiperSlide key={post.id} className="pb-10">
					<BlogCard post={post} truncateText={truncateText} />
				</SwiperSlide>
			))}
		</Swiper>
	);
}
