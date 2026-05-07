<script lang="ts">
    interface Props {
        href: string;
        backgroundImage: string;
        title: string;
        height?: "full" | "half" | "third";
    }

    let { href, backgroundImage, title, height = "full" }: Props = $props();

    const heightClasses = {
        full: "h-64 sm:h-[calc(100vh-88px)]",
        half: "h-64 sm:h-[calc(50vh-44px)]",
        third: "h-64 sm:h-[calc(33vh-30px)]",
    };
</script>

<a
    {href}
    class="w-full justify-center items-center bg-center bg-cover flex-col flex"
    style="background-image: url({backgroundImage})"
>
    <div
        class="{heightClasses[
            height
        ]} w-full bg-black/50 hover:bg-primary/50 transition-colors duration-150 ease-in-out justify-center items-center flex-row flex"
    >
        <h2 class="p-8 text-lead text-center break-words">{title}</h2>
    </div>
</a>
