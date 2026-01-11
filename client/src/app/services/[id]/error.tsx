'use client';

import { useEffect } from 'react';
import Promotion from '@/components/Promotion';
import Nav from '@/components/navbar/Nav';
import Footer from '@/components/footer/Footer';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="font-['Jost'] bg-[#f9fafb] min-h-screen">
            <Promotion />
            <Nav />

            <main className="mx-auto w-[90%] px-4 sm:px-6 mt-10">
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Une erreur est survenue</h2>
                    <p className="text-gray-600 text-center mb-8 max-w-md">
                        Désolé, nous n'avons pas pu charger le service.
                    </p>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => reset()}
                            className="px-6 py-3 bg-[#263973] text-white rounded-lg hover:bg-[#1e2a5a] transition-all duration-200 shadow-md"
                        >
                            Réessayer
                        </button>
                        <Link
                            href="/services"
                            className="px-6 py-3 border border-[#263973] text-[#263973] rounded-lg hover:bg-[#263973] hover:text-white transition-all duration-200 shadow-sm"
                        >
                            Voir tous les services
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
