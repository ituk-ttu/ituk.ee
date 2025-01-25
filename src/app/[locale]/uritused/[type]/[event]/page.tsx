"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { query, collection, where, getDocs, DocumentData, doc, orderBy } from "firebase/firestore";
import Loading from "@/components/animations/loading";
import Card from "@/components/cards/card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDictionary } from "@/components/dictionary-provider";

interface Event {
  category: string;
  banner: string;
  name: string;
  en_name: string;
  description: string;
  en_description: string;
  gallery?: { src: string; name: string }[];
  links?: Map<string, Map<string, string>>;
}

interface EventYear {
  key: string;
  banner: string;
  date: string;
  description: string;
  extraInformation?: string;
  handle: string;
  gallery?: Map<string, string>;
  title: string;
}

export default function EventPage({
  params: paramsPromise,
}: {
  params: Promise<{ event: string }>;
}) {
  const pathname = usePathname();
  const currentLocale = pathname?.split("/")[1];

  const dictionary = useDictionary().event;

  const [curEvent, setCurEvent] = useState<Event | null>(null);
  const [eventHandle, setEventHandle] = useState<string | null>(null);
  const [eventYears, setEventYears] = useState<EventYear[]>([]);
  const [images, setImages] = useState<Map<string, string>>();

  useEffect(() => {
    async function unwrapParams() {
      const params = await paramsPromise;
      setEventHandle(params.event);
    }
    unwrapParams();
  }, [paramsPromise]);

  const getEvent = async () => {
    if (!eventHandle) return;

    try {
      const q = query(
        collection(db, "events"),
        where("handle", "==", eventHandle)
      );
      const querySnapshot = await getDocs(q);

      const events: Event[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;

        const gallery = data.gallery
          ? (data.gallery as string[]).map((src: string, index: number) => ({
            src,
            name: `Image ${index + 1}`,
          }))
          : undefined;

        const links =
          data.links && typeof data.links === "object"
            ? new Map(
              Object.entries(data.links).map(([year, events]) => [
                year,
                new Map(
                  Object.entries(events as Record<string, string>)
                ),
              ])
            )
            : undefined;

        return {
          category: data.category,
          banner: data.banner,
          name: data.name,
          en_name: data.name_en,
          description: data.description,
          en_description: data.description_en,
          gallery,
          links,
        };
      });

      try {
        const eventRef = doc(db, "events", querySnapshot.docs[0].id);
        const yearQuerySnapshot = await getDocs(
          query(collection(eventRef, "years"), orderBy("date", "desc"))
        );
        const _eventYears: EventYear[] = yearQuerySnapshot.docs.map((doc) => {
          const data = doc.data() as DocumentData;
          return {
            key: doc.id,
            banner: data.banner,
            date: data.date,
            description: data.description,
            gallery: data.gallery ? data.gallery : undefined,
            handle: data.handle,
            title: data.title
          };
        });
        setEventYears(_eventYears);
      } catch (error) {
        console.error("Error getting members: ", error);
        throw error;
      }

      setCurEvent(events[0]);
      getImages();
    } catch (error) {
      console.error("Error getting event: ", error);
    }
  };

  const getImages = () => (
    eventYears.map((year) => (
      year.gallery?.forEach((title, image) => {
        const newMap = new Map(images);
        newMap.set(title, image)
        setImages(newMap)
        console.log(images)
      }
      ))
    ))

  useEffect(() => {
    getEvent();
  }, [getEvent]);

  if (curEvent) {
    return (
      <div>
        <div className="flex flex-col items-center">
          <div
            className="items-center justify-center h-full w-full bg-center bg-cover flex-row flex"
            style={{ backgroundImage: `url(${curEvent.banner})` }}
          >
            <div className="main-padding w-full bg-black/50 justify-center items-center flex-row flex">
              <h1 className="big text-center">{currentLocale === "en" ? curEvent.en_name : curEvent.name}</h1>
            </div>
          </div>

          <div className="main-padding w-full justify-center items-start flex-col flex gap-16">
            <div className="w-full justify-start items-start flex-col md:flex-row flex gap-16">
              <div className="w-full justify-center items-start flex-col flex gap-16">
                <h2>{dictionary.description}</h2>
                <div>
                  {(currentLocale === "en" ? curEvent.en_description : curEvent.description)
                    ?.split("\n")
                    .map((line, index) => (
                      <p key={index}>
                        {line}
                        <br />
                      </p>
                    ))}
                </div>

              </div>
            </div>

            {eventYears ? (
              <div className="w-full justify-center items-start flex-col flex gap-8">
                <h2>{dictionary.years}</h2>
                <div className="grid min-w-full grid-cols-[repeat(auto-fit,minmax(17.75rem,1fr))] gap-8">
                  {eventYears.map((year) => (
                    <Link key={year.key} href={`${usePathname()}/${year.handle}`}>
                      <Card title={year.title} image={year.banner} type="default" />
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full justify-center items-start flex-col flex gap-8">
                <h2>{dictionary.years}</h2>
                <p className="italic">{dictionary.noyears}</p>
              </div>
            )}

            <div className="justify-center items-center flex-col sm:flex-row flex gap-16">
              {images && Array.from(images.entries()).map(([title, image], index) => (
                <div key={index}>
                  <img src={image} alt={title} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-min justify-center items-center flex-col flex gap-8">
      <h2>Laeb...</h2>
      <Loading />
    </div>
  );
}