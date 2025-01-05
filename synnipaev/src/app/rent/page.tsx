"use client";

import {db} from '@/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { DocumentData } from 'firebase/firestore';
import Card from "@/components/card";

interface Rent {
    name: string;
    price: number;
    unit: string;
    imagePath: string;
}

export default function Home() {
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
                <div className="main-padding w-full h-full bg-epic-gradient justify-center items-center flex-row flex">
                    <h1 className="big">Tehnika rent</h1>
                </div>
            </div>

            <div className="flex flex-row items-center px-16 py-32 gap-16">
                <p>Tehnika rentimiseks kirjuta: kontakt@ituk.ee<br/><br/>
                    Soovin rentida tehnikat üritusele /ürituse nimi/ kuupäevadel /kuupäev/.<br/><br/>
                    NB! Hind kehtib ürituse/päeva kohta!
                </p>

                <div className="flex flex-row gap-8">
                    {rentables.map((rent) => (
                        <Card title={rent.name} image={rent.imagePath} description={rent.price.toString() + " " + rent.unit} width={288} height={384}/>
                    ))}
                </div>
            </div>
        </div>
    )
}