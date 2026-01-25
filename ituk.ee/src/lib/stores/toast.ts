import { writable } from "svelte/store";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface Toast {
    id: string;
    variant: ToastVariant;
    title: string;
    message: string;
    dismissible: boolean;
    duration?: number;
}

const MAX_TOASTS = 4;

function createToastStore() {
    const { subscribe, update } = writable<Toast[]>([]);

    function generateId(): string {
        return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    function add(
        variant: ToastVariant,
        title: string,
        message: string,
        options?: { duration?: number }
    ) {
        const id = generateId();

        // Success toasts auto-dismiss after 5 seconds, others must be dismissed by user
        const dismissible = variant !== "success";
        const duration = variant === "success" ? (options?.duration ?? 5000) : undefined;

        const toast: Toast = {
            id,
            variant,
            title,
            message,
            dismissible,
            duration,
        };

        update((toasts) => {
            // Add new toast at the beginning (top)
            const newToasts = [toast, ...toasts];
            // Keep only MAX_TOASTS
            return newToasts.slice(0, MAX_TOASTS);
        });

        // Auto-dismiss success toasts
        if (duration) {
            setTimeout(() => {
                remove(id);
            }, duration);
        }

        return id;
    }

    function remove(id: string) {
        update((toasts) => toasts.filter((t) => t.id !== id));
    }

    function clear() {
        update(() => []);
    }

    return {
        subscribe,
        add,
        remove,
        clear,
        success: (title: string, message: string, options?: { duration?: number }) =>
            add("success", title, message, options),
        error: (title: string, message: string) =>
            add("error", title, message),
        warning: (title: string, message: string) =>
            add("warning", title, message),
        info: (title: string, message: string) =>
            add("info", title, message),
    };
}

export const toasts = createToastStore();
