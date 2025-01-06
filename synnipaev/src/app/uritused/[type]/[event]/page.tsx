"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { query, collection, where, getDocs, DocumentData, documentId } from "firebase/firestore";
import Button from "@/components/buttons/button"
import Image from "next/image";

interface Event {
    category: string;
    banner: string;
    name: string;
    description: string;
    gallery?: string[];
    links?: Map<string, string>;
}

export default function Home({ params, }: { params: Promise<{ event: string }>; }) {
    const [curEvent, setCurEvent] = useState<Event>();

    const getEvent = async () => {
        try {
            const q = query(
                collection(db, "events"),
                where("handle", "==", (await params).event)
            );
            const querySnapshot = await getDocs(q);
            const events: Event[] = querySnapshot.docs.map((doc) => {
                const data = doc.data() as DocumentData;
                return {
                    category: data.category,
                    banner: data.banner,
                    name: data.name,
                    description: data.description,
                    gallery: data.gallery ? data.gallery : undefined,
                    links: data.links ? new Map(Object.entries(data.links)) : undefined,
                };
            });
            setCurEvent(events[0]);
        } catch (error) {
            console.error("Error getting members: ", error);
            throw error;
        }
    };

    useEffect(() => {
        getEvent();
    }, []);

    if (curEvent) {
        return (
            <div className='flex flex-col items-center gap-16'>
                <div className='flex flex-row items-center justify-center h-80 w-full bg-center bg-cover' style={{ backgroundImage: `url(${curEvent.banner})` }}>
                    <h1 className='big text-center'>{curEvent.name}</h1>
                </div>

                <div className='flex flex-col items-start w-full px-32 py-32 gap-16'>
                    <p>{curEvent.description}</p>

                    {curEvent.links?
                        <div className='flex flex-col items-start w-full gap-8'>
                            <h3>Varasemad üritused</h3>
                            <div className='flex flex-row flex-wrap items-start content-start gap-8'>
                                {Array.from(curEvent.links.entries()).map(([key, value]) => (
                                    <Button type='primary' text={key} to={value} />
                                ))}
                            </div>
                        </div>
                        :<></>
                    }
                    {curEvent.gallery?
                    <div className='flex flex-col justify-center items-start w-full gap-8 h-80'>
                        <h3>Galerii</h3>
                        <div className='flex flex-row flex-wrap items-center gap-16'>
                            {curEvent.gallery.map((image) => (
                                <Image src={image} alt='Image' width={512} height={280} />
                            ))}
                        </div>
                    </div>
                    :<></>
                    }
                </div>
            </div>
        )
    }
}