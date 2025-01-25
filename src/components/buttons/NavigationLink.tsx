"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // Use Next.js App Router

interface NavigationLinkProps {
  children?: React.ReactNode;
  text?: string;
  variant: "primary" | "secondary" | "tertiary";
  big?: boolean;
  type?: string;
  active?: boolean;
  href: string;
  ariaLabel?: string;
  className?: string; // Allow custom class names to be passed
}

const NavigationLink: React.FC<NavigationLinkProps> = ({
  children,
  text,
  variant,
  big = false,
  active,
  href,
  ariaLabel,
  className = "",
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = pathname.includes(href || ""); // Check if the current path matches the `to` prop

  const baseClasses = `flex justify-center items-center button-text transition-colors duration-150 uppercase ${className}`;

  const variantClasses = {
    primary: `bg-primary shadow-filled rounded text-light hover:bg-secondary focus:bg-light focus:text-primary ${big ? "min-w-32 min-h-16 px-8" : "min-w-32 min-h-12 px-8"
      }`,
    secondary: `bg-transparent shadow-filled rounded box-border border-primary border-4 text-light hover:border-light focus:bg-light focus:border-light focus:text-primary ${big ? "min-w-32 min-h-16 px-8" : "min-w-32 min-h-12 px-8"
      }`,
    tertiary: `bg-transparent border-b-4 h-12 px-2 ${isActive || active
      ? "border-primary text-light"
      : "border-transparent text-light hover:border-light focus:border-primary focus:text-light"
      }`,
  };

  return (
    <Link
      className={`${baseClasses} ${variantClasses[variant]}`}
      aria-label={ariaLabel || text}
      href={href}
    >
      {children || text} {/* Render `children` or `text` */}
    </Link>
  );
};

export default NavigationLink;