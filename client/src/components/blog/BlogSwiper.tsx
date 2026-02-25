'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import BlogCard from '@/components/blog/BlogCard';

interface Post {
    id: string | number;
    title: string;
    description: string;
    image: string;
    category: string;
    created_at: string;
}

interface BlogSwiperProps {
    posts: Post[];
}

export default function BlogSwiper({ posts }: BlogSwiperProps) {
    const truncateDescription = (text: string, maxLength = 100) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

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
            className="!overflow-visible"
        >
            {posts.map((post) => (
                <SwiperSlide key={post.id} className="pb-10">
                    <BlogCard post={post} truncateDescription={truncateDescription} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
