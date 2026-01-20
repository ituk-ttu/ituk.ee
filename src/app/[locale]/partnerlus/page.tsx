"use client"

import { db } from "@/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import { DocumentData } from "firebase/firestore";
import Image from "next/image"
import netgroup from "@/assets/images/partners/netgroup.png"
import nortal from "@/assets/images/partners/nortal.png"
import alecoq from "@/assets/images/partners/alecoq.png"
import ctaImage from "@/assets/images/koostoo.jpg"
import dominos from "@/assets/images/partners/dominos.png"
import { useDictionary } from "@/components/dictionary-provider";
import Card from "@/components/cards/card";
import { usePathname } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import Statistics from "@/components/statistics";

interface SocialStats {
  instagram: number;
  facebook: number;
  discord: number;
}

interface StudentOrg {
  name: string;
  en_name: string;
  imagePath: string;
  link: string;
  projects?: string[];
}

export default function Home() {
  const pathname = usePathname();
  const currentLocale = pathname?.split("/")[1];

  const dictionary = useDictionary().partners;

  const [studentOrgs, setStudentOrgs] = useState<StudentOrg[]>([]);
  const [socialStats, setSocialStats] = useState<SocialStats>({
    instagram: 1070,
    facebook: 1900,
    discord: 320
  });

  const fetchSocialStats = useCallback(async () => {
    try {
      const response = await fetch('/api/social-stats');
      if (response.ok) {
        const data = await response.json();
        setSocialStats({
          instagram: data.instagram,
          facebook: data.facebook,
          discord: data.discord
        });
      }
    } catch (error) {
      console.error("Error fetching social stats:", error);
    }
  }, []);

  const getStudentOrgs = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "partners"), orderBy("name", "asc"))
      );
      const orgs: StudentOrg[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          name: data.name,
          en_name: data.name_en,
          imagePath: data.imagePath,
          link: data.link,
          projects: data.projects,
        };
      });
      setStudentOrgs(orgs);
    } catch (error) {
      console.error("Error getting partners: ", error);
      throw error;
    }
  };
  useEffect(() => {
    getStudentOrgs();
    fetchSocialStats();
  }, [fetchSocialStats]);

  return (
    <div>
      <PageHeader title={dictionary.header} backgroundImage="/headers/cooperation.jpg" />

      <div className="section-padding container-content items-center flex-col flex gap-8">
        <h2 className="text-center">{dictionary.partners}</h2>
        <div className="w-full flex flex-col sm:flex-row items-stretch gap-8">
          <Link target="_blank" href="https://nortal.com/" className="flex-1 h-24 sm:h-32 p-4 bg-nortal rounded-2xl flex justify-center items-center overflow-hidden">
            <Image src={nortal} alt="Nortal" className="object-contain w-full h-full" />
          </Link>
          <Link target="_blank" href="https://netgroup.com/" className="flex-1 h-24 sm:h-32 p-4 bg-netgroup rounded-2xl flex justify-center items-center overflow-hidden">
            <Image src={netgroup} alt="Netgroup" className="object-contain w-full h-full" />
          </Link>
          <Link target="_blank" href="https://www.alecoq.ee/" className="flex-1 h-24 sm:h-32 p-4 bg-alecoq rounded-2xl flex justify-center items-center overflow-hidden">
            <Image src={alecoq} alt="A.LeCoq" className="object-contain w-full h-full" />
          </Link>
          <Link target="_blank" href="https://dominospizza.ee/" className="flex-1 h-24 sm:h-32 p-4 bg-dominos rounded-2xl flex justify-center items-center overflow-hidden">
            <Image src={dominos} alt="Domino's" className="object-contain w-full h-full" />
          </Link>
        </div>
      </div>

      <div className="section-padding container-content items-center flex-col flex gap-8">
        <h2 className="text-center break-all">{dictionary.studentorgs}</h2>
        <div className="grid min-w-full grid-cols-1 gap-8 xs:grid-cols-2 lg:grid-cols-4">
          {studentOrgs.map((partner, index) => (
            <Card key={index} link={partner.link} title={currentLocale === "en" ? partner.en_name : partner.name} image={partner.imagePath} listItems={partner.projects} type="list" />
          ))}
        </div>
      </div>

      <Statistics
        title={dictionary.offer}
        items={[
          { value: socialStats.instagram.toString(), label: dictionary.statistics.stat1.description },
          { value: socialStats.facebook.toString(), label: dictionary.statistics.stat2.description },
          { value: socialStats.discord.toString(), label: dictionary.statistics.stat3.description },
          { value: dictionary.statistics.stat4.title, label: dictionary.statistics.stat4.description },
        ]}
      />

      <div className="section-padding container-content justify-center items-center gap-16 flex-col md:flex-row flex">
        <div className="w-full md:w-1/2 flex flex-col gap-8">
          <h2>{dictionary.wish}</h2>
          <p>{dictionary.goal}</p>
          <h3>{dictionary.contact} <a className="text-primary underline hover:brightness-125" href="mailto:kontakt@ituk.ee">kontakt@ituk.ee</a> {dictionary.contact2}</h3>
        </div>
        <div className="w-full md:w-1/2">
          <Image src={ctaImage} alt="" className="rounded-2xl object-cover w-full h-72" />
        </div>
      </div>
    </div>
  )
}