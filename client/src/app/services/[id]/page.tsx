import type { Metadata, ResolvingMetadata } from 'next';
import ServiceDetailClient from './ServiceDetailClient';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ id: string }>;
}

async function getService(id: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.Landmark.ma/';

    try {
        const res = await fetch(`${baseUrl}api/services/${id}`, {
            next: { revalidate: 3600 } // Revalidate every hour
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error('Failed to fetch service');
        }

        const data = await res.json();
        return {
            ...data,
            imageUrl: `https://api.Landmark.ma/public/storage/${data.image}`,
        };
    } catch (error) {
        console.error('Error fetching service:', error);
        return null;
    }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = (await params).id;
    const service = await getService(id);

    if (!service) {
        return {
            title: 'Service Introuvable | Landmark',
        };
    }

    return {
        title: `${service.title} | Landmark`,
        description: service.description?.substring(0, 160),
    };
}

export default async function ServiceDetailPage({ params }: Props) {
    const id = (await params).id;
    const service = await getService(id);

    if (!service) {
        notFound();
    }

    return <ServiceDetailClient service={service} />;
}
