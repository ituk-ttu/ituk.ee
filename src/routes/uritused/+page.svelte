<script lang="ts">
    import * as m from "$lib/paraglide/messages";
    import SEO from "$lib/components/SEO.svelte";
    import ImageButton from "$lib/components/ImageButton.svelte";
</script>

<SEO pageKey="uritused" />

<div class="items-start flex-col sm:flex-row flex">
    <h1 class="hidden">Üritused</h1>
    <div class="w-full sm:w-1/3">
        <ImageButton
            href="/uritused/haridus"
            backgroundImage="/headers/haridus.jpg"
            title={m.events_education()}
        />
    </div>
    <div class="w-full sm:w-1/3">
        <ImageButton
            href="/uritused/meelelahutus"
            backgroundImage="/headers/meelelahutus.jpg"
            title={m.events_entertainment()}
        />
    </div>
    <div class="w-full sm:w-1/3">
        <ImageButton
            href="/uritused/muu"
            backgroundImage="/headers/sisekad.jpg"
            title={m.events_other()}
        />
    </div>
</div>
