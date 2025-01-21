"use client"

import Loading from "@/components/animations/loading";
import { db } from "@/firebase";
import { collection, doc, DocumentData, getDocs, query, where } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

interface EventYear {
    key: string;
    banner: string;
    date: string;
    description: string;
    extraInformation?: string;
    handle: string;
    gallery?: Map<string, string>;
    title: string;
}

export default function Year({
    params: paramsPromise,
}: {
    params: Promise<{ event: string, year: string }>;
}) {
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
                extraInformation: data.extraInformation ? data.extraInformation : undefined,
                gallery: data.gallery ? new Map(Object.entries(data.gallery)) : undefined,
                handle: data.handle,
                title: data.title
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
            <div className="flex flex-col items-center">
                <div
                    className="items-center justify-center h-full w-full bg-center bg-cover flex-row flex"
                    style={{ backgroundImage: `url(${eventYear.banner})` }}
                >
                    <div className="main-padding w-full bg-black/50 justify-center items-center flex-row flex">
                        <h1 className="big text-center">{eventYear.title}</h1>
                    </div>
                </div>

                <div className="flex flex-row items-start py-32 gap-16">
                    <div className="flex flex-col items-start gap-8">
                        <h3>Kirjeldus</h3>
                        <p>{eventYear.description}</p>
                    </div>

                    {eventYear.extraInformation && eventYear.extraInformation.length > 0 && (
                        <div className="flex flex-col items-start gap-8">
                            <h3>Lisainfo</h3>
                            <p>{eventYear.extraInformation}</p>
                        </div>
                    )}
                </div>
                
                {eventYear.gallery && eventYear.gallery.size > 0 && (
                    <div className="flex flex-col justify-center items-start py-32 gap-8">
                        <h3>Galerii</h3>
                        {Array.from(eventYear.gallery.values()).map((image, index) => (
                            <div key={index}>
                            <img src={image} alt={`Gallery image ${index + 1}`} />
                          </div>
                        ))}
                    </div>
                )}
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