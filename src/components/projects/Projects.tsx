import ProjectGrid from './ProjectGrid';
import { api } from '@/services/api';

interface Project {
    id: string | number;
    title: string;
    description: string;
    image: string;
    landing: string;
    view_percent: number | string;
}

async function getProjects(): Promise<Project[]> {
    try {
        const data = await api.home.getBlogs({
            next: { revalidate: 3600 }
        });
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