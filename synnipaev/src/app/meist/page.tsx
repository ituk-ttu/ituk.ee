"use client";

import {db} from '@/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { DocumentData } from 'firebase/firestore';
import Card from '@/components/card';
import Timeline from '@/components/timeline';

interface BoardMember {
  name: string;
  position: string;
  email: string;
  imagePath: string;
};

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
      const querrySnapshot = await getDocs(collection(db, 'board'));
      const members: BoardMember[] = querrySnapshot.docs.map((doc) => {
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
      console.error('Error getting members: ', error);
      throw error;
    }
  };

  const getEvents = async () => {
    try {
      const q = query(collection(db, 'timeline-events'), orderBy('year'));
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
      console.error('Error getting events: ', error);
      throw error;
    }
  };

  useEffect(() => {
    getBoardMembers();
    getEvents();
  }, []);

  return (
    <div>
      <div className="flex flex-row justify-center items-center h-80">
        <h1 className="big">Mis on {'\u003E'}itük_</h1>
      </div>
      
      <div className="flex flex-col items-start px-16 py-32 gap-16">
        <p>ITÜK ehk TalTechi IT-teaduskonna üliõpilaskogu on tudengiorganisatsioon, mille eesmärgiks on IT-teaduskonna tudengite huvide esindamine ning nende hariduse, heaolu ja meelelahutuse edendamine. Meie liikmed, kes õpivad erinevatel infotehnoloogia õppekavadel, on aktiivsed ja abivalmid tudengid, kes annavad tudengitele hääle ja aitavad igapäevaelu ja õpingutega seotud probleemidele lahendusi leida.</p>
        <div className="flex flex-col items-start gap-8">
          <h2>Mida {'\u003E'}itük_ teeb?</h2>
          <p>Meie kõige tuntumad haridusüritused on IT-ametite päev, Praktikakohvik ja TalTech GameCamp, kus tudengid saavad praktilise kogemuse ning tutvuda IT-valdkonna ettevõtete ja ekspertidega. Lisaks pakume meelelahutust üritustega nagu Tudengibaar, Don’t Do IT, IT-teaduskonna rebaste ristimine, TalTech e-Sport ja palju muud. Meie eesmärgiks on luua mitmekülgne kogukond, kus tudengid saavad nii õppida, lõbutseda kui ka ennast arendada.</p>
          <p>Lisaks suurüritustele korraldame ka mitmesuguseid siseüritusi, koolitusi ja osutame õppealast abi, et meie liikmed saaksid tuge ja võimaluse areneda igas valdkonnas. Pakume ka mitmeid spordiüritusi, nagu võrkpallitrennid ja sporditurniirid, et tervis ja meeskonnatunne oleksid igapäevaelu osa.</p>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center px-16 py-32 gap-16">
        <h2>2024/2025. õppeaasta juhatus</h2>
        <div className="flex flex-row justify-center align-center gap-8 flex-wrap">
          {boardMembers.map((member) => (
            <Card title={member.name} image={member.imagePath} description={member.position} board={true} width={400} height={500} email={member.email}/>
          ))}
        </div>
      </div>

      <div className='flex flex-col justify-center items-center px-16 py-32 gap-8'>
        <h2>ITÜK läbi aegade</h2>
        <div className='flex flex-col justify-center align-center'>
          <Timeline type="start" />
          {events.map((event, index) => (
            <Timeline type={index % 2 === 0 ? 'left' : 'right'} imagePath={event.imagePath} title={event.title} description={event.description} year={event.year} />
          ))}
          <Timeline type="end" />
        </div>
        <h2>...ja kui tuleb veel huvitavaid asju, siis lisame siia!</h2>
      </div>
    </div>
  );
}
