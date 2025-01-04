import React from "react";
import email from "@/assets/icons/email.svg";
import phone from "@/assets/icons/phone.svg";
import location from "@/assets/icons/location.svg";
import hub from "@/assets/logos/ituk_hub.svg";
import Image from "next/image";
import Link from "next/link";
import FacebookLink from "./buttons/socials/Facebook";
import InstagramLink from "./buttons/socials/Instagram";
import GitHubLink from "./buttons/socials/Github";

export default function Footer() {
  return (
    <footer className="main-container main-padding dark shadow-filled justify-between items-center flex-col gap-auto md:flex-row gap-32 md:gap-auto flex">
      <div className="justify-between items-start gap-8 flex-col flex">
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
      <div className="justify-between items-center md:items-end gap-8 flex-col flex">
        <div className="justify-between items-center gap-6 flex-row flex">
          <FacebookLink />
          <div className="w-[2px] h-[24px] bg-light" />
          <InstagramLink />
          <div className="w-[2px] h-[24px] bg-light" />
          <GitHubLink />
        </div>
        <div className="justify-between items-center gap-6 flex-row flex">
          <Link href="https://hub.ituk.ee/">
            <Image src={hub} alt="Hub" />
          </Link>
          <Link href="/stiil">
            <p className="font-bold underline">Stiiliraamat</p>
          </Link>
        </div>
        <p className="font-bold">© ITÜK 2016-2024</p>
      </div>
    </footer>
  );
}
