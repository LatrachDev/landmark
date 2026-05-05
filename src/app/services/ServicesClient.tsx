"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Reviews from "@/components/reviews/Reviews";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/footer/Footer";
import WebSiteBG from "@/assets/BG/maskBg.png";

const baseURL = "https://api.landmark.ma/storage/";

interface Service {
	id: string | number;
	title: string;
	description: string;
	image: string;
	category: string;
}

interface ServicesClientProps {
	initialServices: Service[];
}

export default function ServicesClient({
	initialServices,
}: ServicesClientProps) {
	const [services] = useState<Service[]>(initialServices);
	const router = useRouter();

	const groupedServices = {
		A: services.filter((service) => service.category === "A"),
		B: services.filter((service) => service.category === "B"),
		C: services.filter((service) => service.category === "C"),
	};

	const categoryTitles: { [key: string]: string } = {
		A: "A.nalyser le marché",
		B: "b.rand design",
		C: "c.réation de contenu",
	};

	const projectsStructuredData = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: "Services Landmark Agency",
		description:
			"Services marketing digital et créatifs proposés par Landmark Agency au Maroc",
		numberOfItems: services.length,
		itemListElement: services.map((service, index) => ({
			"@type": "Service",
			position: index + 1,
			name: service.title,
			description: service.description,
			provider: {
				"@type": "Organization",
				name: "Landmark Agency",
				url: "https://Landmark.ma",
			},
			areaServed: "Morocco",
			url: `https://Landmark.ma/services/${service.id}`,
		})),
	};

	return (
		<section className="font-['Jost'] relative min-h-screen">
			{/* Structured Data Script */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(projectsStructuredData),
				}}
			/>

			{/* Background style */}
			<div
				className="absolute top-0 left-0 w-full bg-cover bg-no-repeat z-0"
				style={{
					backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 70%, rgba(255,255,255,1) 95%), url(${WebSiteBG.src})`,
					backgroundPosition: "left 0px top -100px",
					height: "40%",
				}}
			></div>

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

					{["A", "B", "C"].map((category, idx) => (
						<div key={idx} className="mb-28">
							<h3 className="font-bold text-[#01143a] uppercase text-left text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-12 tracking-tight leading-[1.1]">
								{categoryTitles[category]}
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
								{groupedServices[category as keyof typeof groupedServices].map(
									(service, i) => (
										<div
											key={i}
											onClick={() => router.push(`/services/${service.id}`)}
											className="flex flex-col bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-500 cursor-pointer overflow-hidden border border-gray-50/50 group h-full"
										>
											<div className="aspect-[1.6/1] overflow-hidden">
												<img
													src={baseURL + service.image}
													alt={service.title}
													className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
													loading="lazy"
												/>
											</div>
											<div className="p-8 pb-10 flex flex-col flex-1">
												<h4 className="text-[#010E26] font-bold uppercase text-lg sm:text-xl leading-tight mb-4 group-hover:text-[#445EF2] transition-colors duration-300">
													{service.title}
												</h4>
												<p className="text-[#64748b] text-sm sm:text-base font-normal leading-relaxed line-clamp-3">
													{service.description}
												</p>
											</div>
										</div>
									),
								)}
							</div>
						</div>
					))}
				</div>
			</section>

			<Reviews />
			<Contact />
		</section>
	);
}
