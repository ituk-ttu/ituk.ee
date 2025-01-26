import Image from "next/image";
import tux_cover from "@/assets/images/tux_cover.png";
import Button from "@/components/buttons/button";
import { Locale } from "../../../i18nConfig";
import { getDictionary } from "@/dictionaries/dictionaries";
import hingematvad from "@/assets/images/hingematvad.jpg";
import koostoo from "@/assets/images/koostoo.jpg";

export default async function Home(props: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await props.params;

  const dictionary = (await getDictionary(locale)).home;
  return (
    <div>
      <div className="relative w-full h-full" aria-label="ITÜK | TalTechi IT-teaduskonna üliõpilaskogu">
        <video className="absolute top-0 left-0 w-full h-full object-cover" autoPlay loop muted playsInline aria-label="ITÜK läbi aegade">
          <source src="/itünk.webm" type="video/webm" />
          <source src="/itünk.mp4" type="video/mp4" />
        </video>
        <div className="absolute z-10 top-0 left-0 w-full h-full object-cover bg-[#000000bf]" />
        <div className="relative z-20 justify-between items-end px-[6.9%] flex-row flex">
          <div className="h-full w-screen lg:w-1/2 justify-center py-24 items-start flex-col flex">
            <div className="items-start gap-16 flex-col flex">
              <div className="bg-primary">
                <h1 className="font-bold giant lowercase">&gt;itük_</h1>
              </div>
              <p className="lead font-bold">{dictionary.hero}</p>
              <div className="gap-8 flex-col sm:flex-row flex">
                <Button variant="primary" big={true} text={dictionary.joinus} to="https://liitu.ituk.ee/" />
                <Button variant="secondary" big={true} text={dictionary.readaboutus} to="/meist" />
              </div>
            </div>
          </div>
          <div className="hidden lg:w-1/2 justify-end items-end flex-col lg:flex">
            <Image src={tux_cover} alt="ITÜKi maskott pingviin Tux 3.0" />
          </div>
        </div>
      </div>

      <div className="main-padding justify-start items-center flex-col lg:flex-row flex gap-16">
        <Image className="h-full w-full lg:w-1/2 hidden lg:flex shadow-filled" src={hingematvad} alt="ITÜKi liikmed ei mata nii pea hinge!" />
        <div className="h-full w-full lg:w-1/2 flex-col justify-start items-start flex gap-8">
          <div className="p-4 md:p-8 bg-primary flex-col justify-center items-start gap-6 flex">
            <h2 className="lead">{dictionary.events}</h2>
          </div>
          <p>{dictionary.eventsdesc}</p>
          <Button variant="secondary" big={true} text={dictionary.eventsbutton} to="/uritused" />
        </div>
      </div>

      <div className="main-padding justify-start items-center flex-col lg:flex-row flex gap-16">
        <div className="h-full w-full lg:w-1/2 flex-col justify-start items-start flex gap-8">
          <div className="p-4 md:p-8 bg-primary flex-col justify-center items-start gap-6 flex">
            <h2 className="lead">{dictionary.coop}</h2>
          </div>
          <p>{dictionary.coopdesc}</p>
          <Button variant="secondary" big={true} text={dictionary.coopbutton} to="/partnerlus" />
        </div>
        <Image className="h-full w-full lg:w-1/2 hidden lg:flex shadow-filled" src={koostoo} alt="ITÜKi liikmed tegemas omavahelist koostööd" />
      </div>
    </div >
  );
}