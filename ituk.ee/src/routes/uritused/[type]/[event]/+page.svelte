<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import * as m from "$lib/paraglide/messages";
    import { getLocale } from "$lib/paraglide/runtime";
    import {
        getEventByHandle,
        getEventYears,
        type Event,
        type EventYear,
    } from "$lib/firebase";
    import SEO from "$lib/components/SEO.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Card from "$lib/components/Card.svelte";

    let event = $state<Event | null>(null);
    let eventYears = $state<EventYear[]>([]);
    let loading = $state(true);
    let eventHandle = $derived($page.params.event ?? "");
    let eventType = $derived($page.params.type ?? "");
    let isEnglish = $derived(getLocale() === "en");

    onMount(async () => {
        try {
            if (eventHandle) event = await getEventByHandle(eventHandle);
            if (event?.id) {
                eventYears = await getEventYears(event.id);
            }
        } catch (error) {
            console.error("Error loading event:", error);
        } finally {
            loading = false;
        }
    });
</script>

<SEO pageKey="uritused" />

{#if loading}
    <div class="flex flex-col items-center justify-center gap-8 min-h-[50vh]">
        <h2>Laeb...</h2>
        <Loading />
    </div>
{:else if event}
    <div class="flex flex-col items-center">
        <div
            class="items-center justify-center h-full w-full bg-center bg-cover flex-row flex"
            style="background-image: url({event.banner})"
        >
            <div
                class="section-padding w-full bg-black/50 justify-center items-center flex-row flex"
            >
                <h1 class="text-big text-center">
                    {isEnglish ? event.name_en : event.name}
                </h1>
            </div>
        </div>

        <div
            class="section-padding container-content justify-center items-start flex-col flex gap-16"
        >
            <div
                class="w-full justify-start items-start flex-col md:flex-row flex gap-16"
            >
                <div
                    class="w-full justify-center items-start flex-col flex gap-16"
                >
                    <h2>{m.event_description()}</h2>
                    <div>
                        {#each (isEnglish ? event.description_en : event.description)?.split("\n") ?? [] as line, index}
                            <p>
                                {line}
                                <br /><br />
                            </p>
                        {/each}
                    </div>
                </div>
            </div>

            {#if eventYears.length > 0}
                <div
                    class="w-full justify-center items-start flex-col flex gap-8"
                >
                    <h2>{m.event_years()}</h2>
                    <div
                        class="grid min-w-full grid-cols-1 gap-8 xs:grid-cols-2 lg:grid-cols-4"
                    >
                        {#each eventYears as year (year.id)}
                            <a
                                href="/uritused/{eventType}/{eventHandle}/{year.handle}"
                            >
                                <Card
                                    title={isEnglish
                                        ? year.title_en
                                        : year.title}
                                    image={year.banner}
                                    type="default"
                                />
                            </a>
                        {/each}
                    </div>
                </div>
            {:else}
                <div
                    class="w-full justify-center items-start flex-col flex gap-8"
                >
                    <h2>{m.event_years()}</h2>
                    <p class="italic text-gray">{m.event_noyears()}</p>
                </div>
            {/if}
        </div>
    </div>
{:else}
    <div class="flex flex-col items-center justify-center gap-8 min-h-[50vh]">
        <p class="text-gray">Event not found</p>
    </div>
{/if}
