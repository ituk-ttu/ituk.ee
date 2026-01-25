<script lang="ts">
    interface Photo {
        src: string;
        name: string;
    }

    interface Props {
        photos: Photo[];
    }

    let { photos }: Props = $props();

    let selectedPhoto = $state<Photo | null>(null);

    function openLightbox(photo: Photo) {
        selectedPhoto = photo;
    }

    function closeLightbox() {
        selectedPhoto = null;
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") closeLightbox();
    }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {#each photos as photo (photo.src)}
        <button
            onclick={() => openLightbox(photo)}
            class="aspect-square overflow-hidden rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
        >
            <img
                src={photo.src}
                alt={photo.name}
                class="w-full h-full object-cover"
                loading="lazy"
            />
        </button>
    {/each}
</div>

{#if selectedPhoto}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
        role="dialog"
        aria-modal="true"
        aria-label="Image lightbox"
        tabindex="-1"
        class="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
        onclick={closeLightbox}
        onkeydown={(e) => e.key === "Escape" && closeLightbox()}
    >
        <button
            onclick={closeLightbox}
            class="absolute top-4 right-4 text-white hover:text-primary transition-colors"
            aria-label="Close"
        >
            <span class="material-symbols-outlined text-3xl">close</span>
        </button>
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <img
            src={selectedPhoto.src}
            alt={selectedPhoto.name}
            class="max-w-full max-h-[90vh] object-contain"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.key === "Escape" && closeLightbox()}
        />
    </div>
{/if}
