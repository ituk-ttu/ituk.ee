"use client";

import React, { useState } from "react";
import Image from "next/image";
import logo_large from "@/assets/logos/ituk_navbar_logo.svg";
import logo_small from "@/assets/logos/ituk_navbar_symbol.svg";
import Button from "@/components/buttons/button";
import NavigationLink from "@/components/buttons/NavigationLink";
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
    <header className="sticky top-0 z-50 w-full px-[6.9%] py-4 bg-dark shadow-filled justify-between items-center inline-flex">
      <a className="flex sm:hidden items-center cursor-pointer" href="/" aria-label="Avaleht">
        <Image src={logo_small} alt="ITÜK | TalTechi IT-teaduskonna üliõpilaskogu" />
      </a>
      <a className="hidden sm:flex items-center cursor-pointer" href="/" aria-label="Avaleht">
        <Image src={logo_large} alt="ITÜK | TalTechi IT-teaduskonna üliõpilaskogu" />
      </a>
      <div className="justify-start items-center gap-8 hidden lg:flex">
        <NavigationLink variant="tertiary" text={dictionary.aboutus} href="/meist" />
        <NavigationLink variant="tertiary" text={dictionary.events} href="/uritused" />
        <NavigationLink variant="tertiary" text={dictionary.partners} href="/partnerlus" />
        <NavigationLink variant="tertiary" text={dictionary.rent} href="/rent" />
        <Button variant="primary" text={dictionary.join} to="https://liitu.ituk.ee/" />
        <LanguageButton />
      </div>
      <HamburgerMenu className="flex lg:hidden" isOpen={isMenuOpen} onClick={toggleMenu} />
      {isMenuOpen && (
        <div
          className="fixed inset-0 top-[72px] bg-dark/90 z-30 flex flex-col items-center justify-center gap-4"
          onClick={toggleMenu}
        >
          <NavigationLink variant="tertiary" text={dictionary.aboutus} href="/meist" />
          <NavigationLink variant="tertiary" text={dictionary.events} href="/uritused" />
          <NavigationLink variant="tertiary" text={dictionary.partners} href="/partnerlus" />
          <NavigationLink variant="tertiary" text={dictionary.rent} href="/rent" />
          <div className="justify-center items-center flex-col flex gap-8">
            <Button variant="primary" text={dictionary.join} to="https://liitu.ituk.ee/" />
            <LanguageButton />
          </div>
        </div>
      )}
    </header>
  );
}