"use client";

import { useEffect, useState, useCallback } from "react";
import { db } from "@/firebase";
import { query, collection, where, getDocs, DocumentData, doc, orderBy } from "firebase/firestore";
import Gallery from "@/components/gallery/gallery";
import Loading from "@/components/animations/loading";
import Card from "@/components/cards/card";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Event {
  category: string;
  banner: string;
  name: string;
  description: string;
  gallery?: { src: string; name: string }[];
  links?: Map<string, Map<string, string>>;
}

interface EventYear {
  key: string;
  banner: string;
  date: string;
  description: string;
  handle: string;
  gallery?: string[];
  title: string;
}

export default function EventPage({
  params: paramsPromise,
}: {
  params: Promise<{ event: string }>;
}) {
  const [curEvent, setCurEvent] = useState<Event | null>(null);
  const [eventHandle, setEventHandle] = useState<string | null>(null);
  const [eventYears, setEventYears] = useState<EventYear[]>([]);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    async function unwrapParams() {
      const params = await paramsPromise;
      setEventHandle(params.event);
    }
    unwrapParams();
  }, [paramsPromise]);

  const getEvent = useCallback(async () => {
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
          description: data.description,
          gallery,
          links,
        };
      });

      try {
        const eventRef = doc(db, "events", querySnapshot.docs[0].id);
        const yearQuerySnapshot = await getDocs(
          query(collection(eventRef, "years"), orderBy("date", "desc"))
        );
        const eventYears: EventYear[] = yearQuerySnapshot.docs.map((doc) => {
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
        setEventYears(eventYears);
      } catch (error) {
        console.error("Error getting members: ", error);
        throw error;
      }

      setCurEvent(events[0]);
    } catch (error) {
      console.error("Error getting event: ", error);
    }
  }, [eventHandle]);

  const getImages = () => eventYears.map((year) => (
    year.gallery?.map((image) => (
      setImages(oldArray => [...oldArray, image])
    ))
  ))

  useEffect(() => {
    getEvent();
  }, [getEvent]);

  useEffect(() => {
    getImages();
  }, [curEvent])

  if (curEvent) {
    return (
      <div>
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
            <div className="w-full justify-start items-start flex-col md:flex-row flex gap-16">
              <div className="w-full justify-center items-start flex-col flex gap-16">
                <h2>Kirjeldus</h2>
                <p>{curEvent.description}</p>
              </div>
            </div>

            {eventYears ? (
              <div className="w-full justify-center items-start flex-col flex gap-8">
                <h2>Varasemad üritused</h2>
                <div className="justify-center items-center flex-col sm:flex-row flex gap-16">
                  {eventYears.map((year) => (
                    <Link key={year.key} href={`${usePathname()}/${year.handle}`}>
                      <Card title={year.title} image={year.banner} description={year.description} board={false} />
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full justify-center items-start flex-col flex gap-8">
                <h2>Varasemad üritused</h2>
                <p className="italic">Ei ole üritusi, mida näidata. Tõenäoliselt puudus avalik reklaam üritustele (nt siseüritused), või üritusi ei toimunud.</p>
              </div>
            )}

            <div className="justify-center items-center flex-col sm:flex-row flex gap-16">
              {images && images.map((image, index) => (
                  <div key={index}>
                    <img src={image} alt={`Gallery image ${index + 1}`} />
                  </div>
              ))}
            </div>

            {curEvent.gallery && curEvent.gallery.length > 0 ? (
              <div className="justify-center items-start flex-col flex gap-8">
                <h2>Galerii</h2>
                <Gallery photos={curEvent.gallery} />
              </div>
            ) : (
              <div className="justify-center items-start flex-col flex gap-8">
                <h2>Galerii</h2>
                <p className="italic">Ei ole pilte, mida näidata.</p>
              </div>
            )}
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