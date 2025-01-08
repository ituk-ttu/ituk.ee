import Link from "next/link";

export default function Home() {
  return (
    <div className="main-min items-start flex-col sm:flex-row flex">
      <h1 className="hidden">Üritused</h1>
      <Link
        className="w-full sm:w-1/3 justify-center items-center bg-center bg-cover bg-[url('@/assets/images/events/haridus.jpg')] flex-col flex"
        href="/uritused/haridus"
      >
        <div className="triple-height sm:h-screen main-max w-full bg-black/50 hover:bg-primary/50 transition-colors duration-150 ease-in-out justify-center items-center flex-row flex">
          <h2 className="p-8 title text-center">Haridus</h2>
        </div>
      </Link>
      <Link
        className="w-full sm:w-1/3 justify-center items-center bg-center bg-cover bg-[url('@/assets/images/events/meelelahutus.jpg')] flex-col flex"
        href="/uritused/meelelahutus"
      >
        <div className="triple-height sm:h-screen main-max w-full bg-black/50 hover:bg-primary/50 transition-colors duration-150 ease-in-out justify-center items-center flex-row flex">
          <h2 className="p-8 title text-center">Meelelahutus</h2>
        </div>
      </Link>
      <Link
        className="w-full sm:w-1/3 justify-center items-center bg-center bg-cover bg-[url('@/assets/images/events/sisekad.jpg')] flex-col flex"
        href="/uritused/muu"
      >
        <div className="triple-height sm:h-screen main-max w-full bg-black/50 hover:bg-primary/50 transition-colors duration-150 ease-in-out justify-center items-center flex-row flex">
          <h2 className="p-8 title text-center">Sise- ja muud üritused</h2>
        </div>
      </Link>
    </div>
  );
}
