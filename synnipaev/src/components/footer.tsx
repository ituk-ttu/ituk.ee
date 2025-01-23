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
          <p className="font-bold underline">kontakt@ituk.ee</p>
        </div>
        <div className="justify-start items-center gap-4 flex-row flex">
          <Image src={phone} alt="Phone number" />
          <p className="font-bold underline">+372 5693 1193</p>
        </div>
        <div className="justify-start items-center gap-4 flex-row flex">
          <Image src={location} alt="Our office" />
          <p className="font-bold underline">
            ICO-210, Raja 4c, Tallinn, Harjumaa
          </p>
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
          <Link href="/stiil">
            <p className="font-bold underline">{dictionary.style}</p>
          </Link>
        </div>
        <p className="font-bold">© ITÜK 2017-2025</p>
      </div>
    </footer>
  );
}