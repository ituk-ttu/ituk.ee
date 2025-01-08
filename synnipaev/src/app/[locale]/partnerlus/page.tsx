import Image from "next/image"
import netgroup from "@/assets/images/partners/netgroup.png"
import nortal from "@/assets/images/partners/nortal.png"
import Metadata from "@/components/metadata"

export default function Home() {
  return (
    <div>
      <Metadata
        title="Koostöö | TalTechi IT-teaduskonna üliõpilaskogu"
        description="ITÜKi koostöö"
        image="/banners/partnerlus_banner.jpg"
        url="https://ituk.ee/partnerlus"
      />
      <div className="justify-center items-center bg-cooperation-bg bg-center bg-cover flex-row flex">
        <div className="main-padding w-full h-full bg-epic-gradient justify-center items-center flex-row flex">
          <h1 className="big">Koostöö</h1>
        </div>
      </div>

      <div className="flex flex-col items-center px-16 py-32 gap-16">
        <h2>Meie koostööpartnerid</h2>
        <div className="flex flex-row justify-center items-center px-16 gap-16">
          <Image src={netgroup} alt="Netgroup" width={800} height={278} />
          <Image src={nortal} alt="Nortal" width={800} height={278} />
        </div>
      </div>
    </div>
  )
}