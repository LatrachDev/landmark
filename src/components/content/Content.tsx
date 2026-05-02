import ContentClient from './ContentClient';
import Thumbnail1 from '@/assets/Landing/reels/thumbnails/cosmarkThumbnail.jpg';
import Thumbnail2 from '@/assets/Landing/reels/thumbnails/ikramThumbnail.jpg';
import Thumbnail3 from '@/assets/Landing/reels/thumbnails/brimoThumbnail.jpg';

const staticContents = [
    {
        id: 1,
        video: '/video/Reel1.mp4',
        thumbnail: Thumbnail1.src,
        title: 'Reel 1',
        views: 120000,
    },
    {
        id: 2,
        video: '/video/Reel2.mp4',
        thumbnail: Thumbnail2.src,
        title: 'Reel 2',
        views: 85000,
    },
    {
        id: 3,
        video: '/video/Reel3.mp4',
        thumbnail: Thumbnail3.src,
        title: 'Reel 3',
        views: 200000,
    },
];

const Content = () => {
    return <ContentClient contents={staticContents} />;
};

export default Content;
