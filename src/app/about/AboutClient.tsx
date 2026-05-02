'use client';

import { useState } from 'react';
import Mission from '@/components/home/Mission';
import WebSiteBG from '@/assets/BG/maskBg.png';
import TiltedCard from '@/components/TiltedCard';
import { LinkedinFilled, InstagramOutlined } from "@ant-design/icons";
import type { TeamMember } from '@/types/team';

interface AboutClientProps {
    initialTeamMembers: TeamMember[];
}

export default function AboutClient({ initialTeamMembers }: AboutClientProps) {
    const [teamMembers] = useState<TeamMember[]>(initialTeamMembers);

    return (
        <div className="font-['Jost'] relative min-h-screen">
            {/* Background with gradient overlay */}
            <div
                className="absolute top-0 left-0 w-full bg-cover bg-no-repeat"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 70%, rgba(255,255,255,1) 95%), url(${WebSiteBG.src})`,
                    backgroundPosition: 'left 0px top -100px',
                    height: '40%'
                }}
            ></div>

            <section className="text-left py-16 px-4 sm:px-10 w-[90%] m-auto relative z-10">
                <h1 className="sm:mt-24 mt-5 text-[#010e26] text-xl sm:text-2xl md:text-4xl font-bold uppercase tracking-wide mb-4 md:mb-6">
                    Landmark est plus qu'une agence de marketing digital, c'est un espace où la créativité et la performance se rejoignent pour donner vie à des marques fortes.
                </h1>

                <Mission className="text-[#263973] py-16 font-medium" />

                <div className="py-16">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-[0.2em] mb-6 uppercase pl-0 text-[#263973]" style={{ fontFamily: 'bodoni' }}>
                        À propos de Landmark
                    </h2>

                    <p className="mb-6 leading-relaxed text-[#666666]">
                        <strong className="font-semibold text-[#666666]">
                            Landmark est une agence de marketing digital basée à Oujda, au Maroc,
                            qui aide les marques à se faire remarquer et à se développer.
                        </strong>{' '}
                        Nous créons des identités visuelles fortes, des contenus percutants et des
                        stratégies de communication sur mesure pour attirer le bon public et
                        augmenter l'engagement.
                    </p>

                    <p className="mb-6 leading-relaxed text-[#666666]">
                        <strong className="font-semibold text-[#666666]">
                            Notre objectif est simple : transformer des idées en marques mémorables
                            et efficaces.
                        </strong>{' '}
                        Grâce à notre vision claire et notre capacité d'adaptation, nous
                        accompagnons nos clients dans un monde en constante évolution. Que vous
                        lanciez votre projet ou que vous souhaitiez améliorer votre présence en
                        ligne, nous sommes là pour vous guider à chaque étape.
                    </p>

                    <div className="mb-6 text-[#666666]">
                        <strong className="font-semibold text-[#666666]">Nos services incluent :</strong>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Création d'identité de marque (logo, charte graphique)</li>
                            <li>Conception de sites web</li>
                            <li>Gestion des réseaux sociaux</li>
                            <li>Publicité digitale (Meta Ads, Google Ads)</li>
                            <li>Photographie et vidéos promotionnelles</li>
                        </ul>
                    </div>

                    <p className="leading-relaxed text-[#666666]">
                        <strong className="font-semibold text-[#666666]">
                            Ce qui fait notre différence ? Une vraie écoute, une équipe créative, et
                            une approche sur mesure.
                        </strong>{' '}
                        Que vous soyez une petite entreprise locale ou une marque ambitieuse,
                        Landmark est là pour vous aider à grandir.
                    </p>


                    <h2 className="text-xl mt-20 sm:text-2xl font-bold tracking-[0.2em] mb-6 uppercase pl-0 text-[#263973]" style={{ fontFamily: 'bodoni' }}>
                        Équipe Landmark
                    </h2>

                    {/* Team Members */}
                    <section className="flex flex-wrap gap-8 md:gap-6 justify-center pt-5">
                        {teamMembers.map(({ id, name, role, description, imageUrl, linkedin, instagram }) => (
                            <article key={id} className="w-full sm:w-[48%] lg:w-[30%] text-left">
                                {/* Tilted Card - Wrapper with aspect ratio */}
                                <div className="w-full aspect-square">
                                    <TiltedCard
                                        imageSrc={imageUrl}
                                        altText={`Photo de ${name}`}
                                        captionText={name}
                                        containerHeight="100%"
                                        containerWidth="100%"
                                        imageHeight="100%"
                                        imageWidth="100%"
                                        rotateAmplitude={12}
                                        scaleOnHover={1.08}
                                        showMobileWarning={false}
                                        showTooltip={true}
                                        displayOverlayContent={true}
                                        overlayContent={
                                            <div className="w-full h-full flex flex-col items-center justify-center px-6 bg-black/60 rounded-[15px]">
                                                {/* <p className="text-white text-center text-lg font-medium underline decoration-white decoration-2 underline-offset-8 mb-3">
                          {post}
                        </p>
                        <p className="text-white text-center text-sm font-light uppercase tracking-wide">
                          {name}
                        </p> */}
                                            </div>
                                        }
                                    />
                                </div>

                                {/* Team Member Info */}
                                <div className="mt-6">
                                    <p className="text-[#010e26] uppercase mb-2 font-bold text-base">{name}</p>
                                    <p className="text-[#666666] text-sm leading-relaxed mb-3">{description}</p>

                                    <div className="flex gap-3 mt-3">
                                        {linkedin && (
                                            <a
                                                href={linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#0e76a8] hover:scale-110 transition-transform"
                                                aria-label={`LinkedIn de ${name}`}
                                            >
                                                <LinkedinFilled className="text-xl" />
                                            </a>
                                        )}
                                        {instagram && (
                                            <a
                                                href={instagram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#E1306C] hover:scale-110 transition-transform"
                                                aria-label={`Instagram de ${name}`}
                                            >
                                                <InstagramOutlined className="text-xl" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>
                </div>

            </section>
        </div>
    );
}
