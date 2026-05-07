// Admin services for CRUD operations
import { db, invalidateCache, invalidateCacheByPrefix, CACHE_KEYS } from '$lib/firebase';
import {
    collection,
    getDocs,
    query,
    orderBy,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    Timestamp,
} from 'firebase/firestore';
import { toasts } from '$lib/stores/toast';

// Generic CRUD helpers
export async function saveDocument(
    collectionName: string,
    data: Record<string, any>,
    successMessage: string = 'Salvestatud!'
): Promise<boolean> {
    try {
        const { id, ...docData } = data;
        if (id) {
            await updateDoc(doc(db, collectionName, id), docData);
        } else {
            await addDoc(collection(db, collectionName), docData);
        }
        toasts.success('Salvestatud', successMessage);
        return true;
    } catch (e) {
        console.error(`Error saving to ${collectionName}:`, e);
        toasts.error('Viga', 'Salvestamisel tekkis viga');
        return false;
    }
}

export async function deleteDocument(
    collectionName: string,
    docId: string
): Promise<boolean> {
    try {
        await deleteDoc(doc(db, collectionName, docId));
        return true;
    } catch (e) {
        console.error(`Error deleting from ${collectionName}:`, e);
        toasts.error('Viga', 'Kustutamisel tekkis viga');
        return false;
    }
}

// Board member operations
export async function saveBoardMember(data: Record<string, string>): Promise<boolean> {
    return saveDocument('board', data, 'Juhatuse liige edukalt salvestatud!');
}

export async function deleteBoardMember(id: string): Promise<boolean> {
    return deleteDocument('board', id);
}

// Timeline operations
export async function saveTimelineEvent(data: Record<string, string>): Promise<boolean> {
    const { id, date, ...eventData } = data;
    const finalData = {
        ...eventData,
        date: new Date(date),
    };

    try {
        if (id) {
            await updateDoc(doc(db, 'timeline-events', id), finalData);
        } else {
            await addDoc(collection(db, 'timeline-events'), finalData);
        }
        invalidateCache(CACHE_KEYS.TIMELINE_EVENTS);
        toasts.success('Salvestatud', 'Ajaloo sündmus edukalt salvestatud!');
        return true;
    } catch (e) {
        console.error('Error saving timeline event:', e);
        toasts.error('Viga', 'Ajaloo sündmuse salvestamisel tekkis viga');
        return false;
    }
}

export async function deleteTimelineEvent(id: string): Promise<boolean> {
    const result = await deleteDocument('timeline-events', id);
    if (result) invalidateCache(CACHE_KEYS.TIMELINE_EVENTS);
    return result;
}

// Event operations
export async function saveEvent(data: Record<string, string>): Promise<boolean> {
    const result = await saveDocument('events', data, 'Üritus edukalt salvestatud!');
    if (result) invalidateCacheByPrefix('event');
    return result;
}

export async function deleteEvent(id: string): Promise<boolean> {
    const result = await deleteDocument('events', id);
    if (result) invalidateCacheByPrefix('event');
    return result;
}

// Event year operations
export async function saveEventYear(
    eventId: string,
    data: Record<string, string>
): Promise<boolean> {
    try {
        const { id, ...yearData } = data;
        const eventRef = doc(db, 'events', eventId);
        if (id) {
            await updateDoc(doc(eventRef, 'years', id), yearData);
        } else {
            await addDoc(collection(eventRef, 'years'), yearData);
        }
        invalidateCache(CACHE_KEYS.EVENT_YEARS(eventId));
        toasts.success('Salvestatud', 'Aasta edukalt salvestatud!');
        return true;
    } catch (e) {
        console.error('Error saving event year:', e);
        toasts.error('Viga', 'Aasta salvestamisel tekkis viga');
        return false;
    }
}

