<script lang="ts" module>
    // Export function to check if form has changes
    export function hasChanges(
        formData: Record<string, string>,
        initialData: Record<string, string>,
    ): boolean {
        for (const key of Object.keys(formData)) {
            if ((formData[key] || "") !== (initialData[key] || "")) {
                return true;
            }
        }
        return false;
    }
</script>

<script lang="ts">
    import InputField from "./InputField.svelte";
    import TextArea from "./TextArea.svelte";
    import Button from "./Button.svelte";
    import { validate, schemas } from "$lib/admin/validation";
    import { toasts } from "$lib/stores/toast";

    interface Props {
        id?: string;
        type:
            | "board"
            | "event"
            | "eventYear"
            | "rent"
            | "image"
            | "sponsor"
            | "partner"
            | "timeline";
        initialData?: Record<string, string>;
        onSave?: (data: Record<string, string>) => void;
        onDelete?: (id: string) => void;
        onDirtyChange?: (isDirty: boolean) => void;
    }

    let {
        id = "",
        type,
        initialData = {},
        onSave,
        onDelete,
        onDirtyChange,
    }: Props = $props();

    // Default fields for each type to avoid undefined bindings
    const defaultFields: Record<string, Record<string, string>> = {
        board: {
            name: "",
            position: "",
            position_en: "",
            email: "",
            imagePath: "",
        },
        event: {
            name: "",
            name_en: "",
            description: "",
            description_en: "",
            banner: "",
            category: "",
            handle: "",
        },
        eventYear: {
            name: "",
            name_en: "",
            description: "",
            description_en: "",
            extraInformation: "",
            extraInformation_en: "",
            imagePath: "",
            date: "",
            handle: "",
        },
        rent: {
            name: "",
            name_en: "",
            description: "",
            description_en: "",
            imagePath: "",
        },
        image: { name: "", imagePath: "" },
        sponsor: {
            name: "",
            imagePath: "/sponsors/nortal.png",
            link: "",
            bgColor: "#FFFFFF",
        },
        partner: {
            name: "",
            name_en: "",
            imagePath: "",
            link: "",
            projects: "",
        },
        timeline: {
            name: "",
            date: "",
            imagePath: "",
        },
    };

    // Form state - initialize with defaults to avoid undefined bindings
    let formData = $state<Record<string, string>>({ ...defaultFields[type] });
    let originalData = $state<Record<string, string>>({
        ...defaultFields[type],
    });
    let lastId = $state<string | undefined>(undefined);

    // Sync form data when initialData or id changes
    $effect(() => {
        // Only update if id actually changed (new item selected)
        if (id !== lastId || lastId === undefined) {
            const newData = { ...defaultFields[type], ...initialData };
            formData = newData;
            originalData = { ...newData };
            lastId = id;
        }
    });

    // Check if form is dirty (has unsaved changes)
    let isDirty = $derived(hasChanges(formData, originalData));

    // Notify parent when dirty state changes
    $effect(() => {
        if (onDirtyChange) {
            onDirtyChange(isDirty);
        }
    });

    // Validation errors
    let validationErrors = $state<Record<string, string>>({});

    // Image preview
    let imagePreview = $derived(
        formData.imagePath ||
            formData.image ||
            formData.banner ||
            "/ituk_placeholder.jpg",
    );

    function handleSave() {
        // Validate if schema exists for this type
        const schema = schemas[type];
        if (schema) {
            const result = validate(formData, schema);
            validationErrors = result.errors;
            if (!result.valid) {
                const errorCount = Object.keys(result.errors).length;
                toasts.warning(
                    "Valideerimise viga",
                    `${errorCount} välja vajab parandamist`,
                );
                return;
            }
        }

        if (onSave) {
            onSave({ id, ...formData });
            validationErrors = {};
        }
    }

    function handleDelete() {
        if (
            onDelete &&
            id &&
            confirm("Kas oled kindel, et soovid kustutada?")
        ) {
            onDelete(id);
        }
    }
</script>

