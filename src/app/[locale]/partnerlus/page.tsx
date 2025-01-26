"use client"

import { db } from "@/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import Image from "next/image"
import netgroup from "@/assets/images/partners/netgroup.png"
import nortal from "@/assets/images/partners/nortal.png"
import { useDictionary } from "@/components/dictionary-provider";
import Card from "@/components/cards/card";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
  }, []);

  return (
    <div className="main-min">
      <div className="justify-center items-center bg-[url('/headers/cooperation.jpg')] bg-center bg-cover flex-row flex">
        <div className=" w-full h-full bg-extra justify-center items-center flex-row flex">
          <div className="main-padding w-full h-full bg-epic-gradient">
            <h1 className="text-center big">{dictionary.header}</h1>
          </div>
        </div>
      </div>

      <div className="main-padding items-center flex-col flex gap-16">
        <h2 className="text-center">{dictionary.partners}</h2>
        <div className="w-full justify-center items-center flex-col md:flex-row flex gap-16">
          <Link href="https://nortal.com/" className="self-stretch main-padding h-full md:w-1/2 bg-nortal rounded-2xl flex-col justify-center items-center flex">
            <Image src={nortal} alt="Nortal" />
          </Link>
          <Link href="https://netgroup.com/" className="self-stretch main-padding h-full md:w-1/2 bg-netgroup rounded-2xl flex-col justify-center items-center flex">
            <Image src={netgroup} alt="Netgroup" />
          </Link>
        </div>
      </div>

      <div className="main-padding items-center flex-col flex gap-16">
        <h2 className="text-center">{dictionary.studentorgs}</h2>
        <div className="grid min-w-full grid-cols-1 gap-8 xs:grid-cols-2 lg:grid-cols-4">
          {studentOrgs.map((partner, index) => (
            <Card key={index} link={partner.link} title={currentLocale === "en" ? partner.en_name : partner.name} image={partner.imagePath} listItems={partner.projects} type="list" />
          ))}
        </div>
      </div>

      <div className="main-padding bg-primary justify-center items-center gap-16 flex-col xl:flex-row flex">
        <h2 className="text-center w-full">{dictionary.offer}</h2>
        <div className=" justify-between items-center flex-col md:flex-row flex gap-16">
          <p className="items-center flex-col flex gap-4 transform transition-transform duration-150 hover:scale-125 hover:select-none">
            <span className="big font-bold">{dictionary.statistics.stat1.title}</span>
            {dictionary.statistics.stat1.description}
          </p>
          <p className="items-center flex-col flex gap-4 transform transition-transform duration-150 hover:scale-125 hover:select-none">
            <span className="big font-bold">{dictionary.statistics.stat2.title}</span>
            {dictionary.statistics.stat2.description}
          </p>
          <p className="items-center flex-col flex gap-4 transform transition-transform duration-150 hover:scale-125 hover:select-none">
            <span className="big font-bold">{dictionary.statistics.stat3.title}</span>
            {dictionary.statistics.stat3.description}
          </p>
          <p className="items-center flex-col flex gap-4 transform transition-transform duration-150 hover:scale-125 hover:select-none">
            <span className="big font-bold">{dictionary.statistics.stat4.title}</span>
            {dictionary.statistics.stat4.description}
          </p>
        </div>
      </div>

      <div className="main-padding justify-center items-center gap-16 flex-col flex">
        <h2 className="text-center">{dictionary.wish}</h2>
        <p className="text-center">{dictionary.goal}</p>
        <h3 className="text-center">{dictionary.contact} <a className="contact underline hover:decoration-primary" href="mailto:kontakt@ituk.ee">kontakt@ituk.ee</a> {dictionary.contact2}</h3>
      </div>
    </div>
  )
}