export async function deleteEventYear(eventId: string, yearId: string): Promise<boolean> {
    try {
        const eventRef = doc(db, 'events', eventId);
        await deleteDoc(doc(eventRef, 'years', yearId));
        invalidateCache(CACHE_KEYS.EVENT_YEARS(eventId));
        return true;
    } catch (e) {
        console.error('Error deleting event year:', e);
        return false;
    }
}

// Rent operations
export async function saveRentItem(data: Record<string, string>): Promise<boolean> {
    const result = await saveDocument('rent', data, 'Seade edukalt salvestatud!');
    if (result) invalidateCache(CACHE_KEYS.RENT_ITEMS);
    return result;
}

export async function deleteRentItem(id: string): Promise<boolean> {
    const result = await deleteDocument('rent', id);
    if (result) invalidateCache(CACHE_KEYS.RENT_ITEMS);
    return result;
}

// Sponsor operations
export async function saveSponsor(data: Record<string, string>): Promise<boolean> {
    const result = await saveDocument('sponsors', data, 'Sponsor edukalt salvestatud!');
    if (result) invalidateCache(CACHE_KEYS.SPONSORS);
    return result;
}

export async function deleteSponsor(id: string): Promise<boolean> {
    const result = await deleteDocument('sponsors', id);
    if (result) invalidateCache(CACHE_KEYS.SPONSORS);
    return result;
}

// Partner operations
export async function savePartner(data: Record<string, string>): Promise<boolean> {
    const { id, projects, ...partnerData } = data;
    const projectsArray = projects
        ? projects.split(',').map((p) => p.trim()).filter(Boolean)
        : [];
    const finalData = { ...partnerData, projects: projectsArray };

    try {
        if (id) {
            await updateDoc(doc(db, 'partners', id), finalData);
        } else {
            await addDoc(collection(db, 'partners'), finalData);
        }
        invalidateCache(CACHE_KEYS.PARTNERS);
        toasts.success('Salvestatud', 'Partner edukalt salvestatud!');
        return true;
    } catch (e) {
        console.error('Error saving partner:', e);
        toasts.error('Viga', 'Partneri salvestamisel tekkis viga');
        return false;
    }
}

export async function deletePartner(id: string): Promise<boolean> {
    const result = await deleteDocument('partners', id);
    if (result) invalidateCache(CACHE_KEYS.PARTNERS);
    return result;
}

// Logbook operations
export async function createLogEntry(
    authorUID: string | undefined,
    author: string,
    entry: string
): Promise<boolean> {
    if (!author || !entry) {
        toasts.warning('Tähelepanu', 'Palun täida kõik väljad');
        return false;
    }
    try {
        await addDoc(collection(db, 'logbook'), {
            authorUID,
            author,
            entry,
            date: Timestamp.fromDate(new Date()),
        });
        toasts.success('Loodud', 'Logiraamatu sissekanne edukalt lisatud!');
        return true;
    } catch (e) {
        console.error('Error creating log:', e);
        return false;
    }
}

// Data loading helpers
export async function loadTimelineEvents(): Promise<any[]> {
    const snapshot = await getDocs(
        query(collection(db, 'timeline-events'), orderBy('date', 'asc'))
    );
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        const dateObj = data.date?.toDate?.() || new Date(data.date);
        return {
            id: doc.id,
            ...data,
            date: dateObj.toISOString().split('T')[0],
        };
    });
}

export async function loadRentItems(): Promise<any[]> {
    const snapshot = await getDocs(collection(db, 'rent'));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function loadEvents(): Promise<any[]> {
    const snapshot = await getDocs(collection(db, 'events'));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function loadSponsors(): Promise<any[]> {
    const snapshot = await getDocs(collection(db, 'sponsors'));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function loadPartners(): Promise<any[]> {
    const snapshot = await getDocs(collection(db, 'partners'));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function loadLogbook(): Promise<any[]> {
    const snapshot = await getDocs(
        query(collection(db, 'logbook'), orderBy('date', 'desc'))
    );
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            date: data.date?.toDate?.() || new Date(),
        };
    });
}
