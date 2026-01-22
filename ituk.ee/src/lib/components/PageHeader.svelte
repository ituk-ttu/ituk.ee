<script lang="ts">
    interface Props {
        title: string;
        backgroundImage: string;
    }

    let { title, backgroundImage }: Props = $props();
</script>

<div
    class="items-center justify-center h-full w-full bg-center bg-cover flex-row flex"
    style="background-image: url({backgroundImage})"
>
    <div
        class="w-full h-full bg-extra justify-center items-center flex-row flex"
    >
        <div
            class="section-padding w-full h-full"
            style="background: linear-gradient(180deg, rgba(135, 0, 66, 0.75) 0%, rgba(135, 0, 66, 0.75) 50%, #131313 100%)"
        >
            <h1 class="text-big text-center">{title}</h1>
        </div>
    </div>
</div>
