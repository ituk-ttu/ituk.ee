import Link from "next/link";

export default function Home() {
    return(
        <div className="flex flex-row items-start h-screen">
           <Link className="flex flex-col justify-center items-center py-8 h-full w-full bg-center bg-[url('@/assets/images/events/meelelahutus.jpg')]" href="/uritused/meelelahutus" >
            <h1 className="title">Meelelahutus</h1>
           </Link>
           <Link className="flex flex-col justify-center items-center py-8 h-full w-full bg-center bg-[url('@/assets/images/events/haridus.jpg')]" href="/uritused/haridus" >
            <h1 className="title">Haridus</h1>
           </Link>
           <Link className="flex flex-col justify-center items-center py-8 h-full w-full bg-center bg-[url('@/assets/images/events/sisekad.jpg')]" href="/uritused/muu" >
            <h1 className="title">Sise- ja muud üritused</h1>
           </Link> 
        </div>
    )
}