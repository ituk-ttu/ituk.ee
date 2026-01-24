<script lang="ts">
    interface Props {
        size?: "sm" | "md" | "lg";
    }

    let { size = "md" }: Props = $props();

    const sizeClasses = {
        sm: "w-6 h-6",
        md: "w-12 h-12",
        lg: "w-16 h-16",
    };
</script>

<div
    class="animate-spin rounded-full border-4 border-gray/30 border-t-primary {sizeClasses[
        size
    ]}"
></div>
