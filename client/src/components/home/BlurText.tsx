"use client";

import { motion, Transition, Easing } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";

// Define the shape of our animation styles
type AnimationStyle = Record<string, string | number>;

interface BlurTextProps {
    text?: string;
    delay?: number;
    className?: string;
    animateBy?: "words" | "letters";
    direction?: "top" | "bottom";
    threshold?: number;
    rootMargin?: string;
    animationFrom?: AnimationStyle;
    animationTo?: AnimationStyle[];
    easing?: Easing;
    onAnimationComplete?: () => void;
    stepDuration?: number;
}

const buildKeyframes = (
    from: AnimationStyle,
    steps: AnimationStyle[]
): Record<string, (string | number)[]> => {
    const keys = new Set([
        ...Object.keys(from),
        ...steps.flatMap((s) => Object.keys(s)),
    ]);

    const keyframes: Record<string, (string | number)[]> = {};
    keys.forEach((k) => {
        // Fallback to undefined/null behavior handled by Framer Motion if property doesn't exist
        keyframes[k] = [from[k], ...steps.map((s) => s[k])];
    });
    return keyframes;
};

const BlurText: React.FC<BlurTextProps> = ({
    text = "",
    delay = 200,
    className = "",
    animateBy = "words",
    direction = "top",
    threshold = 0.1,
    rootMargin = "0px",
    animationFrom,
    animationTo,
    easing = (t) => t,
    onAnimationComplete,
    stepDuration = 0.35,
}) => {
    const elements = animateBy === "words" ? text.split(" ") : text.split("");
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.unobserve(ref.current!);
                }
            },
            { threshold, rootMargin }
        );
        observer.observe(ref.current);
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [threshold, rootMargin]);

    const defaultFrom: AnimationStyle = useMemo(
        () =>
            direction === "top"
                ? { filter: "blur(10px)", opacity: 0, y: -50 }
                : { filter: "blur(10px)", opacity: 0, y: 50 },
        [direction]
    );

    const defaultTo: AnimationStyle[] = useMemo(
        () => [
            {
                filter: "blur(5px)",
                opacity: 0.5,
                y: direction === "top" ? 5 : -5,
            },
            { filter: "blur(0px)", opacity: 1, y: 0 },
        ],
        [direction]
    );

    const fromSnapshot = animationFrom ?? defaultFrom;
    const toSnapshots = animationTo ?? defaultTo;

    const stepCount = toSnapshots.length + 1;
    const totalDuration = stepDuration * (stepCount - 1);
    const times = Array.from({ length: stepCount }, (_, i) =>
        stepCount === 1 ? 0 : i / (stepCount - 1)
    );

    return (
        <div ref={ref} className={`blur-text ${className} flex flex-wrap`}>
            {elements.map((segment, index) => {
                const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

                const spanTransition: Transition = {
                    duration: totalDuration,
                    times,
                    delay: (index * delay) / 1000,
                    ease: easing,
                };

                return (
                    <motion.span
                        className="inline-block will-change-[transform,filter,opacity]"
                        key={index}
                        initial={fromSnapshot}
                        animate={inView ? animateKeyframes : fromSnapshot}
                        transition={spanTransition}
                        onAnimationComplete={
                            index === elements.length - 1 ? onAnimationComplete : undefined
                        }
                    >
                        {segment === " " ? "\u00A0" : segment}
                        {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
                    </motion.span>
                );
            })}
        </div>
    );
};

export default BlurText;