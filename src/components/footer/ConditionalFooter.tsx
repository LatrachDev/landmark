'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

const HIDDEN_ON: string[] = ['/offre', '/landmark-login', '/admin'];

export default function ConditionalFooter() {
    const pathname = usePathname();

    if (HIDDEN_ON.some((path) => pathname === path || pathname.startsWith(path + '/'))) {
        return null;
    }

    return <Footer />;
}
