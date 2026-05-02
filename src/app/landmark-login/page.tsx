'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import mainLogo from '@/assets/logotype/main.png';
import loginImage from '@/assets/JPG/haythamContact.jpg';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { api } from '@/services/api';
import Link from 'next/link';

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
            // The JWT is stored as an httpOnly cookie by the server — it never touches JS.
            // We only receive the admin's email and role as confirmation.
            await api.login({ email, password });

            toast.success('Bienvenue !');
            router.push('/admin');
        } catch (err: unknown) {
            const errorMessage =
                (err as { message?: string })?.message || 'Identifiants incorrects';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen flex overflow-hidden font-[Jost]">
            {/* Left Side - Form */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 lg:p-16"
            >
                <div className="w-full max-w-md">
                    <Link href="/" className="flex justify-left mb-12">
                        <Image
                            src={mainLogo}
                            alt="Landmark Logo"
                            width={240}
                            height={70}
                            className="h-16 object-contain w-auto"
                            priority
                        />
                    </Link>

                    <div className="mb-10">
                        <h1 className="text-3xl font-black text-[#010E26] uppercase tracking-tight mb-3">Administration</h1>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-[0.15em]">Accès réservé aux administrateurs</p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-semibold mb-6 flex items-center gap-3 border border-red-100">
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
                            <label className="block text-[#010E26] text-xs font-bold uppercase tracking-wider ml-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="votre@email.com"
                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#445EF2] focus:outline-none transition-all text-[#010E26] font-medium placeholder:text-gray-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[#010E26] text-xs font-bold uppercase tracking-wider ml-1">Mot de passe</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#445EF2] focus:outline-none transition-all text-[#010E26] font-medium placeholder:text-gray-400"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#445EF2] text-white font-bold uppercase tracking-wider py-5 rounded-2xl hover:bg-[#263973] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-70 disabled:pointer-events-none mt-8"
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

                    <p className="text-center mt-12 text-gray-400 text-xs font-medium uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} Landmark Agency
                    </p>
                </div>
            </motion.div>

            {/* Right Side - Image */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:block lg:w-1/2 relative overflow-hidden"
            >
                <Image
                    src={loginImage}
                    alt="Landmark Agency"
                    fill
                    className="object-cover"
                    priority
                    quality={100}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#010E26]/60 via-transparent to-transparent" />
                <div className="absolute bottom-12 left-12 right-12 text-white">
                    <h2 className="text-4xl font-black uppercase mb-4 tracking-tight">Bienvenue</h2>
                    <p className="text-lg font-medium opacity-90">Accédez à votre espace d&apos;administration</p>
                </div>
            </motion.div>
        </div>
    );
}
