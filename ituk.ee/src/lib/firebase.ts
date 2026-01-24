import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, doc, getDoc, addDoc, updateDoc, deleteDoc, where, type DocumentData } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Types
export interface BoardMember {
    id?: string;
    name: string;
    position: string;
    position_en: string;
    email: string;
    imagePath: string;
}

export interface TimelineEvent {
    id?: string;
    title: string;
    description: string;
    imagePath: string;
    year: Date;
}

export interface Event {
    id?: string;
    handle: string;
    name: string;
    name_en: string;
    description: string;
    description_en: string;
    banner: string;
    category: 'haridus' | 'meelelahutus' | 'muu';
    gallery?: string[];
}

export interface EventYear {
    id?: string;
    handle: string;
    title: string;
    title_en: string;
    description: string;
    description_en: string;
    extraInformation?: string;
    extraInformation_en?: string;
    banner: string;
    date: string;
    gallery?: Record<string, string>;
}

export interface RentItem {
    id?: string;
    name: string;
    name_en: string;
    price: number;
    unit: string;
    imagePath: string;
}

export interface Partner {
    id?: string;
    name: string;
    name_en: string;
    imagePath: string;
    link: string;
    projects?: string[];
}

// Fetch functions
export async function getBoardMembers(): Promise<BoardMember[]> {
    const q = query(collection(db, 'board'), orderBy('imagePath', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as BoardMember[];
}

export async function getTimelineEvents(): Promise<TimelineEvent[]> {
    const q = query(collection(db, 'timeline-events'), orderBy('year'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            description: data.description,
            imagePath: data.imagePath,
            year: data.year?.toDate?.() || new Date(data.year)
        };
    }) as TimelineEvent[];
}

export async function getEvents(): Promise<Event[]> {
    const snapshot = await getDocs(collection(db, 'events'));
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Event[];
}

export async function getEventsByCategory(category: string): Promise<Event[]> {
    const q = query(collection(db, 'events'), where('category', '==', category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Event[];
}

export async function getEventByHandle(handle: string): Promise<Event | null> {
    const q = query(collection(db, 'events'), where('handle', '==', handle));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data()
    } as Event;
}

export async function getEventYears(eventId: string): Promise<EventYear[]> {
    const eventRef = doc(db, 'events', eventId);
    const q = query(collection(eventRef, 'years'), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as EventYear[];
}

export async function getEventYear(eventHandle: string, yearHandle: string): Promise<EventYear | null> {
    const eventQuery = query(collection(db, 'events'), where('handle', '==', eventHandle));
    const eventSnapshot = await getDocs(eventQuery);
    if (eventSnapshot.empty) return null;

    const eventRef = doc(db, 'events', eventSnapshot.docs[0].id);
    const yearQuery = query(collection(eventRef, 'years'), where('handle', '==', yearHandle));
    const yearSnapshot = await getDocs(yearQuery);
    if (yearSnapshot.empty) return null;

    return {
        id: yearSnapshot.docs[0].id,
        ...yearSnapshot.docs[0].data()
    } as EventYear;
}

export async function getRentItems(): Promise<RentItem[]> {
    const snapshot = await getDocs(collection(db, 'rent'));
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as RentItem[];
}

export async function getPartners(): Promise<Partner[]> {
    const snapshot = await getDocs(collection(db, 'partners'));
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Partner[];
}

// Admin functions
export async function addDocument(collectionName: string, data: DocumentData) {
    return addDoc(collection(db, collectionName), data);
}

export async function updateDocument(collectionName: string, docId: string, data: DocumentData) {
    return updateDoc(doc(db, collectionName, docId), data);
}

export async function deleteDocument(collectionName: string, docId: string) {
    return deleteDoc(doc(db, collectionName, docId));
}

// Settings functions
export async function getSetting(key: string): Promise<string | null> {
    const docRef = doc(db, 'settings', key);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data().value as string;
    }
    return null;
}

export async function setSetting(key: string, value: string): Promise<void> {
    const docRef = doc(db, 'settings', key);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        await updateDoc(docRef, { value });
    } else {
        await addDoc(collection(db, 'settings'), { value });
    }
}
