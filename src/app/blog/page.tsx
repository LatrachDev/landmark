import { Metadata } from "next";
import WebSiteBG from "@/assets/BG/maskBg.png";
import BlogSwiper from "@/components/blog/BlogSwiper";
import type { Blog, BlogCategory } from "@/types/blog";
import { CATEGORY_LABELS } from "@/types/blog";

const safeJsonLd = (obj: unknown) =>
	JSON.stringify(obj)
		.replace(/</g, "\\u003c")
		.replace(/>/g, "\\u003e")
		.replace(/&/g, "\\u0026");

export const metadata: Metadata = {
	title: "Blog Landmark - Conseils Marketing Digital & Branding Maroc",
	description:
		"Apprendre les meilleures stratégies marketing avec Landmark : conseils, astuces et tendances du marketing digital au Maroc. Découvrez nos articles sur le SEO, brand design et stratégies de communication.",
	keywords: [
		"blog marketing digital maroc",
		"conseils branding maroc",
		"actualités marketing digital",
		"tendances digitales maroc",
		"stratégie contenu maroc",
		"blog agence créative",
		"Landmark blog",
	],
	alternates: { canonical: "/blog" },
	openGraph: {
		url: "https://landmark.ma/blog",
		title: "Blog Landmark - Conseils Marketing Digital & Branding Maroc",
		description:
			"Apprendre les meilleures stratégies marketing avec Landmark : conseils, astuces et tendances du marketing digital au Maroc.",
		images: [
			{
				url: "/assets/Logotype/White.png",
				width: 1200,
				height: 630,
				alt: "Blog Landmark Agency - Marketing Digital Maroc",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Blog Landmark - Conseils Marketing Digital & Branding Maroc",
		description:
			"Conseils, astuces et tendances du marketing digital au Maroc. Articles sur le SEO, brand design et stratégies de communication.",
		images: ["/assets/Logotype/White.png"],
	},
};

const NEXT_PUBLIC_API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
	/\/$/,
	"",
);

async function getBlogs(): Promise<Blog[]> {
	try {
		const res = await fetch(`${NEXT_PUBLIC_API_URL}/api/blogs`, {
			next: { revalidate: 3600 },
		});
		if (!res.ok) return [];
		return res.json();
	} catch {
		return [];
	}
}

export default async function BlogPage() {
	const blogs = await getBlogs();

	const grouped = new Map<BlogCategory, Blog[]>();
	for (const blog of blogs) {
		const cat = blog.category as BlogCategory;
		if (!grouped.has(cat)) grouped.set(cat, []);
		grouped.get(cat)!.push(blog);
	}

	const blogListSchema = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: "Blog Landmark Agency",
		description: "Articles et conseils marketing digital par Landmark Agency",
		url: "https://landmark.ma/blog",
		mainEntity: {
			"@type": "ItemList",
			numberOfItems: blogs.length,
			itemListElement: blogs.map((post, index) => ({
				"@type": "ListItem",
				position: index + 1,
				url: `https://landmark.ma/blog/${post.id}`,
				name: post.title,
			})),
		},
	};

	return (
		<div className="font-jost relative min-h-screen w-full overflow-x-hidden bg-white">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: safeJsonLd(blogListSchema) }}
			/>

			{/* Background */}
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
					Besoin d'inspiration ?
				</h1>
				<p className="text-[#010e26] uppercase mb-10 md:mb-20 text-sm md:text-xl tracking-normal">
					Découvrez tous nos contenus en un seul endroit.
				</p>

				<div className="pb-8 md:pb-16">
					<div className="space-y-16 md:space-y-24">
						<div>
							<h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#263973] uppercase text-left mb-8 tracking-widest relative inline-block font-bodoni">
								Nos Articles
								<span className="absolute -bottom-2 left-0 w-10 h-1 bg-[#445EF2]"></span>
							</h2>
						</div>

						{grouped.size > 0 ? (
							Array.from(grouped.entries()).map(([category, posts]) => (
								<div key={category} className="space-y-8 md:space-y-10">
									<div className="flex items-center gap-6">
										<h2 className="text-xl sm:text-2xl md:text-3xl text-[#010E26] uppercase text-left font-bold tracking-tight leading-tight font-bodoni">
											{CATEGORY_LABELS[category]}
										</h2>
										<div className="h-px bg-linear-to-r from-gray-300 to-transparent grow"></div>
									</div>
									<BlogSwiper posts={posts} />
								</div>
							))
						) : (
							<div className="text-center py-12 bg-white/50 backdrop-blur-md rounded-3xl border border-dashed border-gray-300">
								<p className="text-gray-500 font-medium">
									Aucun article disponible pour le moment.
								</p>
							</div>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
