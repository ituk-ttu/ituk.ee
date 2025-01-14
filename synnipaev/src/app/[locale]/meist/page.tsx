"use client";

import { db } from "@/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import Card from "@/components/cards/card";
import Timeline from "@/components/timeline";
import uritused from "@/assets/images/uritused.jpg";
import sobrad from "@/assets/images/sobrad.jpg";

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
        <div className=" w-full h-full bg-extra justify-center items-center flex-row flex">
          <div className="main-padding w-full h-full bg-epic-gradient">
            <h1 className="text-center big">Mis on ITÜK?</h1>
          </div>
        </div>
      </div>

      <div className="main-padding justify-center items-center text-align gap-16 flex-col lg:flex-row flex">
        <div className="flex-col flex gap-8">
          <h2>ITÜK ehk TalTechi IT-teaduskonna üliõpilaskogu on...</h2>
          <p>
            ...tudengiorganisatsioon, mille eesmärgiks on IT-teaduskonna tudengite huvide esindamine ning nende hariduse, heaolu ja meelelahutuse edendamine, korraldades õppeaasta vältel mitmeid ägedaid üritusi.
            <br /><br />
            Meie liikmed, kes õpivad erinevatel infotehnoloogia õppekavadel, on aktiivsed ja abivalmid tudengid, kes annavad tudengitele hääle ja aitavad igapäevaelu ja õpingutega seotud probleemidele lahendusi leida.
          </p>
        </div>
        <div className="justify-center items-center flex-col sm:flex-row flex gap-16">
          <Card image={uritused.src} title="Ürituste korraldamine" description="Jäta oma märk maha korraldades üritusi ja luues unustamatuid hetki nii endale kui kaastudengitele!" board={false} />
          <Card image={sobrad.src} title="Sõbrad kogu eluks" description="ITÜKist leiad endale sõbrad ja mõttekaaslased, kellega koos tulevikule vastu minna ja teha suuri tegusid!" board={false} />
        </div>
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
