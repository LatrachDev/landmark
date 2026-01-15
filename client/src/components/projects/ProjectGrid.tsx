'use client';

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import Link from 'next/link';

interface Project {
    id: string | number;
    title: string;
    description: string;
    image: string;
    landing: string;
    view_percent: number | string;
}

interface ProjectGridProps {
    projects: Project[];
}

const ProjectGrid = memo(({ projects }: ProjectGridProps) => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const modalRef = useRef<HTMLDivElement | null>(null);

    const isLongDescription = (selectedProject?.description?.length ?? 0) > 150;

    // Prevent background scroll when modal is open
    useEffect(() => {
        if (selectedProject) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [selectedProject]);

    const openProjectModal = useCallback((project: Project) => {
        setSelectedProject(project);
    }, []);

    const closeProjectModal = useCallback(() => {
        setSelectedProject(null);
        setIsExpanded(false);
    }, []);

    const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            closeProjectModal();
        }
    }, [closeProjectModal]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && selectedProject) {
                closeProjectModal();
            }
        };
        if (selectedProject) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [selectedProject, closeProjectModal]);

    return (
        <section className="mx-auto px-4 sm:px-10 py-16 bg-white">
            <div className="container w-[90%] m-auto">
                {/* Section Title */}
                <div className="mb-12 font-bold text-left" style={{ fontFamily: 'bodoni' }}>
                    <h2 className="text-xl sm:text-2xl text-[#263973] uppercase">Brand Design</h2>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div key={project.id} className="flex flex-col group">
                            <div
                                className="mb-4 rounded-lg overflow-hidden aspect-square bg-gray-100 relative cursor-pointer focus-within:ring-2 focus-within:ring-[#445EF2] focus-within:ring-offset-2"
                                onClick={() => openProjectModal(project)}
                                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        openProjectModal(project);
                                    }
                                }}
                                tabIndex={0}
                                role="button"
                                aria-label={`Voir les détails du projet ${project.title}`}
                            >
                                <img
                                    src={`https://api.Landmark.ma/public/storage/${project.image}`}
                                    alt={`Image du projet ${project.title}`}
                                    className="w-full h-full object-cover absolute inset-0 transition-all duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 hover:bg-black/50 flex items-center justify-center transition-all duration-300">
                                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold text-lg">
                                        Cliquez pour voir les détails
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold font-['Jost'] mb-2">{project.title}</h3>
                            <p className="font-['Jost'] font-normal text-[#010E26] mb-3 line-clamp-2">
                                {project.description}
                            </p>
                            <p className="sm:text-2xl text-2xl text-blue-500 font-bold font-['Jost'] mb-4">
                                {project.view_percent}% <br />
                                <span className="text-[#010E26] text-xs font-light w-[30%]">
                                    Website views after rebranding
                                </span>
                            </p>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-left text-xs sm:text-sm lg:text-xl mt-12">
                    <Link
                        href="/projects"
                        className="inline-block border-2 border-gray-800 px-8 py-3 font-['Jost'] uppercase hover:bg-gray-800 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 rounded"
                        aria-label="Voir tous nos projets"
                    >
                        voir tous les projets
                    </Link>
                </div>

                {/* Project Modal */}
                {selectedProject && (
                    <div
                        className="fixed inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center z-50 overflow-y-auto"
                        onClick={handleOverlayClick}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="project-modal-title"
                        style={{
                            paddingTop: 'max(env(safe-area-inset-top), 1rem)',
                            paddingBottom: 'max(env(safe-area-inset-bottom), 1rem)',
                        }}
                    >
                        <div
                            ref={modalRef}
                            className="bg-white rounded-lg w-[90%] max-w-6xl relative overflow-hidden flex flex-col max-h-[calc(100vh-2rem)]"
                            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white px-6 py-2 border-b flex justify-between items-start z-10">
                                <div className="w-full">
                                    <h2 id="project-modal-title" className="text-2xl font-bold">{selectedProject.title}</h2>

                                    <div className="mt-2 text-gray-600">
                                        <p
                                            id="project-description"
                                            className={`transition-all ${!isExpanded && isLongDescription ? 'line-clamp-3 sm:line-clamp-none' : ''}`}
                                        >
                                            {selectedProject.description}
                                        </p>
                                        {isLongDescription && (
                                            <button
                                                onClick={() => setIsExpanded(!isExpanded)}
                                                className="text-[#445EF2] text-sm mt-1 sm:hidden focus:outline-none focus:ring-2 focus:ring-[#445EF2] focus:ring-offset-2 rounded"
                                                aria-expanded={isExpanded}
                                                aria-controls="project-description"
                                            >
                                                {isExpanded ? 'Show less' : 'Lire la suite'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={closeProjectModal}
                                    className="text-gray-500 cursor-pointer hover:text-gray-700 text-2xl ml-4 focus:outline-none focus:ring-2 focus:ring-[#445EF2] focus:ring-offset-2 rounded"
                                    aria-label="Fermer la fenêtre de détails du projet"
                                >
                                    &times;
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(100vh-160px)]">
                                <img
                                    src={`https://api.Landmark.ma/public/storage/${selectedProject.landing}`}
                                    alt={`Page d'accueil du projet ${selectedProject.title}`}
                                    className="w-full h-auto mb-6 rounded-md"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
});

ProjectGrid.displayName = 'ProjectGrid';

export default ProjectGrid;
