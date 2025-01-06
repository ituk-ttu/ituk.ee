"use client";

import { db } from "@/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import Button from "@/components/buttons/button";
import Image from "next/image";

interface Event {
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
  const [curEvent, setCurEvent] = useState<Event>();
  const [overlay, setOverlay] = useState<boolean>(false);

  const handleOverlayClick = (event: Event) => {
    setOverlay(!overlay);
    setCurEvent(event);
  };

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
    getEvents();
  }, []);

  if (overlay && curEvent) {
    return (
      <div className="flex flex-col items-center">
        <div
          className="flex flex-row items-center justify-center h-80 w-full bg-center bg-cover"
          style={{ backgroundImage: `url(${curEvent.banner})` }}
        >
          <div className="h-full w-full bg-black/50 justify-center items-center flex-row flex">
            <h1 className="big text-center">{curEvent.name}</h1>
          </div>
        </div>

        <div className="flex flex-col items-start w-full main-padding gap-16">
          <p>{curEvent.description}</p>

          <div className="flex flex-col items-start w-full gap-8">
            <h2>Varasemad üritused</h2>
            <div className="flex flex-row flex-wrap items-start content-start gap-8">
              {Array.from(curEvent.links.entries()).map(([key, value]) => (
                <Button type="primary" text={key} to={value} />
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center items-start w-full gap-8">
            <h2>Galerii</h2>
            <div className="flex flex-row flex-wrap items-center gap-16">
              {curEvent.gallery.map((image) => (
                <Image src={image} alt="Image" width={512} height={280} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            onClick={() => handleOverlayClick(events[index])}
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
          <div
            id={index.toString()}
            onClick={() => handleOverlayClick(events[index])}
            className="event-height justify-center items-center bg-center bg-cover bg-[url('@/assets/images/events/sisekad.jpg')] flex-col flex"
            style={{ backgroundImage: `url(${event.banner})` }}
          >
            <div className="event-height w-full bg-black/50 hover:bg-primary/50 transition-colors duration-150 ease-in-out justify-center items-center flex-row flex">
              <h2 className="title text-center">{event.name}</h2>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
