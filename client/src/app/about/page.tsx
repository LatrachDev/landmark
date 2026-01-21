import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
    title: 'About Us | Landmark',
    description: "Découvrez l'équipe créative de Landmark à Oujda. Notre mission : transformer vos idées en marques mémorables grâce à la créativité et la performance. Rencontrez nos experts.",
};

async function getAboutData() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.Landmark.ma/';

    try {
        const res = await fetch(`${baseUrl}api/about`, {
            headers: {
                'Accept': 'application/json'
            },
            next: { revalidate: 3600 } // Revalidate every hour
        });

        if (!res.ok) {
            throw new Error('Failed to fetch about data');
        }

        const data = await res.json();
        return data.teamMembers || [];
    } catch (error) {
        console.error('Error fetching about data:', error);
        return [];
    }
}

export default async function AboutPage() {
    const teamMembers = await getAboutData();

    return (
        <AboutClient initialTeamMembers={teamMembers} />
    );
}
