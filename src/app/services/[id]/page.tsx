import type { Metadata } from 'next';
import ServiceDetailClient from './ServiceDetailClient';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ id: string }>;
}

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.landmark.ma/').replace(/\/$/, '');

function truncateDescription(text: string, maxLength = 155) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).split(' ').slice(0, -1).join(' ') + '...';
}

async function getService(id: string) {
    try {
        const res = await fetch(`${apiBaseUrl}/api/services/${id}`, {
            next: { revalidate: 3600 }
        });

        if (!res.ok) return null;

        const data = await res.json();
        return {
            ...data,
            imageUrl: `https://api.Landmark.ma/storage/${data.image}`,
        };
    } catch (error) {
        console.error('Error fetching service:', error);
        return null;
    }
}

export async function generateStaticParams() {
    try {
        const res = await fetch(`${apiBaseUrl}/api/services`);
        const data = await res.json();
        return data.services?.map((service: any) => ({
            id: String(service.id),
        })) || [];
    } catch {
        return [];
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const service = await getService(id);

    if (!service) {
        return {
            title: 'Service Introuvable | Landmark',
        };
    }

    const description = truncateDescription(service.description);

    return {
        title: `${service.title} | Landmark`,
        description,
        keywords: `${service.title}, services marketing digital maroc, agence créative maroc, Landmark`,
        alternates: {
            canonical: `/services/${id}`,
        },
        openGraph: {
            type: 'website',
            url: `https://landmark.ma/services/${id}`,
            title: `${service.title} | Landmark`,
            description,
            images: [service.imageUrl],
        },
    };
}

export default async function ServiceDetailPage({ params }: Props) {
    const { id } = await params;
    const service = await getService(id);

    if (!service) {
        notFound();
    }

    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": service.title,
        "description": truncateDescription(service.description),
        "image": service.imageUrl,
        "provider": {
            "@type": "Organization",
            "name": "Landmark Agency",
            "url": "https://landmark.ma"
        },
        "areaServed": "Morocco",
        "url": `https://landmark.ma/services/${id}`
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
                "name": "Services",
                "item": "https://landmark.ma/services"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": service.title
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <ServiceDetailClient service={service} />
        </>
    );
}
