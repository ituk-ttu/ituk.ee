import React from "react";

interface ButtonProps {
    children?: React.ReactNode;
    text?: string;
    type: "primary" | "secondary" | "tertiary";
    big?: boolean;
    onClick?: () => void;
}

export default function Button({ children, text, type, big = false, onClick }: ButtonProps) {
    if (type === "primary") {
        return (
            <button className={`button primary bg-primary shadow-filled ${big ? "big" : ""}`} onClick={onClick}>
                {children}
                <h1 className="button-text">{text}</h1>
            </button>
        );
    } else if (type === "secondary") {
        return (
            <button className={`button secondary shadow-filled ${big ? "big" : ""}`} onClick={onClick}>
                {children}
                <h1 className="button-text">{text}</h1>
            </button>
        );
    } else if (type === "tertiary") {
        return (
            <button className={`button tertiary ${big ? "big" : ""}`} onClick={onClick}>
                {children}
                <h1 className="button-text">{text}</h1>
            </button>
        );
    }
}