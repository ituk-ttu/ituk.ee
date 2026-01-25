<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import * as m from "$lib/paraglide/messages";
    import { getLocale } from "$lib/paraglide/runtime";
    import { getEventsByCategory, type Event } from "$lib/firebase";
    import SEO from "$lib/components/SEO.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import PageHeader from "$lib/components/PageHeader.svelte";
    import ImageButton from "$lib/components/ImageButton.svelte";

    let events = $state<Event[]>([]);
    let loading = $state(true);
    let category = $derived($page.params.type ?? "");
    let isEnglish = $derived(getLocale() === "en");

    const categoryImages: Record<string, string> = {
        haridus: "/headers/haridus.jpg",
        meelelahutus: "/headers/meelelahutus.jpg",
        muu: "/headers/sisekad.jpg",
    };

    const getCategoryTitle = (cat: string): string => {
        switch (cat) {
            case "haridus":
                return m.events_category_education();
            case "meelelahutus":
                return m.events_category_entertainment();
            case "muu":
                return m.events_category_other();
            default:
                return cat;
        }
    };

    onMount(async () => {
        try {
            if (category) events = await getEventsByCategory(category);
        } catch (error) {
            console.error("Error loading events:", error);
        } finally {
            loading = false;
        }
    });
</script>

<SEO pageKey="uritused" />

<div>
    <PageHeader
        title={getCategoryTitle(category)}
        backgroundImage={categoryImages[category] || "/ituk_placeholder.jpg"}
    />

    {#if loading}
        <Loading fullHeight />
    {:else if events.length === 0}
        <div
            class="section-padding container-content flex flex-col items-center justify-center gap-8 min-h-[50vh]"
        >
            <p class="text-gray">{m.event_noyears()}</p>
        </div>
    {:else}
        <div class="section-padding container-content">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {#each events as event (event.id)}
                    <a
                        href="/uritused/{event.category}/{event.handle}"
                        class="group relative rounded-lg overflow-hidden aspect-video"
                    >
                        <img
                            src={event.banner || "/ituk_placeholder.jpg"}
                            alt={isEnglish ? event.name_en : event.name}
                            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                        ></div>
                        <div class="absolute bottom-0 left-0 right-0 p-4">
                            <h3 class="text-white font-bold text-lg">
                                {isEnglish ? event.name_en : event.name}
                            </h3>
                        </div>
                    </a>
                {/each}
            </div>
        </div>
    {/if}
</div>
