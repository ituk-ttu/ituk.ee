import Image from "next/image";
import tux_cover from "@/assets/images/tux_cover.png";
import Button from "@/components/buttons/button";
import { Locale } from "../../../i18nConfig";
import { getDictionary } from "@/dictionaries/dictionaries";

export default async function Home(props: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await props.params;

  const dictionary = (await getDictionary(locale)).home;
  return (
    <div>
      <div className="justify-between items-end px-[6.9%] flex-row flex">
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
  );
}
