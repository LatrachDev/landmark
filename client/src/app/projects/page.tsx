import type { Metadata } from 'next';
import WebSiteBG from '@/assets/BG/maskBg.png';
import ProjectsInteractive from '@/components/projects/ProjectsInteractive';
import Services from '@/components/services/Services';
import Contact from '@/components/contact/Contact';

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

async function getProjectsData() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.Landmark.ma/';

    try {
        const res = await fetch(`${baseUrl}api/portfolio`, {
            next: { revalidate: 3600 }
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
    const { allProjects, contents }: { allProjects: Project[], contents: Content[] } = await getProjectsData();

    const projectsStructuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Projects Landmark Agency",
        "description": "Portfolio de projets marketing digital et créatifs réalisés par Landmark Agency au Maroc",
        "numberOfItems": allProjects.length,
        "itemListElement": allProjects.map((project, index) => ({
            "@type": "CreativeWork",
            "position": index + 1,
            "name": project.title,
            "description": project.description,
            "creator": {
                "@type": "Organization",
                "name": "Landmark Agency",
                "url": "https://Landmark.ma"
            }
        }))
    };

    return (
        <div className="font-['Jost'] relative min-h-screen bg-white">
            {/* Structured Data Script */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsStructuredData) }}
            />

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
                    <div className="container w-full m-auto">
                        <div className="text-xl sm:text-2xl font-bold text-left text-[#263973] uppercase mb-6" style={{ fontFamily: 'bodoni' }}>
                            <h2>BRAND design</h2>
                        </div>

                        <ProjectsInteractive projects={allProjects} contents={contents} />
                    </div>
                </div>

                <Services />
         
            </section>
            <Contact />
        </div>
    );
}
