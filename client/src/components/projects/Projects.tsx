import ProjectGrid from './ProjectGrid';

// Define the TypeScript interface for your Project data
interface Project {
    id: string | number;
    title: string;
    description: string;
    image: string;
    landing: string;
    view_percent: number | string;
}

async function getProjects(): Promise<Project[]> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.Landmark.ma/';

    try {
        const res = await fetch(`${baseUrl}api/home`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch projects: ${res.statusText}`);
        }

        const data = await res.json();
        return data.threeProjects || [];
    } catch (error) {
        console.error('Error fetching projects on server:', error);
        return [];
    }
}

const Projects = async () => {
    const threeProjects = await getProjects();

    return <ProjectGrid projects={threeProjects} />;
};

export default Projects;