import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

const safeJsonLd = (obj: unknown) =>
	JSON.stringify(obj)
		.replace(/</g, "\\u003c")
		.replace(/>/g, "\\u003e")
		.replace(/&/g, "\\u0026");

export const metadata: Metadata = {
	title: "Contact - Devis Gratuit",
	description:
		"Contactez Landmark pour un devis gratuit. Discutons de vos projets marketing et obtenez une consultation personnalisée par notre équipe d'experts en marketing digital et branding au Maroc.",
	keywords: [
		"contact agence marketing maroc",
		"devis marketing digital gratuit",
		"branding maroc contact",
		"Landmark contact",
		"Haytham Guemmah contact",
		"agence créative oujda contact",
		"consultation marketing gratuite",
	],
	alternates: { canonical: "/contact" },
	openGraph: {
		url: "https://landmark.ma/contact",
		title: "Contact Landmark - Devis Gratuit Agence Marketing Maroc",
		description:
			"Contactez-nous pour un devis gratuit. Notre équipe vous accompagne dans vos projets marketing digital, branding et création de contenu au Maroc.",
		images: [
			{
				url: "/assets/Logotype/White.png",
				width: 1200,
				height: 630,
				alt: "Contactez Landmark Agency - Devis Gratuit",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Contact Landmark - Devis Gratuit Agence Marketing",
		description:
			"Contactez notre équipe pour un devis gratuit et une consultation personnalisée en marketing digital et branding.",
		images: ["/assets/Logotype/White.png"],
	},
};

export default function ContactPage() {
	const contactPageSchema = {
		"@context": "https://schema.org",
		"@type": "ContactPage",
		name: "Contactez Landmark Agency",
		description:
			"Page de contact de Landmark Agency - obtenez un devis gratuit pour vos projets marketing digital et branding au Maroc.",
		url: "https://landmark.ma/contact",
		inLanguage: "fr-MA",
		mainEntity: {
			"@type": "Organization",
			name: "Landmark Agency",
			telephone: "+212-710-220010",
			email: "contact.landmarkagency@gmail.com",
			contactPoint: {
				"@type": "ContactPoint",
				telephone: "+212-710-220010",
				contactType: "sales",
				availableLanguage: ["French", "Arabic", "English"],
			},
		},
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
			{ "@type": "ListItem", position: 2, name: "Contact" },
		],
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: safeJsonLd(contactPageSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
			/>
			<ContactPageClient />
		</>
	);
}
