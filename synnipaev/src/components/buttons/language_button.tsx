"use client";

import React from "react";
import Estonian from "@/assets/icons/et.svg";
import English from "@/assets/icons/en.svg";
import Image from "next/image";

interface LanguageButtonProps {
    onClick?: () => void;
    className?: string;
}

const LanguageButton: React.FC<LanguageButtonProps> = ({
    onClick,
    className = "",
}) => {
    return (
        <div aria-label="Language Button" className="justify-start items-center flex-row flex gap-4">
            <button aria-label="Estonian" onClick={onClick}>
                <Image src={Estonian} alt="Estonian" />
            </button>
            <div className="h-full w-0.5 bg-light"></div>
            <button aria-label="English" onClick={onClick}>
                <Image src={English} alt="English" />
            </button>
        </div>
    );
};

export default LanguageButton;