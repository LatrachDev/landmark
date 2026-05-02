"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
	FacebookFilled,
	BehanceOutlined,
	LinkedinFilled,
	InstagramOutlined,
} from "@ant-design/icons";

import whiteLogo from "@/assets/logotype/white.png";
import bgImage from "@/assets/BG/Web-Site-BG-black.jpg";

const Footer = memo(() => {
	return (
		<footer
			style={{ backgroundImage: `url(${bgImage.src})` }}
			className="bg-cover bg-center w-full text-white font-['Jost'] pt-12 md:pt-20 pb-6 md:pb-10 px-4 sm:px-10 z-30"
		>
			<div className="mx-auto flex flex-col w-[90%]">
				{/* Logo */}
				<div className="relative w-48 md:w-64 h-24 mb-12 md:mb-20">
					<Image
						src={whiteLogo}
						alt="Landmark - Agence Marketing Digital"
						fill
						className="object-contain"
						priority={false}
					/>
				</div>

				<div className="flex flex-col lg:flex-row gap-8 md:gap-12">
					{/* Left Section */}
					<div className="lg:w-7/12">
						<h2 className="text-xl sm:text-2xl md:text-4xl font-bold uppercase mb-4 md:mb-6 tracking-wide text-left">
							Prêt à commencer ?
						</h2>
						<p className="text-sm md:text-lg text-left lg:text-justify w-full lg:w-10/12 mb-6 md:mb-8 tracking-wider uppercase font-light">
							Grâce à une enquête de satisfaction client, 92 % de nos clients
							expriment une grande satisfaction et recommandent en toute
							confiance nos services à d’autres.
						</p>
						<div className="text-left">
							<Link
								href="/contact"
								className="inline-block border border-white text-white px-8 py-3 md:px-10 md:py-4 uppercase font-normal text-sm tracking-wider hover:bg-white hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded"
								aria-label="Contactez-nous pour discuter de votre projet"
							>
								Contactez-nous
							</Link>
						</div>
					</div>

					{/* Right Section */}
					<div className="lg:w-5/12 flex flex-col md:flex-row lg:flex-col gap-8 md:gap-12">
						{/* Social Media */}
						<div className="w-full md:w-1/2 lg:w-full">
							<p
								className="uppercase font-bold mb-3 text-sm tracking-wider text-left"
								style={{ fontFamily: "bodoni" }}
							>
								suivez-nous pour du contenu quotidien
							</p>
							<div className="flex md:justify-start space-x-6 text-xl mt-6 md:mt-10">
								<a
									href="https://www.facebook.com/Landmarkagency.official"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Facebook"
								>
									<FacebookFilled className="hover:opacity-70 transition-opacity cursor-pointer" />
								</a>
								<a
									href="https://www.instagram.com/Landmark_agency/"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Instagram"
								>
									<InstagramOutlined className="hover:opacity-70 transition-opacity cursor-pointer" />
								</a>
								<a
									href="https://www.linkedin.com/company/Landmarkagency"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="LinkedIn"
								>
									<LinkedinFilled className="hover:opacity-70 transition-opacity cursor-pointer" />
								</a>
								<a
									href="https://www.behance.net/Landmarkagency"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Behance"
								>
									<BehanceOutlined className="hover:opacity-70 transition-opacity cursor-pointer" />
								</a>
							</div>
						</div>

						{/* Navigation */}
						<div className="w-full md:w-1/2 lg:w-full">
							<p
								className="uppercase mb-3 font-bold text-sm tracking-wider text-left"
								style={{ fontFamily: "bodoni" }}
							>
								NAVIGATION
							</p>
							<nav aria-label="Navigation du pied de page">
								<ul className="space-y-2 mt-6 md:mt-10 text-left">
									<li>
										<Link
											href="/projects"
											className="font-semibold text-sm border-b-2 border-transparent hover:opacity-70 hover:border-[#445ef2] transition-opacity block w-fit focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded"
										>
											PROJET
										</Link>
									</li>
									<li>
										<Link
											href="/services"
											className="font-semibold text-sm border-b-2 border-transparent hover:opacity-70 hover:border-[#445ef2] transition-opacity block w-fit focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded"
										>
											SERVICES
										</Link>
									</li>
									<li>
										<Link
											href="/about"
											className="font-semibold text-sm border-b-2 border-transparent hover:opacity-70 hover:border-[#445ef2] transition-opacity block w-fit uppercase focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded"
										>
											à propos de nous
										</Link>
									</li>
									<li>
										<Link
											href="/contact"
											className="font-semibold text-sm border-b-2 border-transparent hover:opacity-70 hover:border-[#445ef2] transition-opacity block w-fit uppercase focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded"
										>
											Contactez-nous
										</Link>
									</li>
									<li>
										<Link
											href="/blog"
											className="font-semibold text-sm border-b-2 border-transparent hover:opacity-70 hover:border-[#445ef2] transition-opacity block w-fit focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded"
										>
											BLOG
										</Link>
									</li>
								</ul>
							</nav>
						</div>
					</div>
				</div>

				{/* Copyright */}
				<div className="mt-8 md:mt-12 text-sm md:text-base lg:text-xl">
					Copyright &copy; 2025 - {new Date().getFullYear()} tous droits
					réservés
				</div>
			</div>
		</footer>
	);
});

Footer.displayName = "Footer";

export default Footer;
