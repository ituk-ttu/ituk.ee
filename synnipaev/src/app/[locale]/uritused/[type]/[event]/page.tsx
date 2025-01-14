"use client";

import { useEffect, useState, useCallback } from "react";
import { db } from "@/firebase";
import { query, collection, where, getDocs, DocumentData } from "firebase/firestore";
import Gallery from "@/components/gallery/gallery";
import Loading from "@/components/animations/loading";

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
            <div className="w-full justify-start items-start flex-col md:flex-row flex gap-16">
              <div className="w-full justify-center items-start flex-col flex gap-16">
                <h2>Kirjeldus</h2>
                <p>{curEvent.description}</p>
              </div>

              {curEvent.links && curEvent.links.size > 0 ? (
                <div className="w-full justify-center items-start flex-col flex gap-8">
                  <h2>Varasemad üritused</h2>
                  <p className="italic">Mõned aastad võivad olla vahelt puudu, kuna nendel aastatel puudus avalik reklaam üritustele (nt siseüritused), või üritusi ei toimunud.</p>
                  <div className="relative inline-block">
                    <button
                      className="z-20 min-h-12 px-8 button-text bg-primary shadow-filled rounded text-light hover:bg-secondary focus:bg-light focus:text-primary justify-between items-center flex-row flex gap-4"
                      onClick={() => setIsDropdownOpen((prev) => !prev)}
                    >
                      {selectedYear || "Vali aasta"}
                      <div className={`focus:text-primary w-4 h-4 transform transition-transform duration-300 justify-center items-center flex ${isDropdownOpen ? "rotate-180" : ""}`} >
                        <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <g clipPath="url(#clip0_1038_2084)">
                            <path d="M7.77742 6.76758L1.41409 0.404243L-3.39965e-07 1.81833L7.77749 9.59582L15.555 1.81818L14.1409 0.404091L7.77742 6.76758Z" />
                          </g>
                          <defs>
                            <clipPath id="clip0_1038_2084">
                              <rect width="9.19173" height="15.555" fill="white" transform="translate(0 9.59583) rotate(-90)" />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                    </button>
                    {isDropdownOpen && (
                      <div className="self-stretch w-full absolute z-10 bg-dark border-t-2 border-black rounded shadow-filled overflow-y-auto">
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
                <div className="w-full justify-center items-start flex-col flex gap-8">
                  <h2>Varasemad üritused</h2>
                  <p className="italic">Ei ole üritusi, mida näidata. Tõenäoliselt puudus avalik reklaam üritustele (nt siseüritused), või üritusi ei toimunud.</p>
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