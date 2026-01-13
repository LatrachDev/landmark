'use client';

import Promotion from '@/components/Promotion';
import Nav from '@/components/navbar/Nav';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import WebSiteBG from '@/assets/BG/maskBg.png';
import logoSrc from '@/assets/logotype/white.png';

import { BlogSkeleton } from '@/components/blog/BlogSkeleton';
import BlogCard from '@/components/blog/BlogCard';

export default function BlogPageClient() {
    const [blogData, setBlogData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.landmark.ma/';
        fetch(`${apiBaseUrl}api/blog`, {
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => {
                if (data.blogs) {
                    // Group blogs by category
                    const groupedBlogs = data.blogs.reduce((acc: any, blog: any) => {
                        const category = blog.category;
                        if (!acc[category]) {
                            acc[category] = [];
                        }
                        acc[category].push({
                            ...blog,
                            image: `https://api.Landmark.ma/public/storage/${blog.image}`
                        });
                        return acc;
                    }, {});

                    // Convert to array format matching your original structure
                    const formattedData = Object.entries(groupedBlogs).map(([category, posts]) => ({
                        category: category === 'CONTENT'
                            ? 'EN RELATION AVEC LA CRÉATION DE CONTENUE'
                            : `EN RELATION AVEC LE ${category}`,
                        posts: posts as any[]
                    }));

                    setBlogData(formattedData);
                }
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch blog data:', error);
                setIsLoading(false);
            });
    }, []);

    // Function to truncate description
    const truncateDescription = (text: string, maxLength = 100) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className="font-jost relative min-h-screen w-full overflow-x-hidden bg-white">
            {/* Background with smoother, longer gradient overlay */}
            <div
                className="absolute top-0 left-0 w-full bg-cover bg-no-repeat opacity-40 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 40%, rgba(255,255,255,1) 100%), url(${WebSiteBG.src})`,
                    backgroundPosition: 'left 0px top -50px',
                    height: '100%'
                }}
            ></div>

            <Promotion />
            <Nav />
            <section className='w-full flex flex-col justify-center px-4 sm:px-10 relative'>

                <div className="relative z-10 mt-12 md:mt-24">
                    <div className="mx-auto w-[90%]">
                        <h1 className="text-[#010e26] text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 md:mb-6 leading-none">
                            Besoin d'inspiration ?
                        </h1>
                        <p className="text-[#010e26] uppercase mb-8 md:mb-12 text-base sm:text-lg md:text-xl font-medium tracking-tight opacity-80">
                            Découvrez tous nos contenus en un seul endroit.
                        </p>
                    </div>

                    {/* Blog Sections */}
                    <section className=" pb-8 md:pb-16 ">
                        <div className="container w-[90%] mx-auto space-y-16 md:space-y-24">

                            <div>
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#263973] uppercase text-left mb-8 tracking-widest relative inline-block font-bodoni">
                                    Nos Articles
                                    <span className="absolute -bottom-2 left-0 w-10 h-1 bg-[#445EF2]"></span>
                                </h2>
                            </div>

                            {isLoading ? (
                                <BlogSkeleton />
                            ) : blogData.length > 0 ? (
                                blogData.map((category, index) => (
                                    <div key={index} className="space-y-8 md:space-y-10">
                                        <div className="flex items-center gap-6">
                                            <h2 className="text-xl sm:text-2xl md:text-3xl text-[#010E26] uppercase text-left font-bold tracking-tight leading-tight font-bodoni">
                                                {category.category}
                                            </h2>
                                            <div className="h-[1px] bg-gradient-to-r from-gray-300 to-transparent flex-grow"></div>
                                        </div>

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
                                            {category.posts.map((post: any) => (
                                                <SwiperSlide key={post.id} className="pb-10">
                                                    <BlogCard post={post} truncateDescription={truncateDescription} />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white/50 backdrop-blur-md rounded-3xl border border-dashed border-gray-300">
                                    <p className="text-gray-500 font-medium">Aucun article disponible pour le moment.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

            </section>
        </div>
    );
}
