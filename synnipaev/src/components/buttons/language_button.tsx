"use client";

import React from "react";
import Estonian from "@/assets/icons/et.svg";
import English from "@/assets/icons/en.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LanguageButtonProps {
    onClick?: () => void;
    className?: string;
}

const LanguageButton: React.FC<LanguageButtonProps> = ({
    onClick,
    className = "",
}) => {
    const pathname = usePathname();

    const redirectedPathname = (locale: string) => {
        if (!pathname) return "/";
        const segments = pathname.split("/");
        if (segments[1] !== "en") {
            return `/${locale}${pathname}`;
        }
        segments[1] = locale;
        return segments.join("/");
    };

    const currentLocale = pathname?.split("/")[1] || "et";

    return (
        <div
            aria-label="Language Button"
            className="justify-start items-center flex-row flex gap-8"
        >
            {currentLocale === "et" ? (
                <Link href={redirectedPathname("en")} aria-label="English" onClick={onClick}>
                    <Image src={English} alt="Switch to English" />
                </Link>
            ) : (
                <Link href={redirectedPathname("et")} aria-label="Estonian" onClick={onClick}>
                    <Image src={Estonian} alt="Switch to Estonian" />
                </Link>
            )}
        </div>
    );
};

export default LanguageButton;