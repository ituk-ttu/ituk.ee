"use client"

import Card from "@/components/cards/card";
import { useDictionary } from "@/components/dictionary-provider"
import uritused from "@/assets/images/uritused.jpg"
import sobrad from "@/assets/images/sobrad.jpg"
import meened from "@/assets/images/meened.jpg"
import muu from "@/assets/images/muu.jpg"


export default function Home() {
    const dictionary = useDictionary().join;
    return (
        <div>
            <div className="justify-center items-center bg-join-bg bg-center bg-cover flex-row flex">
                <div className=" w-full h-full bg-extra justify-center items-center flex-row flex">
                    <div className="main-padding w-full h-full bg-epic-gradient">
                        <h1 className="text-center big">{dictionary.header}</h1>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center px-16 py-32 gap-16">
                <h1>{dictionary.text1}</h1>
                <div className="flex flex-row items-center gap-16">
                    <Card title={dictionary.card1.title} image={uritused.src} description={dictionary.card1.description} type="default" />
                    <Card title={dictionary.card2.title} image={meened.src} description={dictionary.card2.description} type="default" />
                    <Card title={dictionary.card3.title} image={sobrad.src} description={dictionary.card3.description} type="default" />
                    <Card title={dictionary.card4.title} image={muu.src} description={dictionary.card4.description} type="default" />
                </div>
                <h1>{dictionary.text2}</h1>
            </div>
        </div>
    )
}