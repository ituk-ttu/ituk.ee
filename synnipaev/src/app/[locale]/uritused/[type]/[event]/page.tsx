"use client";

import { useEffect, useState, useCallback } from "react";
import { db } from "@/firebase";
import { query, collection, where, getDocs, DocumentData } from "firebase/firestore";
import Gallery from "@/components/gallery/gallery";
import Loading from "@/components/animations/loading";
import down_arrow from "@/assets/icons/down_arrow.svg";

interface Event {
  category: string;
  banner: string;
  name: string;
  description: string;
  gallery?: { src: string; name: string }[];
  links?: Map<string, Map<string, string>>;
}

export default function EventPage({
  params: paramsPromise,
}: {
  params: Promise<{ event: string }>;
}) {
  const [curEvent, setCurEvent] = useState<Event | null>(null);
  const [eventHandle, setEventHandle] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

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

      setCurEvent(events[0]);
    } catch (error) {
      console.error("Error getting event: ", error);
    }
  }, [eventHandle]);

  useEffect(() => {
    getEvent();
  }, [getEvent]);

  const renderEventLinks = () => {
    if (!selectedYear || !curEvent?.links) return null;

    const events = curEvent.links.get(selectedYear);

    if (!events) return <p>Ei ole üritusi, mida näidata.</p>;

    return (
      <ul className="space-y-2">
        {Array.from(events.entries()).map(([name, link]) => (
          <li key={name}>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {name}
            </a>
          </li>
        ))}
      </ul>
    );
  };

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
            <div className="w-full justify-center items-start flex-col md:flex-row flex gap-16">
              <div className="w-full justify-center items-start flex-col flex gap-16">
                <h2>Kirjeldus</h2>
                <p>{curEvent.description}</p>
              </div>


              {curEvent.links && curEvent.links.size > 0 ? (
                <div className="w-full justify-center items-start flex-col flex gap-8">
                  <h2>Varasemad üritused</h2>
                  <div className="relative inline-block w-full">
                    <button
                      className="z-20 min-h-12 px-8 button-text bg-primary shadow-filled rounded text-light hover:bg-secondary focus:bg-light focus:text-primary justify-between items-center flex-row flex gap-4"
                      onClick={() => setIsDropdownOpen((prev) => !prev)}
                    >
                      {selectedYear || "Vali aasta"}
                      <p className={`w-4 h-4 transform transition-transform duration-300 justify-center items-center flex ${isDropdownOpen ? "rotate-180" : ""}`}>
                        v
                      </p>
                    </button>
                    {isDropdownOpen && (
                      <div className="self-stretch absolute z-10 bg-dark border-t-2 border-black rounded shadow-filled overflow-y-auto">
                        {Array.from(curEvent.links.keys())
                          .sort((a, b) => Number(b) - Number(a)) // Sort years in descending order
                          .map((year) => (
                            <div
                              key={year}
                              className="min-w-32 min-h-12 px-8 button-text bg-dark border-t-2 border-black hover:bg-gray cursor-pointer justify-start items-center flex-row flex"
                              onClick={() => {
                                setSelectedYear(year);
                                setIsDropdownOpen(false);
                              }}
                            >
                              {year}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                  <div>{renderEventLinks()}</div>
                </div>

              ) : (
                <div className="justify-center items-start flex-col flex gap-8">
                  <h2>Varasemad üritused</h2>
                  <p>Ei ole üritusi, mida näidata.</p>
                </div>
              )}
            </div>

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