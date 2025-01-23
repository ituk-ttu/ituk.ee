import spin from '@/assets/animations/tux_spin.gif';
import spin_cw from '@/assets/animations/tux_spin_cw.gif';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="bg-derp-bg bg-top bg-cover text-align justify-center items-center flex-row flex">
      <div className="bg-extra justify-center items-center flex-row flex">
        <div className="w-screen main-padding bg-epic-gradient justify-center items-center flex-col md:flex-row flex gap-16">
          <div className="w-full md:w-1/3 flex-row justify-center items-end flex">
            <Image className="animate-etator" src={spin_cw.src} width="420" height="420" alt="Spinning Tux" />
          </div>
          <div className="w-full md:w-1/3 flex-col justify-center items-center flex">
            <h1 className="giant">404</h1>
            <p className="text-center text-3xl">Lehekülge ei leitud, küll aga sa leidsid keerlevad Tuxid!</p>
          </div>
          <div className="w-full md:w-1/3 flex-row justify-center items-end flex">
            <Image className="animate-rotate" src={spin.src} width="420" height="420" alt="Spinning Tux" />
          </div>
        </div>
      </div>
    </div>
  )
}