'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import mainLogo from '@/assets/logotype/main.png';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { api } from '@/services/api';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        document.title = 'Connexion Administration | Landmark';
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await api.login({ email, password });

            localStorage.setItem('token', data.token);
            Cookies.set('admin_token', data.token, { expires: 1 }); // 1 day
            toast.success('Bienvenue Haytham !');
            router.push('/admin');
        } catch (err: any) {
            const errorMessage = err?.message || 'Identifiants incorrects';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-jost px-4 overflow-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#445EF2]/5 rounded-full blur-3xl italic" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#010E26]/5 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md z-10"
            >
                <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50">
                    <div className="flex justify-center mb-10">
                        <Image
                            src={mainLogo}
                            alt="Landmark Logo"
                            width={220}
                            height={60}
                            className="h-14 object-contain w-auto"
                            priority
                        />
                    </div>

                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-black text-[#010E26] uppercase tracking-tight mb-2">Administration</h1>
                        <p className="text-gray-400 text-sm font-medium uppercase tracking-[0.2em]">Accès réservé</p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold mb-6 flex items-center gap-3 border border-red-100">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-[#010E26] text-xs font-black uppercase tracking-widest ml-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="votre@email.com"
                                className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#445EF2] focus:outline-none focus:ring-4 focus:ring-[#445EF2]/10 transition-all text-[#010E26] font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[#010E26] text-xs font-black uppercase tracking-widest ml-1">Mot de passe</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#445EF2] focus:outline-none focus:ring-4 focus:ring-[#445EF2]/10 transition-all text-[#010E26] font-medium"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#010E26] text-white font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-[#445EF2] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#010E26]/10 disabled:opacity-70 disabled:pointer-events-none mt-4"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Connexion en cours...
                                </>
                            ) : (
                                <>
                                    Accéder au dashboard
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-10 text-gray-400 text-xs font-bold uppercase tracking-[0.3em]">
                    &copy; {new Date().getFullYear()} Landmark Agency
                </p>
            </motion.div>
        </div>
    );
}
