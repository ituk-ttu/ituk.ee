<script lang="ts">
    import * as m from "$lib/paraglide/messages";
    import PageHeader from "$lib/components/PageHeader.svelte";
    import Button from "$lib/components/Button.svelte";
    import SEO from "$lib/components/SEO.svelte";

    // NB! `time` is what's displayed, `end` is what decides dimming - keep them in sync
    // Summer timezone is used here!
    const info_evenings = [
        {
            date: m.infoohtu_date1(),
            location: "Akadeemia tee 15a, ICT-315",
            facebook: "https://fb.me/e/9H0AUReW9",
            time: "19:00 - 22:00",
            end: "2026-08-26T20:00:00+03:00"
        },
        {
            date: m.infoohtu_date2(),
            location: "Akadeemia tee 15a, ICT-315",
            facebook: "https://fb.me/e/5NDXGGKRW",
            time: "19:00 - 22:00",
            end: "2026-09-03T20:00:00+03:00"
        },
        {
            date: m.infoohtu_date3(),
            location: "Peatus, Telliskivi",
            facebook: "https://fb.me/e/7bub45Nm6",
            time: "19:00 - 22:00",
            end: "2026-09-10T20:00:00+03:00"
        },
        {
            date: m.infoohtu_date4(),
            location: "Akadeemia tee 15a, ICT-315",
            facebook: "https://fb.me/e/byXO8YPgw",
            time: "18:00 - 22:00",
            end: "2026-09-24T20:00:00+03:00"
        },
    ];

    const now = new Date();
    const isPast = (evening: { end: string }) => new Date(evening.end) < now;
</script>

<SEO pageKey="infoohtud" />

<div>
    <PageHeader
        title={m.infoohtud_title()}
        backgroundImage="/headers/meist.jpg"
    />

    <div class="section-padding container-content flex flex-col gap-8">
        <p>{m.infoohtud_intro1()}</p>
        <p>{m.infoohtud_intro2()}</p>
        <p>{m.infoohtud_intro3()}</p>


        <h2>{m.infoohtud_events_heading()}</h2>
        <ul class="list-none pl-0 flex flex-col gap-4">
            {#each info_evenings as evening}
                <li
                    class="bg-white/[0.03] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                    class:opacity-50={isPast(evening)}
                >
                    <div class="flex flex-col gap-1">
                        <span class="font-raleway font-bold text-h4">
                            {evening.date} — {evening.time}
                        </span>
                        <span class="font-raleway font-bold text-h4"></span>
                        <span class="text-base">
                            {evening.location || m.infoohtud_location_tba()}
                        </span>
                    </div>
                    <Button
                        variant="primary"
                        size="md"
                        text={m.infoohtud_fb_link()}
                        to={evening.facebook}
                    />
                </li>
            {/each}
        </ul>
    </div>
</div>
