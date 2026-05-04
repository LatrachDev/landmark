import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import type { TeamMember } from "@/types/team";

const safeJsonLd = (obj: unknown) =>
	JSON.stringify(obj)
		.replace(/</g, "\\u003c")
		.replace(/>/g, "\\u003e")
		.replace(/&/g, "\\u0026");

export const metadata: Metadata = {
	title: "À Propos - Notre Équipe Créative",
	description:
		"Découvrez l'équipe créative de Landmark à Oujda. Notre mission : transformer vos idées en marques mémorables grâce à la créativité et la performance. Rencontrez nos experts en marketing digital.",
	keywords: [
		"équipe landmark maroc",
		"agence créative oujda",
		"Haytham Guemmah",
		"experts marketing digital maroc",
		"à propos landmark agency",
		"fondateur landmark marketing",
		"agence branding oujda équipe",
	],
	alternates: { canonical: "/about" },
	openGraph: {
		url: "https://landmark.ma/about",
		title: "À Propos de Landmark - Notre Équipe Créative au Maroc",
		description:
			"Découvrez l'équipe créative de Landmark à Oujda. Experts en branding, marketing digital et création de contenu — rencontrez ceux qui transforment vos ambitions en réussites.",
		images: [
			{
				url: "/assets/Logotype/White.png",
				width: 1200,
				height: 630,
				alt: "Équipe Landmark Agency - Experts Marketing Digital Maroc",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "À Propos de Landmark Agency",
		description:
			"Découvrez l'équipe créative de Landmark - experts en branding et marketing digital au Maroc.",
		images: ["/assets/Logotype/White.png"],
	},
};

async function getTeamMembers(): Promise<TeamMember[]> {
	const apiUrl = (process.env.API_URL || "http://localhost:5000").replace(
		/\/$/,
		"",
	);
	try {
		const res = await fetch(`${apiUrl}/api/team`, {
			next: { revalidate: 3600 },
		});
		if (!res.ok) return [];
		return res.json();
	} catch {
		return [];
	}
}

export default async function AboutPage() {
	const teamMembers = await getTeamMembers();

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
			{ "@type": "ListItem", position: 2, name: "À Propos" },
		],
	};

	const aboutPageSchema = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: "À Propos de Landmark Agency",
		description:
			"Découvrez l'équipe créative de Landmark Agency, agence marketing digital basée à Oujda, Maroc.",
		url: "https://landmark.ma/about",
		inLanguage: "fr-MA",
		mainEntity: {
			"@type": "Organization",
			name: "Landmark Agency",
			url: "https://landmark.ma",
			founder: {
				"@type": "Person",
				name: "Haytham Guemmah",
				jobTitle: "Fondateur & PDG",
			},
			numberOfEmployees: {
				"@type": "QuantitativeValue",
				value: teamMembers.length > 0 ? teamMembers.length : 5,
			},
		},
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: safeJsonLd(aboutPageSchema) }}
			/>
			<AboutClient initialTeamMembers={teamMembers} />
		</>
	);
}
