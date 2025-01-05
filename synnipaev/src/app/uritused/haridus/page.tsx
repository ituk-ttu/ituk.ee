"use client";

import { db } from '@/firebase';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { DocumentData } from 'firebase/firestore';
import Button from '@/components/buttons/button';
import Image from 'next/image';

interface Event {
    category: string;
    banner: string;
    name: string;
    description: string;
    gallery: string[];
    links: Map<string, string>;
}

export default function Home() {
    const [events, setEvents] = useState<Event[]>([]);
    const [curEvent, setCurEvent] = useState<Event>();
    const [overlay, setOverlay] = useState<boolean>(false);

    const handleOverlayClick = (event: Event) => {
        setOverlay(!overlay);
        setCurEvent(event);
    };

    const getEvents = async () => {
        try {
            const q = query(collection(db, 'events'), where('category', '==', 'haridus'));
            const querrySnapshot = await getDocs(q);
            const events: Event[] = querrySnapshot.docs.map((doc) => {
                const data = doc.data() as DocumentData;
                return {
                    category: data.category,
                    banner: data.banner,
                    name: data.name,
                    description: data.description,
                    gallery: data.gallery,
                    links: new Map(Object.entries(data.links)),
                };
            });
            setEvents(events);
        } catch (error) {
            console.error('Error getting members: ', error);
            throw error;
        }
    };

    useEffect(() => { getEvents(); }, []);

    if (overlay && curEvent) {
        return(
            <div className='flex flex-col items-center gap-16'>
                <div className='flex flex-row items-center justify-center h-80 w-full bg-center bg-cover' style={{backgroundImage: `url(${curEvent.banner})`}}>
                    <h1 className='big text-center'>{curEvent.name}</h1>
                </div>

                <div className='flex flex-col items-start w-full px-32 py-32 gap-16'>
                    <p>{curEvent.description}</p>

                    <div className='flex flex-col items-start w-full gap-8'>
                        <h3>Varasemad üritused</h3>
                        <div className='flex flex-row flex-wrap items-start content-start gap-8'>
                            {Array.from(curEvent.links.entries()).map(([key, value]) => (
                                <Button type='primary' text={key} to={value} />
                            ))}
                        </div>
                    </div>

                    <div className='flex flex-col justify-center items-start w-full gap-8 h-80'>
                        <h3>Galerii</h3>
                        <div className='flex flex-row flex-wrap items-center gap-16'>
                            {curEvent.gallery.map((image) => (
                                <Image src={image} alt='Image' width={512} height={280}/>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (events.length <= 0) {
        <div className='flex flex-row items-center justify-center h-screen w-full'>
            <h1>No events found!</h1>
        </div>
    }

    if (events.length <= 4) {
        return (
            <div className="flex flex-row items-start h-screen w-full flex-wrap">
                {events.map((event, index) => (
                    <div id={index.toString()} onClick={() => handleOverlayClick(events[index])} className="flex flex-col justify-center items-center py-8 h-1/2 w-1/2 bg-center bg-cover" style={{backgroundImage: `url(${event.banner})`}}>
                        <h1 className="title text-center">{event.name}</h1>
                    </div>
                ))}
            </div>
        )   
    } else {
        return (
            <div className="flex flex-row items-start h-screen w-full flex-wrap">
                {events.map((event, index) => (
                    <div id={index.toString()} onClick={() => handleOverlayClick(events[index])} className="flex flex-col justify-center items-center py-8 h-1/2 w-1/3 bg-center bg-cover" style={{backgroundImage: `url(${event.banner})`}}>
                        <h1 className="title text-center">{event.name}</h1>
                    </div>
                ))}
            </div>
        )   
    }
}