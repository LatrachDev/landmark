import BlogClient from './BlogClient';
import { api } from '@/services/api';

async function getBlogs() {
    try {
        const data = await api.home.getBlogs({
            next: { revalidate: 3600 }
        });
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
