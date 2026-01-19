"use client";

import React from "react";
import Link from "next/link";

interface ButtonProps {
  children?: React.ReactNode;
  text?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "tertiary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  to?: string;
  href?: string;
  ariaLabel?: string;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  text,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  to,
  href,
  ariaLabel,
  className = "",
  onClick,
}) => {
  const sizeClasses = {
    sm: "min-w-24 px-3 py-1.5 btn-sm",
    md: "min-w-24 px-4 py-2 btn-md",
    lg: "min-w-24 px-6 py-3 btn-lg",
  };

  const baseClasses = `
    flex justify-center items-center
    button-text uppercase
    rounded overflow-hidden
    transition-all duration-150 ease-in-out
    ${sizeClasses[size]}
    ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
    ${className}
  `;

  const variantClasses = {
    primary: `
      bg-primary text-white
      ${!disabled && "hover:brightness-[1.2] active:brightness-[0.7]"}
    `,
    secondary: `
      bg-transparent border-4 border-primary text-white
      ${!disabled && "hover:bg-primary/20 active:bg-primary/30"}
    `,
    tertiary: `
      bg-transparent text-white
      ${!disabled && "hover:bg-primary/20 active:bg-primary/30"}
    `,
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]}`;
  const content = children || text;

  if (to) {
    const isExternal = to.startsWith("http://") || to.startsWith("https://");

    if (isExternal) {
      return (
        <a
          className={combinedClasses}
          aria-label={ariaLabel || text}
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          onClick={disabled ? (e) => e.preventDefault() : onClick as React.MouseEventHandler<HTMLAnchorElement>}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        className={combinedClasses}
        aria-label={ariaLabel || text}
        href={to}
        onClick={disabled ? (e) => e.preventDefault() : onClick as React.MouseEventHandler<HTMLAnchorElement>}
      >
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        className={combinedClasses}
        aria-label={ariaLabel || text}
        href={href}
        download
        onClick={disabled ? (e) => e.preventDefault() : onClick as React.MouseEventHandler<HTMLAnchorElement>}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={combinedClasses}
      aria-label={ariaLabel || text}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      type={type}
      disabled={disabled}
    >
      {content}
    </button>
  );
};

export default Button;
