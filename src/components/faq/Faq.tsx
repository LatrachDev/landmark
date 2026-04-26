'use client';

import { useState } from 'react';

const faqData = [
    {
        title: 'ANALYSER LE MARCHÉ',
        content:
            'Une Voie Claire & Ciblée Pour Lancer Votre Entreprise.',
        items: [
            "Se plonger dans l'étude de marché",
            'Connaître votre clientèle',
            'Évaluez vos concurrents',
            'Trouvez vos points forts et corrigez vos points faibles',
            'Identifier les lacunes du marché',
            'Se démarquer',
        ],
    },
    {
        title: 'BRAND DESIGN',
        content:
            'Créer & lancer une marque durable sur le marché.',
        items: [
            "Brand Design",
            'Élaboration de charte graphique',
            'Conception UI/UX',
            'Conception de sites web (UI & UI design)',
            'Conception packaging',
        ],
    },
    {
        title: 'CRÉATION DE CONTENU',
        content:
            'Grandissez & évoluez avec du contenu qui augmente les interactions.',
        items: [
            "Où que soit votre public, vous serez présent.",
            'Narration visuelle.',
            'Créer - Publier - Répéter.',
            'Analyse des données et résultats',
        ],
    },
];

const Faq = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="px-4 sm:px-10 pb-10 bg-white">
            <div className="container w-[90%] m-auto">
                <div className="mb-12">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#263973] uppercase text-left" style={{ fontFamily: 'bodoni' }}>
                        FAQ’s
                    </h2>
                </div>

                <div className="space-y-4 font-jost">
                    {faqData.map((faq, index) => (
                        <div
                            key={index}
                            className="border-b border-gray-300 pb-4"
                        >
                            <button
                                onClick={() => toggleFaq(index)}
                                className="cursor-pointer w-full text-left flex justify-between items-center py-4 focus:outline-none"
                                aria-expanded={openIndex === index}
                            >
                                <h3 className="text-sm sm:text-xl font-bold uppercase">
                                    {faq.title}
                                </h3>
                                <svg
                                    className={`w-6 h-6 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="pl-4">
                                    <p className="text-sm sm:text-xl mb-4 text-gray-700">{faq.content}</p>
                                    <ul className="space-y-2 pl-5 list-disc text-gray-600">
                                        {faq.items.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Faq;
