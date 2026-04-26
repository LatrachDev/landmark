import AboutClient from './AboutClient';
import { api } from '@/services/api';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us | Landmark',
    description: "Découvrez l'équipe créative de Landmark à Oujda. Notre mission : transformer vos idées en marques mémorables grâce à la créativité et la performance. Rencontrez nos experts.",
};

async function getAboutData() {
    try {
        const data = await api.home.getAbout({
            next: { revalidate: 3600 }
        });
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
