import type { Metadata } from 'next';
import ProjectsClient from './ProjectsClient';

export const metadata: Metadata = {
    title: 'Projects Landmark - Projets Marketing Digital & Branding Maroc',
    description: 'Découvrez notre portfolio de projets marketing digital et branding au Maroc. Réalisations créatives pour des marques ambitieuses à Oujda, Casablanca, Tanger : sites web, identités visuelles, contenus créatifs.',
    keywords: [
        'projects marketing digital maroc',
        'projets branding maroc',
        'réalisations créatives',
        'projects agence web maroc',
        'projets Landmark',
        'créations visuelles maroc',
        'design graphique projects'
    ],
    alternates: {
        canonical: '/projects',
    },
    openGraph: {
        url: 'https://Landmark.ma/projects',
    }
};

async function getProjectsData() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.Landmark.ma/';

    try {
        const res = await fetch(`${baseUrl}api/portfolio`, {
            next: { revalidate: 3600 } // Revalidate every hour
        });

        if (!res.ok) {
            throw new Error('Failed to fetch projects data');
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching projects data:', error);
        return { allProjects: [], contents: [] };
    }
}

export default async function ProjectsPage() {
    const { allProjects, contents } = await getProjectsData();

    return (
        <ProjectsClient initialProjects={allProjects} initialContents={contents} />
    );
}
