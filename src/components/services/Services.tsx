"use client";

import { useEffect, useRef, useState, useMemo, memo } from "react";
import Image, { StaticImageData } from "next/image";

// Assets
import marketingIcon from "@/assets/Services/marketingIcon.svg";
import designIcon from "@/assets/Services/designIcon.svg";
import creationIcon from "@/assets/Services/creation.svg";
import seoIcon from "@/assets/Services/seo.svg";
import uxIcon from "@/assets/Services/ux.svg";
import photographyIcon from "@/assets/Services/photography.svg";

// 1. Define the TypeScript interface for your service data
interface ServiceItem {
	icon: StaticImageData | string | any; // Type allows for Next.js static imports
	alt: string;
	title: string;
	description: string;
}

const servicesData: ServiceItem[] = [
	{
		icon: marketingIcon,
		alt: "Marketing Icon",
		title: "ANALYSER LE MARCHÉ",
		description: "Une voie claire & ciblée pour lancer votre entreprise.",
	},
	{
		icon: designIcon,
		alt: "Branding Icon",
		title: "BRAND DESIGN",
		description: "Créez & lancez une marque qui se démarque sur le marché.",
	},
	{
		icon: creationIcon,
		alt: "Content Creation Icon",
		title: "CRÉATION DE CONTENU",
		description:
			"Grandissez & évoluez avec du contenu qui augmente les interactions.",
	},
	{
		icon: seoIcon,
		alt: "SEO Icon",
		title: "SEO & SEA",
		description: "Boostez & Optimiser le classement de votre Site Web",
	},
	{
		icon: uxIcon,
		alt: "UI UX Icon",
		title: "UI & UX DESIGN",
		description: "Créez & Développez une interface qui capte vos utilisateurs.",
	},
	{
		icon: photographyIcon,
		alt: "Photography Icon",
		title: "PHOTOGRAPHIE",
		description: "Capturez & présentez des visuels qui inspirent et engagent.",
	},
];

const Services = memo(() => {
	// 2. Add TypeScript types to your useState and useRef hooks
	const [visibleItems, setVisibleItems] = useState<number[]>([]);
	const itemsRef = useRef<(HTMLElement | null)[]>([]);

	// Memoize services data
	const memoizedServicesData = useMemo(() => servicesData, []);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries: IntersectionObserverEntry[]) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						// Ensure the attribute exists and parse it to a number safely
						const indexAttr = entry.target.getAttribute("data-index");
						if (indexAttr !== null) {
							const index = Number(indexAttr);
							setVisibleItems((prev) => [...new Set([...prev, index])]);
						}
						// Stop observing once it's visible so it doesn't animate out and in repeatedly
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.2, rootMargin: "50px" },
		);

		// Filter out nulls before observing
		itemsRef.current.forEach((el) => {
			if (el) observer.observe(el);
		});

		return () => observer.disconnect();
	}, []);

	return (
		<section id="services-section" className="py-16  text-center w-full m-auto">
			<h2
				className="text-xl sm:text-2xl font-bold text-left text-[#263973] uppercase mb-6"
				style={{ fontFamily: "bodoni" }}
			>
				SERVICES
			</h2>

			<h3 className="text-sm sm:text-xl font-jost font-bold text-left text-gray-900 uppercase mb-4">
				Des Solutions Complètes pour Booster Votre Marque et Votre Visibilité
			</h3>

			<p className="text-[#666666] font-jost text-sm sm:text-xl font-bold text-left w-10/12 mb-12">
				Que vous souhaitiez renforcer votre présence en ligne, bâtir une
				identité de marque forte ou captiver votre audience avec du contenu
				créatif, nous offrons des solutions complètes et adaptées.
			</p>

			<div className="grid grid-cols-1 font-jost sm:grid-cols-2 md:grid-cols-3 gap-x-20 gap-y-12 mx-auto">
				{memoizedServicesData.map(
					({ icon, alt, title, description }, index) => (
						<article
							key={index}
							// Properly type the ref assignment callback
							ref={(el: HTMLElement | null) => {
								itemsRef.current[index] = el;
							}}
							data-index={index}
							className={`flex flex-col items-center text-center transform transition-all duration-700 ${
								visibleItems.includes(index)
									? "opacity-100 translate-y-0"
									: "opacity-0 translate-y-10"
							}`}
						>
							{/* 3. Updated to handle Next.js static image object imports (.src) */}
							<img
								src={icon?.src || icon}
								alt={alt}
								className="h-14 mb-2"
								loading="lazy"
								width="56"
								height="56"
							/>
							<h4 className="text-lg font-bold text-gray-900 mb-1">{title}</h4>
							<p className="font-semibold text-sm w-52 text-gray-600">
								{description}
							</p>
						</article>
					),
				)}
			</div>
		</section>
	);
});

Services.displayName = "Services";

export default Services;
