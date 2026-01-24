<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import * as m from "$lib/paraglide/messages";
    import { getLocale } from "$lib/paraglide/runtime";
    import { getEventsByCategory, type Event } from "$lib/firebase";
    import SEO from "$lib/components/SEO.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import ImageButton from "$lib/components/ImageButton.svelte";

    let events = $state<Event[]>([]);
    let loading = $state(true);
    let category = $derived($page.params.type ?? "");
    let isEnglish = $derived(getLocale() === "en");

    const categoryTitles: Record<string, { et: string; en: string }> = {
        haridus: { et: "Hariduslikud üritused", en: "Educational events" },
        meelelahutus: {
            et: "Meelelahutuslikud üritused",
            en: "Entertainment events",
        },
        muu: { et: "Sise- ja muud üritused", en: "Internal and other events" },
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

<h1 class="hidden">
    {categoryTitles[category]?.[isEnglish ? "en" : "et"] ?? category}
</h1>

{#if loading}
    <div class="flex flex-col items-center justify-center gap-8 min-h-[50vh]">
        <h2>Laeb...</h2>
        <Loading />
    </div>
{:else if events.length === 0}
    <div class="flex flex-col items-center justify-center gap-8 min-h-[50vh]">
        <p class="text-gray">{m.event_noyears()}</p>
    </div>
{:else}
    <div
        class={events.length <= 3
            ? "items-start flex-col sm:flex-row flex"
            : "grid grid-cols-1 sm:grid-cols-3"}
    >
        {#each events as event (event.id)}
            <div class={events.length <= 3 ? "w-full sm:w-1/3" : "w-full"}>
                <ImageButton
                    href="/uritused/{event.category}/{event.handle}"
                    backgroundImage={event.banner}
                    title={isEnglish ? event.name_en : event.name}
                    height={events.length <= 3 ? "full" : "half"}
                />
            </div>
        {/each}
    </div>
{/if}
