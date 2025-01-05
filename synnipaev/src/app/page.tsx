import Image from "next/image";
import tux_cover from "@/assets/images/tux_cover.png";
import Button from "@/components/buttons/button";

export default function Home() {
  return (
    <div>
      <div className="justify-between items-end pt-24 px-[6.9%] flex-row flex">
        <div className="w-screen lg:w-1/2 h-full justify-start items-start pb-24 flex-col flex">
          <div className="items-start gap-16 flex-col flex">
            <div className="bg-primary">
              <h1 className="font-bold giant lowercase">{"\u003E"}itük_</h1>
            </div>
            <p className="lead font-bold">
              Oleme tudengid, kes kannavad teiste häält, edendavad haridust ja
              toovad tudengiellu unustamatuid elamusi.
            </p>
            <div className="gap-8 flex-col sm:flex-row flex">
              <Button
                type="primary"
                big={true}
                text="Liitu meiega"
                to="https://liitu.ituk.ee/"
              />
              <Button
                type="secondary"
                big={true}
                text="Loe meist lähemalt"
                to="/meist"
              />
            </div>
          </div>
        </div>
        <Image
          className="hidden lg:flex"
          src={tux_cover}
          alt="ITÜKi maskott pingviin Tux 2.5"
        />
      </div>

      <div className="main-padding bg-primary justify-center items-center gap-16 flex-col md:flex-row flex">
        <div className="justify-center items-center gap-2 sm:gap-4 flex-col flex">
          <p className="big font-bold">20</p>
          <p>aastat ajalugu</p>
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
          <p>ühine eesmärk</p>
        </div>
      </div>
    </div>
  );
}
