import Link from 'next/link';
import Image from 'next/image';

interface ServiceCardProps {
    id: string | number;
    title: string;
    description: string;
    image: string;
}

const baseURL = "https://api.landmark.ma/public/storage/";

export default function ServiceCard({ id, title, description, image }: ServiceCardProps) {
    return (
        <Link
            href={`/services/${id}`}
            className="flex flex-col bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-500 cursor-pointer overflow-hidden border border-gray-50/50 group h-full"
        >
            <div className="aspect-[1.6/1] overflow-hidden relative">
                <Image
                    src={baseURL + image}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
            </div>
            <div className="p-8 pb-10 flex flex-col flex-1">
                <h4 className="text-[#010E26] font-bold uppercase text-lg sm:text-xl leading-tight mb-4 group-hover:text-[#445EF2] transition-colors duration-300">
                    {title}
                </h4>
                <p className="text-[#64748b] text-sm sm:text-base font-normal leading-relaxed line-clamp-3">
                    {description}
                </p>
            </div>
        </Link>
    );
}
