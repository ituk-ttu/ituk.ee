<script lang="ts">
    import { onMount } from "svelte";
    import * as m from "$lib/paraglide/messages";
    import { getLocale } from "$lib/paraglide/runtime";
    import PageHeader from "$lib/components/PageHeader.svelte";
    import Card from "$lib/components/Card.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import { getRentItems, type RentItem } from "$lib/firebase";
    import SEO from "$lib/components/SEO.svelte";

    let rentItems = $state<RentItem[]>([]);
    let loading = $state(true);
    let error = $state<string | null>(null);

    onMount(async () => {
        try {
            rentItems = await getRentItems();
        } catch (e) {
            console.error("Error loading rent items:", e);
            error = "Failed to load rental items";
        } finally {
            loading = false;
        }
    });

    function getLocalizedName(item: RentItem): string {
        return getLocale() === "en" && item.name_en ? item.name_en : item.name;
    }

    function getLocalizedDescription(item: RentItem): string {
        return getLocale() === "en" && item.description_en
            ? item.description_en
            : item.description;
    }
</script>

<SEO pageKey="rent" />

<div>
    <PageHeader title={m.rent_header()} backgroundImage="/headers/rent.jpg" />

    <div class="section-padding container-content flex flex-col gap-8">
        <h2>{m.rent_title()}</h2>
        <p>{m.rent_description()}</p>
        <p>
            {m.rent_request()}
            <a
                class="text-primary underline hover:brightness-125"
                href="mailto:kontakt@ituk.ee">kontakt@ituk.ee</a
            >
        </p>
        <p class="text-primary font-bold">{m.rent_NB()}</p>

        {#if loading}
            <Loading />
        {:else if error}
            <p class="text-red-500">{error}</p>
        {:else if rentItems.length === 0}
            <p class="text-gray">No rental items available</p>
        {:else}
            <div
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center"
            >
                {#each rentItems as item}
                    <Card
                        title={getLocalizedName(item)}
                        image={item.imagePath}
                        listItems={[getLocalizedDescription(item)]}
                        type="list"
                    />
                {/each}
            </div>
        {/if}
    </div>
</div>
