import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetailPageClient from "./BlogDetailPageClient";
import Blog from "@/components/blog/Blog";
import type { Blog as BlogType } from "@/types/blog";

type Props = {
	params: Promise<{ id: string }>;
};

const API_URL = (process.env.API_URL || "http://localhost:5000").replace(/\/$/, "");

const safeJsonLd = (obj: unknown) =>
	JSON.stringify(obj)
		.replace(/</g, "\\u003c")
		.replace(/>/g, "\\u003e")
		.replace(/&/g, "\\u0026");

function truncate(text: string, maxLength = 155) {
	if (!text) return "";
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength).split(" ").slice(0, -1).join(" ") + "...";
}

async function getBlog(id: string): Promise<BlogType | null> {
	try {
		const res = await fetch(`${API_URL}/api/blogs/${id}`, {
			next: { revalidate: 3600 },
		});
		if (!res.ok) return null;
		return res.json();
	} catch {
		return null;
	}
}

export async function generateStaticParams() {
	try {
		const res = await fetch(`${API_URL}/api/blogs`);
		if (!res.ok) return [];
		const blogs: BlogType[] = await res.json();
		return blogs.map((b) => ({ id: b.id }));
	} catch {
		return [];
	}
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const blog = await getBlog(id);

	if (!blog) {
		return {
			title: "Blog Post | Landmark Agency",
			description: "Découvrez nos articles de blog marketing digital et branding.",
		};
	}

	const description = truncate(blog.content);

	return {
		title: `${blog.title} | Landmark Agency`,
		description,
		keywords: `${blog.category}, marketing digital maroc, blog landmark, ${blog.title}`,
		alternates: { canonical: `/blog/${id}` },
		openGraph: {
			type: "article",
			url: `https://landmark.ma/blog/${id}`,
			title: blog.title,
			description,
			images: [blog.imageUrl],
			publishedTime: blog.createdAt,
		},
	};
}

export default async function BlogDetailPage({ params }: Props) {
	const { id } = await params;
	const blog = await getBlog(id);

	if (!blog) notFound();

	const articleSchema = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: blog.title,
		image: blog.imageUrl,
		datePublished: blog.createdAt,
		author: { "@type": "Organization", name: "Landmark Agency" },
		publisher: {
			"@type": "Organization",
			name: "Landmark Agency",
			logo: {
				"@type": "ImageObject",
				url: "https://landmark.ma/assets/Logotype/White.png",
			},
		},
		description: truncate(blog.content),
	};

	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Accueil", item: "https://landmark.ma" },
			{ "@type": "ListItem", position: 2, name: "Blog", item: "https://landmark.ma/blog" },
			{ "@type": "ListItem", position: 3, name: blog.title },
		],
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: safeJsonLd(articleSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
			/>
			<BlogDetailPageClient blog={blog}>
				<Blog hideHeader={true} />
			</BlogDetailPageClient>
		</>
	);
}
