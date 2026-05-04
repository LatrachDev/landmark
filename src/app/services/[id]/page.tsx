import type { Metadata } from "next";
import ServiceDetailClient from "./ServiceDetailClient";
import { notFound } from "next/navigation";
import type { Service } from "@/types/service";

interface Props {
	params: Promise<{ id: string }>;
}

const API_URL = (process.env.API_URL || "http://localhost:5000").replace(
	/\/$/,
	"",
);

function truncateDescription(text: string, maxLength = 155) {
	if (!text || text.length <= maxLength) return text;
	return text.substring(0, maxLength).split(" ").slice(0, -1).join(" ") + "...";
}

function safeJsonLd(data: object): string {
	return JSON.stringify(data)
		.replace(/</g, "\\u003c")
		.replace(/>/g, "\\u003e")
		.replace(/&/g, "\\u0026");
}

async function getService(id: string): Promise<Service | null> {
	try {
		const res = await fetch(`${API_URL}/api/services/${id}`, {
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
		const res = await fetch(`${API_URL}/api/services`);
		if (!res.ok) return [];
		const services: Service[] = await res.json();
		return services.map((s) => ({ id: s.id }));
	} catch {
		return [];
	}
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const service = await getService(id);

	if (!service) return { title: "Service Introuvable | Landmark" };

	const description = truncateDescription(service.description);
	return {
		title: `${service.title} | Landmark`,
		description,
		keywords: `${service.title}, services marketing digital maroc, agence créative maroc, Landmark`,
		alternates: { canonical: `/services/${id}` },
		openGraph: {
			type: "website",
			url: `https://landmark.ma/services/${id}`,
			title: `${service.title} | Landmark`,
			description,
			images: [service.imageUrl],
		},
		twitter: {
			card: "summary_large_image",
			title: `${service.title} | Landmark Agency`,
			description,
			images: [service.imageUrl],
		},
	};
}

export default async function ServiceDetailPage({ params }: Props) {
	const { id } = await params;
	const service = await getService(id);

	if (!service) notFound();

	const serviceSchema = {
		"@context": "https://schema.org",
		"@type": "Service",
		name: service.title,
		description: truncateDescription(service.description),
		image: service.imageUrl,
		provider: {
			"@type": "Organization",
			name: "Landmark Agency",
			url: "https://landmark.ma",
		},
		areaServed: "Morocco",
		url: `https://landmark.ma/services/${id}`,
	};

	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Accueil",
				item: "https://landmark.ma",
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Services",
				item: "https://landmark.ma/services",
			},
			{ "@type": "ListItem", position: 3, name: service.title },
		],
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: safeJsonLd(serviceSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
			/>
			<ServiceDetailClient service={service} />
		</>
	);
}
