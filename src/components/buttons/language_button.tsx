"use client";

import React from "react";
import Estonian from "@/assets/icons/et.svg";
import English from "@/assets/icons/en.svg";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface LanguageButtonProps {
    onClick?: () => void;
    className?: string;
}

const LanguageButton: React.FC<LanguageButtonProps> = ({
    onClick,
    className = "",
}) => {
    const router = useRouter();
    const pathname = usePathname();

    const changeLanguage = (locale: string) => {
        const pathParts = pathname.split("/").filter(Boolean) || [];

        if (pathParts[0] === "en" || pathParts[0] === "et") {
            pathParts[0] = locale;
        } else {
            pathParts.unshift(locale);
        }

        router.push(`/${pathParts.join("/")}`);
    };

    const currentLocale = pathname?.split("/")[1];

    return (
        <button
            aria-label={currentLocale === "en" ? "Switch to Estonian" : "Switch to English"}
            onClick={() => changeLanguage(currentLocale === "en" ? "et" : "en")}
            className={`w-8 h-8 flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80 ${className}`}
        >
            <Image
                src={currentLocale === "en" ? Estonian : English}
                alt={currentLocale === "en" ? "Switch to Estonian" : "Switch to English"}
                width={32}
                height={32}
            />
        </button>
    );
};

export default LanguageButton;