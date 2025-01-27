"use client";

import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import { DocumentData } from "firebase/firestore";
import Link from "next/link";
import Loading from "@/components/animations/loading";
import { usePathname } from "next/navigation";

interface Event {
  key: string;
  handle: string;
  category: string;
  banner: string;
  name: string;
  en_name: string;
}

export default function EventType({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [category, setCategory] = useState<string>("");

  const pathname = usePathname();
  const currentLocale = pathname?.split("/")[1];

  const categoryTitles: Record<string, string> = {
    haridus: "Hariduslikud üritused",
    meelelahutus: "Meelelahutuslikud üritused",
    muu: "Sise- ja muud üritused",
  };

  const getEvents = useCallback(async () => {
    try {
      const resolvedParams = await params;
      setCategory(resolvedParams.type);

      const q = query(
        collection(db, "events"),
        where("category", "==", resolvedParams.type)
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
          en_name: data.name_en,
        };
      });
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error getting events: ", error);
    }
  }, [params]);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  return (
    <div>
      <h1 className="hidden">{categoryTitles[category]}</h1>
      {events.length === 0 ? (
        <div className="main-min justify-center items-center flex-col flex gap-8">
          <h2>Laeb...</h2>
          <Loading />
        </div>
      ) : (
        <div
          className={`main-min ${events.length <= 3
            ? "items-start flex-col sm:flex-row flex"
            : "grid grid-cols-[repeat(auto-fit,minmax(100%,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(33.3333%,1fr))]"
            }`}
        >
          {events.map((event) => {
            const linkClass =
              events.length <= 3
                ? "w-full sm:h-[calc(100vh-88px)] sm:w-1/3 justify-center items-center bg-center bg-cover flex-col flex"
                : "w-full sm:h-[calc(50vh-44px)] justify-center items-center bg-center bg-cover flex-col flex";

            return (
              <Link
                key={event.key}
                href={`/uritused/${event.category}/${event.handle}`}
                className={linkClass}
                style={{ backgroundImage: `url(${event.banner})` }}
              >
                <div className="triple-height sm:h-screen w-full bg-black/50 hover:bg-primary/50 transition-colors duration-150 ease-in-out justify-center items-center flex-row flex">
                  <h2 className="p-8 lead text-center break-words text-wrap">
                    {currentLocale === "en" ? event.en_name : event.name}
                  </h2>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}