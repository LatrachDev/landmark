import ProjectGrid from "./ProjectGrid";
import type { Project } from "@/types/project";

async function getProjects(): Promise<Project[]> {
	const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
		/\/$/,
		"",
	);
	try {
		const res = await fetch(`${apiUrl}/api/projects`, {
			next: { revalidate: 3600 },
		});
		if (!res.ok) return [];
		const data: Project[] = await res.json();
		return data.slice(0, 3);
	} catch {
		return [];
	}
}

const Projects = async () => {
	const projects = await getProjects();
	return <ProjectGrid projects={projects} />;
};

export default Projects;
