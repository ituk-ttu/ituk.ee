<script lang="ts">
    import * as m from "$lib/paraglide/messages";
    import SEO from "$lib/components/SEO.svelte";
</script>

<SEO pageKey="uritused" />

<div class="items-start flex-col sm:flex-row flex">
    <h1 class="hidden">Üritused</h1>
    <a
        class="w-full sm:w-1/3 justify-center items-center bg-center bg-cover flex-col flex"
        style="background-image: url('/events/haridus.jpg')"
        href="/uritused/haridus"
    >
        <div
            class="h-64 sm:h-screen main-max w-full bg-black/50 hover:bg-primary/50 transition-colors duration-150 ease-in-out justify-center items-center flex-row flex"
        >
            <h2 class="p-8 text-lead text-center">{m.events_education()}</h2>
        </div>
    </a>
    <a
        class="w-full sm:w-1/3 justify-center items-center bg-center bg-cover flex-col flex"
        style="background-image: url('/events/meelelahutus.jpg')"
        href="/uritused/meelelahutus"
    >
        <div
            class="h-64 sm:h-screen main-max w-full bg-black/50 hover:bg-primary/50 transition-colors duration-150 ease-in-out justify-center items-center flex-row flex"
        >
            <h2 class="p-8 text-lead text-center">
                {m.events_entertainment()}
            </h2>
        </div>
    </a>
    <a
        class="w-full sm:w-1/3 justify-center items-center bg-center bg-cover flex-col flex"
        style="background-image: url('/events/sisekad.jpg')"
        href="/uritused/muu"
    >
        <div
            class="h-64 sm:h-screen main-max w-full bg-black/50 hover:bg-primary/50 transition-colors duration-150 ease-in-out justify-center items-center flex-row flex"
        >
            <h2 class="p-8 text-lead text-center">{m.events_other()}</h2>
        </div>
    </a>
</div>
