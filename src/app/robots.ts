import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/admin/", "/landmark-login/", "/api/", "/espace-non-reference/"],
			},
		],
		sitemap: "https://landmark.ma/sitemap.xml",
		host: "https://landmark.ma",
	};
}
