<script lang="ts">
    import { onMount } from "svelte";

    interface StatItem {
        value: string;
        label: string;
    }

    interface Props {
        title: string;
        items: StatItem[];
    }

    let { title, items }: Props = $props();
    let containerRef: HTMLElement;
    let displayValues = $state<string[]>([]);
    let hasAnimated = $state(false);

    $effect(() => {
        if (displayValues.length === 0 && items.length > 0) {
            displayValues = items.map(() => "0");
        }
    });

    function parseValue(value: string): { num: number; suffix: string } {
        const match = value.match(/^(\d+)(.*)$/);
        if (match) {
            return { num: parseInt(match[1], 10), suffix: match[2] };
        }
        return { num: 0, suffix: value };
    }

    function animateCount(
        index: number,
        targetNum: number,
        suffix: string,
        duration: number = 2000,
    ) {
        const startTime = performance.now();
        const startValue = 0;

        function update(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(
                startValue + (targetNum - startValue) * easeOut,
            );

            displayValues[index] = currentValue + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    onMount(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        hasAnimated = true;
                        items.forEach((item, index) => {
                            const { num, suffix } = parseValue(item.value);
                            if (num > 0) {
                                animateCount(index, num, suffix);
                            } else {
                                displayValues[index] = item.value;
                            }
                        });
                    }
                });
            },
            { threshold: 0.2 },
        );

        if (containerRef) {
            observer.observe(containerRef);
        }

        return () => observer.disconnect();
    });
</script>

<div
    bind:this={containerRef}
    class="section-padding bg-primary container-content flex flex-col md:flex-row justify-between items-center gap-8"
>
    <h2 class="text-center md:text-left">{title}</h2>
    <div class="flex flex-wrap justify-center md:justify-end gap-8">
        {#each items as item, index}
            <div class="flex flex-col items-center gap-4">
                <span class="text-4xl sm:text-5xl font-bold">
                    {displayValues[index]}
                </span>
                <span class="text-center">{item.label}</span>
            </div>
        {/each}
    </div>
</div>
