<script lang="ts">
    import { page } from "$app/stores";
</script>

<div class="bg-[url('/headers/derp.jpg')] bg-top bg-cover">
    <div class="bg-extra">
        <div
            class="w-full min-h-screen section-padding justify-center items-center flex-col flex gap-8"
            style="background: linear-gradient(180deg, rgba(135, 0, 66, 0.75) 0%, rgba(135, 0, 66, 0.75) 50%, #131313 100%)"
        >
            <img
                src="https://http.cat/{$page.status}"
                alt="HTTP {$page.status}"
                class="max-w-full max-h-96 rounded-lg shadow-filled"
            />
            <p class="text-center text-xl max-w-md">
                {#if $page.status === 404}
                    Lehekülge ei leitud, küll aga sa leidsid kassi!
                {:else}
                    Midagi läks valesti. Proovi hiljem uuesti.
                {/if}
            </p>
        </div>
    </div>
</div>
