// Admin store for shared state across admin routes
import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';

// Auth state
export const adminUser = writable<User | null>(null);
export const adminLoading = writable(true);

// Current page/section
export type AdminSection =
    | 'uldine'
    | 'juhatus'
    | 'ajalugu'
    | 'uritused'
    | 'rent'
    | 'sponsorid'
    | 'partnerid'
    | 'logiraamat'
    | '';

export const currentSection = writable<AdminSection>('');

// Form dirty state
export const formIsDirty = writable(false);

// Helper to check dirty state before navigation
export function confirmNavigation(): boolean {
    let dirty = false;
    formIsDirty.subscribe(v => dirty = v)();

    if (dirty) {
        return confirm('Sul on salvestamata muudatused. Kas soovid jätkata?');
    }
    return true;
}
