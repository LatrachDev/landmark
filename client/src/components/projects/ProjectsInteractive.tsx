'use client';

import { useState, useEffect, useRef } from 'react';
import ProjectCard from './ProjectCard';
import VideoCard from '@/components/content/VideoCard';

interface Project {
    id: string | number;
    title: string;
    description: string;
    image: string;
    landing: string;
    view_percent: number | string;
}

interface Content {
    id: string | number;
    video: string;
    thumbnail: string;
    title: string;
    views: number | string;
}

interface ProjectsInteractiveProps {
    projects: Project[];
    contents: Content[];
}

export default function ProjectsInteractive({ projects, contents }: ProjectsInteractiveProps) {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [viewportHeight, setViewportHeight] = useState(0);
    const modalRef = useRef<HTMLDivElement>(null);
    const activeVideoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        setViewportHeight(window.innerHeight);

        const handleResize = () => setViewportHeight(window.innerHeight);
        const handleVisualViewportChange = () => {
            if (window.visualViewport) setViewportHeight(window.visualViewport.height);
        };

        window.addEventListener('resize', handleResize);
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleVisualViewportChange);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', handleVisualViewportChange);
            }
        };
    }, []);

    const openProjectModal = (project: Project) => {
        setSelectedProject(project);
        setIsExpanded(false);
        document.body.style.overflow = 'hidden';
    };

    const closeProjectModal = () => {
        setSelectedProject(null);
        setIsExpanded(false);
        document.body.style.overflow = 'auto';
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            closeProjectModal();
        }
    };

    const handleVideoPlay = (ref: React.RefObject<HTMLVideoElement | null>) => {
        if (ref.current) {
            if (activeVideoRef.current && activeVideoRef.current !== ref.current) {
                activeVideoRef.current.pause();
            }
            activeVideoRef.current = ref.current;
        }
    };

    const isLongDescription = selectedProject && selectedProject.description.length > 200;

    return (
        <>
            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                    <ProjectCard key={index} project={project} onProjectClick={openProjectModal} />
                ))}
            </div>

            {/* Content Section */}
            <div className="py-16 bg-white">
                <div className="container w-full mx-auto">
                    <div className="mb-12">
                        <h2
                            className="text-xl sm:text-2xl text-[#263973] font-bold uppercase text-left"
                            style={{ fontFamily: 'bodoni' }}
                        >
                            Création de contenu
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {contents.map((content) => (
                            <VideoCard
                                key={content.id}
                                videoUrl={`https://api.Landmark.ma/public/storage/${content.video}`}
                                thumbnailUrl={`https://api.Landmark.ma/public/storage/${content.thumbnail}`}
                                title={content.title}
                                views={content.views}
                                onVideoPlay={handleVideoPlay}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {selectedProject && (
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center z-50 px-4"
                    onClick={handleOverlayClick}
                    style={{
                        height: viewportHeight > 0 ? `${viewportHeight}px` : '100vh',
                    }}
                >
                    <div
                        ref={modalRef}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
                        style={{
                            maxHeight: viewportHeight > 0 ? `${viewportHeight * 0.9}px` : '90vh',
                        }}
                    >
                        <div className="relative w-full h-64 md:h-80">
                            <img
                                src={`https://api.Landmark.ma/public/storage/${selectedProject.image}`}
                                alt={selectedProject.title}
                                className={`w-full h-full object-cover ${isExpanded && isLongDescription ? 'rounded-t-3xl' : ''}`}
                            />
                        </div>

                        <div className="p-6 md:p-8 overflow-y-auto" style={{ maxHeight: '50vh' }}>
                            <h2 className="text-2xl md:text-3xl font-bold text-[#010E26] mb-4">{selectedProject.title}</h2>
                            <p className={`text-[#64748b] text-base leading-relaxed mb-6 ${!isExpanded && isLongDescription ? 'line-clamp-3' : ''}`}>
                                {selectedProject.description}
                            </p>
                            {isLongDescription && (
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="text-[#445EF2] font-semibold hover:underline mb-6"
                                >
                                    {isExpanded ? 'Voir moins' : 'Voir plus'}
                                </button>
                            )}

                            <button
                                onClick={closeProjectModal}
                                className="w-full bg-[#263973] text-white py-3 rounded-full font-bold hover:bg-[#445EF2] transition-colors duration-300"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
