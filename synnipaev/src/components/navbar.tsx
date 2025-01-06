"use client";

import React, { useState } from "react";
import Image from "next/image";
import logo_large from "@/assets/logos/ituk_navbar_logo.svg";
import logo_small from "@/assets/logos/ituk_navbar_symbol.svg";
import Button from "@/components/buttons/button";
import HamburgerMenu from "./buttons/HamburgerMenu";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? "" : "hidden"; // Lock/unlock scroll
  };
  return (
    <header className="sticky top-0 z-20 w-full min-h-[72px] px-[6.9%] py-1 bg-dark shadow-filled justify-between items-center inline-flex">
      <a
        className="flex sm:hidden items-center cursor-pointer"
        href="/"
        aria-label="Avaleht"
      >
        <Image src={logo_small} alt="ITÜK | IT-teaduskonna üliõpilaskogu" />
      </a>
      <a
        className="hidden sm:flex items-center cursor-pointer"
        href="/"
        aria-label="Avaleht"
      >
        <Image src={logo_large} alt="ITÜK | IT-teaduskonna üliõpilaskogu" />
      </a>
      <div className="justify-start items-center gap-8 hidden lg:flex">
        <Button variant="tertiary" text="Meist" to="/meist" />
        <Button variant="tertiary" text="Üritused" to="/uritused" />
        <Button variant="tertiary" text="Koostöö" to="/partnerlus" />
        <Button variant="tertiary" text="Rent" to="/rent" />
        <Button variant="primary" text="Liitu" to="https://liitu.ituk.ee/" />
      </div>
      <HamburgerMenu
        className="flex lg:hidden"
        isOpen={isMenuOpen}
        onClick={toggleMenu}
      />
      {isMenuOpen && (
        <div
          className="fixed inset-0 top-[72px] bg-dark/90 z-30 flex flex-col items-center justify-center gap-4"
          onClick={toggleMenu}
        >
          <Button variant="tertiary" text="Meist" to="/meist" />
          <Button variant="tertiary" text="Üritused" to="/uritused" />
          <Button variant="tertiary" text="Koostöö" to="/partnerlus" />
          <Button variant="tertiary" text="Rent" to="/rent" />
          <Button
            variant="primary"
            text="Liitu"
            to="https://liitu.ituk.ee/"
            onClick={toggleMenu}
          />
        </div>
      )}
    </header>
  );
}
