<script lang="ts">
    import { page } from "$app/stores";
    import { dev } from "$app/environment";

    // Cast error to include stack for debugging
    let errorStack = $derived(
        ($page.error as unknown as { stack?: string })?.stack,
    );
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
                class="w-full md:w-1/3 flex-col justify-center items-center flex gap-4"
            >
                <h1 class="text-7xl">{$page.status}</h1>
                <p class="text-center text-2xl">
                    {#if $page.status === 404}
                        Lehekülge ei leitud, küll aga sa leidsid keerlevad
                        Tuxid!
                    {:else}
                        Midagi läks valesti. Proovi hiljem uuesti.
                    {/if}
                </p>
                {#if dev && $page.error}
                    <div
                        class="mt-8 w-full max-w-2xl bg-black/50 p-4 rounded-lg"
                    >
                        <p class="text-red-400 font-bold mb-2">Debug Info</p>
                        <p class="text-white/80 font-mono text-sm break-all">
                            {$page.error.message}
                        </p>
                        {#if errorStack}
                            <details class="mt-2">
                                <summary
                                    class="text-white/60 cursor-pointer hover:text-white"
                                >
                                    Stack trace
                                </summary>
                                <pre
                                    class="mt-2 text-xs text-white/60 overflow-x-auto whitespace-pre-wrap">{errorStack}</pre>
                            </details>
                        {/if}
                    </div>
                {/if}
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
