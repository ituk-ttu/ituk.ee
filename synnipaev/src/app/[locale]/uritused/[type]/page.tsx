"use client";

import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import { DocumentData } from "firebase/firestore";
import Link from "next/link";
import Metadata from "@/components/metadata";
import Loading from "@/components/loading";

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
  params: { type: string }; // `params` is directly passed as an object, not a Promise
}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [category, setCategory] = useState<string>("");

  // Mapping for categories to titles
  const categoryTitles: Record<string, string> = {
    haridus: "Hariduslikud üritused",
    meelelahutus: "Meelelahutuslikud üritused",
    muu: "Sise- ja muud üritused",
  };

  // Memoize getEvents to prevent unnecessary re-renders
  const getEvents = useCallback(async () => {
    try {
      const { type } = params;
      setCategory(type); // Set the category based on params

      const q = query(
        collection(db, "events"),
        where("category", "==", type)
      );
      const querySnapshot = await getDocs(q);
      const fetchedEvents: Event[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          key: doc.id,
          handle: data.handle,
          category: data.category,
          banner: data.banner,
          name: data.name,
        };
      });
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error getting events: ", error);
    }
  }, [params]); // useCallback ensures the function is memoized and only changes when `params` change

  // Trigger the effect when params change
  useEffect(() => {
    getEvents();
  }, [getEvents]);

  return (
    <div>
      <Metadata
        title={categoryTitles[category] + " | TalTechi IT-teaduskonna üliõpilaskogu"}
        description="Discover the events organized by ITÜK!"
        image={`/banners/${category}_banner.jpg`}
        url={`https://ituk.ee/uritused/${category}`}
      />
      <h1 className="hidden">{categoryTitles[category]}</h1>

      {events.length === 0 ? (
        <div className="main-min justify-center items-center flex-col flex gap-8">
          <h2>Laeb...</h2>
          <Loading />
        </div>
      ) : (
        <div className={`main-min ${events.length <= 3 ? 'items-start flex-col sm:flex-row flex' : 'grid grid-cols-[repeat(auto-fit,minmax(100%,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(33.3333%,1fr))]'}`}>
          {events.map((event, index) => {
            const eventClass =
              events.length <= 3
                ? "triple-height sm:h-screen main-max w-full bg-black/50 hover:bg-primary/50 transition-colors duration-150 ease-in-out justify-center items-center flex-row flex"
                : "triple-height sm:h-screen double-max w-full bg-black/50 hover:bg-primary/50 transition-colors duration-150 ease-in-out justify-center items-center flex-row flex";
            const linkClass =
              events.length <= 3
                ? "w-full sm:w-1/3 justify-center items-center bg-center bg-cover flex-col flex"
                : "w-full justify-center items-center bg-center bg-cover bg-flex-col flex";

            return (
              <Link
                key={event.key}
                href={`/uritused/${event.category}/${event.handle}`}
                className={linkClass}
                style={{ backgroundImage: `url(${event.banner})` }}
              >
                <div className={eventClass}>
                  <h2 className="p-8 title text-center">{event.name}</h2>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
