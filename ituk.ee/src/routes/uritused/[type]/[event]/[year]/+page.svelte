<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import * as m from "$lib/paraglide/messages";
    import { getLocale } from "$lib/paraglide/runtime";
    import { getEventYear, type EventYear } from "$lib/firebase";
    import SEO from "$lib/components/SEO.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Gallery from "$lib/components/Gallery.svelte";

    let eventYear = $state<EventYear | null>(null);
    let loading = $state(true);
    let eventHandle = $derived($page.params.event ?? "");
    let yearHandle = $derived($page.params.year ?? "");
    let isEnglish = $derived(getLocale() === "en");

    onMount(async () => {
        try {
            if (eventHandle && yearHandle)
                eventYear = await getEventYear(eventHandle, yearHandle);
        } catch (error) {
            console.error("Error loading event year:", error);
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
{:else if eventYear}
    <div class="flex flex-col items-center">
        <div
            class="items-center justify-center h-full w-full bg-center bg-cover flex-row flex"
            style="background-image: url({eventYear.banner})"
        >
            <div
                class="section-padding w-full bg-black/50 justify-center items-center flex-row flex"
            >
                <h1 class="text-big text-center">
                    {isEnglish ? eventYear.title_en : eventYear.title}
                </h1>
            </div>
        </div>

        <div
            class="section-padding container-content justify-center items-start flex-col flex gap-16"
        >
            <div
                class="w-full justify-center items-start flex-col md:flex-row flex gap-16"
            >
                <div
                    class="w-full justify-center items-start flex-col flex gap-16"
                >
                    <h2>{m.year_description()}</h2>
                    <div>
                        {#each (isEnglish ? eventYear.description_en : eventYear.description)?.split("\n") ?? [] as line}
                            <p>
                                {line}
                                <br /><br />
                            </p>
                        {/each}
                    </div>
                </div>

                {#if eventYear.extraInformation && eventYear.extraInformation.length > 0}
                    <div
                        class="w-full justify-center items-start flex-col flex gap-16"
                    >
                        <h3>{m.year_extrainformation()}</h3>
                        <div>
                            {#each (isEnglish ? eventYear.extraInformation_en : eventYear.extraInformation)?.split("\n") ?? [] as line}
                                <p>
                                    {line}
                                    <br /><br />
                                </p>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
        </div>

        {#if eventYear.gallery && Object.keys(eventYear.gallery).length > 0}
            <div
                class="section-padding container-content justify-center items-start flex-col flex gap-8"
            >
                <h3>{m.year_gallery()}</h3>
                <Gallery
                    photos={Object.entries(eventYear.gallery).map(
                        ([name, src]) => ({
                            src,
                            name,
                        }),
                    )}
                />
            </div>
        {/if}
    </div>
{:else}
    <div class="flex flex-col items-center justify-center gap-8 min-h-[50vh]">
        <p class="text-gray">Event year not found</p>
    </div>
{/if}
