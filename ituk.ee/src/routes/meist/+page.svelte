<script lang="ts">
    import { onMount } from "svelte";
    import { getLocale } from "$lib/paraglide/runtime";
    import * as m from "$lib/paraglide/messages";
    import {
        getBoardMembers,
        getTimelineEvents,
        type BoardMember,
        type TimelineEvent,
    } from "$lib/firebase";
    import PageHeader from "$lib/components/PageHeader.svelte";
    import Card from "$lib/components/Card.svelte";
    import Statistics from "$lib/components/Statistics.svelte";
    import TimelineDesktop from "$lib/components/TimelineDesktop.svelte";

    let boardMembers = $state<BoardMember[]>([]);
    let timelineEvents = $state<TimelineEvent[]>([]);
    let loading = $state(true);
    let error = $state<string | null>(null);

    onMount(async () => {
        try {
            [boardMembers, timelineEvents] = await Promise.all([
                getBoardMembers(),
                getTimelineEvents(),
            ]);
        } catch (e) {
            console.error("Error loading data:", e);
            error = "Failed to load data";
        } finally {
            loading = false;
        }
    });

    const isEnglish = $derived(getLocale() === "en");
</script>

<div>
    <PageHeader
        title={m.aboutus_whatis()}
        backgroundImage="/headers/meist.jpg"
    />

    <!-- What is ITÜK Section -->
    <div
        class="section-padding container-content flex flex-col lg:flex-row gap-16 items-center"
    >
        <div class="flex flex-col gap-8">
            <h2>{m.aboutus_answer()}</h2>
            <p>{m.aboutus_answer2()}</p>
            <p>{m.aboutus_answer3()}</p>
        </div>
        <div
            class="h-full justify-center items-stretch flex-col sm:flex-row flex gap-8"
        >
            <Card
                image="/images/uritused.jpg"
                title={m.aboutus_card1_title()}
                description={m.aboutus_card1_description()}
                type="default"
            />
            <Card
                image="/images/sobrad.jpg"
                title={m.aboutus_card2_title()}
                description={m.aboutus_card2_description()}
                type="default"
            />
        </div>
    </div>

    <!-- Statistics Section -->
    <Statistics
        title={m.aboutus_numbers()}
        items={[
            {
                value: m.aboutus_stat1_title(),
                label: m.aboutus_stat1_description(),
            },
            {
                value: m.aboutus_stat2_title(),
                label: m.aboutus_stat2_description(),
            },
            {
                value: m.aboutus_stat3_title(),
                label: m.aboutus_stat3_description(),
            },
            {
                value: m.aboutus_stat4_title(),
                label: m.aboutus_stat4_description(),
            },
        ]}
    />

    <!-- Structure Section -->
    <div
        class="section-padding container-content flex flex-col md:flex-row gap-16 items-center"
    >
        <div class="w-full md:w-1/2 flex flex-col gap-8">
            <h2>{m.aboutus_structure()}</h2>
            <p>{m.aboutus_howmany()}</p>
            <ul>
                <li>{m.aboutus_status1()}</li>
                <li>{m.aboutus_status2()}</li>
                <li>{m.aboutus_status3()}</li>
                <li>{m.aboutus_status4()}</li>
            </ul>
            <p>{m.aboutus_structure2()}</p>
            <p>{m.aboutus_structure3()}</p>
        </div>
        <div class="w-full md:w-1/2 flex flex-col items-center gap-8">
            <img
                class="w-full"
                src="/images/ituk_struktuur_2026.png"
                alt="ITÜKi struktuur 2026"
            />
            <p class="opacity-50">{m.aboutus_structure4()}</p>
        </div>
    </div>

    <!-- Board Section -->
    <div
        class="section-padding container-content flex flex-col gap-8 items-center"
    >
        <h2>{m.aboutus_boardtitle()}</h2>
        {#if loading}
            <p class="text-gray">{m.common_loading()}</p>
        {:else if error}
            <p class="text-red-500">{error}</p>
        {:else}
            <div
                class="grid w-full grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4 justify-items-center"
            >
                {#each boardMembers as member}
                    <Card
                        title={member.name}
                        image={member.imagePath}
                        description={isEnglish
                            ? member.position_en
                            : member.position}
                        type="board"
                        email={member.email}
                    />
                {/each}
            </div>
        {/if}
    </div>

    <!-- History Section (Desktop only) -->
    <div
        class="section-padding container-content hidden lg:flex flex-col gap-8 items-center"
    >
        <h2>{m.aboutus_historytitle()}</h2>
        {#if loading}
            <p class="text-gray">{m.common_loading()}</p>
        {:else if error}
            <p class="text-red-500">{error}</p>
        {:else}
            <TimelineDesktop items={timelineEvents} />
        {/if}
        <h3>...ja kui tuleb veel huvitavaid asju, siis lisame siia!</h3>
    </div>
</div>
