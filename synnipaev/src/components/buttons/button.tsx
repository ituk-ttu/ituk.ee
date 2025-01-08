"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation"; // Use Next.js App Router

interface ButtonProps {
  children?: React.ReactNode;
  text?: string;
  type?: "button" | "submit" | "reset"; // Specify valid button types
  variant: "primary" | "secondary" | "tertiary";
  big?: boolean;
  active?: boolean;
  to?: string; // Internal navigation path
  href?: string; // External link
  ariaLabel?: string;
  className?: string; // Allow custom class names to be passed
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // MouseEvent type
}

const Button: React.FC<ButtonProps> = ({
  children,
  text,
  type = "button", // Default to "button"
  variant,
  big = false,
  active,
  to,
  href,
  ariaLabel,
  className = "",
  onClick,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = to && pathname === to; // Check if the current path matches the `to` prop

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event); // Pass the event to the `onClick` prop
    event.preventDefault();
    if (href) {
      window.location.href = href; // Redirect to external link
    } else if (to) {
      router.push(to); // Internal navigation using Next.js's router
    }
  };

  const baseClasses = `flex justify-center items-center transition-colors duration-150 ${className}`;

  const variantClasses = {
    primary: `bg-primary shadow-filled rounded text-light hover:bg-secondary focus:bg-light focus:text-primary ${big ? "min-w-32 min-h-16 px-8 big-button-text" : "min-w-32 min-h-12 px-8"
      }`,
    secondary: `bg-transparent shadow-filled rounded box-border border-primary border-4 text-light hover:border-light focus:bg-light focus:border-light focus:text-primary ${big ? "min-w-32 min-h-16 px-8 big-button-text" : "min-w-32 min-h-12 px-8"
      }`,
    tertiary: `bg-transparent border-b-4 h-12 px-2 ${isActive || active
      ? "border-primary text-light"
      : "border-transparent text-light hover:border-light focus:border-primary focus:text-light"
      }`,
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      aria-label={ariaLabel || text}
      onClick={handleClick}
      type={type} // Pass the `type` here to the button attribute
    >
      {children || text} {/* Render `children` or `text` */}
    </button>
  );
};

export default Button;
