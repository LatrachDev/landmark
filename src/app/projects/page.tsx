import type { Metadata } from "next";
import WebSiteBG from "@/assets/BG/maskBg.png";
import ProjectsInteractive from "@/components/projects/ProjectsInteractive";
import Services from "@/components/services/Services";
import Contact from "@/components/contact/Contact";
import type { Project } from "@/types/project";

export const metadata: Metadata = {
	title: "Portfolio - Projets Marketing Digital & Branding Maroc",
	description:
		"Découvrez notre portfolio de projets marketing digital et branding au Maroc. Réalisations créatives pour des marques ambitieuses à Oujda, Casablanca, Tanger : sites web, identités visuelles, contenus créatifs.",
	keywords: [
		"portfolio marketing digital maroc",
		"projets branding maroc",
		"réalisations créatives agence maroc",
		"projets agence web maroc",
		"projets Landmark",
		"créations visuelles maroc",
		"design graphique projets",
	],
	alternates: { canonical: "/projects" },
	openGraph: {
		url: "https://landmark.ma/projects",
		title: "Portfolio Landmark - Projets Marketing Digital & Branding Maroc",
		description:
			"Découvrez nos réalisations créatives pour des marques ambitieuses au Maroc : identités visuelles, sites web, contenus digitaux.",
		images: [
			{
				url: "/assets/Logotype/White.png",
				width: 1200,
				height: 630,
				alt: "Portfolio Landmark Agency - Projets Créatifs Maroc",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Portfolio Landmark - Projets Marketing Digital Maroc",
		description:
			"Réalisations créatives pour des marques ambitieuses au Maroc : identités visuelles, sites web, contenus digitaux.",
		images: ["/assets/Logotype/White.png"],
	},
};

interface Content {
	id: string | number;
	video: string;
	thumbnail: string;
	title: string;
	views: number | string;
}

async function getProjects(): Promise<Project[]> {
	const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
		/\/$/,
		"",
	);
	try {
		const res = await fetch(`${apiUrl}/api/projects`, {
			next: { revalidate: 3600 },
		});
		if (!res.ok) return [];
		return res.json();
	} catch {
		return [];
	}
}

async function getContents(): Promise<Content[]> {
	const baseUrl = (
		process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.Landmark.ma"
	).replace(/\/$/, "");
	try {
		const res = await fetch(`${baseUrl}/api/portfolio`, {
			next: { revalidate: 3600 },
		});
		if (!res.ok) return [];
		const data = await res.json();
		return data?.contents ?? [];
	} catch {
		return [];
	}
}

// Prevent </script> injection in JSON-LD
function safeJsonLd(data: object): string {
	return JSON.stringify(data)
		.replace(/</g, "\\u003c")
		.replace(/>/g, "\\u003e")
		.replace(/&/g, "\\u0026");
}

export default async function ProjectsPage() {
	const [projects, contents] = await Promise.all([
		getProjects(),
		getContents(),
	]);

	const portfolioSchema = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: "Portfolio Landmark Agency",
		description:
			"Portfolio de projets marketing digital et créatifs réalisés par Landmark Agency au Maroc",
		url: "https://landmark.ma/projects",
		numberOfItems: projects.length,
		itemListElement: projects.map((project, index) => ({
			"@type": "CreativeWork",
			position: index + 1,
			name: project.title,
			description: project.description,
			creator: {
				"@type": "Organization",
				name: "Landmark Agency",
				url: "https://landmark.ma",
			},
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
			{ "@type": "ListItem", position: 2, name: "Portfolio" },
		],
	};

	return (
		<div className="font-['Jost'] relative min-h-screen bg-white">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: safeJsonLd(portfolioSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
			/>

			<div
				className="absolute top-0 left-0 w-full bg-cover bg-no-repeat"
				style={{
					backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 70%, rgba(255,255,255,1) 95%), url(${WebSiteBG.src})`,
					backgroundPosition: "left 0px top -100px",
					height: "40%",
				}}
			></div>

			<section className="text-left py-16 px-4 sm:px-10 w-[90%] m-auto relative z-10">
				<h1 className="sm:mt-24 mt-5 text-[#010e26] text-xl sm:text-2xl md:text-4xl font-bold uppercase tracking-wide mb-4 md:mb-6">
					Découvrez ce qu'on a réalisé pour eux… et ce qu'on peut faire pour
					vous
				</h1>
				<p className="text-[#010e26] uppercase mb-10 md:mb-20 text-sm md:text-xl tracking-normal">
					Faites comme eux, choisissez l'excellence et rejoignez une communauté
					qui nous fait confiance pour transformer leurs ambitions en réussites.
				</p>

				<div className="py-16">
					<div className="container w-full m-auto">
						<div
							className="text-xl sm:text-2xl font-bold text-left text-[#263973] uppercase mb-6"
							style={{ fontFamily: "bodoni" }}
						>
							<h2>BRAND design</h2>
						</div>

						<ProjectsInteractive projects={projects} contents={contents} />
					</div>
				</div>

				<Services />
			</section>
			<Contact />
		</div>
	);
}
