import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, doc, getDoc, addDoc, updateDoc, deleteDoc, setDoc, where, type DocumentData } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import {
    PUBLIC_FIREBASE_API_KEY,
    PUBLIC_FIREBASE_AUTH_DOMAIN,
    PUBLIC_FIREBASE_PROJECT_ID,
    PUBLIC_FIREBASE_STORAGE_BUCKET,
    PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    PUBLIC_FIREBASE_APP_ID,
    PUBLIC_FIREBASE_MEASUREMENT_ID
} from '$env/static/public'
import { getCached, invalidateCache, invalidateCacheByPrefix, CACHE_KEYS } from './cache';

const firebaseConfig = {
    apiKey: PUBLIC_FIREBASE_API_KEY,
    authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: PUBLIC_FIREBASE_APP_ID,
    measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID
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
    year?: string;
}

export interface TimelineEvent {
    id?: string;
    name: string;
    date: Date;
    imagePath: string;
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
    description: string;
    description_en: string;
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

export interface Sponsor {
    id?: string;
    name: string;
    imagePath: string;
    link: string;
    bgColor: string;
}

// Fetch functions (with caching)
export async function getBoardMembers(): Promise<BoardMember[]> {
    return getCached(CACHE_KEYS.BOARD_MEMBERS, async () => {
        const q = query(collection(db, 'board'), orderBy('imagePath', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        })) as BoardMember[];
    });
}

export async function getTimelineEvents(): Promise<TimelineEvent[]> {
    return getCached(CACHE_KEYS.TIMELINE_EVENTS, async () => {
        const q = query(collection(db, 'timeline-events'), orderBy('date'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                imagePath: data.imagePath,
                date: data.date?.toDate?.() || new Date(data.date)
            };
        }) as TimelineEvent[];
    });
}

export async function getEvents(): Promise<Event[]> {
    return getCached(CACHE_KEYS.EVENTS, async () => {
        const snapshot = await getDocs(collection(db, 'events'));
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        })) as Event[];
    });
}

export async function getEventsByCategory(category: string): Promise<Event[]> {
    return getCached(CACHE_KEYS.EVENTS_BY_CATEGORY(category), async () => {
        const q = query(collection(db, 'events'), where('category', '==', category));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        })) as Event[];
    });
}

export async function getEventByHandle(handle: string): Promise<Event | null> {
    return getCached(CACHE_KEYS.EVENT_BY_HANDLE(handle), async () => {
        const q = query(collection(db, 'events'), where('handle', '==', handle));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        return {
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data()
        } as Event;
    });
}

export async function getEventYears(eventId: string): Promise<EventYear[]> {
    return getCached(CACHE_KEYS.EVENT_YEARS(eventId), async () => {
        const eventRef = doc(db, 'events', eventId);
        const q = query(collection(eventRef, 'years'), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        })) as EventYear[];
    });
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
    return getCached(CACHE_KEYS.RENT_ITEMS, async () => {
        const snapshot = await getDocs(collection(db, 'rent'));
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        })) as RentItem[];
    });
}

export async function getPartners(): Promise<Partner[]> {
    return getCached(CACHE_KEYS.PARTNERS, async () => {
        const snapshot = await getDocs(collection(db, 'partners'));
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        })) as Partner[];
    });
}

export async function getSponsors(): Promise<Sponsor[]> {
    return getCached(CACHE_KEYS.SPONSORS, async () => {
        const snapshot = await getDocs(collection(db, 'sponsors'));
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        })) as Sponsor[];
    });
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
    return getCached(CACHE_KEYS.SETTINGS(key), async () => {
        const docRef = doc(db, 'settings', key);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().value as string;
        }
        return null;
    });
}

export async function setSetting(key: string, value: string): Promise<void> {
    const docRef = doc(db, 'settings', key);
    await setDoc(docRef, { value });
    // Invalidate cache for this setting
    invalidateCache(CACHE_KEYS.SETTINGS(key));
}

// Re-export cache utilities for admin use
export { invalidateCache, invalidateCacheByPrefix, clearCache, CACHE_KEYS } from './cache';

// Leaderboard types and functions for Tux game
export interface LeaderboardEntry {
    id?: string;
    name: string;
    score: number;
    timestamp: Date;
}

export async function getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    const q = query(
        collection(db, 'leaderboard'),
        orderBy('score', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.slice(0, limit).map(doc => ({
        id: doc.id,
        name: doc.data().name as string,
        score: doc.data().score as number,
        timestamp: doc.data().timestamp?.toDate() || new Date()
    }));
}

export async function addLeaderboardEntry(name: string, score: number): Promise<string> {
    const docRef = await addDoc(collection(db, 'leaderboard'), {
        name: name.toUpperCase(),
        score,
        timestamp: new Date()
    });
    return docRef.id;
}
