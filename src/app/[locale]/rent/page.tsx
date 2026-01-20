"use client";

import { db } from '@/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { DocumentData } from 'firebase/firestore';
import Card from "@/components/cards/card";
import { useDictionary } from '@/components/dictionary-provider';
import { usePathname } from 'next/navigation';
import PageHeader from "@/components/page-header";

interface Rent {
  name: string;
  en_name: string;
  price: number;
  unit: string;
  imagePath: string;
}

export default function Home() {
  const pathname = usePathname();
  const currentLocale = pathname?.split("/")[1];

  //get dictionary
  const dictionary = useDictionary().rent;

  const [rentables, setRentables] = useState<Rent[]>([]);

  const getRentables = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "rent"))
      );
      const rent: Rent[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          name: data.name,
          en_name: data.name_en,
          price: data.price,
          unit: data.unit,
          imagePath: data.imagePath,
        };
      });
      setRentables(rent);
    } catch (error) {
      console.error('Error getting members: ', error);
      throw error;
    }
  };

  useEffect(() => {
    getRentables();
  }, []);

  return (
    <div>
      <PageHeader title={dictionary.header} backgroundImage="/headers/rent.jpg" />

      <div className="section-padding container-content gap-16 flex-col lg:flex-row flex">
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <h2>{dictionary.title}</h2>
          <p>{dictionary.description}</p>
          <p>{dictionary.request}<a className="font-bold underline hover:text-primary" href="mailto:kontakt@ituk.ee?subject=Tehnika rent - [ürituse nimi]&body=Tervist,%0A%0ASoovin rentida tehnikat üritusele [ürituse nimi] kuupäevadel [kuupäev].%0A%0ALugupidamisega">kontakt@ituk.ee</a></p>
          <p className="text-sm text-gray">{dictionary.NB}</p>
        </div>

        <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {rentables.map((rent, index) => (
            <Card key={index} title={currentLocale === "en" ? rent.en_name : rent.name} image={rent.imagePath} listItems={[rent.price.toString() + " " + rent.unit]} type="list" />
          ))}
        </div>
      </div>
    </div>
  )
}