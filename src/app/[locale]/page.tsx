import Image from "next/image";
import tux_cover from "@/assets/images/tux_cover.png";
import Button from "@/components/buttons/button";
import { Locale } from "../../../i18nConfig";
import { getDictionary } from "@/dictionaries/dictionaries";
import hingematvad from "@/assets/images/hingematvad.jpg";
import koostoo from "@/assets/images/koostoo.jpg";
import hero from "@/assets/images/hero.jpg";

export default async function Home(props: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await props.params;

  const dictionary = (await getDictionary(locale)).home;
  return (
    <div>
      {/* Hero Section */}
      <div className="relative w-full h-full" aria-label="ITÜK | TalTechi IT-teaduskonna üliõpilaskogu">
        <Image
          src={hero}
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute z-10 top-0 left-0 w-full h-full bg-gradient-to-t from-background via-background/80 to-primary/40" />
        <div className="relative z-20 container-content justify-between items-end flex-row flex">
          <div className="h-full w-full lg:w-1/2 justify-center py-24 items-start flex-col flex">
            <div className="items-start gap-16 flex-col flex">
              <div className="bg-primary p-4">
                <h1 className="font-bold text-big lowercase">&gt;itük_</h1>
              </div>
              <p className="text-title font-bold">{dictionary.hero}</p>
              <div className="gap-8 flex-col sm:flex-row flex">
                <Button variant="primary" size="lg" text={dictionary.joinus} to="https://liitu.ituk.ee/" />
                <Button variant="secondary" size="lg" text={dictionary.readaboutus} to="/meist" />
              </div>
            </div>
          </div>
          <div className="hidden lg:w-1/2 justify-end items-end flex-col lg:flex relative">
            <Image src={tux_cover} alt="ITÜKi maskott pingviin Tux 3.0" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Info Sections */}
      <div className="section-padding container-content flex flex-col gap-16">
        {/* Events Section */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          <div className="w-full max-w-[512px] aspect-video relative">
            <Image
              className="object-cover rounded"
              src={hingematvad}
              alt="ITÜKi liikmed ei mata nii pea hinge!"
              fill
              sizes="(max-width: 1024px) 100vw, 512px"
            />
          </div>
          <div className="w-full max-w-[512px] flex flex-col gap-6 items-start">
            <div className="p-4 bg-primary">
              <h2>{dictionary.events}</h2>
            </div>
            <p>{dictionary.eventsdesc}</p>
            <Button variant="primary" size="lg" text={dictionary.eventsbutton} to="/uritused" />
          </div>
        </div>

        {/* Cooperation Section */}
        <div className="w-full flex flex-col-reverse lg:flex-row items-center justify-center gap-8 lg:gap-16">
          <div className="w-full max-w-[512px] flex flex-col gap-6 items-start">
            <div className="p-4 bg-primary">
              <h2>{dictionary.coop}</h2>
            </div>
            <p>{dictionary.coopdesc}</p>
            <Button variant="primary" size="lg" text={dictionary.coopbutton} to="/partnerlus" />
          </div>
          <div className="w-full max-w-[512px] aspect-video relative">
            <Image
              className="object-cover rounded"
              src={koostoo}
              alt="ITÜKi liikmed tegemas omavahelist koostööd"
              fill
              sizes="(max-width: 1024px) 100vw, 512px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}