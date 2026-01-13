import { Metadata } from 'next';
import BlogPageClient from './BlogPageClient';

export const metadata: Metadata = {
    title: "Blog Landmark - Conseils Marketing Digital & Branding Maroc",
    description: "Apprendre les meilleures stratégies marketing avec Landmark : conseils, astuces et tendances du marketing digital au Maroc. Découvrez nos articles sur le SEO, brand design et stratégies de communication.",
    keywords: "blog marketing digital maroc, conseils branding maroc, actualités marketing, tendances digitales maroc, stratégie contenu maroc, blog agence créative, Landmark blog",
    alternates: {
        canonical: "/blog",
    },
    openGraph: {
        url: "https://Landmark.ma/blog",
    }
};

export default function BlogPage() {
    return <BlogPageClient />;
}
