"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  query,
  collection,
  where,
  getDocs,
  DocumentData,
  documentId,
} from "firebase/firestore";
import Button from "@/components/buttons/button";
import Image from "next/image";

interface Event {
  category: string;
  banner: string;
  name: string;
  description: string;
  gallery?: string[];
  links?: Map<string, string>;
}

export default function Home({
  params,
}: {
  params: Promise<{ event: string }>;
}) {
  const [curEvent, setCurEvent] = useState<Event>();

  const getEvent = async () => {
    try {
      const q = query(
        collection(db, "events"),
        where("handle", "==", (await params).event)
      );
      const querySnapshot = await getDocs(q);
      const events: Event[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          category: data.category,
          banner: data.banner,
          name: data.name,
          description: data.description,
          gallery: data.gallery ? data.gallery : undefined,
          links: data.links ? new Map(Object.entries(data.links)) : undefined,
        };
      });
      setCurEvent(events[0]);
    } catch (error) {
      console.error("Error getting members: ", error);
      throw error;
    }
  };

  useEffect(() => {
    getEvent();
  }, []);

  if (curEvent) {
    return (
      <div className="flex flex-col items-center">
        <div
          className="items-center justify-center h-full w-full bg-center bg-cover flex-row flex"
          style={{ backgroundImage: `url(${curEvent.banner})` }}
        >
          <div className="main-padding w-full bg-black/50 justify-center items-center flex-row flex">
            <h1 className="big text-center">{curEvent.name}</h1>
          </div>
        </div>

        <div className="main-padding w-full justify-center items-start flex-col flex gap-16">
          <p>{curEvent.description}</p>

          {curEvent.links ? (
            <div className="justify-center items-start flex-col flex gap-8">
              <h3>Varasemad üritused</h3>
              <div className="justify-start items-center flex-row flex gap-8">
                {Array.from(curEvent.links.entries()).map(([key, value]) => (
                  <Button variant="primary" text={key} to={value} />
                ))}
              </div>
            </div>
          ) : (
            <></>
          )}
          {curEvent.gallery ? (
            <div className="justify-center items-start flex-col flex gap-8">
              <h3>Galerii</h3>
              <div className="">
                {curEvent.gallery.map((image) => (
                  <Image src={image} alt="Image" width={512} height={280} />
                ))}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  }
}
