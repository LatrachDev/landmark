import { MetadataRoute } from 'next';

const baseUrl = 'https://landmark.ma';
const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.landmark.ma/').replace(/\/$/, '');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let blogs: MetadataRoute.Sitemap = [];
    let services: MetadataRoute.Sitemap = [];

    try {
        const [blogsRes, servicesRes] = await Promise.all([
            fetch(`${apiBaseUrl}/api/blog`),
            fetch(`${apiBaseUrl}/api/services`)
        ]);

        if (blogsRes.ok) {
            const blogsData = await blogsRes.json();
            blogs = blogsData.blogs?.map((blog: any) => ({
                url: `${baseUrl}/blog/${blog.id}`,
                lastModified: new Date(blog.updated_at || blog.created_at),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            })) || [];
        }

        if (servicesRes.ok) {
            const servicesData = await servicesRes.json();
            services = servicesData.services?.map((service: any) => ({
                url: `${baseUrl}/services/${service.id}`,
                lastModified: new Date(service.updated_at || service.created_at),
                changeFrequency: 'monthly' as const,
                priority: 0.8,
            })) || [];
        }
    } catch (error) {
        console.error('Error generating sitemap:', error);
    }

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        ...blogs,
        ...services,
    ];
}
