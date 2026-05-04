"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import mainLogo from "@/assets/logotype/main.png";
import { GA_MEASUREMENT_ID } from "@/lib/gtag";
import { api } from "@/services/api";

const ADMIN_TEAM = "/admin/team";
const ADMIN_PROJECTS = "/admin/projects";
const ADMIN_BLOG = "/admin/blog";
const ADMIN_CONTENT = "/admin/content";
const ADMIN_SERVICES = "/admin/services";
const ADMIN_ANALYTICS = "/admin/analytics";

const GA_BASE = "https://analytics.google.com/analytics/web/";
const LOOKER_STUDIO_URL = "https://datastudio.google.com/embed/reporting/3427369e-0138-40ef-97c2-7d34ead0d563/page/DFAxF";

const reports = [
	{
		label: "Vue d'ensemble",
		desc: "Trafic total, sessions et utilisateurs actifs",
		icon: (
			<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
			</svg>
		),
		href: GA_BASE,
		color: "bg-blue-50 text-blue-600 border-blue-100",
	},
	{
		label: "Temps réel",
		desc: "Utilisateurs actifs sur le site en ce moment",
		icon: (
			<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
			</svg>
		),
		href: GA_BASE,
		color: "bg-emerald-50 text-emerald-600 border-emerald-100",
		badge: "LIVE",
	},
	{
		label: "Audience",
		desc: "Démographie, localisation et appareils",
		icon: (
			<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
			</svg>
		),
		href: GA_BASE,
		color: "bg-violet-50 text-violet-600 border-violet-100",
	},
	{
		label: "Acquisition",
		desc: "Sources de trafic : organique, direct, social",
		icon: (
			<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
			</svg>
		),
		href: GA_BASE,
		color: "bg-amber-50 text-amber-600 border-amber-100",
	},
	{
		label: "Engagement",
		desc: "Pages vues, événements et conversions",
		icon: (
			<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
			</svg>
		),
		href: GA_BASE,
		color: "bg-rose-50 text-rose-600 border-rose-100",
	},
	{
		label: "Pages les plus vues",
		desc: "Contenu le plus populaire du site",
		icon: (
			<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
			</svg>
		),
		href: GA_BASE,
		color: "bg-indigo-50 text-indigo-600 border-indigo-100",
	},
];

const adminCards = [
	{ title: "Équipe", icon: "👥", path: ADMIN_TEAM },
	{ title: "Projets", icon: "📁", path: ADMIN_PROJECTS },
	{ title: "Contenu", icon: "✍️", path: ADMIN_CONTENT },
	{ title: "Blog", icon: "🖼️", path: ADMIN_BLOG },
	{ title: "Services", icon: "🛠️", path: ADMIN_SERVICES },
	{ title: "Analytics", icon: "📊", path: ADMIN_ANALYTICS, active: true },
];

