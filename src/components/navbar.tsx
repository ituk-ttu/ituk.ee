"use client";

import React, { useState } from "react";
import Image from "next/image";
import logo_large from "@/assets/logos/ituk_navbar_logo.svg";
import logo_small from "@/assets/logos/ituk_navbar_symbol.svg";
import Button from "@/components/buttons/button";
import HamburgerMenu from "./buttons/HamburgerMenu";
import LanguageButton from "./buttons/language_button";
import { getDictionary } from "@/dictionaries/dictionaries";

export default function Navbar({
  dictionary,
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>["navbar"];
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? "" : "hidden";
  };

  return (
    <header className="sticky top-0 z-50 w-full px-[clamp(1rem,4vw,4rem)] py-4 bg-background shadow-filled flex justify-between items-center">
      {/* Logo - small on mobile, large on sm+ */}
      <a className="flex sm:hidden items-center cursor-pointer" href="/" aria-label="Avaleht">
        <Image src={logo_small} alt="ITÜK | TalTechi IT-teaduskonna üliõpilaskogu" height={56} width={56} priority />
      </a>
      <a className="hidden sm:flex items-center cursor-pointer" href="/" aria-label="Avaleht">
        <Image src={logo_large} alt="ITÜK | TalTechi IT-teaduskonna üliõpilaskogu" height={56} width={225} priority />
      </a>

      {/* Desktop nav (≥1280px / xl): All buttons */}
      <div className="items-center gap-8 hidden xl:flex">
        <Button variant="tertiary" size="lg" text={dictionary.aboutus} to="/meist" />
        <Button variant="tertiary" size="lg" text={dictionary.events} to="/uritused" />
        <Button variant="tertiary" size="lg" text={dictionary.partners} to="/partnerlus" />
        <Button variant="tertiary" size="lg" text={dictionary.rent} to="/rent" />
        <Button variant="primary" size="lg" text={dictionary.join} to="https://liitu.ituk.ee/" />
        <LanguageButton />
      </div>

      {/* Tablet/Mobile nav (<1280px): Join (md+), Language, Hamburger */}
      <div className="items-center gap-8 flex xl:hidden">
        <Button variant="primary" size="lg" text={dictionary.join} to="https://liitu.ituk.ee/" className="hidden md:flex" />
        <LanguageButton />
        <HamburgerMenu isOpen={isMenuOpen} onClick={toggleMenu} />
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 top-[88px] bg-background/95 z-30 flex flex-col items-center justify-center gap-8"
          onClick={toggleMenu}
        >
          <Button variant="tertiary" size="lg" text={dictionary.aboutus} to="/meist" />
          <Button variant="tertiary" size="lg" text={dictionary.events} to="/uritused" />
          <Button variant="tertiary" size="lg" text={dictionary.partners} to="/partnerlus" />
          <Button variant="tertiary" size="lg" text={dictionary.rent} to="/rent" />
          <Button variant="primary" size="lg" text={dictionary.join} to="https://liitu.ituk.ee/" className="md:hidden" />
        </div>
      )}
    </header>
  );
}