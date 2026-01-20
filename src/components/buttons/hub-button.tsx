"use client";

import React, { useState } from "react";

interface HubButtonProps {
    className?: string;
}

const HubButton: React.FC<HubButtonProps> = ({ className = "" }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <a
            href="https://hub.ituk.ee/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ITÜK Hub"
            className={`button-text text-2xl cursor-pointer transition-colors duration-150 ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span className={isHovered ? "text-primary" : "text-white"}>&gt;</span>
            <span className="text-white">hub</span>
            <span className={isHovered ? "text-primary" : "text-white"}>_</span>
        </a>
    );
};

export default HubButton;
