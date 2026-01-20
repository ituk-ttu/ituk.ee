"use client"

import Card from "@/components/cards/card";
import { useDictionary } from "@/components/dictionary-provider"
import PageHeader from "@/components/page-header";
import uritused from "@/assets/images/uritused.jpg"
import sobrad from "@/assets/images/sobrad.jpg"
import meened from "@/assets/images/meened.jpg"
import muu from "@/assets/images/muu.jpg"


export default function Home() {
    const dictionary = useDictionary().join;
    return (
        <div>
            <PageHeader title={dictionary.header} backgroundImage="/headers/liitu.jpg" />

            <div className="section-padding container-content flex flex-col justify-center items-center gap-8">
                <h2>{dictionary.text1}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <Card title={dictionary.card1.title} image={uritused.src} description={dictionary.card1.description} type="default" />
                    <Card title={dictionary.card2.title} image={meened.src} description={dictionary.card2.description} type="default" />
                    <Card title={dictionary.card3.title} image={sobrad.src} description={dictionary.card3.description} type="default" />
                    <Card title={dictionary.card4.title} image={muu.src} description={dictionary.card4.description} type="default" />
                </div>
                <h2>{dictionary.text2}</h2>
            </div>
        </div>
    )
}