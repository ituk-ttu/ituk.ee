<script lang="ts">
    import { onMount } from "svelte";
    import * as m from "$lib/paraglide/messages";
    import { getLocale } from "$lib/paraglide/runtime";
    import PageHeader from "$lib/components/PageHeader.svelte";
    import Statistics from "$lib/components/Statistics.svelte";
    import Card from "$lib/components/Card.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import {
        getPartners,
        getSponsors,
        getSetting,
        type Partner,
        type Sponsor,
    } from "$lib/firebase";
    import SEO from "$lib/components/SEO.svelte";

    let sponsors = $state<Sponsor[]>([]);
    let studentOrgs = $state<Partner[]>([]);
    let loading = $state(true);
    let error = $state<string | null>(null);

    // Statistics with defaults
    let statInstagramFollowers = $state("1170");
    let statFacebookFollowers = $state("2000");
    let statDiscordMembers = $state("450");
    let statEventsPerYear = $state("30+");
    let socialInstagram = $state("https://www.instagram.com/ituk.taltech/");
    let socialFacebook = $state("https://www.facebook.com/ituk.taltech/");
    let socialDiscord = $state("https://discord.gg/ituk");

    onMount(async () => {
        try {
            const [
                sponsorsData,
                studentOrgsData,
                savedInstagram,
                savedFacebook,
                savedDiscord,
                savedEvents,
                savedInstagramLink,
                savedFacebookLink,
            ] = await Promise.all([
                getSponsors(),
                getPartners(),
                getSetting("statInstagramFollowers"),
                getSetting("statFacebookFollowers"),
                getSetting("statDiscordMembers"),
                getSetting("statEventsPerYear"),
                getSetting("socialInstagram"),
                getSetting("socialFacebook"),
            ]);
            sponsors = sponsorsData;
            studentOrgs = studentOrgsData;
            if (savedInstagram) statInstagramFollowers = savedInstagram;
            if (savedFacebook) statFacebookFollowers = savedFacebook;
            if (savedDiscord) statDiscordMembers = savedDiscord;
            if (savedEvents) statEventsPerYear = savedEvents;
            if (savedInstagramLink) socialInstagram = savedInstagramLink;
            if (savedFacebookLink) socialFacebook = savedFacebookLink;
        } catch (e) {
            console.error("Error loading data:", e);
            error = "Failed to load data";
        } finally {
            loading = false;
        }
    });

    function getLocalizedName(org: Partner): string {
        return getLocale() === "en" && org.name_en ? org.name_en : org.name;
    }
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
        {#if loading}
            <Loading />
        {:else if sponsors.length === 0}
            <p class="text-gray">No sponsors found</p>
        {:else}
            <div
                class="w-full flex flex-col sm:flex-row items-stretch gap-8 flex-wrap justify-center"
            >
                {#each sponsors as sponsor}
                    <a
                        target="_blank"
                        href={sponsor.link}
                        class="flex-1 min-w-[200px] max-w-[300px] h-24 sm:h-32 p-4 rounded-xl flex justify-center items-center overflow-hidden"
                        style="background-color: {sponsor.bgColor}"
                    >
                        <img
                            src={sponsor.imagePath}
                            alt={sponsor.name}
                            class="object-contain w-full h-full"
                            loading="lazy"
                        />
                    </a>
                {/each}
            </div>
        {/if}
    </div>

    <!-- Student Orgs Section -->
    <div
        class="section-padding container-content items-center flex-col flex gap-8"
    >
        <h2 class="text-center">{m.partners_studentorgs()}</h2>
        {#if loading}
            <Loading />
        {:else if error}
            <p class="text-red-500">{error}</p>
        {:else if studentOrgs.length === 0}
            <p class="text-gray">No student organizations found</p>
        {:else}
            <div
                class="grid min-w-full grid-cols-1 gap-8 xs:grid-cols-2 lg:grid-cols-4 justify-items-center"
            >
                {#each studentOrgs as org}
                    <Card
                        link={org.link}
                        title={getLocalizedName(org)}
                        image={org.imagePath}
                        listItems={org.projects}
                        type="list"
                    />
                {/each}
            </div>
        {/if}
    </div>

    <!-- Statistics Section -->
    <Statistics
        title={m.partners_offer()}
        items={[
            {
                value: statInstagramFollowers,
                label: m.partners_stat1_description(),
                link: socialInstagram,
            },
            {
                value: statFacebookFollowers,
                label: m.partners_stat2_description(),
                link: socialFacebook,
            },
            {
                value: statDiscordMembers,
                label: m.partners_stat3_description(),
                link: socialDiscord,
            },
            {
                value: statEventsPerYear,
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
