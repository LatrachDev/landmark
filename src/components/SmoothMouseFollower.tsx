"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export default function SmoothMouseFollower() {
	const mousePosition = useRef({ x: 0, y: 0 });
	const dotPosition = useRef({ x: 0, y: 0 });
	const borderDotPosition = useRef({ x: 0, y: 0 });
	const rafId = useRef<number | null>(null);

	const [renderPos, setRenderPos] = useState({
		dot: { x: 0, y: 0 },
		border: { x: 0, y: 0 },
	});
	const [isHovering, setIsHovering] = useState(false);
	const [isDesktop, setIsDesktop] = useState(false);

	const DOT_SMOOTHNESS = 0.2;
	const BORDER_DOT_SMOOTHNESS = 0.1;

	// Check if desktop on mount and resize
	useEffect(() => {
		const checkIsDesktop = () => {
			setIsDesktop(window.innerWidth > 768);
		};

		checkIsDesktop();
		window.addEventListener("resize", checkIsDesktop);

		return () => {
			window.removeEventListener("resize", checkIsDesktop);
		};
	}, []);

	// Memoized handlers
	const handleMouseMove = useCallback((e: MouseEvent) => {
		mousePosition.current = { x: e.clientX, y: e.clientY };
	}, []);

	const handleMouseEnter = useCallback(() => setIsHovering(true), []);
	const handleMouseLeave = useCallback(() => setIsHovering(false), []);

	// Animation and event listeners
	useEffect(() => {
		if (!isDesktop) return;

		const lerp = (start: number, end: number, factor: number) =>
			start + (end - start) * factor;

		const animate = () => {
			dotPosition.current.x = lerp(
				dotPosition.current.x,
				mousePosition.current.x,
				DOT_SMOOTHNESS,
			);
			dotPosition.current.y = lerp(
				dotPosition.current.y,
				mousePosition.current.y,
				DOT_SMOOTHNESS,
			);
			borderDotPosition.current.x = lerp(
				borderDotPosition.current.x,
				mousePosition.current.x,
				BORDER_DOT_SMOOTHNESS,
			);
			borderDotPosition.current.y = lerp(
				borderDotPosition.current.y,
				mousePosition.current.y,
				BORDER_DOT_SMOOTHNESS,
			);

			setRenderPos({
				dot: { x: dotPosition.current.x, y: dotPosition.current.y },
				border: {
					x: borderDotPosition.current.x,
					y: borderDotPosition.current.y,
				},
			});

			rafId.current = requestAnimationFrame(animate);
		};

		window.addEventListener("mousemove", handleMouseMove);

		const interactiveElements = document.querySelectorAll(
			'a, button, img, input, textarea, select, [role="button"]',
		);
		interactiveElements.forEach((el) => {
			el.addEventListener("mouseenter", handleMouseEnter);
			el.addEventListener("mouseleave", handleMouseLeave);
		});

		rafId.current = requestAnimationFrame(animate);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			interactiveElements.forEach((el) => {
				el.removeEventListener("mouseenter", handleMouseEnter);
				el.removeEventListener("mouseleave", handleMouseLeave);
			});
			if (rafId.current !== null) {
				cancelAnimationFrame(rafId.current);
			}
		};
	}, [isDesktop, handleMouseMove, handleMouseEnter, handleMouseLeave]);

	if (!isDesktop) return null;

	return (
		<div className="pointer-events-none fixed inset-0 z-9999">
			{/* Inner dot */}
			<div
				className="absolute rounded-full bg-[#445EF2] transition-opacity duration-300"
				style={{
					width: "8px",
					height: "8px",
					transform: "translate(-50%, -50%)",
					left: `${renderPos.dot.x}px`,
					top: `${renderPos.dot.y}px`,
				}}
			/>

			{/* Border circle */}
			<div
				className="absolute rounded-full border border-[#445EF2]"
				style={{
					width: isHovering ? "44px" : "28px",
					height: isHovering ? "44px" : "28px",
					transform: "translate(-50%, -50%)",
					left: `${renderPos.border.x}px`,
					top: `${renderPos.border.y}px`,
					transition: "width 0.3s ease-out, height 0.3s ease-out",
				}}
			/>
		</div>
	);
}
