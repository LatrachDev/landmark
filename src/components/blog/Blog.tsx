import BlogClient from "./BlogClient";
import type { Blog } from "@/types/blog";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.landmark.ma").replace(
	/\/$/,
	"",
);

async function getBlogs(): Promise<Blog[]> {
	try {
		const res = await fetch(`${API_URL}/api/blogs`, {
			next: { revalidate: 3600 },
		});
		if (!res.ok) return [];
		return res.json();
	} catch {
		return [];
	}
}

const Blog = async ({ hideHeader = false }: { hideHeader?: boolean }) => {
	const blogs = await getBlogs();
	return <BlogClient blogs={blogs} hideHeader={hideHeader} />;
};

export default Blog;
