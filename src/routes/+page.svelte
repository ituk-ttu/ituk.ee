<script lang="ts">
    import * as m from "$lib/paraglide/messages";
    import Button from "$lib/components/Button.svelte";
    import SEO from "$lib/components/SEO.svelte";
</script>

<SEO pageKey="home" />

<div>
    <!-- Hero Section -->
    <div
        class="relative w-full h-full"
        aria-label="ITÜK | TalTechi IT-teaduskonna üliõpilaskogu"
    >
        <img
            src="/images/hero.jpg"
            alt=""
            class="absolute inset-0 w-full h-full object-cover"
        />
        <div
            class="absolute z-10 top-0 left-0 w-full h-full"
            style="background: linear-gradient(180deg, rgba(135, 0, 66, 0.75) 0%, #131313 100%)"
        ></div>
        <div
            class="relative z-20 container-content justify-between items-end flex-row flex"
        >
            <div
                class="h-full w-full justify-center py-24 items-start flex-col flex"
            >
                <div class="items-start gap-16 flex-col flex">
                    <div class="bg-primary p-4">
                        <h1 class="font-bold text-big lowercase">&gt;itük_</h1>
                    </div>
                    <p class="text-title font-bold">{m.home_hero()}</p>
                    <div class="gap-8 flex-col sm:flex-row flex">
                        <Button
                            variant="primary"
                            size="lg"
                            text={m.home_joinus()}
                            to="https://forms.gle/ci5MnseRW3PB1fes6"
                        />
                        <Button
                            variant="secondary"
                            size="lg"
                            text={m.home_readaboutus()}
                            to="/meist"
                        />
                    </div>
                </div>
            </div>
            <div
                class="hidden lg:w-full justify-end items-end flex-col lg:flex relative"
            >
                <img
                    src="/images/tux_cover_cropped.png"
                    alt="ITÜKi maskott pingviin Tux 3.0"
                />
                <div
                    class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none"
                ></div>
            </div>
        </div>
    </div>

    <!-- Info Sections -->
    <div class="section-padding container-content flex flex-col gap-16">
        <!-- Events Section -->
        <div
            class="w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16"
        >
            <div class="w-full max-w-[512px] aspect-video relative">
                <img
                    class="object-cover rounded w-full h-full"
                    src="/images/hingematvad.jpg"
                    alt="ITÜKi liikmed ei mata nii pea hinge!"
                    loading="lazy"
                />
            </div>
            <div class="w-full max-w-[512px] flex flex-col gap-6 items-start">
                <div class="p-4 bg-primary">
                    <h2>{m.home_events()}</h2>
                </div>
                <p>{m.home_eventsdesc()}</p>
                <Button
                    variant="primary"
                    size="lg"
                    text={m.home_eventsbutton()}
                    to="/uritused"
                />
            </div>
        </div>

        <!-- Cooperation Section -->
        <div
            class="w-full flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-16"
        >
            <div class="w-full max-w-[512px] flex flex-col gap-6 items-start">
                <div class="p-4 bg-primary">
                    <h2>{m.home_coop()}</h2>
                </div>
                <p>{m.home_coopdesc()}</p>
                <Button
                    variant="primary"
                    size="lg"
                    text={m.home_coopbutton()}
                    to="/partnerlus"
                />
            </div>
            <div class="w-full max-w-[512px] aspect-video relative">
                <img
                    class="object-cover rounded w-full h-full"
                    src="/images/koostoo.jpg"
                    alt="ITÜKi liikmed tegemas omavahelist koostööd"
                    loading="lazy"
                />
            </div>
        </div>
    </div>
</div>
