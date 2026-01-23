<script lang="ts">
    import Card from "./Card.svelte";

    interface TimelineItem {
        title: string;
        imagePath: string;
        year: Date;
    }

    interface Props {
        items: TimelineItem[];
    }

    let { items }: Props = $props();

    // Responsive cards per row: 3 at xl (1280px+), 2 at lg (1024px+)
    let windowWidth = $state(
        typeof window !== "undefined" ? window.innerWidth : 1280,
    );

    const cardsPerRow = $derived(windowWidth >= 1280 ? 3 : 2);

    // Group items into rows based on cardsPerRow
    const rows = $derived(() => {
        const result: TimelineItem[][] = [];
        for (let i = 0; i < items.length; i += cardsPerRow) {
            result.push(items.slice(i, i + cardsPerRow));
        }
        return result;
    });

    function formatDate(date: Date): string {
        return date.toLocaleDateString("et-EE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }

    function formatYear(date: Date): string {
        return date.getFullYear().toString();
    }

    // Get first item's year for Start, current year for End
    const firstYear = $derived(
        items.length > 0 ? formatYear(items[0].year) : "",
    );
    const lastYear = new Date().getFullYear().toString();

    // Get items for a row, reversed for odd rows (visual right-to-left)
    function getRowItems(
        row: TimelineItem[],
        rowIndex: number,
    ): TimelineItem[] {
        return rowIndex % 2 === 0 ? row : [...row].reverse();
    }
</script>

<svelte:window bind:innerWidth={windowWidth} />

<!-- Timeline container: hidden below lg (1024px) -->
<div class="hidden lg:flex flex-col items-start">
    {#each rows() as row, rowIndex}
        {@const isEvenRow = rowIndex % 2 === 0}
        {@const isLastRow = rowIndex === rows().length - 1}
        {@const isFirstRow = rowIndex === 0}
        {@const cardsInRow = row.length}
        {@const displayItems = getRowItems(row, rowIndex)}

        <!-- Row: all elements h-[460px] -->
        <div class="flex items-stretch">
            <!-- Left connector -->
            {#if isFirstRow}
                <!-- Start: year + arrow pointing right -->
                <div
                    class="w-[128px] h-[460px] shrink-0 flex flex-col gap-4 pb-[354px]"
                >
                    <div class="flex-1 flex items-end justify-center">
                        <p class="text-2xl font-bold">{firstYear}</p>
                    </div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="128"
                        height="24"
                        viewBox="0 0 128 24"
                        fill="white"
                    >
                        <path
                            d="M20 10L0 0V24L20 14H128V10H20Z"
                            fill="currentColor"
                        />
                    </svg>
                </div>
            {:else if isEvenRow}
                <!-- Connector down right: vertical down then horizontal right -->
                <div
                    class="w-[128px] h-[460px] shrink-0 flex flex-col items-start pb-[364px] pl-[90px]"
                >
                    <div class="flex-1 flex flex-col items-start w-full">
                        <div class="w-1 flex-1 bg-white"></div>
                        <div class="h-1 w-full bg-white"></div>
                    </div>
                </div>
            {:else}
                <!-- Connector left down: horizontal left then vertical down -->
                <div
                    class="w-[128px] h-[460px] shrink-0 flex flex-col items-start pt-[92px] pl-[90px]"
                >
                    <div class="h-1 w-full bg-white"></div>
                    <div class="w-1 flex-1 bg-white"></div>
                </div>
            {/if}

            <!-- Cards and connectors between them -->
            {#each displayItems as item, cardIndex}
                <!-- Card cell: date on top, line with dot, card below -->
                <div class="h-[460px] shrink-0 flex flex-col gap-4">
                    <!-- Date area: flex-1 pushes content to bottom -->
                    <div class="flex-1 flex items-end justify-center">
                        <p class="text-2xl font-bold">
                            {formatDate(item.year)}
                        </p>
                    </div>
                    <!-- Line with dot: h-24 -->
                    <div
                        class="h-6 w-[256px] relative flex items-center justify-center shrink-0"
                    >
                        <div
                            class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-white"
                        ></div>
                        <div
                            class="relative w-4 h-4 rounded-full bg-white"
                        ></div>
                    </div>
                    <!-- Card -->
                    <Card
                        title={item.title}
                        image={item.imagePath}
                        type="timeline"
                    />
                </div>

                <!-- Connector between cards -->
                {#if cardIndex < cardsInRow - 1}
                    <div class="w-[128px] h-[460px] shrink-0 pt-[83px]">
                        <div class="h-[22px] flex items-center py-2">
                            <div class="h-1 w-full bg-white"></div>
                        </div>
                    </div>
                {/if}
            {/each}

            <!-- Right connector -->
            {#if isLastRow && isEvenRow}
                <!-- End: year + arrow pointing right -->
                <div
                    class="w-[128px] h-[460px] shrink-0 flex flex-col gap-4 pb-[354px]"
                >
                    <div class="flex-1 flex items-end justify-center">
                        <p class="text-2xl font-bold">{lastYear}</p>
                    </div>
                    <svg
                        width="128"
                        height="24"
                        viewBox="0 0 128 24"
                        fill="none"
                        class="shrink-0"
                    >
                        <path
                            d="M0 10H116V0L128 12L116 24V14H0V10Z"
                            fill="white"
                        />
                    </svg>
                </div>
            {:else if isLastRow && !isEvenRow}
                <!-- End on odd row: year + arrow pointing left -->
                <div
                    class="w-[128px] h-[460px] shrink-0 flex flex-col gap-4 pb-[354px]"
                >
                    <div class="flex-1 flex items-end justify-center">
                        <p class="text-2xl font-bold">{lastYear}</p>
                    </div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="128"
                        height="24"
                        viewBox="0 0 128 24"
                        fill="white"
                    >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M104 14V24L128 12L104 0V10H0V14H104Z"
                            fill="currentColor"
                        />
                    </svg>
                </div>
            {:else if isEvenRow}
                <!-- Connector right down: horizontal right then vertical down -->
                <div
                    class="w-[128px] h-[460px] shrink-0 flex flex-col items-end pt-[92px] pr-[90px]"
                >
                    <div class="h-1 w-full bg-white"></div>
                    <div class="w-1 flex-1 bg-white"></div>
                </div>
            {:else}
                <!-- Connector down left: vertical down then horizontal left -->
                <div
                    class="w-[128px] h-[460px] shrink-0 flex flex-col items-end pb-[364px] pr-[90px]"
                >
                    <div class="flex-1 flex flex-col items-end w-full">
                        <div class="w-1 flex-1 bg-white"></div>
                        <div class="h-1 w-full bg-white"></div>
                    </div>
                </div>
            {/if}
        </div>
    {/each}
</div>
