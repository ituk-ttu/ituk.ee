"use client";

import { useEffect, useRef, useState } from "react";

interface StatItemProps {
    value: string;
    label: string;
}

function StatItem({ value, label }: StatItemProps) {
    const [displayValue, setDisplayValue] = useState("0");
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Parse number and suffix (e.g., "500+" -> { num: 500, suffix: "+" })
    const match = value.match(/^(\d+)(.*)$/);
    const targetNum = match ? parseInt(match[1], 10) : 0;
    const suffix = match ? match[2] : "";

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true);

                    const duration = 1500; // ms
                    const startTime = performance.now();

                    const animate = (currentTime: number) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Ease-out curve for smoother ending
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(easeOut * targetNum);

                        setDisplayValue(current.toString());

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            setDisplayValue(targetNum.toString());
                        }
                    };

                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [targetNum, hasAnimated]);

    return (
        <div ref={ref} className="flex flex-col items-center gap-2 min-w-24 transition-transform duration-150 hover:scale-110">
            {/* Invisible element to reserve space for final value */}
            <span className="text-stat font-bold relative">
                <span className="invisible">{value}</span>
                <span className="absolute inset-0 flex justify-center">{displayValue}{suffix}</span>
            </span>
            <span className="text-center">{label}</span>
        </div>
    );
}

interface StatisticsProps {
    items: StatItemProps[];
    title?: string;
}

export default function Statistics({ items, title }: StatisticsProps) {
    return (
        <div className="section-padding bg-primary">
            <div className="container-content flex flex-col lg:flex-row justify-between items-center gap-8">
                {title && <h2 className="shrink-0">{title}</h2>}
                <div className="flex flex-wrap justify-center items-center gap-16">
                    {items.map((item, index) => (
                        <StatItem key={index} value={item.value} label={item.label} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export { StatItem };
export type { StatItemProps, StatisticsProps };
