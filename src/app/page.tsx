import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import bgImage from "@/assets/BG/Web-Site-BG-black.jpg";
import Mission from "@/components/home/Mission";
import Services from "@/components/services/Services";
import Projects from "@/components/projects/Projects";
import Content from "@/components/content/Content";
import Reviews from "@/components/reviews/Reviews";
import Contact from "@/components/contact/Contact";
import Blog from "@/components/blog/Blog";
import Faq from "@/components/faq/Faq";

const safeJsonLd = (obj: unknown) =>
	JSON.stringify(obj)
		.replace(/</g, "\\u003c")
		.replace(/>/g, "\\u003e")
		.replace(/&/g, "\\u0026");

export const metadata: Metadata = {
	alternates: { canonical: "/" },
	openGraph: {
		type: "website",
		url: "https://landmark.ma",
		title:
			"Landmark - Agence Marketing Digital au Maroc | Branding & Stratégie Créative",
		description:
			"Renforcez votre présence en ligne, créez une identité de marque forte et captivez votre audience avec Landmark - agence de marketing digital au Maroc spécialisée en branding, création de contenu et développement web.",
		images: [
			{
				url: "/assets/Logotype/White.png",
				width: 1200,
				height: 630,
				alt: "Landmark Agency - Agence Marketing Digital Maroc",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Landmark - Agence Marketing Digital au Maroc",
		description:
			"Agence créative spécialisée en branding, marketing digital et stratégie de contenu au Maroc.",
		images: ["/assets/Logotype/White.png"],
	},
};

export default function Home() {
	const websiteSchema = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "Landmark Agency",
		url: "https://landmark.ma",
		description:
			"Agence marketing digital au Maroc spécialisée en branding, création de contenu et développement web.",
		inLanguage: "fr-MA",
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate:
					"https://landmark.ma/blog?q={search_term_string}",
			},
			"query-input": "required name=search_term_string",
		},
	};

	const localBusinessSchema = {
		"@context": "https://schema.org",
		"@type": "LocalBusiness",
		"@id": "https://landmark.ma/#business",
		name: "Landmark Agency",
		alternateName: "Landmark Marketing Agency",
		description:
			"Agence marketing digital au Maroc spécialisée en branding, création de contenu, développement web et stratégie digitale.",
		url: "https://landmark.ma",
		logo: "https://landmark.ma/assets/Logotype/White.png",
		image: "https://landmark.ma/assets/Logotype/White.png",
		telephone: "+212-710-220010",
		email: "contact.landmarkagency@gmail.com",
		address: {
			"@type": "PostalAddress",
			addressLocality: "Oujda",
			addressRegion: "Oriental",
			postalCode: "60000",
			addressCountry: "MA",
		},
		geo: {
			"@type": "GeoCoordinates",
			latitude: 34.6814,
			longitude: -1.9086,
		},
		areaServed: [
			{ "@type": "City", name: "Oujda" },
			{ "@type": "City", name: "Casablanca" },
			{ "@type": "City", name: "Tanger" },
			{ "@type": "Country", name: "Maroc" },
		],
		priceRange: "$$",
		openingHoursSpecification: [
			{
				"@type": "OpeningHoursSpecification",
				dayOfWeek: [
					"Monday",
					"Tuesday",
					"Wednesday",
					"Thursday",
					"Friday",
				],
				opens: "09:00",
				closes: "18:00",
			},
		],
		sameAs: [
			"https://www.facebook.com/Landmarkagency",
			"https://www.instagram.com/Landmarkagency",
			"https://www.linkedin.com/company/Landmarkagency",
		],
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: "Services Marketing Digital",
			itemListElement: [
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "Branding",
						description: "Création d'identité de marque professionnelle",
					},
				},
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "Marketing Digital",
						description: "Stratégie et gestion des réseaux sociaux",
					},
				},
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "Développement Web",
						description: "Création de sites web et applications",
					},
				},
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "Création de Contenu",
						description: "Production photo, vidéo et contenu digital",
					},
				},
			],
		},
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: safeJsonLd(localBusinessSchema) }}
			/>
			<div
				style={{ backgroundImage: `url(${bgImage.src})` }}
				className="-mt-40 w-full bg-cover bg-center bg-no-repeat pb-20"
				role="img"
				aria-label="Arrière-plan de la section héro"
			>
				<Hero />
				<Mission className="mx-auto py-16 px-4 sm:px-10 w-[90%] m-auto text-white" />
			</div>
			<div className="mx-auto px-4 sm:px-10 w-[90%] m-auto">
				<Services />
			</div>
			<Projects />
			<Content />
			<Reviews />
			<Contact />
			<Blog />
			<Faq />
		</>
	);
}
