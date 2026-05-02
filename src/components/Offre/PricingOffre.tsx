"use client";

import { useCallback, useMemo, memo } from "react";
import { JSX } from "react/jsx-runtime";

interface Package {
	id: number;
	name: string;
	oldPrice: string;
	price: string;
	features: string[];
	isPopular?: boolean;
}

interface PackageInfo {
	name: string;
	price: string;
	serviceValue: string;
	displayText: string;
}

const PricingOffre = memo(function PricingOffre(): JSX.Element {
	const scrollToContact = useCallback((packageInfo: PackageInfo): void => {
		if (packageInfo) {
			sessionStorage.setItem("selectedPackage", JSON.stringify(packageInfo));
		}
		const contactElement = document.getElementById("contact-offre");
		if (contactElement) {
			contactElement.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	}, []);

	const packages = useMemo<Package[]>(
		() => [
			{
				id: 1,
				name: "1 VIDÉO",
				oldPrice: "1,100",
				price: "950",
				features: [
					"1 Model",
					"Scénario original",
					"Montage Vidéo avec des Effets Spéciaux",
					"1 Photo de produits",
					"Conception de l'image avec Photoshop",
				],
			},
			{
				id: 2,
				name: "4 VIDÉO",
				oldPrice: "3,000",
				price: "2,800",
				features: [
					"2 Models",
					"Scénario original",
					"Montage Vidéo avec des Effets Spéciaux",
					"3 Photos de produits",
					"Conception de l'image avec Photoshop.",
				],
				isPopular: true,
			},
			{
				id: 3,
				name: "6 VIDÉO",
				oldPrice: "4,000",
				price: "3,900",
				features: [
					"3 Model",
					"Scénario original",
					"Montage Vidéo avec des Effets Spéciaux",
					"6 Photo de produits",
					"Conception de l'image avec Photoshop",
				],
			},
		],
		[],
	);

	const priceBlockColors = useMemo<Record<string, string>>(
		() => ({
			"1 VIDÉO": "bg-[#05C7F2]",
			"4 VIDÉO": "bg-[#445EF2]",
			"6 VIDÉO": "bg-[#263973]",
		}),
		[],
	);

	return (
		<div className="w-full py-4 sm:py-6 md:py-8 lg:py-10 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 relative">
			<div className="container mx-auto max-w-7xl">
				<h2
					className="text-2xl sm:text-3xl text-center md:text-4xl lg:text-5xl font-bold text-white mb-8 sm:mb-12 md:mb-16"
					style={{ fontFamily: "var(--font-jenine)" }}
				>
					اختار الباقة اللي كتناسبك
				</h2>

				<div className="grid grid-cols-1 mt-10 md:mt-26 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 items-stretch">
					{packages.map((pkg) => {
						const isPopular = pkg.isPopular ?? false;
						const priceColor = priceBlockColors[pkg.name] || "bg-cyan-400";

						return (
							<div
								key={pkg.id}
								className={`relative my-5 h-full flex flex-col bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl transition-all duration-300 hover:shadow-2xl ${
									isPopular
										? "overflow-visible lg:-mt-10 lg:-mb-10 lg:scale-105"
										: "overflow-hidden"
								}`}
							>
								{/* Popular Badge */}
								{isPopular && (
									<div
										className="absolute top-0 right-0 z-30"
										style={{
											transform:
												"rotate(12deg) translateX(0.5rem) translateY(-0.5rem)",
										}}
									>
										<div
											className="absolute bg-blue-700 text-white px-2 py-0.5 sm:px-3 sm:py-1 md:px-4 text-xs sm:text-sm font-bold whitespace-nowrap"
											style={{
												fontFamily: "var(--font-madani-bold)",
												transform: "translate(2px, 2px)",
												zIndex: 1,
											}}
										>
											الأكثر طلبا
										</div>
										<div
											className="relative bg-blue-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 md:px-4 text-xs sm:text-sm font-bold whitespace-nowrap"
											style={{
												fontFamily: "var(--font-madani-bold)",
												zIndex: 2,
											}}
										>
											الأكثر طلبا
										</div>
									</div>
								)}

								{/* Header */}
								<div className="bg-[#7585A0] px-3 sm:px-4 md:px-6 rounded-t-lg sm:rounded-t-xl py-2 sm:py-2.5 md:py-2">
									<h3
										className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-white text-center uppercase"
										style={{ fontFamily: "Jost" }}
									>
										{pkg.name}
									</h3>
								</div>

								{/* Price Section */}
								<div
									className={`${priceColor} px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 ${isPopular ? "lg:py-8" : "lg:py-6"}`}
								>
									<div className="flex flex-col">
										{pkg.oldPrice && (
											<p
												className="text-yellow-300 text-right font-semibold text-2xl md:text-3xl line-through mb-0.5 sm:mb-1"
												style={{ fontFamily: "Jost" }}
											>
												{pkg.oldPrice} DH
											</p>
										)}
										<p
											className="text-white text-center text-5xl md:text-6xl font-bold"
											style={{ fontFamily: "Bodoni" }}
										>
											{pkg.price} DH
										</p>
									</div>
								</div>

								{/* Features List */}
								<div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 lg:py-6 bg-white grow">
									<ul className="space-y-2 sm:space-y-3 md:space-y-4">
										{pkg.features.map((feature, index) => (
											<li
												key={index}
												className="flex items-start gap-2 sm:gap-3"
											>
												<div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
													<svg
														className="w-4 h-4 sm:w-5 sm:h-5 text-white"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={3}
															d="M5 13l4 4L19 7"
														/>
													</svg>
												</div>
												<span
													className="text-gray-800 text-xs sm:text-sm md:text-base leading-relaxed"
													style={{ fontFamily: "Jost" }}
												>
													{feature}
												</span>
											</li>
										))}
									</ul>
								</div>

								{/* CTA Button */}
								<div
									className={`px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-5 ${isPopular ? "lg:pb-10" : "lg:pb-6"}`}
								>
									<button
										onClick={() => {
											const priceWithoutComma = pkg.price.replace(/,/g, "");
											const videoCount =
												pkg.name === "1 VIDÉO"
													? "1"
													: pkg.name === "4 VIDÉO"
														? "4"
														: "6";
											const serviceValue = `${videoCount} video${videoCount === "1" ? "" : "s"} ${priceWithoutComma}dh`;
											scrollToContact({
												name: pkg.name,
												price: pkg.price,
												serviceValue,
												displayText: serviceValue,
											});
										}}
										className="block w-full cursor-pointer bg-cyan-400 hover:bg-cyan-500 text-white text-center py-2.5 sm:py-3 md:py-3.5 lg:py-4 rounded transition-colors duration-300 font-semibold text-xl md:text-2xl"
										style={{ fontFamily: "var(--font-madani-bold)" }}
									>
										تواصل معانا
									</button>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
});

export default PricingOffre;
