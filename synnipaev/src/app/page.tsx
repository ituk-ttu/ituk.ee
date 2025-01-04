import Image from "next/image";
import tux_cover from "@/assets/images/tux_cover.png";
import Link from "next/link";
import Button from "@/components/buttons/button";

export default function Home() {
  return (
    <div>
      <div className="hero">
        <div className="info">
          <div className="bg-primary py-4 px-2">
            <h1 className="font-bold size-48">{"\u003E"}itük_</h1>
          </div>
          <p className="title">
            Oleme tudengid, kes kannavad teiste häält, edendavad haridust ja
            toovad tudengiellu unustamatuid elamusi.
          </p>
          <div className="buttons">
            <Link href="/join">
              <Button type="primary" big={true} text="Liitu meiega" />
            </Link>
            <Link href="/aboutus">
              <Button type="secondary" big={true} text="Loe meist lähemalt" />
            </Link>
          </div>
        </div>
        <Image src={tux_cover} alt="Tux cover" width={614} height={745} />
      </div>

      <div className="statistics bg-primary">
        <div className="statistics-container">
          <h1>20</h1>
          <h5>aastat tegutsemist</h5>
        </div>
        <div className="statistics-container">
          <h1>1200+</h1>
          <h5>liiget läbi aegade</h5>
        </div>
        <div className="statistics-container">
          <h1>XX</h1>
          <h5>midagi ürituste arvuga</h5>
        </div>
        <div className="statistics-container">
          <h1>1</h1>
          <h5>eesmärk</h5>
        </div>
      </div>
    </div>
  );
}
