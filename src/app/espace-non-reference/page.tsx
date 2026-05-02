import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Links - Landmark Agency",
	description: "Quick access to websites and resources",
	robots: "noindex, nofollow",
};

interface LinkItem {
	title: string;
	url: string;
	description: string;
}

export default function EspaceNonReference() {
	const links: LinkItem[] = [
		{
			title: "Hawkseo",
			url: "https://hawkseo.co/agence-seo-maroc",
			description: "SEO agency",
		},
		{ title: "L3ochaq", url: "https://l3ochaq.ma/", description: "Store" },
		{
			title: "Issam Portfolio",
			url: "https://mahtaj.vercel.app/",
			description: "Portfolio",
		},
		{
			title: "Adil Portfolio",
			url: "http://adilaitelhoucine.me/Port-Folio/",
			description: "Portfolio",
		},
	];

	return (
		<div className="font-[Jost] flex flex-col min-h-screen">
			<main className="flex-1 bg-gray-50 py-10 px-6">
				<div className="max-w-5xl mx-auto text-center">
					<h1 className="text-3xl font-bold text-gray-900 mb-6">Links</h1>
					<p className="text-gray-600 mb-10">
						Quick access to websites and resources
					</p>

					<div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
						{links.map((link, index) => (
							<a
								key={index}
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								className="block bg-white text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-600 shadow-md rounded-2xl p-6 hover:shadow-xl transition"
							>
								<h2 className="text-xl font-semibold mb-2">{link.title}</h2>
								<p className="text-sm">{link.description}</p>
							</a>
						))}
					</div>
				</div>
			</main>
		</div>
	);
}
