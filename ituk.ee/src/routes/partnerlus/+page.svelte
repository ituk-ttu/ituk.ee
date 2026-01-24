<script lang="ts">
    import { onMount } from "svelte";
    import * as m from "$lib/paraglide/messages";
    import PageHeader from "$lib/components/PageHeader.svelte";
    import Statistics from "$lib/components/Statistics.svelte";
    import { getPartners, type Partner } from "$lib/firebase";
    import SEO from "$lib/components/SEO.svelte";
    import { SOCIAL_STATS, EVENTS_PER_YEAR } from "$lib/config/stats";

    let studentOrgs = $state<Partner[]>([]);
    let loading = $state(true);
    let error = $state<string | null>(null);

    onMount(async () => {
        try {
            studentOrgs = await getPartners();
        } catch (e) {
            console.error("Error loading student orgs:", e);
            error = "Failed to load student organizations";
        } finally {
            loading = false;
        }
    });
</script>

<SEO pageKey="partnerlus" />

<div>
    <PageHeader
        title={m.partners_header()}
        backgroundImage="/headers/cooperation.jpg"
    />

    <!-- Partners Section -->
    <div
        class="section-padding container-content items-center flex-col flex gap-8"
    >
        <h2 class="text-center">{m.partners_partners()}</h2>
        <div class="w-full flex flex-col sm:flex-row items-stretch gap-8">
            <a
                target="_blank"
                href="https://nortal.com/"
                class="flex-1 h-24 sm:h-32 p-4 bg-nortal rounded-xl flex justify-center items-center overflow-hidden"
            >
                <img
                    src="/images/partners/nortal.png"
                    alt="Nortal"
                    class="object-contain w-full h-full"
                    loading="lazy"
                />
            </a>
            <a
                target="_blank"
                href="https://netgroup.com/"
                class="flex-1 h-24 sm:h-32 p-4 bg-netgroup rounded-xl flex justify-center items-center overflow-hidden"
            >
                <img
                    src="/images/partners/netgroup.png"
                    alt="Netgroup"
                    class="object-contain w-full h-full"
                    loading="lazy"
                />
            </a>
            <a
                target="_blank"
                href="https://www.alecoq.ee/"
                class="flex-1 h-24 sm:h-32 p-4 bg-alecoq rounded-xl flex justify-center items-center overflow-hidden"
            >
                <img
                    src="/images/partners/alecoq.png"
                    alt="A.LeCoq"
                    class="object-contain w-full h-full"
                    loading="lazy"
                />
            </a>
            <a
                target="_blank"
                href="https://dominospizza.ee/"
                class="flex-1 h-24 sm:h-32 p-4 bg-dominos rounded-xl flex justify-center items-center overflow-hidden"
            >
                <img
                    src="/images/partners/dominos.png"
                    alt="Domino's"
                    class="object-contain w-full h-full"
                    loading="lazy"
                />
            </a>
        </div>
    </div>

    <!-- Student Orgs Section -->
    <div
        class="section-padding container-content items-center flex-col flex gap-8"
    >
        <h2 class="text-center">{m.partners_studentorgs()}</h2>
        {#if loading}
            <p class="text-gray">{m.common_loading()}</p>
        {:else if error}
            <p class="text-red-500">{error}</p>
        {:else if studentOrgs.length === 0}
            <p class="text-gray">No student organizations found</p>
        {:else}
            <div class="w-full flex flex-wrap justify-center gap-8">
                {#each studentOrgs as org}
                    <a
                        target="_blank"
                        href={org.link}
                        class="w-24 h-24 p-2 bg-white rounded-xl flex justify-center items-center overflow-hidden hover:scale-105 transition-transform"
                    >
                        <img
                            src={org.imagePath}
                            alt={org.name}
                            class="object-contain w-full h-full"
                            loading="lazy"
                        />
                    </a>
                {/each}
            </div>
        {/if}
    </div>

    <!-- Statistics Section -->
    <Statistics
        title={m.partners_offer()}
        items={[
            {
                value: SOCIAL_STATS.instagram.followers,
                label: m.partners_stat1_description(),
                link: SOCIAL_STATS.instagram.link,
            },
            {
                value: SOCIAL_STATS.facebook.followers,
                label: m.partners_stat2_description(),
                link: SOCIAL_STATS.facebook.link,
            },
            {
                value: SOCIAL_STATS.discord.members,
                label: m.partners_stat3_description(),
                link: SOCIAL_STATS.discord.link,
            },
            {
                value: EVENTS_PER_YEAR,
                label: m.partners_stat4_description(),
                link: "/uritused",
            },
        ]}
    />

    <!-- CTA Section -->
    <div
        class="section-padding container-content justify-center items-center gap-16 flex-col md:flex-row flex"
    >
        <div class="w-full md:w-1/2 flex flex-col gap-8">
            <h2>{m.partners_wish()}</h2>
            <p>{m.partners_goal()}</p>
            <h3>
                {m.partners_contact()}
                <a
                    class="text-primary underline hover:brightness-125"
                    href="mailto:kontakt@ituk.ee">kontakt@ituk.ee</a
                >
                {m.partners_contact2()}
            </h3>
        </div>
        <div class="w-full md:w-1/2">
            <img
                src="/images/koostoo.jpg"
                alt=""
                class="rounded-xl object-cover w-full h-72"
            />
        </div>
    </div>
</div>
