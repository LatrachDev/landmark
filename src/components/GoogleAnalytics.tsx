"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { GA_MEASUREMENT_ID, pageview } from "@/lib/gtag";

function GATracker() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		if (!GA_MEASUREMENT_ID) return;
		const qs = searchParams.toString();
		pageview(pathname + (qs ? `?${qs}` : ""));
	}, [pathname, searchParams]);

	return null;
}

export default function GoogleAnalytics() {
	return (
		<Suspense fallback={null}>
			<GATracker />
		</Suspense>
	);
}
