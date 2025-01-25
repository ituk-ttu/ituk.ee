"use client";

import React from "react";
import Estonian from "@/assets/icons/et.svg";
import English from "@/assets/icons/en.svg";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

interface LanguageButtonProps {
    onClick?: () => void;
    className?: string;
}


const LanguageButton: React.FC<LanguageButtonProps> = ({
    onClick,
    className = "",
}) => {
    const router = useRouter()
    const pathname = usePathname();

    const changeLanguage = (locale: string) => {

        const pathParts = pathname.split("/").filter(Boolean) || [];

        if (pathParts[0] === "en" || pathParts[0] === "et") {
            pathParts[0] = locale; // Replace the current locale
        } else {
            pathParts.unshift(locale); // Prepend the new locale
        }

        console.log(`/${pathParts.join("/")}`);
        router.push(`/${pathParts.join("/")}`);
    };


    const currentLocale = pathname?.split("/")[1];

    return (
        <div
            aria-label="Language Button"
            className="justify-start items-center flex-row flex gap-8"
        >
            {currentLocale === "en" ? (
                <button aria-label="Estonian" onClick={() => changeLanguage("et")}>
                    <Image src={Estonian} alt="Switch to Estonian" />
                </button>
            ) : (
                <button aria-label="English" onClick={() => changeLanguage("en")}>
                    <Image src={English} alt="Switch to English" />
                </button>
            )}
        </div>
    );
};

export default LanguageButton;