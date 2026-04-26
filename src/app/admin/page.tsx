'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import mainLogo from '@/assets/logotype/main.png';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';

// Route constants
const ADMIN_TEAM = '/admin/team';
const ADMIN_INBOX = '/admin/inbox';
const ADMIN_PROJECTS = '/admin/projects';
const ADMIN_BLOG = '/admin/blog';
const ADMIN_CONTENT = '/admin/content';
const ADMIN_SERVICES = '/admin/services';

export default function Dashboard() {
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        document.title = 'Dashboard | Landmark Administration';
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoaded(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        Cookies.remove('admin_token');
        toast.success('Déconnexion réussie');
        router.push('/');
    };

    const cards = [
        {
            title: 'Gestion d’équipe',
            desc: 'Ajoutez, modifiez ou supprimez les membres de l’équipe.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            path: ADMIN_TEAM,
            color: 'bg-blue-50 text-blue-600',
        },
        {
            title: 'Gestion des projets',
            desc: 'Suivez, ajoutez ou archivez les projets de l’agence.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            path: ADMIN_PROJECTS,
            color: 'bg-indigo-50 text-indigo-600',
        },
        {
            title: 'Gestion du blog',
            desc: 'Éditez, publiez et gérez vos articles de blog.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2zM14 4v4h4" />
                </svg>
            ),
            path: ADMIN_BLOG,
            color: 'bg-emerald-50 text-emerald-600',
        },
        {
            title: 'Création de contenu',
            desc: 'Gérez les articles, textes, et médias publiés.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
            path: ADMIN_CONTENT,
            color: 'bg-amber-50 text-amber-600',
        },
        {
            title: 'Boîte de réception',
            desc: 'Consultez les messages de vos clients potentiels.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
            ),
            path: ADMIN_INBOX,
            color: 'bg-purple-50 text-purple-600',
        },
        {
            title: 'Gestion des services',
            desc: 'Modifiez les services proposés par l\'agence.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            path: ADMIN_SERVICES,
            color: 'bg-rose-50 text-rose-600',
        },
    ];

    if (!isLoaded) {
        return (
            <div className="font-[Jost] bg-[#fcfdfe] min-h-screen pb-20 overflow-x-hidden">
                {/* Fixed Navigation Bar Skeleton */}
                <nav className="bg-white border-b border-gray-100 fixed top-0 left-0 right-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10 h-24 flex justify-between items-center">
                        <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="h-10 w-32 bg-gray-200 rounded-2xl animate-pulse" />
                    </div>
                </nav>

                {/* Hero Section Skeleton */}
                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 md:py-24 mt-24">
                    <div className="mb-16">
                        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-4" />
                        <div className="h-16 w-96 bg-gray-200 rounded-lg animate-pulse mb-6" />
                        <div className="h-6 w-full max-w-2xl bg-gray-200 rounded animate-pulse" />
                    </div>

                    {/* Grid Cards Skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] h-64"
                            >
                                <div className="w-16 h-16 bg-gray-200 rounded-2xl animate-pulse mb-8" />
                                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-3" />
                                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
                                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="font-jost bg-[#fcfdfe] min-h-screen pb-20 overflow-x-hidden">
            {/* Navigation Bar - Fixed */}
            <nav className="bg-white border-b border-gray-100 fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/95">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 h-24 flex justify-between items-center">
                    <Link href="/admin">
                        <Image
                            src={mainLogo}
                            alt="Landmark"
                            className="h-10 md:h-12 w-auto object-contain"
                            priority
                        />
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="group flex items-center gap-3 bg-[#010E26] text-white px-6 py-3 rounded-2xl hover:bg-[#445EF2] transition-all font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#010E26]/10 active:scale-95"
                    >
                        <span>Déconnexion</span>
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4-4H3" />
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 md:py-24 mt-24">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-16"
                >
                    <span className="text-[#445EF2] font-black tracking-[0.3em] uppercase text-xs mb-4 block">Espace Administrateur</span>
                    <h1 className="text-4xl md:text-6xl font-black text-[#010E26] uppercase leading-none font-bodoni mb-6">
                        Welcome back Haytham !
                    </h1>
                    <p className="text-gray-500 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
                        Gérez facilement votre contenu, votre équipe, vos projets et optimisez la présence digitale de Landmark Agency.
                    </p>
                </motion.div>

                {/* Grid Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            whileHover={{ y: -8, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push(card.path)}
                            className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] transition-all cursor-pointer group flex flex-col h-full"
                        >
                            <div className={`w-16 h-16 ${card.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                {card.icon}
                            </div>

                            <h3 className="text-xl font-bold text-[#010E26] mb-3 uppercase tracking-tight group-hover:text-[#445EF2] transition-colors">
                                {card.title}
                            </h3>
                            <p className="text-gray-500 font-medium leading-relaxed flex-grow">
                                {card.desc}
                            </p>

                            <div className="mt-8 flex items-center gap-3 text-[#445EF2] font-black uppercase text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                <span>Gérer maintenant</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Footer decoration */}
            <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#445EF2]/20 to-transparent pointer-events-none" />
        </div>
    );
}
