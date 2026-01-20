import React from "react";
import Link from "next/link";
import SocialIcon from "@/components/icons/social-icon";
import HubButton from "@/components/buttons/hub-button";
import { getDictionary } from "@/dictionaries/dictionaries";

export default function Footer({
  dictionary,
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>["footer"];
}) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="z-50 w-full py-[clamp(2rem,4vw,4rem)] px-[clamp(1rem,4vw,4rem)] bg-background shadow-filled flex flex-col sm:flex-row flex-wrap justify-between items-center gap-8 sm:gap-16">
      {/* Contact Info */}
      <div className="flex flex-col gap-4 items-start">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-white text-xl">mail</span>
          <a href="mailto:kontakt@ituk.ee" className="font-bold underline hover:decoration-primary">
            kontakt@ituk.ee
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-white text-xl">call</span>
          <a href="tel:+37258517633" className="font-bold underline hover:decoration-primary">
            +372 5851 7633
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-white text-xl">location_on</span>
          <a href="https://www.google.com/maps/place/TalTech+IT+College/@59.3954482,24.6617187,17z/data=!3m1!4b1!4m6!3m5!1s0x469295a90aee413b:0x4f990fb010829ae5!8m2!3d59.3954455!4d24.6642936!16s%2Fm%2F0j24704?entry=ttu&g_ep=EgoyMDI1MDEyMi4wIKXMDSoASAFQAw%3D%3D" className="font-bold underline hover:decoration-primary">
            ICO-210, Raja 4c, Tallinn
          </a>
        </div>
      </div>

      {/* Organization Data */}
      <div className="flex flex-col gap-4 items-center text-center">
        <p className="font-bold">MTÜ FOR Tsükkel</p>
        <p className="font-bold">Registrikood: 80391807</p>
        <p className="font-bold">LHV EE617700771002582855</p>
      </div>

      {/* Social Media & Links */}
      <div className="flex flex-col gap-4 items-end">
        <div className="flex items-center gap-6">
          <SocialIcon platform="facebook" href="https://www.facebook.com/ituk.taltech/" />
          <div className="w-[2px] h-6 bg-white" />
          <SocialIcon platform="instagram" href="https://www.instagram.com/ituk.taltech/" />
          <div className="w-[2px] h-6 bg-white" />
          <SocialIcon platform="github" href="https://www.github.com/ituk-ttu/" />
        </div>
        <div className="flex items-center justify-between w-full gap-6">
          <HubButton />
          <Link href="/stiil" className="font-bold underline hover:decoration-primary">
            {dictionary.style}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-white text-base">copyright</span>
          <p className="font-bold">ITÜK 2017-{currentYear}</p>
        </div>
      </div>
    </footer>
  );
}
