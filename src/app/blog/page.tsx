import { Metadata } from 'next';
import WebSiteBG from '@/assets/BG/maskBg.png';
import BlogSwiper from '@/components/blog/BlogSwiper';

export const metadata: Metadata = {
    title: "Blog Landmark - Conseils Marketing Digital & Branding Maroc",
    description: "Apprendre les meilleures stratégies marketing avec Landmark : conseils, astuces et tendances du marketing digital au Maroc. Découvrez nos articles sur le SEO, brand design et stratégies de communication.",
    keywords: "blog marketing digital maroc, conseils branding maroc, actualités marketing, tendances digitales maroc, stratégie contenu maroc, blog agence créative, Landmark blog",
    alternates: {
        canonical: "/blog",
    },
    openGraph: {
        url: "https://landmark.ma/blog",
        title: "Blog Landmark - Conseils Marketing Digital & Branding Maroc",
        description: "Apprendre les meilleures stratégies marketing avec Landmark : conseils, astuces et tendances du marketing digital au Maroc.",
    }
};

interface Blog {
    id: string | number;
    title: string;
    description: string;
    image: string;
    category: string;
    created_at: string;
}

interface BlogCategory {
    category: string;
    posts: Blog[];
}

async function getBlogData(): Promise<BlogCategory[]> {
    try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.landmark.ma/';
        const res = await fetch(`${apiBaseUrl}api/blog`, {
            headers: {
                'Accept': 'application/json'
            },
            next: { revalidate: 3600 } // Revalidate every hour
        });

        if (!res.ok) {
            throw new Error('Failed to fetch blog data');
        }

        const data = await res.json();

        if (data.blogs) {
            // Group blogs by category
            const groupedBlogs = data.blogs.reduce((acc: any, blog: any) => {
                const category = blog.category;
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push({
                    ...blog,
                    image: `https://api.Landmark.ma/storage/${blog.image}`
                });
                return acc;
            }, {});

            // Convert to array format
            const formattedData = Object.entries(groupedBlogs).map(([category, posts]) => ({
                category: category === 'CONTENT'
                    ? 'EN RELATION AVEC LA CRÉATION DE CONTENUE'
                    : `EN RELATION AVEC LE ${category}`,
                posts: posts as Blog[]
            }));

            return formattedData;
        }

        return [];
    } catch (error) {
        console.error('Failed to fetch blog data:', error);
        return [];
    }
}

export default async function BlogPage() {
    const blogData = await getBlogData();

    const allPosts = blogData.flatMap(cat => cat.posts);
    const blogListSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Blog Landmark Agency",
        "description": "Articles et conseils marketing digital par Landmark Agency",
        "url": "https://landmark.ma/blog",
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": allPosts.length,
            "itemListElement": allPosts.map((post, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `https://landmark.ma/blog/${post.id}`,
                "name": post.title
            }))
        }
    };

    return (
        <div className="font-jost relative min-h-screen w-full overflow-x-hidden bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
            />
            {/* Background */}
            <div
                className="absolute top-0 left-0 w-full bg-cover bg-no-repeat"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 70%, rgba(255,255,255,1) 95%), url(${WebSiteBG.src})`,
                    backgroundPosition: 'left 0px top -100px',
                    height: '40%'
                }}
            ></div>

            <section className="text-left py-16 px-4 sm:px-10 w-[90%] m-auto relative z-10">
                <h1 className="sm:mt-24 mt-5 text-[#010e26] text-xl sm:text-2xl md:text-4xl font-bold uppercase tracking-wide mb-4 md:mb-6">
                    Besoin d'inspiration ?
                </h1>
                <p className="text-[#010e26] uppercase mb-10 md:mb-20 text-sm md:text-xl tracking-normal">
                    Découvrez tous nos contenus en un seul endroit.
                </p>

                {/* Blog Sections */}
                <div className="pb-8 md:pb-16">
                    <div className="space-y-16 md:space-y-24">
                        <div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#263973] uppercase text-left mb-8 tracking-widest relative inline-block font-bodoni">
                                Nos Articles
                                <span className="absolute -bottom-2 left-0 w-10 h-1 bg-[#445EF2]"></span>
                            </h2>
                        </div>

                        {blogData.length > 0 ? (
                            blogData.map((category, index) => (
                                <div key={index} className="space-y-8 md:space-y-10">
                                    <div className="flex items-center gap-6">
                                        <h2 className="text-xl sm:text-2xl md:text-3xl text-[#010E26] uppercase text-left font-bold tracking-tight leading-tight font-bodoni">
                                            {category.category}
                                        </h2>
                                        <div className="h-[1px] bg-gradient-to-r from-gray-300 to-transparent flex-grow"></div>
                                    </div>

                                    <BlogSwiper posts={category.posts} />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white/50 backdrop-blur-md rounded-3xl border border-dashed border-gray-300">
                                <p className="text-gray-500 font-medium">Aucun article disponible pour le moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
