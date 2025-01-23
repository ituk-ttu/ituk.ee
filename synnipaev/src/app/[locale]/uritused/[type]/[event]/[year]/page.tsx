"use client"

import Loading from "@/components/animations/loading";
import { useDictionary } from "@/components/dictionary-provider";
import { db } from "@/firebase";
import { collection, doc, DocumentData, getDocs, query, where } from "firebase/firestore";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Gallery from "@/components/gallery/gallery";

interface EventYear {
    key: string;
    banner: string;
    date: string;
    description: string;
    en_description: string;
    extraInformation?: string;
    en_extraInformation?: string;
    handle: string;
    gallery?: Map<string, string>;
    title: string;
    en_title: string;
}

export default function Year({
    params: paramsPromise,
}: {
    params: Promise<{ event: string, year: string }>;
}) {
    const pathname = usePathname();
    const currentLocale = pathname?.split("/")[1];

    const dictionary = useDictionary().year;

    const [eventHandle, setEventHandle] = useState<string>("");
    const [year, setYear] = useState<string>("");
    const [eventYear, setEventYear] = useState<EventYear>();

    useEffect(() => {
        async function unwrapParams() {
            const params = await paramsPromise;
            setEventHandle(params.event);
            setYear(params.year);
        }
        unwrapParams();
    }, [paramsPromise]);

    const getYear = useCallback(async () => {
        if (!eventHandle) return;

        try {
            const eventQuerry = query(
                collection(db, "events"),
                where("handle", "==", eventHandle)
            );
            const eventQuerySnapshot = await getDocs(eventQuerry);
            const eventRef = doc(db, "events", eventQuerySnapshot.docs[0].id);
            const yearRef = collection(eventRef, "years");
            const q = query(yearRef, where("handle", "==", year))
            const yearQuerySnapshot = await getDocs(q);

            const data = yearQuerySnapshot.docs[0].data() as DocumentData;
            const eventYear: EventYear = {
                key: yearQuerySnapshot.docs[0].id,
                banner: data.banner,
                date: data.date,
                description: data.description,
                en_description: data.description_en,
                extraInformation: data.extraInformation ? data.extraInformation : undefined,
                en_extraInformation: data.extraInformation_ ? data.extraInformation_ : undefined,
                gallery: data.gallery ? new Map(Object.entries(data.gallery)) : undefined,
                handle: data.handle,
                title: data.title,
                en_title: data.title_en
            };
            console.log(eventYear);
            setEventYear(eventYear);
        } catch (error) {
            console.error("Error getting members: ", error);
            throw error;
        }
    }, [eventHandle])

    useEffect(() => {
        getYear();
    }, [getYear]);

    if (eventYear) {
        return (
            <div className="main-min">
                <div className="flex flex-col items-center">
                    <div
                        className="items-center justify-center h-full w-full bg-center bg-cover flex-row flex"
                        style={{ backgroundImage: `url(${eventYear.banner})` }}
                    >
                        <div className="main-padding w-full bg-black/50 justify-center items-center flex-row flex">
                            <h1 className="big text-center">{currentLocale === "en" ? eventYear.en_title : eventYear.title}</h1>
                        </div>
                    </div>

                    <div className="main-padding w-full justify-center items-start flex-col flex gap-16">
                        <div className="w-full justify-center items-start flex-col md:flex-row flex gap-16">
                            <div className="w-full justify-center items-start flex-col flex gap-16">
                                <h2>{dictionary.description}</h2>
                                <p>{currentLocale === "en" ? eventYear.en_description : eventYear.description}</p>
                            </div>

                            {eventYear.extraInformation && eventYear.extraInformation.length > 0 && (
                                <div className="w-full justify-center items-start flex-col flex gap-8">
                                    <h3>{dictionary.extrainformation}</h3>
                                    <p>{currentLocale === "en" ? eventYear.en_extraInformation : eventYear.extraInformation}</p>
                                </div>
                            )}
                        </div>

                        {eventYear.gallery && eventYear.gallery.size > 0 && (
                            <div className="w-full justify-center items-start flex-col flex gap-8">
                                <h3>{dictionary.gallery}</h3>
                                <Gallery
                                    photos={Array.from(eventYear.gallery.entries()).map(([name, src]) => ({
                                        src,
                                        name,
                                    }))}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="main-min justify-center items-center flex-col flex gap-8">
                <h2>Laeb...</h2>
                <Loading />
            </div>
        );
    }
}