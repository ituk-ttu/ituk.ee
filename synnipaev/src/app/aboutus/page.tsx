import {db} from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
//import { useEffect, useState } from 'react';
import { DocumentData } from 'firebase/firestore';
import sass from '@/assets/images/board/sass.0d78f2d5c88396651c91.jpg';
import Card from '@/components/card';

/*
const [members, setMembers] = useState<DocumentData[]>([]);

useEffect(() => {
  const fetchMembers = async () => {
    const membersRef = collection(db, 'members');
    const querySnapshot = await getDocs(membersRef);
    const members = querySnapshot.docs.map(doc => doc.data());
    setMembers(members);
  };

  fetchMembers();
}, []);
*/

export default function Home() {
  return (
    <div>
      <div className="page-banner">
        <h1 className="big">Mis on {'\u003E'}itük_</h1>
      </div>
      
      <div className="about-us">
        <p>ITÜK ehk TalTechi IT-teaduskonna üliõpilaskogu on tudengiorganisatsioon, mille eesmärgiks on IT-teaduskonna tudengite huvide esindamine ning nende hariduse, heaolu ja meelelahutuse edendamine. Meie liikmed, kes õpivad erinevatel infotehnoloogia õppekavadel, on aktiivsed ja abivalmid tudengid, kes annavad tudengitele hääle ja aitavad igapäevaelu ja õpingutega seotud probleemidele lahendusi leida.</p>
        <div className="about-us-purpose">
          <h2>Mida {'\u003E'}itük_ teeb?</h2>
          <p>Meie kõige tuntumad haridusüritused on IT-ametite päev, Praktikakohvik ja TalTech GameCamp, kus tudengid saavad praktilise kogemuse ning tutvuda IT-valdkonna ettevõtete ja ekspertidega. Lisaks pakume meelelahutust üritustega nagu Tudengibaar, Don’t Do IT, IT-teaduskonna rebaste ristimine, TalTech e-Sport ja palju muud. Meie eesmärgiks on luua mitmekülgne kogukond, kus tudengid saavad nii õppida, lõbutseda kui ka ennast arendada.</p>
          <p>Lisaks suurüritustele korraldame ka mitmesuguseid siseüritusi, koolitusi ja osutame õppealast abi, et meie liikmed saaksid tuge ja võimaluse areneda igas valdkonnas. Pakume ka mitmeid spordiüritusi, nagu võrkpallitrennid ja sporditurniirid, et tervis ja meeskonnatunne oleksid igapäevaelu osa.</p>
        </div>
      </div>

      <div className="board">
        <h2>2024/2025. õppeaasta juhatus</h2>
        <div className="board-members">
          <Card title="Alexander Rein Robas" image={sass} description='Juhatuse esimees' board={true} width={400} height={500} email='esimees@ituk.ee'/>
          <Card title="Alexander Rein Robas" image={sass} description='Juhatuse esimees' board={true} width={400} height={500} email='esimees@ituk.ee'/>
          <Card title="Alexander Rein Robas" image={sass} description='Juhatuse esimees' board={true} width={400} height={500} email='esimees@ituk.ee'/>
          <Card title="Alexander Rein Robas" image={sass} description='Juhatuse esimees' board={true} width={400} height={500} email='esimees@ituk.ee'/>
          <Card title="Alexander Rein Robas" image={sass} description='Juhatuse esimees' board={true} width={400} height={500} email='esimees@ituk.ee'/>
        </div>
      </div>

      <div className='history'>
        <h2>ITÜK läbi aegade</h2>
        <div className='timeline'>

        </div>
        <h2>...ja kui tuleb veel huvitavaid asju, siis lisame siia!</h2>
      </div>
    </div>
  );
}
