"use client";

import { db } from '@/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { DocumentData } from 'firebase/firestore';
import Card from "@/components/cards/card";
import { useDictionary } from '@/components/dictionary-provider';

interface Rent {
  name: string;
  price: number;
  unit: string;
  imagePath: string;
}

export default function Home() {
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
      <div className="justify-center items-center bg-rent-bg bg-center bg-cover flex-row flex">
        <div className=" w-full h-full bg-extra justify-center items-center flex-row flex">
          <div className="main-padding w-full h-full bg-epic-gradient">
            <h1 className="text-center big">{dictionary.header}</h1>
          </div>
        </div>
      </div>

      <div className="main-padding gap-16 flex-col flex">
        <ol className="flex-col flex gap-8">
          <li>{dictionary.request}<a className="font-bold underline" href="mailto:kontakt@ituk.ee?subject=Tehnika rent - [ürituse nimi]&body=Tervist,%0A%0ASoovin rentida tehnikat üritusele [ürituse nimi] kuupäevadel [kuupäev].%0A%0ALugupidamisega">kontakt@ituk.ee</a></li>
          <li>{dictionary.NB}</li>
        </ol>

        <div className="grid min-w-full grid-cols-[repeat(auto-fit,minmax(17.75rem,1fr))] gap-16">
          {rentables.map((rent) => (
            <Card title={rent.name} image={rent.imagePath} description={rent.price.toString() + " " + rent.unit} board={false} />
          ))}
        </div>
      </div>
    </div>
  )
}