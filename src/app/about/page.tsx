import AboutClient from "./AboutClient";
import type { Metadata } from "next";
import type { TeamMember } from "@/types/team";

export const metadata: Metadata = {
	title: "About Us | Landmark",
	description:
		"Découvrez l'équipe créative de Landmark à Oujda. Notre mission : transformer vos idées en marques mémorables grâce à la créativité et la performance. Rencontrez nos experts.",
};

async function getTeamMembers(): Promise<TeamMember[]> {
	const apiUrl = (process.env.API_URL || "http://localhost:5000").replace(
		/\/$/,
		"",
	);
	try {
		const res = await fetch(`${apiUrl}/api/team`, {
			next: { revalidate: 3600 },
		});
		if (!res.ok) return [];
		return res.json();
	} catch {
		return [];
	}
}

export default async function AboutPage() {
	const teamMembers = await getTeamMembers();
	return <AboutClient initialTeamMembers={teamMembers} />;
}
