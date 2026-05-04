import type { Metadata } from "next";
import WebSiteBG from "@/assets/BG/maskBg.png";
import ServiceCard from "@/components/services/ServiceCard";
import Reviews from "@/components/reviews/Reviews";
import Contact from "@/components/contact/Contact";
import type { Service, ServiceCategory } from "@/types/service";
import { CATEGORY_LABELS } from "@/types/service";

export const metadata: Metadata = {
	title: "Services Marketing Digital Maroc | Landmark Agency - Branding & Web",
	description:
		"Découvrez nos services marketing digital au Maroc : branding, développement web, création de contenu, photographie, design graphique. Solutions créatives sur mesure pour votre marque.",
	keywords: [
		"services marketing digital maroc",
		"branding professionnel maroc",
		"développement web maroc",
		"création contenu digital",
		"photographie commerciale maroc",
		"design graphique",
		"stratégie digitale",
	],
	alternates: { canonical: "/services" },
	openGraph: {
		url: "https://landmark.ma/services",
		title: "Services Marketing Digital Maroc | Landmark Agency",
		description:
			"Découvrez nos services marketing digital au Maroc : branding, développement web, création de contenu, photographie, design graphique.",
		images: [
			{
				url: "/assets/Logotype/White.png",
				width: 1200,
				height: 630,
				alt: "Services Landmark Agency - Marketing Digital Maroc",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Services Marketing Digital Maroc | Landmark Agency",
		description:
			"Branding, développement web, création de contenu, photographie et design graphique. Solutions créatives sur mesure au Maroc.",
		images: ["/assets/Logotype/White.png"],
	},
};

async function getServices(): Promise<Service[]> {
	const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
		/\/$/,
		"",
	);
	try {
		const res = await fetch(`${apiUrl}/api/services`, {
			next: { revalidate: 3600 },
		});
		if (!res.ok) return [];
		return res.json();
	} catch {
		return [];
	}
}

function safeJsonLd(data: object): string {
	return JSON.stringify(data)
		.replace(/</g, "\\u003c")
		.replace(/>/g, "\\u003e")
		.replace(/&/g, "\\u0026");
}

export default async function ServicesPage() {
	const services: Service[] = await getServices();

	const grouped: Record<ServiceCategory, Service[]> = { A: [], B: [], C: [] };
	for (const s of services) {
		if (s.category in grouped) grouped[s.category].push(s);
	}

	const servicesStructuredData = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: "Services Landmark Agency",
		description:
			"Services marketing digital et créatifs proposés par Landmark Agency au Maroc",
		numberOfItems: services.length,
		itemListElement: services.map((s, index) => ({
			"@type": "Service",
			position: index + 1,
			name: s.title,
			description: s.description,
			provider: {
				"@type": "Organization",
				name: "Landmark Agency",
				url: "https://landmark.ma",
			},
			areaServed: "Morocco",
			url: `https://landmark.ma/services/${s.id}`,
		})),
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
			{ "@type": "ListItem", position: 2, name: "Services" },
		],
	};

	return (
		<section className="font-['Jost'] relative min-h-screen">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: safeJsonLd(servicesStructuredData) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
			/>

			<div
				className="absolute top-0 left-0 w-full bg-cover bg-no-repeat z-0"
				style={{
					backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 70%, rgba(255,255,255,1) 95%), url(${WebSiteBG.src})`,
					backgroundPosition: "left 0px top -100px",
					height: "40%",
				}}
			/>

			<section className="text-left py-16 px-4 sm:px-10 w-[90%] m-auto relative z-10">
				<h1 className="sm:mt-24 mt-5 text-[#010e26] text-xl sm:text-2xl md:text-4xl font-bold uppercase tracking-wide mb-4 md:mb-6">
					DES SOLUTIONS COMPLÈTES POUR BOOSTER VOTRE MARQUE ET VOTRE VISIBILITÉ
				</h1>
				<p className="text-[#010e26] uppercase mb-10 md:mb-20 text-sm md:text-xl tracking-normal">
					Que vous souhaitiez renforcer votre présence en ligne, bâtir une
					identité de marque forte ou captiver votre audience avec du contenu
					créatif, nous offrons des solutions complètes et adaptées.
				</p>

				<div className="mb-20">
					<h2
						className="text-xl sm:text-2xl md:text-3xl font-bold text-left text-[#263973] uppercase mb-8 tracking-[0.2em]"
						style={{ fontFamily: "bodoni" }}
					>
						SERVICES
					</h2>

					{(["A", "B", "C"] as ServiceCategory[]).map(
						(cat) =>
							grouped[cat].length > 0 && (
								<div key={cat} className="mb-28">
									<h3 className="font-bold text-[#01143a] uppercase text-left text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-12 tracking-tight leading-[1.1]">
										{CATEGORY_LABELS[cat]}
									</h3>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
										{grouped[cat].map((s) => (
											<ServiceCard
												key={s.id}
												id={s.id}
												title={s.title}
												description={s.description}
												imageUrl={s.imageUrl}
											/>
										))}
									</div>
								</div>
							),
					)}
				</div>
			</section>

			<Reviews />
			<Contact />
		</section>
	);
}
