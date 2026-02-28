import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogDetailPageClient from './BlogDetailPageClient';
import Blog from '@/components/blog/Blog';

type Props = {
    params: Promise<{ id: string }>;
};

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.landmark.ma/').replace(/\/$/, '');

function truncateDescription(text: string, maxLength = 155) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).split(' ').slice(0, -1).join(' ') + '...';
}

async function getBlog(id: string) {
    try {
        const res = await fetch(`${apiBaseUrl}/api/blog/${id}`, {
            next: { revalidate: 3600 }
        });
        if (!res.ok) return null;
        const data = await res.json();
        return {
            ...data,
            image: `https://api.landmark.ma/public/storage/${data.image}`
        };
    } catch {
        return null;
    }
}

export async function generateStaticParams() {
    try {
        const res = await fetch(`${apiBaseUrl}/api/blog`);
        const data = await res.json();
        return data.blogs?.map((blog: any) => ({
            id: String(blog.id),
        })) || [];
    } catch {
        return [];
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const blog = await getBlog(id);

    if (!blog) {
        return {
            title: 'Blog Post | Landmark Agency',
            description: 'Découvrez nos articles de blog marketing digital et branding.',
        };
    }

    const description = truncateDescription(blog.description);

    return {
        title: `${blog.title} | Landmark Agency`,
        description,
        keywords: `${blog.category}, marketing digital maroc, blog landmark, ${blog.title}`,
        alternates: {
            canonical: `/blog/${id}`,
        },
        openGraph: {
            type: 'article',
            url: `https://landmark.ma/blog/${id}`,
            title: blog.title,
            description,
            images: [blog.image],
            publishedTime: blog.created_at,
        },
    };
}

export default async function BlogDetailPage({ params }: Props) {
    const { id } = await params;
    const blog = await getBlog(id);

    if (!blog) {
        notFound();
    }

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.title,
        "image": blog.image,
        "datePublished": blog.created_at,
        "author": {
            "@type": "Organization",
            "name": "Landmark Agency"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Landmark Agency",
            "logo": {
                "@type": "ImageObject",
                "url": "https://landmark.ma/assets/Logotype/White.png"
            }
        },
        "description": truncateDescription(blog.description)
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
                "name": "Blog",
                "item": "https://landmark.ma/blog"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": blog.title
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <BlogDetailPageClient blog={blog}>
                <Blog hideHeader={true} />
            </BlogDetailPageClient>
        </>
    );
}
