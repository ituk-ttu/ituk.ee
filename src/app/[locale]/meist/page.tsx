"use client";

import { db } from "@/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import Card from "@/components/cards/card";
import Timeline from "@/components/timeline";
import PageHeader from "@/components/page-header";
import Statistics from "@/components/statistics";
import uritused from "@/assets/images/uritused.jpg";
import sobrad from "@/assets/images/sobrad.jpg";
import { useDictionary } from "@/components/dictionary-provider";
import { usePathname } from "next/navigation";
import ituk_struktuur from "@/assets/images/ituk_struktuur.png";
import Image from "next/image";

interface BoardMember {
  name: string;
  position: string;
  en_position: string;
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
  //get dictionary
  const pathname = usePathname();
  const currentLocale = pathname?.split("/")[1];

  const dictionary = useDictionary().aboutus;

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
          en_position: data.position_en,
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
      const querySnapshot = await getDocs(q);
      const events: Event[] = querySnapshot.docs.map((doc) => {
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
      <PageHeader title={dictionary.whatis} backgroundImage="/headers/about.jpg" />

      <div className="section-padding container-content justify-center items-center text-align gap-16 flex-col lg:flex-row flex">
        <div className="flex-col flex gap-8">
          <h2>{dictionary.answer}</h2>
          <p>
            {dictionary.answer2}
            <br /><br />
            {dictionary.answer3}
          </p>
        </div>
        <div className="h-full justify-center items-stretch flex-col sm:flex-row flex gap-8">
          <Card image={uritused.src} title={dictionary.card1.title} description={dictionary.card1.description} type="default" />
          <Card image={sobrad.src} title={dictionary.card2.title} description={dictionary.card2.description} type="default" />
        </div>
      </div>

      <Statistics
        title={dictionary.numbers} items={[
          { value: dictionary.statistics.stat1.title, label: dictionary.statistics.stat1.description },
          { value: dictionary.statistics.stat2.title, label: dictionary.statistics.stat2.description },
          { value: dictionary.statistics.stat3.title, label: dictionary.statistics.stat3.description },
          { value: dictionary.statistics.stat4.title, label: dictionary.statistics.stat4.description },
        ]} />

      <div className="section-padding container-content justify-center items-center gap-16 flex-col md:flex-row flex">
        <div className="w-full md:w-1/2 flex-col flex gap-8">
          <h2>
            {dictionary.structure}
          </h2>
          <p>
            {dictionary.howmany}
          </p>
          <ul>
            <li>{dictionary.statuses.status1}</li>
            <li>{dictionary.statuses.status2}</li>
            <li>{dictionary.statuses.status3}</li>
            <li>{dictionary.statuses.status4}</li>
          </ul>
          <p>
            {dictionary.structure2}
            <br /><br />
            {dictionary.structure3}
          </p>
        </div>
        <Image className="w-full md:w-1/2" src={ituk_struktuur} alt="ITÜKi struktuur 2025" />
      </div>

      <div className="section-padding container-content justify-center items-center text-align gap-16 flex-col flex">
        <h2>{dictionary.boardtitle}</h2>
        <div className="grid min-w-full grid-cols-1 gap-8 xs:grid-cols-2 lg:grid-cols-4">
          {boardMembers.map((member, index) => (
            <Card key={index} title={member.name} image={member.imagePath} description={currentLocale === "en" ? member.en_position : member.position} type="board" email={member.email} />
          ))}
        </div>
        <h2>{dictionary.historytitle}</h2>
        <div className="flex flex-col justify-center items-center">
          <Timeline type="start" />
          {events.map((event, index) => (
            <Timeline key={index} type={index % 2 === 0 ? "left" : "right"} imagePath={event.imagePath} title={event.title} description={event.description} year={event.year} />
          ))}
          <Timeline type="end" />
        </div>
        <h3>...ja kui tuleb veel huvitavaid asju, siis lisame siia!</h3>
      </div>
    </div >
  );
}
