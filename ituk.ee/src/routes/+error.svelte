<script lang="ts">
    import { page } from "$app/stores";
</script>

<div class="bg-[url('/headers/derp.jpg')] bg-top bg-cover">
    <div class="bg-extra">
        <div
            class="w-full min-h-screen section-padding justify-center items-center flex-col md:flex-row flex gap-16"
            style="background: linear-gradient(180deg, rgba(135, 0, 66, 0.75) 0%, rgba(135, 0, 66, 0.75) 50%, #131313 100%)"
        >
            <div class="w-full md:w-1/3 flex-row justify-center items-end flex">
                <img
                    class="animate-spin-slow"
                    src="/images/tux_spin_cw.gif"
                    width="420"
                    height="420"
                    alt="Spinning Tux"
                />
            </div>
            <div
                class="w-full md:w-1/3 flex-col justify-center items-center flex"
            >
                <h1 class="text-big">{$page.status}</h1>
                <p class="text-center text-3xl">
                    {#if $page.status === 404}
                        Lehekülge ei leitud, küll aga sa leidsid keerlevad
                        Tuxid!
                    {:else}
                        Midagi läks valesti. Proovi hiljem uuesti.
                    {/if}
                </p>
            </div>
            <div class="w-full md:w-1/3 flex-row justify-center items-end flex">
                <img
                    class="animate-spin-slow-reverse"
                    src="/images/tux_spin.gif"
                    width="420"
                    height="420"
                    alt="Spinning Tux"
                />
            </div>
        </div>
    </div>
</div>
