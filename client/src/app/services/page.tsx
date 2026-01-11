import type { Metadata } from 'next';
import ServicesClient from '@/app/services/ServicesClient';

export const metadata: Metadata = {
    title: 'Services Marketing Digital Maroc | Landmark Agency - Branding & Web',
    description: 'Découvrez nos services marketing digital au Maroc : branding, développement web, création de contenu, photographie, design graphique. Solutions créatives sur mesure pour votre marque.',
    keywords: [
        'services marketing digital maroc',
        'branding professionnel maroc',
        'développement web maroc',
        'création contenu digital',
        'photographie commerciale maroc',
        'design graphique',
        'stratégie digitale'
    ],
    alternates: {
        canonical: '/services',
    },
    openGraph: {
        url: 'https://Landmark.ma/services',
    }
};

async function getServicesData() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.Landmark.ma/';

    try {
        const res = await fetch(`${baseUrl}api/services`, {
            next: { revalidate: 3600 } // Revalidate every hour
        });

        if (!res.ok) {
            throw new Error('Failed to fetch services data');
        }

        const data = await res.json();
        return data.services || [];
    } catch (error) {
        console.error('Error fetching services data:', error);
        return [];
    }
}

export default async function ServicesPage() {
    const services = await getServicesData();

    return (
        <ServicesClient initialServices={services} />
    );
}
