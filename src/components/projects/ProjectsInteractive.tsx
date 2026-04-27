'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ProjectCard from './ProjectCard';
import VideoCard from '@/components/content/VideoCard';

const storageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${(process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.landmark.ma').replace(/\/$/, '')}/storage/${path}`;
};

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
    const [modalImageLoaded, setModalImageLoaded] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const activeVideoRef = useRef<HTMLVideoElement | null>(null);

    // Prevent background scroll and hide navbar when modal is open
    useEffect(() => {
        if (selectedProject) {
            document.body.style.overflow = 'hidden';
            document.body.setAttribute('data-modal-open', 'true');
        } else {
            document.body.style.overflow = 'auto';
            document.body.removeAttribute('data-modal-open');
        }

        return () => {
            document.body.style.overflow = 'auto';
            document.body.removeAttribute('data-modal-open');
        };
    }, [selectedProject]);

    const openProjectModal = useCallback((project: Project) => {
        setSelectedProject(project);
        setIsExpanded(false);
        setModalImageLoaded(false);
    }, []);

    const closeProjectModal = useCallback(() => {
        setSelectedProject(null);
        setIsExpanded(false);
        setModalImageLoaded(false);
    }, []);

    const handleOverlayClick = useCallback((e: React.MouseEvent) => {
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

    const handleVideoPlay = (ref: React.RefObject<HTMLVideoElement | null>) => {
        if (ref.current) {
            if (activeVideoRef.current && activeVideoRef.current !== ref.current) {
                activeVideoRef.current.pause();
            }
            activeVideoRef.current = ref.current;
        }
    };

    const isLongDescription = (selectedProject?.description?.length ?? 0) > 150;

    return (
        <>
            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>

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
                                videoUrl={storageUrl(content.video)}
                                thumbnailUrl={storageUrl(content.thumbnail)}
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
                            <div className="relative w-full min-h-[200px]">
                                {!modalImageLoaded && (
                                    <div className="w-full min-h-[400px] bg-gray-200 rounded-md animate-pulse overflow-hidden">
                                        <div className="absolute inset-0 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-[shimmer_1.5s_infinite]" />
                                    </div>
                                )}
                                <img
                                    src={storageUrl(selectedProject.landing || selectedProject.image)}
                                    alt={`Page d'accueil du projet ${selectedProject.title}`}
                                    className={`w-full h-auto mb-6 rounded-md transition-opacity duration-500 ${modalImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                    onLoad={() => setModalImageLoaded(true)}
                                    onError={(e) => {
                                        const img = e.currentTarget;
                                        const fallback = storageUrl(selectedProject.image);
                                        if (img.src !== fallback) {
                                            img.src = fallback;
                                        } else {
                                            setModalImageLoaded(true);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
