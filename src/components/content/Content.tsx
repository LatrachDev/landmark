import ContentClient from './ContentClient';
import { api } from '@/services/api';

async function getContent() {
    try {
        const data = await api.home.getBlogs({
            next: { revalidate: 3600 }
        });
        return data.threeContents || [];
    } catch (error) {
        console.error('Error fetching content on server:', error);
        return [];
    }
}

const Content = async () => {
    const threeContents = await getContent();

    return <ContentClient contents={threeContents} />;
};

export default Content;