export default function AnalyticsPage() {
	const router = useRouter();

	useEffect(() => {
		document.title = "Analytics | Landmark Administration";
		api.me().catch(() => router.push("/landmark-login"));
	}, [router]);

	const handleLogout = async () => {
		await api.logout().catch(() => null);
		router.push("/");
	};


	return (
		<div className="font-jost bg-[#fcfdfe] min-h-screen pb-20 overflow-x-hidden">
			{/* Navigation Bar */}
			<nav className="bg-white border-b border-gray-100 sticky top-0 z-30 h-24 flex items-center">
				<div className="max-w-7xl mx-auto px-6 lg:px-10 w-full flex justify-between items-center">
					<Link href="/admin">
						<Image src={mainLogo} alt="Landmark" className="h-10 md:h-12 w-auto object-contain" priority />
					</Link>
					<button
						onClick={handleLogout}
						className="bg-[#010E26] text-white px-6 py-3 rounded-2xl hover:bg-[#445EF2] transition-all font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#010E26]/10 active:scale-95"
					>
						Déconnexion
					</button>
				</div>
			</nav>

			<div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
				{/* Mini Navigation */}
				<div className="flex flex-wrap gap-3 mb-12">
					{adminCards.map((card, idx) => (
						<button
							key={idx}
							onClick={() => router.push(card.path)}
							className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${card.active ? "bg-[#010E26] text-white shadow-xl shadow-[#010E26]/20" : "bg-white text-gray-400 border border-gray-100 hover:border-[#445EF2] hover:text-[#445EF2]"}`}
						>
							<span className="mr-2">{card.icon}</span>{card.title}
						</button>
					))}
				</div>

				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
					<div>
						<h1 className="text-4xl md:text-5xl font-black text-[#010E26] uppercase font-bodoni mb-2">
							Analytics
						</h1>
						<p className="text-gray-500 font-medium">
							Suivez les performances de <span className="font-bold text-[#010E26]">landmark.ma</span> en temps réel.
						</p>
					</div>
					<a
						href={GA_BASE}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-3 bg-[#445EF2] text-white px-8 py-4 rounded-2xl hover:bg-[#010E26] transition-all font-black uppercase tracking-widest text-xs shadow-xl shadow-[#445EF2]/20 active:scale-95"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
						</svg>
						Ouvrir Google Analytics
					</a>
				</div>

				{/* Property Info Card */}
				<div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-8 mb-10 flex flex-col sm:flex-row sm:items-center gap-6">
					<div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0">
						<svg className="w-7 h-7 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
							<path d="M22.84 2.998C21.656 1.613 19.77 1 17.4 1c-3.088 0-5.373 1.61-6.6 4.54C9.59 2.632 7.5 1 4.8 1 2.14 1 0 3.14 0 5.8c0 1.47.618 2.762 1.625 3.726L10.8 21.89 12 23l1.2-1.11 9.175-12.364C23.382 8.562 24 7.27 24 5.8c0-1.12-.39-2.084-1.16-2.802z"/>
						</svg>
					</div>
					<div className="grow">
						<p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Propriété Google Analytics 4</p>
						<p className="text-2xl font-black text-[#010E26] font-mono">{GA_MEASUREMENT_ID}</p>
						<p className="text-sm text-gray-400 font-medium mt-1">landmark.ma — Toutes les pages sont trackées</p>
					</div>
					<div className="flex items-center gap-2">
						<span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
						<span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Actif</span>
					</div>
				</div>

				{/* Quick Report Links */}
				<h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-5">
					Rapports rapides
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
					{reports.map((report, idx) => (
						<a
							key={idx}
							href={report.href}
							target="_blank"
							rel="noopener noreferrer"
							className="group bg-white rounded-[1.75rem] border border-gray-100 shadow-[0_8px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all p-6 flex items-start gap-4 hover:-translate-y-1"
						>
							<div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${report.color}`}>
								{report.icon}
							</div>
							<div className="grow min-w-0">
								<div className="flex items-center gap-2 mb-1">
									<span className="text-sm font-black text-[#010E26] uppercase tracking-tight">
										{report.label}
									</span>
									{report.badge && (
										<span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-600 uppercase tracking-wider animate-pulse">
											{report.badge}
										</span>
									)}
								</div>
								<p className="text-xs text-gray-400 font-medium leading-snug">{report.desc}</p>
							</div>
							<svg className="w-4 h-4 text-gray-300 group-hover:text-[#445EF2] transition-colors flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
							</svg>
						</a>
					))}
				</div>

				{/* Embedded Looker Studio Report */}
				<div className="bg-white rounded-4xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] overflow-hidden">
					<div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between">
						<div>
							<h2 className="text-sm font-black text-[#010E26] uppercase tracking-tight">Rapport Looker Studio</h2>
							<p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">Rapport intégré en direct</p>
						</div>
						<a
							href={LOOKER_STUDIO_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="text-[10px] font-black uppercase tracking-widest text-[#445EF2] hover:text-[#010E26] transition-colors flex items-center gap-1.5"
						>
							Ouvrir en plein écran
							<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
							</svg>
						</a>
					</div>
					<iframe
						src={LOOKER_STUDIO_URL}
						className="w-full"
						style={{ height: "600px", border: "none" }}
						allowFullScreen
						sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
						title="Rapport Google Analytics - Landmark Agency"
					/>
				</div>
			</div>
		</div>
	);
}
