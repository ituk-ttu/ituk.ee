"use client";

import { db } from "@/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import Card from "@/components/card";
import Timeline from "@/components/timeline";

interface BoardMember {
  name: string;
  position: string;
  email: string;
  imagePath: string;
}

export default function Home() {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);

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

  useEffect(() => {
    getBoardMembers();
  }, []);

  return (
    <div>
      <div className="justify-center items-center bg-about-bg bg-center bg-cover flex-row flex">
        <div className="main-padding w-full h-full bg-custom-gradient justify-center items-center flex-row flex">
          <h1 className="big">Mis on {"\u003E"}itük_?</h1>
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
        <div className="gap-16 flex-col flex">
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

      <div className="board">
        <h2>2024/2025. õppeaasta juhatus</h2>
        <div className="board-members">
          {boardMembers.map((member) => (
            <Card
              title={member.name}
              image={member.imagePath}
              description={member.position}
              board={true}
              width={400}
              height={500}
              email={member.email}
            />
          ))}
        </div>
      </div>

      <div className="history">
        <h2>ITÜK läbi aegade</h2>
        <div className="timeline">
          <Timeline type="start" />
        </div>
        <h2>...ja kui tuleb veel huvitavaid asju, siis lisame siia!</h2>
      </div>
    </div>
  );
}
