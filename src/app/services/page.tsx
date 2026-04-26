import type { Metadata } from 'next';
import { api } from '@/services/api';
import WebSiteBG from '@/assets/BG/maskBg.png';
import ServiceCard from '@/components/services/ServiceCard';
import Reviews from '@/components/reviews/Reviews';
import Contact from '@/components/contact/Contact';

export const metadata: Metadata = {
    title: 'Services Marketing Digital Maroc | Landmark Agency - Branding & Web',
    description: 'Découvrez nos services marketing digital au Maroc : branding, développement web, création de contenu, photographie, design graphique. Solutions créatives sur mesure pour votre marque.',
    keywords: [
        'services marketing digital maroc',
        'branding professionnel maroc',
        'développement web maroc',
        'création contenu digital',
        'photographie commerciale maroc',
        'design graphique',
        'stratégie digitale'
    ],
    alternates: {
        canonical: '/services',
    },
    openGraph: {
        url: 'https://landmark.ma/services',
        title: 'Services Marketing Digital Maroc | Landmark Agency',
        description: 'Découvrez nos services marketing digital au Maroc : branding, développement web, création de contenu, photographie, design graphique.',
    }
};

interface Service {
    id: string | number;
    title: string;
    description: string;
    image: string;
    category: string;
}

async function getServicesData() {
    try {
        const data = await api.home.getServices({
            next: { revalidate: 3600 }
        });
        return data.services || [];
    } catch (error) {
        console.error('Error fetching services data:', error);
        return [];
    }
}

export default async function ServicesPage() {
    const services: Service[] = await getServicesData();

    const groupedServices = {
        A: services.filter(service => service.category === 'A'),
        B: services.filter(service => service.category === 'B'),
        C: services.filter(service => service.category === 'C')
    };

    const categoryTitles: { [key: string]: string } = {
        A: "A.nalyser le marché",
        B: "b.rand design",
        C: "c.réation de contenu"
    };

    const projectsStructuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Services Landmark Agency",
        "description": "Services marketing digital et créatifs proposés par Landmark Agency au Maroc",
        "numberOfItems": services.length,
        "itemListElement": services.map((service, index) => ({
            "@type": "Service",
            "position": index + 1,
            "name": service.title,
            "description": service.description,
            "provider": {
                "@type": "Organization",
                "name": "Landmark Agency",
                "url": "https://landmark.ma"
            },
            "areaServed": "Morocco",
            "url": `https://landmark.ma/services/${service.id}`
        }))
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Accueil",
                "item": "https://landmark.ma"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Services"
            }
        ]
    };

    return (
        <section className="font-['Jost'] relative min-h-screen">
            {/* Structured Data Scripts */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsStructuredData) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            {/* Background style */}
            <div
                className="absolute top-0 left-0 w-full bg-cover bg-no-repeat z-0"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 70%, rgba(255,255,255,1) 95%), url(${WebSiteBG.src})`,
                    backgroundPosition: 'left 0px top -100px',
                    height: '40%'
                }}
            ></div>

            <section className="text-left py-16 px-4 sm:px-10 w-[90%] m-auto relative z-10">
                <h1 className="sm:mt-24 mt-5 text-[#010e26] text-xl sm:text-2xl md:text-4xl font-bold uppercase tracking-wide mb-4 md:mb-6">
                    DES SOLUTIONS COMPLÈTES POUR BOOSTER VOTRE MARQUE ET VOTRE VISIBILITÉ
                </h1>
                <p className="text-[#010e26] uppercase mb-10 md:mb-20 text-sm md:text-xl tracking-normal">
                    Que vous souhaitiez renforcer votre présence en ligne, bâtir une identité de marque forte ou captiver votre audience avec du contenu créatif, nous offrons des solutions complètes et adaptées.
                </p>

                <div className="mb-20">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-left text-[#263973] uppercase mb-8 tracking-[0.2em]" style={{ fontFamily: 'bodoni' }}>
                        SERVICES
                    </h2>

                    {['A', 'B', 'C'].map((category, idx) => (
                        <div key={idx} className="mb-28">
                            <h3 className="font-bold text-[#01143a] uppercase text-left text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-12 tracking-tight leading-[1.1]">
                                {categoryTitles[category]}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                                {groupedServices[category as keyof typeof groupedServices].map((service, i) => (
                                    <ServiceCard
                                        key={i}
                                        id={service.id}
                                        title={service.title}
                                        description={service.description}
                                        image={service.image}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Reviews />
            <Contact />
         
        </section>
    );
}
