import Link from "next/link";

export default function Home() {
  return (
    <div className="main-height items-start flex-row flex">
      <h1 className="hidden">Üritused</h1>
      <Link
        className="main-height w-1/3 justify-center items-center bg-center bg-cover bg-[url('@/assets/images/events/meelelahutus.jpg')]  flex-col flex"
        href="/uritused/meelelahutus"
      >
        <div className="main-height w-full bg-black/50 hover:bg-primary/50 transition-colors duration-150 ease-in-out justify-center items-center flex-row flex">
          <h2 className="title text-center">Meelelahutus</h2>
        </div>
      </Link>
      <Link
        className="main-height w-1/3 justify-center items-center bg-center bg-cover bg-[url('@/assets/images/events/haridus.jpg')]  flex-col flex"
        href="/uritused/haridus"
      >
        <div className="main-height w-full bg-black/50 hover:bg-primary/50 transition-colors duration-150 ease-in-out justify-center items-center flex-row flex">
          <h2 className="title text-center">Haridus</h2>
        </div>
      </Link>
      <Link
        className="main-height w-1/3 justify-center items-center bg-center bg-cover bg-[url('@/assets/images/events/sisekad.jpg')]  flex-col flex"
        href="/uritused/muu"
      >
        <div className="main-height w-full bg-black/50 hover:bg-primary/50 transition-colors duration-150 ease-in-out justify-center items-center flex-row flex">
          <h2 className="title text-center">Sise- ja muud üritused</h2>
        </div>
      </Link>
    </div>
  );
}
