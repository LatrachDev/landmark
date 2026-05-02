"use client";

import dynamic from "next/dynamic";
import NavOffre from "@/components/Offre/NavOffre";
import MainOffre from "@/components/Offre/MainOffre";
import MainVideo from "@/components/Offre/MainVideo";
import AudioOffre from "@/components/Offre/AudioOffre";
import PricingOffre from "@/components/Offre/PricingOffre";
import ContactOffre from "@/components/Offre/ContactOffre";
import FooterOffre from "@/components/Offre/FooterOffre";
import { JSX } from "react/jsx-runtime";

// Dynamically import Videos component (has big video data)
const Videos = dynamic(() => import("@/components/Offre/Videos"), {
	loading: () => (
		<div className="w-full py-12 flex items-center justify-center">
			<div className="text-white">جاري التحميل...</div>
		</div>
	),
	ssr: false, // Disable SSR for this heavy component (equivalent to lazy loading)
});

const containerStyle: React.CSSProperties = {
	backgroundColor: "#010e26",
	backgroundSize: "cover, auto",
	backgroundPosition: "center, center",
	backgroundRepeat: "no-repeat, repeat",
	backgroundAttachment: "fixed",
};

export default function OffrePage(): JSX.Element {
	return (
		<div className="min-h-screen relative" style={containerStyle}>
			<NavOffre />
			<MainOffre />
			<div className="w-full mt-5 md:mt-20">
				<MainVideo />
			</div>
			<Videos />
			<AudioOffre />
			<PricingOffre />
			<ContactOffre />
			<FooterOffre />
		</div>
	);
}
