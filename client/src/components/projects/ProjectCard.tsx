'use client';

interface ProjectCardProps {
    project: {
        id: string | number;
        title: string;
        description: string;
        image: string;
        view_percent: number | string;
    };
    onProjectClick: (project: any) => void;
}

export default function ProjectCard({ project, onProjectClick }: ProjectCardProps) {
    return (
        <div className="flex flex-col mb-10 group">
            <div
                className="mb-4 rounded-lg overflow-hidden aspect-square bg-gray-100 relative cursor-pointer"
                onClick={() => onProjectClick(project)}
            >
                <img
                    src={`https://api.Landmark.ma/public/storage/${project.image}`}
                    alt={project.title}
                    className="w-full h-full object-cover absolute inset-0 transition-all duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 hover:bg-black/50 flex items-center justify-center transition-all duration-300">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold text-lg">
                        Voir les détails
                    </span>
                </div>
            </div>

            <h3 className="text-sm sm:text-xl font-bold font-['Jost'] mb-2">{project.title}</h3>
            <p className="font-['Jost'] text-sm sm:text-base text-[#010E26] mb-3 line-clamp-2">{project.description}</p>
            <p className="sm:text-2xl text-2xl text-blue-500 font-bold font-['Jost'] mb-4">
                {project.view_percent}% <br />
                <span className='text-[#010E26] text-xs font-light'>Website views after rebranding</span>
            </p>
        </div>
    );
}
