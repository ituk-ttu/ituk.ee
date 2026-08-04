<script lang="ts">
    import { onMount } from "svelte";
    import { getLocale } from "$lib/paraglide/runtime";
    import * as m from "$lib/paraglide/messages";
    import {
        getBoardMembers,
        getTimelineEvents,
        getSetting,
        type BoardMember,
        type TimelineEvent,
    } from "$lib/firebase";
    import PageHeader from "$lib/components/PageHeader.svelte";
    import Card from "$lib/components/Card.svelte";
    import Statistics from "$lib/components/Statistics.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import TimelineDesktop from "$lib/components/TimelineDesktop.svelte";
    import SEO from "$lib/components/SEO.svelte";
    import { getYearsInAction } from "$lib/config/stats";
    import TuxGame from "$lib/components/TuxGame.svelte";

    // Statistics with defaults
    let statMembersAllTime = $state("1200+");
    let statActiveMembers = $state("45");
    let statGoals = $state("1");

    let showTuxGame = $state(false);
    let tuxHoverTimer: ReturnType<typeof setTimeout> | null = null;
    let tuxActivated = $state(false);
    let glassesLanded = $state(false);

    function startTuxHover() {
        if (tuxActivated) return;
        tuxHoverTimer = setTimeout(() => {
            tuxActivated = true;
            // Trigger glasses landing animation after a brief delay
            setTimeout(() => {
                glassesLanded = true;
            }, 50);
        }, 1500);
    }

    function endTuxHover() {
        if (tuxHoverTimer) {
            clearTimeout(tuxHoverTimer);
            tuxHoverTimer = null;
        }
    }

    function handleTuxClick() {
        if (tuxActivated) {
            showTuxGame = true;
        }
    }

    let boardMembers = $state<BoardMember[]>([]);
    let timelineEvents = $state<TimelineEvent[]>([]);
    let boardYear = $state("2025/2026");
    let loading = $state(true);
    let error = $state<string | null>(null);

    onMount(async () => {
        try {
            const [
                members,
                events,
                year,
                savedMembersAllTime,
                savedActiveMembers,
                savedGoals,
            ] = await Promise.all([
                getBoardMembers(),
                getTimelineEvents(),
                getSetting("boardYear"),
                getSetting("statMembersAllTime"),
                getSetting("statActiveMembers"),
                getSetting("statGoals"),
            ]);
            const activeYear = year || "2025/2026";
            boardMembers = members.filter(
                (m) => m.year === activeYear || !m.year,
            );
            timelineEvents = events;
            boardYear = activeYear;
            if (savedMembersAllTime) statMembersAllTime = savedMembersAllTime;
            if (savedActiveMembers) statActiveMembers = savedActiveMembers;
            if (savedGoals) statGoals = savedGoals;
        } catch (e) {
            console.error("Error loading data:", e);
            error = "Failed to load data";
        } finally {
            loading = false;
        }
    });

    const isEnglish = $derived(getLocale() === "en");
</script>

<SEO pageKey="meist" />

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
            <p>
                <a
                    href="/infoohtud"
                    class="text-primary underline hover:brightness-125"
                >
                    {m.infoevenings_aboutus()}
                </a>
            </p>
        </div>
        <div
            class="h-full justify-center items-stretch flex-col xs:flex-row flex gap-8"
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
                value: getYearsInAction(),
                label: m.aboutus_stat1_description(),
            },
            {
                value: statMembersAllTime,
                label: m.aboutus_stat2_description(),
            },
            {
                value: statActiveMembers,
                label: m.aboutus_stat3_description(),
            },
            {
                value: statGoals,
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
            <!-- Structure image with clickable Tux area -->
            <!-- Original image: Tux at 503,0 to 639,117. Image assumed ~800px wide -->
            <div class="relative w-full">
                <img
                    class="w-full"
                    src={isEnglish
                        ? "/images/ituk_struktuur_2026_en.png"
                        : "/images/ituk_struktuur_2026.png"}
                    alt={isEnglish
                        ? "ITÜK structure 2026"
                        : "ITÜKi struktuur 2026"}
                />
                <div
                    role="presentation"
                    onmouseenter={startTuxHover}
                    onmouseleave={endTuxHover}
                    onclick={handleTuxClick}
                    class="absolute left-1/2 -translate-x-1/2 transition-all duration-300 {tuxActivated
                        ? 'cursor-pointer'
                        : 'cursor-default'}"
                    style="top: 0; width: 17%; height: 18%;"
                >
                    <!-- Glasses that fly in from the top when activated -->
                    {#if tuxActivated}
                        <img
                            src="/tux/glasses.svg"
                            alt=""
                            class="absolute z-30 pointer-events-none transition-all duration-700 ease-out
                                {glassesLanded
                                ? 'opacity-100'
                                : 'opacity-0 -translate-y-20'}"
                            style="left: 3%; bottom: 3%; width: 90%; max-width: 64px; height: auto; max-height: 10px;"
                        />
                    {/if}
                </div>
            </div>
            <p class="text-gray">{m.aboutus_structure4()}</p>
        </div>
    </div>

    <!-- Board Section -->
    <div
        class="section-padding container-content flex flex-col gap-8 items-center"
    >
        <h2 class="text-center">{m.aboutus_boardtitle({ year: boardYear })}</h2>
        {#if loading}
            <Loading />
        {:else if error}
            <p class="text-red-500">{error}</p>
        {:else}
            <div
                class="grid w-full grid-cols-1 gap-4 sm:gap-8 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center"
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
        <h2 class="text-center">{m.aboutus_historytitle()}</h2>
        {#if loading}
            <Loading />
        {:else if error}
            <p class="text-red-500">{error}</p>
        {:else}
            <TimelineDesktop items={timelineEvents} />
        {/if}
        <h3 class="text-center">
            {m.aboutus_timeline_more()}
        </h3>
    </div>
</div>

{#if showTuxGame}
    <TuxGame onClose={() => (showTuxGame = false)} />
{/if}
