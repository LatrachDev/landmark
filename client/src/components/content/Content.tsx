import ContentClient from './ContentClient';

async function getContent() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.landmark.ma/';

    try {
        const res = await fetch(`${baseUrl}api/home`, {
            next: { revalidate: 3600 },
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch content: ${res.statusText}`);
        }

        const data = await res.json();
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