<div class="w-full rounded-lg overflow-hidden bg-white/5">
    <!-- Image Preview -->
    <div class="w-full aspect-square bg-background overflow-hidden">
        <img
            src={imagePreview}
            alt="Preview"
            class="w-full h-full object-cover"
        />
    </div>

    <!-- Form Fields -->
    <div
        class="p-4 flex flex-col gap-3 bg-gradient-to-b from-primary/30 to-primary/10"
    >
        {#if type === "board"}
            <InputField
                label="Ametinimetus"
                placeholder="Esimees"
                bind:value={formData.position}
                error={validationErrors.position}
                required
            />
            <InputField
                label="Ametinimetus (EN)"
                placeholder="Chairman"
                bind:value={formData.position_en}
                error={validationErrors.position_en}
                required
            />
            <InputField
                label="Täisnimi"
                placeholder="Nimi Nimetus"
                bind:value={formData.name}
                error={validationErrors.name}
                required
            />
            <InputField
                label="Pildi link"
                placeholder="/board/2025/1_esimees.jpg"
                bind:value={formData.imagePath}
                error={validationErrors.imagePath}
                required
            />
            <InputField
                label="Meiliaadress"
                placeholder="esimees@ituk.ee"
                type="email"
                bind:value={formData.email}
                error={validationErrors.email}
                required
            />
        {:else if type === "event"}
            <InputField
                label="Ürituse nimi"
                placeholder="Don't Do IT"
                bind:value={formData.name}
                error={validationErrors.name}
                required
            />
            <InputField
                label="Ürituse nimi (EN)"
                placeholder="Don't Do IT"
                bind:value={formData.name_en}
                error={validationErrors.name_en}
                required
            />
            <TextArea
                label="Kirjeldus"
                placeholder="Ürituse kirjeldus..."
                bind:value={formData.description}
            />
            <TextArea
                label="Kirjeldus (EN)"
                placeholder="Event description..."
                bind:value={formData.description_en}
            />
            <InputField
                label="Banner pildi link"
                placeholder="/events/ddit.jpg"
                bind:value={formData.banner}
            />
            <InputField
                label="Kategooria"
                placeholder="meelelahutus / haridus / muu"
                bind:value={formData.category}
                error={validationErrors.category}
                required
            />
            <InputField
                label="Handle"
                placeholder="dont-do-it"
                bind:value={formData.handle}
                error={validationErrors.handle}
                required
            />
        {:else if type === "eventYear"}
            <InputField
                label="Ürituse nimi koos aastaga"
                placeholder="Don't Do IT 2024"
                bind:value={formData.name}
                required
            />
            <InputField
                label="Ürituse nimi (EN)"
                placeholder="Don't Do IT 2024"
                bind:value={formData.name_en}
            />
            <TextArea
                label="Kirjeldus"
                placeholder="Kirjeldus..."
                bind:value={formData.description}
            />
            <TextArea
                label="Kirjeldus (EN)"
                placeholder="Description..."
                bind:value={formData.description_en}
            />
            <TextArea
                label="Lisainfo"
                placeholder="Lisainfo..."
                bind:value={formData.extraInformation}
            />
            <TextArea
                label="Lisainfo (EN)"
                placeholder="Extra information..."
                bind:value={formData.extraInformation_en}
            />
            <InputField
                label="Pildi link"
                placeholder="/events/ddit_2024.jpg"
                bind:value={formData.imagePath}
            />
            <InputField
                label="Kuupäev/Aasta"
                placeholder="2024"
                bind:value={formData.date}
            />
            <InputField
                label="Handle"
                placeholder="dont-do-it"
                bind:value={formData.handle}
            />
        {:else if type === "rent"}
            <InputField
                label="Seadme nimi"
                placeholder="Pikendusjuhtmed"
                bind:value={formData.name}
                required
            />
            <InputField
                label="Seadme nimi (EN)"
                placeholder="Extension cords"
                bind:value={formData.name_en}
            />
            <InputField
                label="Kirjeldus"
                placeholder="5€/päev"
                bind:value={formData.description}
            />
            <InputField
                label="Kirjeldus (EN)"
                placeholder="5€/day"
                bind:value={formData.description_en}
            />
            <InputField
                label="Pildi link"
                placeholder="/rent/pikendusjuhtmed.jpg"
                bind:value={formData.imagePath}
            />
        {:else if type === "image"}
            <InputField
                label="Pildi nimi"
                placeholder="Galerii pilt"
                bind:value={formData.name}
            />
            <InputField
                label="Pildi link"
                placeholder="/gallery/image.jpg"
                bind:value={formData.imagePath}
            />
        {:else if type === "sponsor"}
            <InputField
                label="Sponsori nimi"
                placeholder="Nortal"
                bind:value={formData.name}
                required
            />
            <InputField
                label="Logo link"
                placeholder="/images/partners/nortal.png"
                bind:value={formData.imagePath}
                required
            />
            <InputField
                label="Veebileht"
                placeholder="https://nortal.com/"
                bind:value={formData.link}
                required
            />
            <InputField
                label="Taustavärv (hex)"
                placeholder="#FFFFFF"
                bind:value={formData.bgColor}
            />
        {:else if type === "partner"}
            <InputField
                label="Organisatsiooni nimi"
                placeholder="Tudengite Teaduselts"
                bind:value={formData.name}
                required
            />
            <InputField
                label="Nimi (EN)"
                placeholder="Student Science Society"
                bind:value={formData.name_en}
            />
            <InputField
                label="Logo link"
                placeholder="/partners/logo.jpg"
                bind:value={formData.imagePath}
                required
            />
            <InputField
                label="Veebileht"
                placeholder="https://example.com/"
                bind:value={formData.link}
                required
            />
            <InputField
                label="Projektid (komadega eraldatud)"
                placeholder="Projekt 1, Projekt 2"
                bind:value={formData.projects}
            />
        {:else if type === "timeline"}
            <InputField
                label="Nimi"
                placeholder="ITÜK asutamine"
                bind:value={formData.name}
                error={validationErrors.name}
                required
            />
            <div class="flex flex-col gap-2">
                <span class="text-sm font-medium text-white">
                    <span class="text-primary">* </span>Kuupäev
                </span>
                <input
                    type="date"
                    bind:value={formData.date}
                    required
                    class="w-full px-4 py-3 bg-white/5 font-noto text-white rounded-lg
                        focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
                        disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200
                        {validationErrors.date ? 'border-red-500' : ''}"
                />
                {#if validationErrors.date}
                    <span class="text-xs text-red-500"
                        >{validationErrors.date}</span
                    >
                {/if}
            </div>
            <InputField
                label="Pildi link"
                placeholder="/timeline/asutamine.jpg"
                bind:value={formData.imagePath}
            />
        {/if}

        <!-- Actions -->
        <div class="flex gap-2 mt-2">
            <Button variant="primary" text="Salvesta" onclick={handleSave} />
            {#if id && onDelete}
                <Button
                    variant="secondary"
                    text="Kustuta"
                    onclick={handleDelete}
                />
            {/if}
        </div>
    </div>
</div>
