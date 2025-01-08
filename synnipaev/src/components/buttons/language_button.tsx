"use client";

import React, { use } from "react";
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
        if (segments[1] != "en") {
            return `/${locale}${pathname}`;
        }
        segments[1] = locale;
        return segments.join("/");
    };

    return (
        <div aria-label="Language Button" className="justify-start items-center flex-row flex gap-4">
            <Link href={redirectedPathname("est")} aria-label="Estonian" onClick={onClick}>
                <Image src={Estonian} alt="Estonian" />
            </Link>
            <div className="h-full w-0.5 bg-light"></div>
            <Link href={redirectedPathname("en")} aria-label="English" onClick={onClick}>
                <Image src={English} alt="English" />
            </Link>
        </div>
    );
};

export default LanguageButton;