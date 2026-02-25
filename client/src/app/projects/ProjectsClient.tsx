'use client';

import { useState, useEffect, useRef } from 'react';
import Contact from '@/components/contact/Contact';
import Footer from '@/components/footer/Footer';
import Services from '@/components/services/Services';
import VideoCard from '@/components/content/VideoCard';
import WebSiteBG from '@/assets/BG/maskBg.png';

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

interface ProjectsClientProps {
    initialProjects: Project[];
    initialContents: Content[];
}

export default function ProjectsClient({ initialProjects, initialContents }: ProjectsClientProps) {
    const [projects] = useState<Project[]>(initialProjects);
    const [contents] = useState<Content[]>(initialContents);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [viewportHeight, setViewportHeight] = useState(0);
    const modalRef = useRef<HTMLDivElement>(null);
    const activeVideoRef = useRef<HTMLVideoElement | null>(null);

    // Handle viewport height (mobile safe zone)
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

    // Prevent background scroll when modal is open
    useEffect(() => {
        if (selectedProject) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.height = '100%';
        } else {
            document.body.style.overflow = 'auto';
            document.body.style.position = 'static';
            document.body.style.width = 'auto';
            document.body.style.height = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
            document.body.style.position = 'static';
            document.body.style.width = 'auto';
            document.body.style.height = 'auto';
        };
    }, [selectedProject]);

    const openProjectModal = (project: Project) => setSelectedProject(project);
    const closeProjectModal = () => {
        setSelectedProject(null);
        setIsExpanded(false);
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            closeProjectModal();
        }
    };

    const handleVideoPlay = (newVideoRef: React.RefObject<HTMLVideoElement | null>) => {
        if (activeVideoRef.current && activeVideoRef.current !== newVideoRef.current) {
            activeVideoRef.current.pause();
        }
        activeVideoRef.current = newVideoRef.current;
    };

    const isLongDescription = (selectedProject?.description?.length ?? 0) > 150;

    const projectsStructuredData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Projects Landmark Agency",
        "description": "Découvrez notre portfolio de projets marketing digital et créations visuelles réalisés au Maroc",
        "url": "https://Landmark.ma/projects",
        "mainEntity": {
            "@type": "ItemList",
            "name": "Projets Landmark",
            "numberOfItems": projects.length,
            "itemListElement": projects.map((project, index) => ({
                "@type": "CreativeWork",
                "position": index + 1,
                "name": project.title,
                "description": project.description,
                "image": `https://api.Landmark.ma/public/storage/${project.image}`,
                "creator": {
                    "@type": "Organization",
                    "name": "Landmark Agency"
                },
                "url": `https://Landmark.ma/projects#project-${project.id}`
            }))
        }
    };

    return (
        <div className="font-['Jost'] relative min-h-screen">
            {/* Structured Data Script */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsStructuredData) }}
            />

            {!selectedProject && (
                <>
                    {/* Background */}
                    <div
                        className="absolute top-0 left-0 w-full bg-cover bg-no-repeat"
                        style={{
                            backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 70%, rgba(255,255,255,1) 95%), url(${WebSiteBG.src})`,
                            backgroundPosition: 'left 0px top -100px',
                            height: '40%'
                        }}
                    ></div>

                    <section className="text-left py-16 px-4 sm:px-10 w-[90%] m-auto relative z-10">
                        <h1 className="sm:mt-24 mt-5 text-[#010e26] text-xl sm:text-2xl md:text-4xl font-bold uppercase tracking-wide mb-4 md:mb-6">
                            Découvrez ce qu'on a réalisé pour eux… et ce qu'on peut faire pour vous
                        </h1>
                        <p className="text-[#010e26] uppercase mb-10 md:mb-20 text-sm md:text-xl tracking-normal">
                            Faites comme eux, choisissez l'excellence et rejoignez une communauté qui nous fait confiance pour transformer leurs ambitions en réussites.
                        </p>

                        {/* Projects Section */}
                        <div className="py-16">
                            <div className="container w-[90%] m-auto">
                                <div className="text-xl sm:text-2xl font-bold text-left text-[#263973] uppercase mb-6" style={{ fontFamily: 'bodoni' }}>
                                    <h2>BRAND design</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {projects.map((project, index) => (
                                        <div key={index} className="flex flex-col mb-10 group">
                                            <div
                                                className="mb-4 rounded-lg overflow-hidden aspect-square bg-gray-100 relative cursor-pointer"
                                                onClick={() => openProjectModal(project)}
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
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Services />

                        {/* Content Section */}
                        <div className="py-16 bg-white">
                            <div className="container w-[90%] mx-auto">
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

         
                    </section>
                        <Contact />
                </>
            )}

            {/* Modal */}
            {selectedProject && (
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center z-50 px-4"
                    onClick={handleOverlayClick}
                    style={{
                        height: viewportHeight > 0 ? `${viewportHeight}px` : '100vh',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 'auto',
                    }}
                >
                    <div
                        ref={modalRef}
                        className="bg-white rounded-lg w-full max-w-6xl relative overflow-hidden flex flex-col"
                        style={{
                            maxHeight: viewportHeight > 0 ? `${viewportHeight - 32}px` : 'calc(100vh - 32px)',
                            height: 'auto'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-start z-10 flex-shrink-0">
                            <div className="flex-1 pr-4">
                                <h2 className="text-xl sm:text-2xl font-bold">{selectedProject.title}</h2>
                                <div className="mt-2 text-gray-600">
                                    <p className={`text-sm sm:text-base transition-all ${!isExpanded && isLongDescription ? 'line-clamp-3 sm:line-clamp-none' : ''}`}>
                                        {selectedProject.description}
                                    </p>
                                    {isLongDescription && (
                                        <button
                                            onClick={() => setIsExpanded(!isExpanded)}
                                            className="text-[#445EF2] text-sm mt-1 sm:hidden"
                                        >
                                            {isExpanded ? 'Show less' : 'Lire la suite'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={closeProjectModal}
                                className="text-gray-500 cursor-pointer hover:text-gray-700 text-2xl flex-shrink-0"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto flex-1 min-h-0">
                            <img
                                src={`https://api.Landmark.ma/public/storage/${selectedProject.landing}`}
                                alt={selectedProject.title}
                                className="w-full h-auto mb-6 rounded-md"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
