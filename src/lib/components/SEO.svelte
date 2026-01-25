<script lang="ts">
    import { getLocale } from "$lib/paraglide/runtime";
    import { getLocalizedMetadata, siteMetadata } from "$lib/config/metadata";

    interface Props {
        pageKey: string;
    }

    let { pageKey }: Props = $props();

    const locale = $derived(getLocale());
    const meta = $derived(getLocalizedMetadata(pageKey, locale));
</script>

<svelte:head>
    <title>{meta.title}</title>
    <meta name="description" content={meta.description} />
    <meta property="og:title" content={meta.title} />
    <meta property="og:description" content={meta.description} />
    <meta property="og:image" content={meta.image} />
    <meta property="og:type" content={meta.type} />
    <meta property="og:site_name" content={siteMetadata.siteName} />
</svelte:head>
