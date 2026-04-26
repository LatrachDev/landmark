'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import mainLogo from '@/assets/logotype/main.png';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { api } from '@/services/api';

// Route constants
const ADMIN_TEAM = '/admin/team';
const ADMIN_INBOX = '/admin/inbox';
const ADMIN_PROJECTS = '/admin/projects';
const ADMIN_BLOG = '/admin/blog';
const ADMIN_CONTENT = '/admin/content';
const ADMIN_SERVICES = '/admin/services';

export default function InboxManagementPage() {
    const [messages, setMessages] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        document.title = "Boîte de Réception | Landmark Administration";
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setIsLoading(true);
        try {
            const data = await api.inbox.getAll();
            setMessages(data);
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        Cookies.remove('admin_token');
        toast.success('Déconnexion réussie');
        router.push('/');
    };

    const navigateTo = (path: string) => router.push(path);

    const adminCards = [
        { title: "Équipe", icon: '👥', path: ADMIN_TEAM },
        { title: 'Projets', icon: '📁', path: ADMIN_PROJECTS },
        { title: 'Contenu', icon: '✍️', path: ADMIN_CONTENT },
        { title: 'Blog', icon: '🖼️', path: ADMIN_BLOG },
        { title: 'Inbox', icon: '📨', path: ADMIN_INBOX, active: true },
        { title: 'Services', icon: '🛠️', path: ADMIN_SERVICES },
    ];

    return (
        <div className="font-jost bg-[#fcfdfe] min-h-screen pb-20 overflow-x-hidden">
            {/* Navigtaion Bar */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-30 h-24 flex items-center">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full flex justify-between items-center">
                    <Link href="/admin">
                        <Image src={mainLogo} alt="Landmark" className="h-10 md:h-12 w-auto object-contain" priority />
                    </Link>
                    <button onClick={handleLogout} className="bg-[#010E26] text-white px-6 py-3 rounded-2xl hover:bg-[#445EF2] transition-all font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#010E26]/10 active:scale-95">
                        Déconnexion
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
                {/* Mini Navigation */}
                <div className="flex flex-wrap gap-3 mb-12">
                    {adminCards.map((card, idx) => (
                        <button key={idx} onClick={() => navigateTo(card.path)} className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${card.active ? 'bg-[#010E26] text-white shadow-xl shadow-[#010E26]/20' : 'bg-white text-gray-400 border border-gray-100 hover:border-[#445EF2] hover:text-[#445EF2]'}`}>
                            <span className="mr-2">{card.icon}</span> {card.title}
                        </button>
                    ))}
                </div>

                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-[#010E26] uppercase font-bodoni mb-2">Boîte de Réception</h1>
                    <p className="text-gray-500 font-medium">Consultez et gérez les messages envoyés depuis le formulaire de contact.</p>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-12 h-12 border-4 border-gray-100 border-t-[#445EF2] rounded-full animate-spin mb-6"></div>
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Synchronisation des messages...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Messages List */}
                        <div className="lg:col-span-1 space-y-4">
                            {messages.data && messages.data.length > 0 ? (
                                messages.data.map((msg: any) => (
                                    <div
                                        key={msg.id}
                                        onClick={() => setSelectedMessage(msg)}
                                        className={`p-6 rounded-[2rem] border transition-all cursor-pointer ${selectedMessage?.id === msg.id ? 'bg-[#445EF2] border-[#445EF2] text-white shadow-xl shadow-[#445EF2]/20' : 'bg-white border-gray-50 text-[#010E26] hover:border-[#445EF2]/30 hover:shadow-lg'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold uppercase text-sm truncate pr-4">{msg.full_name}</h3>
                                            <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${selectedMessage?.id === msg.id ? 'bg-white/20 text-white' : 'bg-gray-50 text-gray-400'}`}>
                                                {new Date(msg.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className={`text-xs font-medium line-clamp-1 ${selectedMessage?.id === msg.id ? 'text-white/70' : 'text-gray-400'}`}>
                                            {msg.message}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center bg-white rounded-[2rem] border border-gray-50">
                                    <p className="text-gray-300 font-black uppercase tracking-[0.3em] text-[10px]">Aucun message</p>
                                </div>
                            )}
                        </div>

                        {/* Message Detail View */}
                        <div className="lg:col-span-2">
                            <AnimatePresence mode="wait">
                                {selectedMessage ? (
                                    <motion.div
                                        key={selectedMessage.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-white rounded-[3rem] p-10 md:p-14 border border-gray-50 shadow-2xl shadow-gray-200/50"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                            <div>
                                                <span className="text-[#445EF2] font-black uppercase text-[10px] tracking-[0.3em] mb-2 block">Détails du message</span>
                                                <h2 className="text-3xl font-black text-[#010E26] uppercase font-bodoni">{selectedMessage.full_name}</h2>
                                            </div>
                                            <div className="flex gap-4">
                                                <a href={`tel:${selectedMessage.phone_number}`} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#010E26] hover:bg-[#445EF2] hover:text-white transition-all shadow-sm">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                </a>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                                            <div className="space-y-1">
                                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Informations</p>
                                                <p className="text-[#010E26] font-bold">{selectedMessage.full_name}</p>
                                                <p className="text-gray-500 font-medium">{selectedMessage.phone_number}</p>
                                                {selectedMessage.company_name && <p className="text-[#445EF2] font-black uppercase text-[10px] italic mt-2">@ {selectedMessage.company_name}</p>}
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Intérêts</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedMessage.interests?.split(',').map((interest: string, idx: number) => (
                                                        <span key={idx} className="bg-gray-100 text-[#010E26] px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider">{interest.trim()}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-10 border-t border-gray-50">
                                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Message</p>
                                            <p className="text-[#010E26] font-medium leading-[1.8] text-lg whitespace-pre-wrap italic">
                                                "{selectedMessage.message}"
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[3rem] p-20 text-center opacity-50">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                                        </div>
                                        <p className="text-gray-300 font-black uppercase tracking-[0.3em] text-[10px]">Sélectionnez un message pour l'étendre</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
