"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import mainLogo from "@/assets/logotype/main.png";
import { JSX } from "react/jsx-runtime";

interface NavLink {
	name: string;
	path: string;
}

const NavOffre = memo(function NavOffre(): JSX.Element {
	const [menuOpen, setMenuOpen] = useState<boolean>(false);
	const pathname = usePathname();

	const navLinks = useMemo<NavLink[]>(
		() => [
			{ name: "ACCUEIL", path: "/" },
			{ name: "PROJETS", path: "/projects" },
			{ name: "SERVICES", path: "/services" },
			{ name: "À PROPOS DE NOUS", path: "/about" },
			{ name: "BLOG", path: "/blog" },
		],
		[],
	);

	const toggleMenu = useCallback((): void => {
		setMenuOpen((prev) => !prev);
	}, []);

	// Close menu on route change
	useEffect(() => {
		setMenuOpen(false);
	}, [pathname]);

	// Lock body scroll when menu is open
	useEffect(() => {
		document.body.style.overflow = menuOpen ? "hidden" : "unset";
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [menuOpen]);

	return (
		<>
			<nav className="w-full sticky top-0 z-50 bg-white transition-colors duration-300">
				<div className="w-[90%] m-auto">
					<div className="flex justify-between items-center">
						{/* Logo */}
						<Link
							href="/"
							className="flex items-center py-4 sm:px-6 z-60 relative"
						>
							<Image
								src={mainLogo}
								alt="Landmark"
								className="w-28 sm:w-40"
								priority
							/>
						</Link>

						{/* Desktop Nav */}
						<div className="hidden xl:flex items-center space-x-8 text-black">
							<div className="flex justify-between space-x-8">
								{navLinks.map((link) => (
									<Link
										key={link.path}
										href={link.path}
										className={`text-sm md:text-base relative group whitespace-nowrap ${
											pathname === link.path ? "font-semibold" : ""
										}`}
									>
										{link.name}
										<span
											className={`absolute bottom-0 left-0 ${
												pathname === link.path ? "w-full" : "w-0"
											} h-0.5 bg-[#445EF2] transition-all duration-300 group-hover:w-full`}
										/>
									</Link>
								))}
							</div>
						</div>

						{/* Mobile Button */}
						<button
							className="xl:hidden z-60 relative text-black focus:outline-none"
							onClick={toggleMenu}
						>
							<svg
								className={`w-6 h-6 transform transition-transform duration-300 ${menuOpen ? "rotate-90" : ""}`}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								{menuOpen ? (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								) : (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M4 6h16M4 12h16M4 18h16"
									/>
								)}
							</svg>
						</button>
					</div>
				</div>
			</nav>

			{/* Mobile Menu Overlay */}
			{menuOpen && (
				<div className="xl:hidden fixed inset-0 z-40 bg-white">
					<div className="flex flex-col justify-center items-center h-full px-8">
						<div className="flex flex-col mt-30 space-y-8 text-center">
							{navLinks.map((link) => (
								<Link
									key={link.path}
									href={link.path}
									className={`text-xl sm:text-2xl relative block group text-black ${
										pathname === link.path ? "font-semibold" : ""
									} hover:text-[#445EF2] transition-colors duration-300`}
									onClick={toggleMenu}
								>
									{link.name}
									<span
										className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 ${
											pathname === link.path ? "w-full" : "w-0"
										} h-0.5 bg-[#445EF2] transition-all duration-300 group-hover:w-full`}
									/>
								</Link>
							))}
						</div>
					</div>
				</div>
			)}
		</>
	);
});

export default NavOffre;
