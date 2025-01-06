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
    <div className="main-min items-start flex-row flex">
      <h2>No events found!</h2>
    </div>;
  }

  if (events.length <= 3) {
    return (
      <div className="main-min items-start flex-col sm:flex-row flex">
        {events.map((event, index) => (
          <Link href={"/uritused/" + event.category + "/" + event.handle} id={index.toString()}
            className="w-full sm:w-1/3 justify-center items-center bg-center bg-cover bg-[url('@/assets/images/events/sisekad.jpg')] flex-col flex" style={{ backgroundImage: `url(${event.banner})` }}
          >
            <div className="triple-height sm:h-screen main-max w-full bg-black/50 hover:bg-primary/50 transition-colors duration-150 ease-in-out justify-center items-center flex-row flex">
              <h2 className="p-8 title text-center">{event.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    );
  } else {
    return (
      <div className="main-min grid grid-cols-[repeat(auto-fit,minmax(100%,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(33.3333%,1fr))]">
        {events.map((event, index) => (
          <Link
            href={"/uritused/" + event.category + "/" + event.handle}
            id={index.toString()}
            className="w-full justify-center items-center bg-center bg-cover bg-[url('@/assets/images/events/sisekad.jpg')] flex-col flex"
            style={{ backgroundImage: `url(${event.banner})` }}
          >
            <div className="triple-height sm:h-screen double-max w-full bg-black/50 hover:bg-primary/50 transition-colors duration-150 ease-in-out justify-center items-center flex-row flex">
              <h2 className="p-8 title text-center">{event.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    );
  }
}
