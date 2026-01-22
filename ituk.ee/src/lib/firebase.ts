import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, doc, getDoc, addDoc, updateDoc, deleteDoc, type DocumentData } from 'firebase/firestore';
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
    title: string;
    title_en: string;
    description: string;
    description_en: string;
    imagePath: string;
    type: 'education' | 'entertainment' | 'other';
}

export interface RentItem {
    id?: string;
    title: string;
    title_en: string;
    description: string;
    description_en: string;
    imagePath: string;
}

export interface Partner {
    id?: string;
    name: string;
    imagePath: string;
    link: string;
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
