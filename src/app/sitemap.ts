import type { MetadataRoute } from "next";

const BASE_URL = "https://landmark.ma";
const NEXT_PUBLIC_NEXT_PUBLIC_API_URL = (process.env.NEXT_PUBLIC_NEXT_PUBLIC_API_URL || "https://api.landmark.ma").replace(
	/\/$/,
	"",
);

type BlogEntry = { id: string; updatedAt: string };
type ServiceEntry = { id: string; updatedAt: string };

async function getBlogs(): Promise<BlogEntry[]> {
	try {
		const res = await fetch(`${NEXT_PUBLIC_NEXT_PUBLIC_API_URL}/api/blogs`, { cache: "no-store" });
		if (!res.ok) return [];
		return res.json();
	} catch {
		return [];
	}
}

async function getServices(): Promise<ServiceEntry[]> {
	try {
		const res = await fetch(`${NEXT_PUBLIC_NEXT_PUBLIC_API_URL}/api/services`, { cache: "no-store" });
		if (!res.ok) return [];
		return res.json();
	} catch {
		return [];
	}
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [blogs, services] = await Promise.all([getBlogs(), getServices()]);

	const staticRoutes: MetadataRoute.Sitemap = [
		{
			url: BASE_URL,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1.0,
		},
		{
			url: `${BASE_URL}/about`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${BASE_URL}/services`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${BASE_URL}/projects`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/blog`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/contact`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.6,
		},
	];

	const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
		url: `${BASE_URL}/blog/${blog.id}`,
		lastModified: new Date(blog.updatedAt),
		changeFrequency: "monthly",
		priority: 0.7,
	}));

	const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
		url: `${BASE_URL}/services/${service.id}`,
		lastModified: new Date(service.updatedAt),
		changeFrequency: "monthly",
		priority: 0.8,
	}));

	return [...staticRoutes, ...blogRoutes, ...serviceRoutes];
}
