'use client';

import { useCallback, memo } from 'react';
import Image from 'next/image';
import team from '@/assets/Landing/team.png';
import { JSX } from 'react/jsx-runtime';

const MainOffre = memo(function MainOffre(): JSX.Element {
    const scrollToContact = useCallback((): void => {
        const contactElement = document.getElementById('contact-offre');
        if (contactElement) {
            contactElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    return (
        <div className="relative w-full flex flex-col items-center justify-start overflow-hidden">
            {/* Team image at the top - Full Width */}
            <div className="relative z-10 w-full mb-4 sm:mb-6 md:mb-8 lg:-mt-32 xl:-mt-40">
                <Image
                    src={team}
                    alt="our team"
                    className="w-full object-cover"
                    priority
                />
            </div>

            {/* Main headlines */}
            <div className="relative z-10 text-center -mt-16 mb-4 sm:mb-6 md:mb-8 lg:-mt-48 xl:-mt-52 px-4 sm:px-6 md:px-8">
                <h1
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight sm:leading-tight md:leading-tight mb-2 sm:mb-3 md:mb-4"
                    style={{ fontFamily: 'var(--font-jenine)' }}
                >
                    <span className="text-white block">خلي الماركة ديالك تبان</span>
                    <span className="text-[#05c7f2] block mt-1 sm:mt-2">بمحتوى يستحق المشاهدة</span>
                </h1>
            </div>

            {/* Paragraph text */}
            <p
                className="relative z-10 text-white text-center text-sm sm:text-base md:text-lg lg:text-xl max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto px-2 sm:px-4 mb-8 sm:mb-10 md:mb-12 leading-relaxed"
                style={{ fontFamily: 'var(--font-madani-regular)' }}
            >
                محتوى كيجبد الانتباه ويحكي القصة ديالك بطريقة احترافية ومقنعة
            </p>

            {/* Call-to-action button */}
            <div className="relative z-10 px-2 sm:px-4">
                <button
                    onClick={scrollToContact}
                    className="w-full cursor-pointer sm:w-auto px-4 rounded-xl sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 bg-white text-[#263973] text-sm sm:text-base md:text-lg lg:text-2xl font-semibold hover:bg-[#05c7f2] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                    style={{ fontFamily: 'var(--font-madani-bold)' }}
                >
                    تواصل معانا وستافد من العرض
                </button>
            </div>
        </div>
    );
});

export default MainOffre;
