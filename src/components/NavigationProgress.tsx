"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function NavigationProgress() {
	const pathname = usePathname();
	const [isNavigating, setIsNavigating] = useState(false);

	useEffect(() => {
		setIsNavigating(true);
		const timer = setTimeout(() => setIsNavigating(false), 400);
		return () => clearTimeout(timer);
	}, [pathname]);

	return (
		<AnimatePresence>
			{isNavigating && (
				<motion.div
					className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-[#445EF2] to-[#263973] z-9999 origin-left"
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					exit={{ scaleX: 1, opacity: 0 }}
					transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
				/>
			)}
		</AnimatePresence>
	);
}
