"use client";

import { db } from "@/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import Card from "@/components/cards/card";
import Timeline from "@/components/timeline";
import Carousel from "@/components/carousel";

interface BoardMember {
  name: string;
  position: string;
  email: string;
  imagePath: string;
}

interface Event {
  title: string;
  description: string;
  imagePath: string;
  year: Date;
}

export default function Home() {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  const getBoardMembers = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "board"), orderBy("imagePath", "asc"))
      );
      const members: BoardMember[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          name: data.name,
          position: data.position,
          email: data.email,
          imagePath: data.imagePath,
        };
      });
      setBoardMembers(members);
    } catch (error) {
      console.error("Error getting members: ", error);
      throw error;
    }
  };

  const getEvents = async () => {
    try {
      const q = query(collection(db, "timeline-events"), orderBy("year"));
      const querrySnapshot = await getDocs(q);
      const events: Event[] = querrySnapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          title: data.title,
          description: data.description,
          imagePath: data.imagePath,
          year: data.year.toDate(),
        };
      });
      setEvents(events);
    } catch (error) {
      console.error("Error getting events: ", error);
      throw error;
    }
  };

  useEffect(() => {
    getBoardMembers();
    getEvents();
  }, []);

  return (
    <div>
      <div className="bg-about-bg bg-center bg-cover text-align justify-center items-center flex-row flex">
        <div className="main-padding w-full h-full bg-epic-gradient justify-center items-center flex-row flex">
          <h1 className="big">Mis on &gt;itük_?</h1>
        </div>
      </div>

      <div className="main-padding justify-center items-center text-align gap-16 flex-col md:flex-row flex">
        <p className="">
          ITÜK ehk TalTechi IT-teaduskonna üliõpilaskogu on tudengiorganisatsioon,
          mis esindab IT-teaduskonna tudengite huve ning toetab nende haridust,
          heaolu ja meelelahutust. Meie eesmärgiks on luua mitmekülgne kogukond,
          kus tudengid saavad õppida, lõbutseda ja ennast arendada, pakkudes nii
          haridus- kui ka meelelahutusüritusi, õppealast tuge ja sportimisvõimalusi.
        </p>

        <Carousel>
          <Card image="/banners/ituk_banner.jpg" title="Card 1" description="This is the description for Card 1" board={false} />
          <Card image="/banners/ituk_banner.jpg" title="Card 2" description="This is the description for Card 2" board={false} />
          <Card image="/banners/ituk_banner.jpg" title="Card 3" description="This is the description for Card 3" board={false} />
        </Carousel>
      </div>

      <div className="main-padding bg-primary justify-center items-center gap-16 flex-col md:flex-row flex">
        <p className="items-center flex-col flex gap-4"><span className="big font-bold">20</span> aastat&nbsp;ajalugu</p>
        <p className="items-center flex-col flex gap-4"><span className="big font-bold">1200+</span> liiget läbi aegade</p>
        <p className="items-center flex-col flex gap-4"><span className="big font-bold">30+</span> üritust aastas</p>
        <p className="items-center flex-col flex gap-4"><span className="big font-bold">1</span> eesmärk</p>
      </div>

      <div className="main-padding justify-center items-center text-align gap-16 flex-col flex">
        <h2>ITÜK läbi aegade</h2>
        <div className="flex flex-col justify-center items-center">
          <Timeline type="start" />
          {events.map((event, index) => (
            <Timeline type={index % 2 === 0 ? "left" : "right"} imagePath={event.imagePath} title={event.title} description={event.description} year={event.year} />
          ))}
          <Timeline type="end" />
        </div>
        <h2>2024/2025. õppeaasta juhatus</h2>
        <div className="grid min-w-full grid-cols-[repeat(auto-fit,minmax(17.75rem,1fr))] gap-8">
          {boardMembers.map((member) => (
            <Card title={member.name} image={member.imagePath} description={member.position} board={true} email={member.email} />
          ))}
        </div>
      </div>
    </div>
  );
}
