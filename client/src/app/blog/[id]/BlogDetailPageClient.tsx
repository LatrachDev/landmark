'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BlogDetailsSkeleton } from '@/components/blog/BlogSkeleton';
import { motion } from 'framer-motion';

export default function BlogDetailPageClient({ children }: { children?: React.ReactNode }) {
    const params = useParams();
    const id = params?.id;
    const [blog, setBlog] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const formatBlogText = (text: string) => {
        if (!text) return null;
        const lines = text.split('\n').filter(line => line.trim() !== '');

        return lines.map((line, index) => {
            // Headings
            if (line.match(/^\d+\.\s+/)) {
                return <h2 key={index} className="text-2xl font-bold mt-10 mb-4 text-[#263973] border-l-4 border-[#445EF2] pl-4">{line}</h2>;
            }
            if (line.startsWith('#')) {
                return <h2 key={index} className="text-2xl font-bold mt-10 mb-4 text-[#263973] border-l-4 border-[#445EF2] pl-4">{line.replace(/^#+\s*/, '')}</h2>;
            }


            // Subpoints
            if (line.match(/^\d+\.\d+\s+/)) {
                return <h3 key={index} className="text-xl font-semibold mt-6 mb-2 text-[#445EF2]">{line}</h3>;
            }

            // List items start with -
            if (line.startsWith('-') || line.startsWith('*')) {
                return (
                    <div key={index} className="flex gap-3 mb-2 ml-4">
                        <span className="text-[#445EF2] mt-1.5">•</span>
                        <li className="list-none text-gray-700 leading-relaxed font-medium">{line.slice(1).trim()}</li>
                    </div>
                );
            }

            // Regular paragraphs
            return <p key={index} className="text-lg leading-relaxed mb-6 text-gray-700 font-medium">{line}</p>;
        });
    };

    useEffect(() => {
        if (!id) return;
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.landmark.ma/';
        fetch(`${apiBaseUrl}api/blog/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => {
                setBlog({
                    ...data,
                    image: `https://api.Landmark.ma/public/storage/${data.image}`
                });
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch blog data:', error);
                setIsLoading(false);
            });
    }, [id]);

    if (isLoading) return (
        <div className="font-jost bg-white">
            <BlogDetailsSkeleton />
        </div>
    );

    if (!blog) return (
        <div className="text-center py-40 bg-gray-50 min-h-screen">
            <div className="max-w-md mx-auto p-10 bg-white rounded-3xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Article non trouvé</h1>
                <p className="text-gray-500 mb-8">Désolé, l'article que vous recherchez n'existe plus ou a été déplacé.</p>
                <Link href="/blog" className="inline-block bg-[#263973] text-white px-8 py-3 rounded-full font-bold hover:bg-[#445EF2] transition-colors">
                    Retour au blog
                </Link>
            </div>
        </div>
    );

    return (
        <>
            <div className="font-jost bg-white text-[#1f2937] w-full overflow-x-hidden relative">
                <main className="mx-auto w-[90%] max-w-5xl px-4 sm:px-6 mt-10 md:mt-16">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 md:mb-12"
                    >
                        <div className="flex items-center gap-3 text-xs mb-4 text-gray-400 font-bold uppercase tracking-widest">
                            <span className="bg-[#445EF2]/10 text-[#445EF2] px-2 py-0.5 rounded-full text-[9px]">Landmark Blog</span>
                            <span>•</span>
                            <time dateTime={blog.created_at}>
                                {new Date(blog.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </time>
                        </div>

                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#010E26] leading-[1.1] mb-6 md:mb-10 font-bodoni">
                            {blog.title}
                        </h1>

                        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-xl mb-8 md:mb-12 group">
                            <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    </motion.div>

                    <div className="mx-auto">
                        <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
                            {formatBlogText(blog.description)}
                        </div>
                    </div>
                </main>

                <div className="mt-20 md:mt-32 border-t border-gray-100 pt-12 md:pt-20">
                    <div className="mx-auto w-full px-8 sm:px-10 md:px-20 lg:px-28">
                        <div className="flex flex-col sm:flex-row justify-between mb-8 md:mb-12 gap-4">
                            <h2 className="text-xl md:text-2xl font-bold text-[#010E26] uppercase tracking-wider font-bodoni">
                                Articles Similaires
                            </h2>
                            <Link href="/blog" className="text-[#445EF2] font-jost font-bold uppercase text-[10px] sm:text-xs tracking-widest hover:underline flex items-center gap-2 group">
                                Voir tout le blog
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
