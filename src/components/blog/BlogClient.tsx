'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Link from 'next/link';
import BlogCard from './BlogCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

interface BlogPost {
    id: string | number;
    title: string;
    description: string;
    image: string;
    created_at?: string;
    category?: string;
}

interface BlogClientProps {
    blogs: BlogPost[];
    hideHeader?: boolean;
}

const BlogClient = ({ blogs, hideHeader = false }: BlogClientProps) => {
    const baseURL = 'https://api.Landmark.ma/public/storage/';

    const truncateText = (text: string, maxLength = 100) => {
        if (!text) return '';
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    const formattedBlogs = blogs.map(blog => ({
        ...blog,
        // Ensure image path is fully qualified for BlogCard
        image: blog.image.startsWith('http') ? blog.image : baseURL + blog.image
    }));

    return (
        <section className={`${hideHeader ? 'py-4 px-0' : 'py-20 px-4 sm:px-10 md:px-20 lg:px-28'} bg-white overflow-hidden relative w-full`}>
            <div className="container w-full m-auto">
                {!hideHeader && (
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="space-y-4">
                            <span className="text-[#445EF2] font-bold tracking-[0.3em] font-jost uppercase text-xs">Notre Actualité</span>
                            <h2 className="text-xl sm:text-2xl font-bold text-[#263973] uppercase text-left" style={{ fontFamily: 'bodoni' }}>
                                Derniers Articles
                            </h2>
                        </div>
                        <Link
                            href="/blog"
                            className="group font-jost flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-[#010E26] hover:text-[#445EF2] transition-colors"
                        >
                            Explorer le blog
                            <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center transition-all group-hover:bg-[#445EF2] group-hover:border-[#445EF2] group-hover:text-white">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                )}

                <div className="relative">
                    {/* Fading gradients */}
                    {/* <div className="absolute top-0 bottom-0 left-[-2px] w-12 sm:w-24 md:w-48 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" /> */}
                    {/* <div className="absolute top-0 bottom-0 right-[-2px] w-12 sm:w-24 md:w-48 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />  */}

                    <Swiper
                        modules={[Navigation]}
                        navigation={true}
                        spaceBetween={30}
                        breakpoints={{
                            320: { slidesPerView: 1.1, spaceBetween: 20 },
                            640: { slidesPerView: 1.8, spaceBetween: 25 },
                            1024: { slidesPerView: 2.2, spaceBetween: 30 },
                            1280: { slidesPerView: 2.5, spaceBetween: 35 },
                        }}
                        className="overflow-hidden"
                    >
                        {formattedBlogs.map((post) => (
                            <SwiperSlide key={post.id} className="pb-12 font-jost h-auto flex">
                                <BlogCard post={post} truncateDescription={truncateText} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

            </div>
        </section>
    );
};

export default BlogClient;
