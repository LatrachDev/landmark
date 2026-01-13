import { Metadata } from 'next';
import BlogDetailPageClient from './BlogDetailPageClient';
import Blog from '@/components/blog/Blog';

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.landmark.ma/';

    try {
        const res = await fetch(`${apiBaseUrl}api/blog/${id}`);
        if (!res.ok) throw new Error();
        const blog = await res.json();

        return {
            title: `${blog.title} | Landmark Agency`,
            description: blog.description.substring(0, 160),
            openGraph: {
                title: blog.title,
                description: blog.description.substring(0, 160),
                images: [`https://api.Landmark.ma/public/storage/${blog.image}`],
            },
        };
    } catch (error) {
        return {
            title: 'Blog Post | Landmark Agency',
            description: 'Découvrez nos articles de blog marketing digital et branding.',
        };
    }
}

export default async function BlogDetailPage({ params }: Props) {
    return (
        <BlogDetailPageClient>
            <Blog hideHeader={true} />
        </BlogDetailPageClient>
    );
}
