"use client";

import { useEffect, useState, useCallback } from "react";
import { db } from "@/firebase";
import { query, collection, where, getDocs, DocumentData } from "firebase/firestore";
import Button from "@/components/buttons/button";
import Gallery from "@/components/gallery/gallery";
import Loading from "@/components/animations/loading";

interface Event {
  category: string;
  banner: string;
  name: string;
  description: string;
  gallery?: { src: string; name: string }[];
  links?: Map<string, string>;
}

export default function EventPage({
  params: paramsPromise,
}: {
  params: Promise<{ event: string }>;
}) {
  const [curEvent, setCurEvent] = useState<Event | null>(null);
  const [eventHandle, setEventHandle] = useState<string | null>(null);

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
          ? data.gallery.map((src: string, index: number) => ({
            src,
            name: `Image ${index + 1}`,
          }))
          : undefined;

        return {
          category: data.category,
          banner: data.banner,
          name: data.name,
          description: data.description,
          gallery,
          links: data.links ? new Map(Object.entries(data.links)) : undefined,
        };
      });
      setCurEvent(events[0]);
    } catch (error) {
      console.error("Error getting event: ", error);
    }
  }, [eventHandle]);

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
              <h1 className="big text-center">{curEvent.name}</h1>
            </div>
          </div>

          <div className="main-padding w-full justify-center items-start flex-col flex gap-16">
            <p>{curEvent.description}</p>

            {curEvent.links && curEvent.links.size > 0 ? (
              <div className="justify-center items-start flex-col flex gap-8">
                <h2>Varasemad üritused</h2>
                <div className="justify-start items-center flex-row flex gap-8">
                  {Array.from(curEvent.links.entries()).map(([key, value]) => (
                    <Button key={key} variant="primary" text={key} to={value} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="justify-center items-start flex-col flex gap-8">
                <h2>Varasemad üritused</h2>
                <p>Ei ole üritusi, mida näidata.</p>
              </div>
            )}

            {curEvent.gallery && curEvent.gallery.length > 0 ? (
              <div className="justify-center items-start flex-col flex gap-8">
                <h2>Galerii</h2>
                <Gallery photos={curEvent.gallery} />
              </div>
            ) : (
              <div className="justify-center items-start flex-col flex gap-8">
                <h2>Galerii</h2>
                <p>Ei ole pilte, mida näidata.</p>
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
