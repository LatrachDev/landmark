import BlogClient from './BlogClient';

async function getBlogs() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.landmark.ma/';

    try {
        const res = await fetch(`${baseUrl}api/home`, {
            next: { revalidate: 3600 },
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch blogs: ${res.statusText}`);
        }

        const data = await res.json();
        return data.blogs || [];
    } catch (error) {
        console.error('Error fetching blogs on server:', error);
        return [];
    }
}

const Blog = async ({ hideHeader = false }: { hideHeader?: boolean }) => {
    const blogs = await getBlogs();

    return <BlogClient blogs={blogs} hideHeader={hideHeader} />;
};

export default Blog;
