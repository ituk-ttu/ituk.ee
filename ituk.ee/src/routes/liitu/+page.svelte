<script lang="ts">
    import * as m from "$lib/paraglide/messages";
    import PageHeader from "$lib/components/PageHeader.svelte";
    import Card from "$lib/components/Card.svelte";
</script>

<div>
    <PageHeader title={m.join_header()} backgroundImage="/headers/liitu.jpg" />

    <div
        class="section-padding container-content flex flex-col justify-center items-center gap-8"
    >
        <h2>{m.join_text1()}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card
                title={m.join_card1_title()}
                image="/images/uritused.jpg"
                description={m.join_card1_description()}
                type="default"
            />
            <Card
                title={m.join_card2_title()}
                image="/images/uritused.jpg"
                description={m.join_card2_description()}
                type="default"
            />
            <Card
                title={m.join_card3_title()}
                image="/images/uritused.jpg"
                description={m.join_card3_description()}
                type="default"
            />
            <Card
                title={m.join_card4_title()}
                image="/images/uritused.jpg"
                description={m.join_card4_description()}
                type="default"
            />
        </div>
        <p class="text-center">{m.join_text2()}</p>
    </div>
</div>
