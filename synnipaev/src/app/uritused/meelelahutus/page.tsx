"use client";

import { db } from '@/firebase';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { use, useEffect, useState } from 'react';
import { DocumentData } from 'firebase/firestore';

interface Event {
    category: string;
    name: string;
    description: string;
    gallery: string[];
    links: string[];
}

export default function Home() {
    const [events, setEvents] = useState<Event[]>([]);
    const [overlay, setOverlay] = useState<boolean>(false);

    const handleOverlayClick = () => {
        setOverlay(!overlay);
    };

    const getEvents = async () => {
        try {
            const q = query(collection(db, 'events'), where('category', '==', 'meelelahutus'));
            const querrySnapshot = await getDocs(q);
            const events: Event[] = querrySnapshot.docs.map((doc) => {
                const data = doc.data() as DocumentData;
                return {
                    category: data.category,
                    name: data.name,
                    description: data.description,
                    gallery: data.gallery,
                    links: data.links,
                };
            });
            setEvents(events);
        } catch (error) {
            console.error('Error getting members: ', error);
            throw error;
        }
    };

    useEffect(() => { getEvents(); }, []);

    if (overlay) {
        return(
            <div>
                
            </div>
        )
    }

    if (events.length <= 4) {
        return (
            <div className="flex flex-row items-start h-screen w-full flex-wrap" onClick={handleOverlayClick}>
                {events.map((event, index) => (
                    <div id={index.toString()} className="flex flex-col justify-center items-center py-8 h-1/2 w-1/2 bg-center bg-cover bg-[url('@/assets/images/events/meelelahutus.jpg')]">
                        <h1 className="title text-center">{event.name}</h1>
                    </div>
                ))}
            </div>
        )   
    }
}