"use client";
import Link from "next/link";
import BlurText from "./BlurText";
import Counter from "./Counter";

const Hero = () => {
	return (
		<div className="px-4 sm:px-6 lg:px-10 mx-auto pt-48 sm:pt-64 w-[90%]">
			<div className="w-full">
				<div className="flex flex-col text-white">
					<h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-jost font-bold uppercase mb-3 sm:mb-4 lg:mb-6 leading-tight">
						<BlurText
							text="Grace à notre expertise, notre agence marketing"
							delay={100}
							animateBy="words"
							direction="top"
							className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-jost font-bold uppercase leading-tight"
						/>
						<span className="inline-block bg-linear-to-r from-[#263973] to-[#445EF2] px-1 sm:px-2 py-0.5 sm:py-1 mt-1 sm:mt-2">
							<BlurText
								text="est recommandée par 92% de nos clients"
								delay={100}
								animateBy="words"
								direction="top"
								className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-jost font-bold uppercase leading-tight"
							/>
						</span>
					</h1>
				</div>

				<p className="text-[#f2f2f2] font-jost font-light mb-6 sm:mb-8 lg:mb-10 text-xs sm:text-sm md:text-base lg:text-xl tracking-normal uppercase">
					Attirez plus de clients, boostez vos ventes et fidélisez vos clients.
				</p>

				<div className="flex flex-row justify-between items-start gap-2 sm:gap-4 lg:gap-8 mb-6 sm:mb-8 lg:mb-10 text-white sm:w-10/12 md:w-full lg:w-8/12">
					<div className="flex-1 text-center sm:text-left">
						<p
							className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
							style={{ fontFamily: "bodoni" }}
						>
							+<Counter target={750} duration={800} />
						</p>
						<p
							className="text-[7px] sm:text-xs md:text-sm lg:text-xl leading-tight"
							style={{ fontFamily: "DMSans" }}
						>
							Projets Réalisés
						</p>
					</div>

					<div className="bg-[#445EF2] w-0.5 sm:w-1 h-6 sm:h-8 lg:h-10 shrink-0"></div>

					<div className="flex-1 text-center sm:text-left">
						<p
							className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
							style={{ fontFamily: "bodoni" }}
						>
							+<Counter target={10} duration={800} />
						</p>
						<p
							className="text-[7px] sm:text-xs md:text-sm lg:text-xl leading-tight"
							style={{ fontFamily: "DMSans" }}
						>
							Clients Active
						</p>
					</div>

					<div className="bg-[#445EF2] w-0.5 sm:w-1 h-6 sm:h-8 lg:h-10 shrink-0"></div>

					<div className="flex-1 text-center sm:text-left">
						<p
							className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
							style={{ fontFamily: "bodoni" }}
						>
							<Counter target={92} duration={800} />%
						</p>
						<p
							className="text-[7px] sm:text-xs md:text-sm lg:text-xl leading-tight"
							style={{ fontFamily: "DMSans" }}
						>
							De Clients Satisfaits
						</p>
					</div>
				</div>

				<div className="flex flex-col font-jost sm:flex-row gap-3 sm:gap-4 lg:gap-8">
					<Link
						href="/contact"
						className="bg-[#445EF2] text-white px-3 py-2 sm:px-4 sm:py-2 md:px-10 lg:py-3 transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 text-sm text-center whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#445EF2] rounded"
						aria-label="Demander un devis gratuit"
					>
						DEMANDEZ VOTRE DEVIS
					</Link>
					<Link
						href="/projects"
						className="border border-white text-white px-3 py-2 sm:px-4 sm:py-2 md:px-10 lg:py-3 transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 text-sm text-center whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 rounded"
						aria-label="Voir tous nos projets"
					>
						VOIR LES PROJETS
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Hero;
