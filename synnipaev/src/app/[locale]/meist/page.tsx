"use client";

import { db } from "@/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import Card from "@/components/cards/card";
import Timeline from "@/components/timeline";

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

      <div className="main-padding gap-16 flex-col flex">
        <p>
          ITÜK ehk TalTechi IT-teaduskonna üliõpilaskogu on
          tudengiorganisatsioon, mille eesmärgiks on IT-teaduskonna tudengite
          huvide esindamine ning nende hariduse, heaolu ja meelelahutuse
          edendamine. Meie liikmed, kes õpivad erinevatel infotehnoloogia
          õppekavadel, on aktiivsed ja abivalmid tudengid, kes annavad
          tudengitele hääle ja aitavad igapäevaelu ja õpingutega seotud
          probleemidele lahendusi leida.
        </p>
        <div className="gap-8 flex-col flex">
          <h2>Mida itük teeb?</h2>
          <p>
            Meie kõige tuntumad haridusüritused on IT-ametite päev,
            Praktikakohvik ja TalTech GameCamp, kus tudengid saavad praktilise
            kogemuse ning tutvuda IT-valdkonna ettevõtete ja ekspertidega.
            Lisaks pakume meelelahutust üritustega nagu Tudengibaar, Don’t Do
            IT, IT-teaduskonna rebaste ristimine, TalTech e-Sport ja palju muud.
            Meie eesmärgiks on luua mitmekülgne kogukond, kus tudengid saavad
            nii õppida, lõbutseda kui ka ennast arendada.
          </p>
          <p>
            Lisaks suurüritustele korraldame ka mitmesuguseid siseüritusi,
            koolitusi ja osutame õppealast abi, et meie liikmed saaksid tuge ja
            võimaluse areneda igas valdkonnas. Pakume ka mitmeid spordiüritusi,
            nagu võrkpallitrennid ja sporditurniirid, et tervis ja
            meeskonnatunne oleksid igapäevaelu osa.
          </p>
        </div>
      </div>

      <div className="main-padding bg-primary justify-center items-center gap-16 flex-col md:flex-row flex">
        <div className="justify-center items-center gap-2 sm:gap-4 flex-col flex">
          <p className="big font-bold">20</p>
          <p>aastat&nbsp;ajalugu</p>
        </div>
        <div className="justify-center items-center gap-2 sm:gap-4 flex-col flex">
          <p className="big font-bold">1200+</p>
          <p>liiget läbi aegade</p>
        </div>
        <div className="justify-center items-center gap-2 sm:gap-4 flex-col flex">
          <p className="big font-bold">30+</p>
          <p>üritust aastas</p>
        </div>
        <div className="justify-center items-center gap-2 sm:gap-4 flex-col flex">
          <p className="big font-bold">1</p>
          <p>eesmärk</p>
        </div>
      </div>

      <div className="main-padding justify-center items-center text-align gap-32 flex-col flex">
        <h2>2024/2025. õppeaasta juhatus</h2>
        <div className="grid min-w-full grid-cols-[repeat(auto-fit,minmax(17.75rem,1fr))] gap-16">
          {boardMembers.map((member) => (
            <Card title={member.name} image={member.imagePath} description={member.position} board={true} email={member.email} />
          ))}
        </div>
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
        <h2>...ja kui tuleb veel huvitavaid asju, siis lisame siia!</h2>
      </div>
    </div>
  );
}
