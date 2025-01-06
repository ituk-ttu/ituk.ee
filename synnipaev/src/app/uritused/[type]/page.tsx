"use client";

import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import Link from "next/link";

interface Event {
  key: string;
  handle: string;
  category: string;
  banner: string;
  name: string;
  description: string;
  gallery: string[];
  links: Map<string, string>;
}

export default function Home({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const [events, setEvents] = useState<Event[]>([]);

  const getEvents = async () => {
    try {
      const q = query(
        collection(db, "events"),
        where("category", "==", (await params).type)
      );
      const querySnapshot = await getDocs(q);
      const events: Event[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          key: doc.id,
          handle: data.handle,
          category: data.category,
          banner: data.banner,
          name: data.name,
          description: data.description,
          gallery: data.gallery,
          links: new Map(Object.entries(data.links)),
        };
      });
      setEvents(events);
    } catch (error) {
      console.error("Error getting members: ", error);
      throw error;
    }
  };

  useEffect(() => {
    console.log("ABCDEFG");
    getEvents();
  }, []);

  if (events.length === 0) {
    <div className="main-height items-start flex-row flex">
      <h2>No events found!</h2>
    </div>;
  }

  if (events.length <= 3) {
    return (
      <div className="grid min-w-full grid-cols-[repeat(auto-fit,minmax(33.33%,1fr))]">
        {events.map((event, index) => (
          <div
            id={index.toString()}
            className="main-height justify-center items-center bg-center bg-cover bg-[url('@/assets/images/events/sisekad.jpg')] flex-col flex"
            style={{ backgroundImage: `url(${event.banner})` }}
          >
            <div className="main-height w-full bg-black/50 hover:bg-primary/50 transition-colors duration-150 ease-in-out justify-center items-center flex-row flex">
              <h2 className="title text-center">{event.name}</h2>
            </div>
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div className="grid min-w-full grid-cols-[repeat(auto-fit,minmax(33.33%,1fr))]">
        {events.map((event, index) => (
          <Link
            href={"/uritused/" + event.category + "/" + event.handle}
            id={index.toString()}
            className="event-height justify-center items-center bg-center bg-cover bg-[url('@/assets/images/events/sisekad.jpg')] flex-col flex"
            style={{ backgroundImage: `url(${event.banner})` }}
          >
            <div className="event-height w-full bg-black/50 hover:bg-primary/50 transition-colors duration-150 ease-in-out justify-center items-center flex-row flex">
              <h2 className="title text-center">{event.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    );
  }
}
