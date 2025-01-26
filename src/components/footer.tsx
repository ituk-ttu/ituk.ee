import React from "react";
import email from "@/assets/icons/email.svg";
import phone from "@/assets/icons/phone.svg";
import location from "@/assets/icons/location.svg";
import Image from "next/image";
import Link from "next/link";
import FacebookLink from "./buttons/socials/Facebook";
import InstagramLink from "./buttons/socials/Instagram";
import GitHubLink from "./buttons/socials/Github";
import HubLink from "./buttons/socials/Hub";
import { getDictionary } from "@/dictionaries/dictionaries";

export default function Footer({
  dictionary,
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>["footer"];
}) {

  return (
    <footer className="z-50 main-container main-padding dark shadow-filled justify-between items-center flex-col gap-auto md:flex-row gap-32 md:gap-auto flex">
      <div className="justify-between items-start gap-4 flex-col flex">
        <div className="justify-start items-center gap-4 flex-row flex">
          <Image src={email} alt="E-mail" />
          <a href="mailto:kontakt@ituk.ee" className="font-bold underline hover:decoration-primary">kontakt@ituk.ee</a>
        </div>
        <div className="justify-start items-center gap-4 flex-row flex">
          <Image src={phone} alt="Phone number" />
          <a href="tel:+37256931193" className="font-bold underline hover:decoration-primary">+372 5693 1193</a>
        </div>
        <div className="justify-start items-center gap-5 flex-row flex">
          <Image src={location} alt="Our office" />
          <a href="https://www.google.com/maps/place/TalTech+IT+College/@59.3954482,24.6617187,17z/data=!3m1!4b1!4m6!3m5!1s0x469295a90aee413b:0x4f990fb010829ae5!8m2!3d59.3954455!4d24.6642936!16s%2Fm%2F0j24704?entry=ttu&g_ep=EgoyMDI1MDEyMi4wIKXMDSoASAFQAw%3D%3D" className="font-bold underline hover:decoration-primary">
            ICO-210, Raja 4c, Tallinn, Harjumaa
          </a>
        </div>
      </div>
      <div className="justify-between items-center md:items-end gap-4 flex-col flex">
        <div className="justify-between items-center gap-6 flex-row flex">
          <FacebookLink />
          <div className="w-[2px] h-[24px] bg-light" />
          <InstagramLink />
          <div className="w-[2px] h-[24px] bg-light" />
          <GitHubLink />
        </div>
        <div className="justify-between items-center gap-6 flex-row flex">
          <HubLink />
          <Link href="/stiil" className="font-bold underline hover:decoration-primary">
            {dictionary.style}
          </Link>
        </div>
        <p className="font-bold">© ITÜK 2017-2025</p>
      </div>
    </footer>
  );
}
