<script lang="ts">
    import { onMount } from "svelte";
    import {
        signInWithEmailAndPassword,
        onAuthStateChanged,
        signOut,
        type User,
    } from "firebase/auth";
    import {
        auth,
        db,
        getBoardMembers,
        getSetting,
        setSetting,
        type BoardMember,
    } from "$lib/firebase";
    import {
        collection,
        getDocs,
        query,
        orderBy,
        addDoc,
        updateDoc,
        deleteDoc,
        doc,
        Timestamp,
        type DocumentData,
    } from "firebase/firestore";
    import Button from "$lib/components/Button.svelte";
    import AdminCard from "$lib/components/AdminCard.svelte";
    import AdminPreviewCard from "$lib/components/AdminPreviewCard.svelte";
    import InputField from "$lib/components/InputField.svelte";
    import TextArea from "$lib/components/TextArea.svelte";
    import PageHeader from "$lib/components/PageHeader.svelte";
    import { toasts } from "$lib/stores/toast";

    // Auth state
    let user = $state<User | null>(null);
    let email = $state("");
    let password = $state("");
    let loading = $state(true);

    // Page state
    let currentPage = $state<
        "juhatus" | "uritused" | "rent" | "logiraamat" | ""
    >("");

    // Data
    let boardMembers = $state<BoardMember[]>([]);
    let rentables = $state<any[]>([]);
    let events = $state<any[]>([]);
    let logbook = $state<any[]>([]);

    // Form state for adding/editing items
    let showAddForm = $state<string | null>(null);
    let selectedBoardMember = $state<BoardMember | null>(null);
    let selectedEvent = $state<any | null>(null);
    let selectedRentItem = $state<any | null>(null);

    // Track if current form has unsaved changes
    let formIsDirty = $state(false);

    // Helper to switch selection with dirty check
    function selectBoardMember(member: BoardMember | null) {
        if (
            formIsDirty &&
            selectedBoardMember &&
            member?.id !== selectedBoardMember.id
        ) {
            if (
                !confirm("Sul on salvestamata muudatused. Kas soovid jätkata?")
            ) {
                return;
            }
        }
        selectedBoardMember = member;
        showAddForm = null;
        formIsDirty = false;
    }

    function selectEvent(event: any | null) {
        if (formIsDirty && selectedEvent && event?.id !== selectedEvent.id) {
            if (
                !confirm("Sul on salvestamata muudatused. Kas soovid jätkata?")
            ) {
                return;
            }
        }
        selectedEvent = event;
        showAddForm = null;
        formIsDirty = false;
    }

    function selectRentItem(item: any | null) {
        if (
            formIsDirty &&
            selectedRentItem &&
            item?.id !== selectedRentItem.id
        ) {
            if (
                !confirm("Sul on salvestamata muudatused. Kas soovid jätkata?")
            ) {
                return;
            }
        }
        selectedRentItem = item;
        showAddForm = null;
        formIsDirty = false;
    }

    // Board year state
    let boardYear = $state("2025/2026"); // Active year (saved to Firebase)
    let viewYear = $state("2025/2026"); // Year being viewed/edited in admin
    const yearOptions = ["2023/2024", "2024/2025", "2025/2026", "2026/2027"];

    // Filtered board members by viewYear
    let filteredBoardMembers = $derived(
        boardMembers.filter(
            (m) => m.year === viewYear || (!m.year && viewYear === boardYear),
        ),
    );

    // Event category filter
    let eventCategoryFilter = $state<string>("all");
    let eventCategories = $derived([
        ...new Set(events.map((e) => e.category).filter(Boolean)),
    ]);
    let filteredEvents = $derived(
        eventCategoryFilter === "all"
            ? events
            : events.filter((e) => e.category === eventCategoryFilter),
    );

    async function saveBoardYear() {
        try {
            await setSetting("boardYear", boardYear);
            toasts.success("Salvestatud", "Õppeaasta edukalt salvestatud!");
        } catch (e) {
            console.error("Error saving board year:", e);
            toasts.error("Viga", "Õppeaasta salvestamisel tekkis viga");
        }
    }

    onMount(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            user = u;
            loading = false;
            if (u) {
                loadData();
            }
        });
        return unsubscribe;
    });

    async function loadData() {
        try {
            boardMembers = await getBoardMembers();

            // Load board year setting
            const savedYear = await getSetting("boardYear");
            if (savedYear) boardYear = savedYear;

            // Load rentables
            const rentSnapshot = await getDocs(
                query(collection(db, "rent"), orderBy("imagePath", "asc")),
            );
            rentables = rentSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Load events
            const eventsSnapshot = await getDocs(
                query(collection(db, "events"), orderBy("category", "asc")),
            );
            events = eventsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Load logbook
            const logSnapshot = await getDocs(
                query(collection(db, "logbook"), orderBy("date", "desc")),
            );
            logbook = logSnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    date: data.date?.toDate?.() || new Date(),
                };
            });
        } catch (e) {
            console.error("Error loading data:", e);
        }
    }

    async function handleLogin(e: Event) {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toasts.success("Sisse logitud", "Tere tulemast tagasi!");
        } catch (error: any) {
            toasts.error("Sisselogimine ebaõnnestus", error.message);
        }
    }

    async function handleLogout() {
        await signOut(auth);
    }

    // Board member CRUD
    async function saveBoardMember(data: Record<string, string>) {
        try {
            const { id, ...memberData } = data;
            // Always include the year field
            const dataWithYear = { ...memberData, year: viewYear };
            if (id) {
                await updateDoc(doc(db, "board", id), dataWithYear);
            } else {
                await addDoc(collection(db, "board"), dataWithYear);
            }
            showAddForm = null;
            selectedBoardMember = null;
            boardMembers = await getBoardMembers();
            toasts.success("Salvestatud", "Liige edukalt salvestatud!");
        } catch (e) {
            console.error("Error saving member:", e);
            toasts.error("Viga", "Liikme salvestamisel tekkis viga");
        }
    }

    async function deleteBoardMember(id: string) {
        try {
            await deleteDoc(doc(db, "board", id));
            selectedBoardMember = null;
            boardMembers = await getBoardMembers();
        } catch (e) {
            console.error("Error deleting member:", e);
        }
    }

    // Event CRUD
    async function saveEvent(data: Record<string, string>) {
        try {
            const { id, ...eventData } = data;
            if (id) {
                await updateDoc(doc(db, "events", id), eventData);
            } else {
                await addDoc(collection(db, "events"), eventData);
            }
            showAddForm = null;
            selectedEvent = null;
            loadData();
            toasts.success("Salvestatud", "Üritus edukalt salvestatud!");
        } catch (e) {
            console.error("Error saving event:", e);
            toasts.error("Viga", "Ürituse salvestamisel tekkis viga");
        }
    }

    async function deleteEvent(id: string) {
        try {
            await deleteDoc(doc(db, "events", id));
            selectedEvent = null;
            loadData();
        } catch (e) {
            console.error("Error deleting event:", e);
        }
    }

    // Rent CRUD
    async function saveRentItem(data: Record<string, string>) {
        try {
            const { id, ...rentData } = data;
            if (id) {
                await updateDoc(doc(db, "rent", id), rentData);
            } else {
                await addDoc(collection(db, "rent"), rentData);
            }
            showAddForm = null;
            selectedRentItem = null;
            loadData();
            toasts.success("Salvestatud", "Seade edukalt salvestatud!");
        } catch (e) {
            console.error("Error saving rent item:", e);
            toasts.error("Viga", "Seadme salvestamisel tekkis viga");
        }
    }

    async function deleteRentItem(id: string) {
        try {
            await deleteDoc(doc(db, "rent", id));
            selectedRentItem = null;
            loadData();
        } catch (e) {
            console.error("Error deleting rent item:", e);
        }
    }

    // Logbook
    let logAuthor = $state("");
    let logEntry = $state("");

    async function createLog() {
        if (!logAuthor || !logEntry) {
            toasts.warning("Tähelepanu", "Palun täida kõik väljad");
            return;
        }
        try {
            await addDoc(collection(db, "logbook"), {
                authorUID: user?.uid,
                author: logAuthor,
                entry: logEntry,
                date: Timestamp.fromDate(new Date()),
            });
            toasts.success("Loodud", "Logiraamatu sissekanne edukalt lisatud!");
            logAuthor = "";
            logEntry = "";
            loadData();
        } catch (e) {
            console.error("Error creating log:", e);
        }
    }
</script>

<div>
    {#if loading}
        <div
            class="section-padding container-content flex justify-center items-center"
        >
            <p>Loading...</p>
        </div>
    {:else if !user}
        <!-- Login Form -->
        <div
            class="section-padding container-content flex flex-col items-center gap-8"
        >
            <h1>Admin Login</h1>
            <form
                class="flex flex-col gap-4 w-full max-w-md bg-white/5 p-6 rounded-lg"
                onsubmit={handleLogin}
            >
                <InputField
                    label="Email"
                    type="email"
                    placeholder="admin@ituk.ee"
                    bind:value={email}
                    required
                />
                <InputField
                    label="Parool"
                    type="password"
                    placeholder="••••••••"
                    bind:value={password}
                    required
                />
                <Button variant="primary" type="submit" text="Logi sisse" />
            </form>
        </div>
    {:else}
        <!-- Admin Dashboard -->
        <PageHeader title="Dashboard" backgroundImage="/headers/derp.jpg" />

        <div class="section-padding container-content flex flex-col gap-8">
            <!-- Navigation -->
            <div class="flex flex-wrap justify-center gap-4">
                <Button
                    variant="secondary"
                    text="Juhatus"
                    onclick={() => (currentPage = "juhatus")}
                />
                <Button
                    variant="secondary"
                    text="Üritused"
                    onclick={() => (currentPage = "uritused")}
                />
                <Button
                    variant="secondary"
                    text="Rent"
                    onclick={() => (currentPage = "rent")}
                />
                <Button
                    variant="secondary"
                    text="Logiraamat"
                    onclick={() => (currentPage = "logiraamat")}
                />
                <Button
                    variant="primary"
                    text="Logi välja"
                    onclick={handleLogout}
                />
            </div>

            {#if currentPage === "juhatus"}
                <!-- Board Members -->
                <div class="flex flex-col gap-8 w-full">
                    <div
                        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                        <h2>Juhatuse koosseis</h2>
                        <Button
                            variant="primary"
                            text="+ Lisa uus"
                            onclick={() =>
                                (showAddForm =
                                    showAddForm === "board" ? null : "board")}
                        />
                    </div>

                    <!-- Instructions -->
                    <div
                        class="bg-white/5 p-4 rounded-lg text-sm text-white/70"
                    >
                        <p class="font-medium text-white mb-2">Juhised:</p>
                        <ul class="list-disc list-inside space-y-1">
                            <li>
                                Pilt croppida ruudukujuliseks, kasutada .jpg
                                failiformaati
                            </li>
                            <li>Kaust: "static/board/(aasta)"</li>
                            <li>
                                Järjekord on sorteeritud failinime järgi (nt
                                "1_esimees.jpg")
                            </li>
                        </ul>
                    </div>

                    <!-- Board Year Selectors -->
                    <div
                        class="flex flex-col sm:flex-row gap-4 bg-white/5 p-4 rounded-lg"
                    >
                        <div class="flex items-center gap-3">
                            <label
                                for="boardYearSelect"
                                class="text-sm font-medium whitespace-nowrap"
                            >
                                Aktiivne aasta:
                            </label>
                            <select
                                id="boardYearSelect"
                                bind:value={boardYear}
                                class="px-3 py-2 bg-white/10 border border-white/10 rounded text-white focus:outline-none focus:border-primary"
                            >
                                {#each yearOptions as year}
                                    <option value={year}>{year}</option>
                                {/each}
                            </select>
                            <Button
                                variant="primary"
                                text="Salvesta"
                                onclick={saveBoardYear}
                            />
                        </div>
                        <div class="flex items-center gap-3">
                            <label
                                for="viewYearSelect"
                                class="text-sm font-medium whitespace-nowrap"
                            >
                                Vaata aastat:
                            </label>
                            <select
                                id="viewYearSelect"
                                bind:value={viewYear}
                                class="px-3 py-2 bg-white/10 border border-white/10 rounded text-white focus:outline-none focus:border-primary"
                            >
                                {#each yearOptions as year}
                                    <option value={year}>{year}</option>
                                {/each}
                            </select>
                        </div>
                    </div>

                    <div class="flex flex-col lg:flex-row gap-6">
                        <!-- List of members -->
                        <div class="flex-1 flex flex-col gap-2">
                            <div class="flex items-center justify-between mb-2">
                                <p class="text-sm text-white/60">
                                    {filteredBoardMembers.length} liiget ({viewYear})
                                </p>
                                {#if selectedBoardMember}
                                    <button
                                        class="text-xs text-white/60 hover:text-white"
                                        onclick={() => selectBoardMember(null)}
                                    >
                                        Tühista valik
                                    </button>
                                {/if}
                            </div>
                            <div
                                class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 max-h-[600px] overflow-y-auto pr-2"
                            >
                                {#each filteredBoardMembers as member}
                                    <AdminPreviewCard
                                        title={member.name}
                                        subtitle={member.position}
                                        image={member.imagePath}
                                        selected={selectedBoardMember?.id ===
                                            member.id}
                                        onclick={() =>
                                            selectBoardMember(member)}
                                    />
                                {/each}
                            </div>
                        </div>

                        <!-- Edit form (shown when item selected or adding new) -->
                        <div
                            class="w-full lg:w-[320px] lg:min-w-[320px] shrink-0"
                        >
                            {#if showAddForm === "board"}
                                <div class="sticky top-4">
                                    <div
                                        class="flex items-center justify-between mb-3"
                                    >
                                        <h3 class="font-bold">
                                            Lisa uus liige
                                        </h3>
                                        <button
                                            class="text-xs text-white/60 hover:text-white"
                                            onclick={() => (showAddForm = null)}
                                        >
                                            Tühista
                                        </button>
                                    </div>
                                    <AdminCard
                                        type="board"
                                        onSave={saveBoardMember}
                                    />
                                </div>
                            {:else if selectedBoardMember}
                                <div class="sticky top-4">
                                    <div
                                        class="flex items-center justify-between mb-3"
                                    >
                                        <h3 class="font-bold">Muuda liiget</h3>
                                        <button
                                            class="text-xs text-white/60 hover:text-white"
                                            onclick={() =>
                                                selectBoardMember(null)}
                                        >
                                            Tühista
                                        </button>
                                    </div>
                                    <AdminCard
                                        id={selectedBoardMember.id}
                                        type="board"
                                        initialData={{
                                            name:
                                                selectedBoardMember.name || "",
                                            position:
                                                selectedBoardMember.position ||
                                                "",
                                            position_en:
                                                selectedBoardMember.position_en ||
                                                "",
                                            email:
                                                selectedBoardMember.email || "",
                                            imagePath:
                                                selectedBoardMember.imagePath ||
                                                "",
                                        }}
                                        onSave={saveBoardMember}
                                        onDelete={deleteBoardMember}
                                        onDirtyChange={(dirty) =>
                                            (formIsDirty = dirty)}
                                    />
                                </div>
                            {:else}
                                <div
                                    class="flex items-center justify-center h-48 bg-white/5 rounded-lg text-white/40 text-sm"
                                >
                                    Vali liige muutmiseks või lisa uus
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            {:else if currentPage === "uritused"}
                <!-- Events -->
                <div class="flex flex-col gap-8 w-full">
                    <div
                        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                        <h2>Üritused</h2>
                        <Button
                            variant="primary"
                            text="+ Lisa uus"
                            onclick={() =>
                                (showAddForm =
                                    showAddForm === "event" ? null : "event")}
                        />
                    </div>

                    <!-- Instructions -->
                    <div
                        class="bg-white/5 p-4 rounded-lg text-sm text-white/70"
                    >
                        <p class="font-medium text-white mb-2">Juhised:</p>
                        <ul class="list-disc list-inside space-y-1">
                            <li>Kategooriad: meelelahutus, haridus, muu</li>
                            <li>
                                Handle peab olema unikaalne URL-sõbralik string
                                (nt "dont-do-it")
                            </li>
                            <li>Banner pilt peaks olema laiusega ~1200px</li>
                        </ul>
                    </div>

                    <!-- Category Filter -->
                    <div
                        class="flex items-center gap-3 bg-white/5 p-4 rounded-lg"
                    >
                        <label for="categoryFilter" class="text-sm font-medium">
                            Filtreeri kategooria järgi:
                        </label>
                        <select
                            id="categoryFilter"
                            bind:value={eventCategoryFilter}
                            class="px-3 py-2 bg-white/10 border border-white/10 rounded text-white focus:outline-none focus:border-primary"
                        >
                            <option value="all">Kõik</option>
                            {#each eventCategories as cat}
                                <option value={cat}>{cat}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="flex flex-col lg:flex-row gap-6">
                        <!-- List of events -->
                        <div class="flex-1 flex flex-col gap-2">
                            <div class="flex items-center justify-between mb-2">
                                <p class="text-sm text-white/60">
                                    {filteredEvents.length} üritust
                                </p>
                                {#if selectedEvent}
                                    <button
                                        class="text-xs text-white/60 hover:text-white"
                                        onclick={() => selectEvent(null)}
                                    >
                                        Tühista valik
                                    </button>
                                {/if}
                            </div>
                            <div
                                class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 max-h-[600px] overflow-y-auto pr-2"
                            >
                                {#each filteredEvents as event}
                                    <AdminPreviewCard
                                        title={event.name}
                                        subtitle={event.category}
                                        image={event.banner}
                                        selected={selectedEvent?.id ===
                                            event.id}
                                        onclick={() => selectEvent(event)}
                                    />
                                {/each}
                            </div>
                        </div>

                        <!-- Edit form -->
                        <div
                            class="w-full lg:w-[320px] lg:min-w-[320px] shrink-0"
                        >
                            {#if showAddForm === "event"}
                                <div class="sticky top-4">
                                    <div
                                        class="flex items-center justify-between mb-3"
                                    >
                                        <h3 class="font-bold">
                                            Lisa uus üritus
                                        </h3>
                                        <button
                                            class="text-xs text-white/60 hover:text-white"
                                            onclick={() => (showAddForm = null)}
                                        >
                                            Tühista
                                        </button>
                                    </div>
                                    <AdminCard
                                        type="event"
                                        onSave={saveEvent}
                                    />
                                </div>
                            {:else if selectedEvent}
                                <div class="sticky top-4">
                                    <div
                                        class="flex items-center justify-between mb-3"
                                    >
                                        <h3 class="font-bold">Muuda üritust</h3>
                                        <button
                                            class="text-xs text-white/60 hover:text-white"
                                            onclick={() => selectEvent(null)}
                                        >
                                            Tühista
                                        </button>
                                    </div>
                                    <AdminCard
                                        id={selectedEvent.id}
                                        type="event"
                                        initialData={{
                                            name: selectedEvent.name || "",
                                            name_en:
                                                selectedEvent.name_en || "",
                                            description:
                                                selectedEvent.description || "",
                                            description_en:
                                                selectedEvent.description_en ||
                                                "",
                                            banner: selectedEvent.banner || "",
                                            category:
                                                selectedEvent.category || "",
                                            handle: selectedEvent.handle || "",
                                        }}
                                        onSave={saveEvent}
                                        onDelete={deleteEvent}
                                        onDirtyChange={(dirty) =>
                                            (formIsDirty = dirty)}
                                    />
                                </div>
                            {:else}
                                <div
                                    class="flex items-center justify-center h-48 bg-white/5 rounded-lg text-white/40 text-sm"
                                >
                                    Vali üritus muutmiseks või lisa uus
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            {:else if currentPage === "rent"}
                <!-- Rentables -->
                <div class="flex flex-col gap-8 w-full">
                    <div
                        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                        <h2>Renditavad seadmed</h2>
                        <Button
                            variant="primary"
                            text="+ Lisa uus"
                            onclick={() =>
                                (showAddForm =
                                    showAddForm === "rent" ? null : "rent")}
                        />
                    </div>

                    <!-- Instructions -->
                    <div
                        class="bg-white/5 p-4 rounded-lg text-sm text-white/70"
                    >
                        <p class="font-medium text-white mb-2">Juhised:</p>
                        <ul class="list-disc list-inside space-y-1">
                            <li>Pilt peaks olema ruudukujuline</li>
                            <li>
                                Kirjeldus võib sisaldada hinda ja ühikut (nt
                                "5€/päev")
                            </li>
                        </ul>
                    </div>

                    <div class="flex flex-col lg:flex-row gap-6">
                        <!-- List of rent items -->
                        <div class="flex-1 flex flex-col gap-2">
                            <div class="flex items-center justify-between mb-2">
                                <p class="text-sm text-white/60">
                                    {rentables.length} seadet
                                </p>
                                {#if selectedRentItem}
                                    <button
                                        class="text-xs text-white/60 hover:text-white"
                                        onclick={() => selectRentItem(null)}
                                    >
                                        Tühista valik
                                    </button>
                                {/if}
                            </div>
                            <div
                                class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 max-h-[600px] overflow-y-auto pr-2"
                            >
                                {#each rentables as item}
                                    <AdminPreviewCard
                                        title={item.name}
                                        subtitle={item.description || ""}
                                        image={item.imagePath}
                                        selected={selectedRentItem?.id ===
                                            item.id}
                                        onclick={() => selectRentItem(item)}
                                    />
                                {/each}
                            </div>
                        </div>

                        <!-- Edit form -->
                        <div
                            class="w-full lg:w-[320px] lg:min-w-[320px] shrink-0"
                        >
                            {#if showAddForm === "rent"}
                                <div class="sticky top-4">
                                    <div
                                        class="flex items-center justify-between mb-3"
                                    >
                                        <h3 class="font-bold">
                                            Lisa uus seade
                                        </h3>
                                        <button
                                            class="text-xs text-white/60 hover:text-white"
                                            onclick={() => (showAddForm = null)}
                                        >
                                            Tühista
                                        </button>
                                    </div>
                                    <AdminCard
                                        type="rent"
                                        onSave={saveRentItem}
                                    />
                                </div>
                            {:else if selectedRentItem}
                                <div class="sticky top-4">
                                    <div
                                        class="flex items-center justify-between mb-3"
                                    >
                                        <h3 class="font-bold">Muuda seadet</h3>
                                        <button
                                            class="text-xs text-white/60 hover:text-white"
                                            onclick={() => selectRentItem(null)}
                                        >
                                            Tühista
                                        </button>
                                    </div>
                                    <AdminCard
                                        id={selectedRentItem.id}
                                        type="rent"
                                        initialData={{
                                            name: selectedRentItem.name || "",
                                            name_en:
                                                selectedRentItem.name_en || "",
                                            description:
                                                selectedRentItem.description ||
                                                "",
                                            description_en:
                                                selectedRentItem.description_en ||
                                                "",
                                            imagePath:
                                                selectedRentItem.imagePath ||
                                                "",
                                        }}
                                        onSave={saveRentItem}
                                        onDelete={deleteRentItem}
                                        onDirtyChange={(dirty) =>
                                            (formIsDirty = dirty)}
                                    />
                                </div>
                            {:else}
                                <div
                                    class="flex items-center justify-center h-48 bg-white/5 rounded-lg text-white/40 text-sm"
                                >
                                    Vali seade muutmiseks või lisa uus
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            {:else if currentPage === "logiraamat"}
                <!-- Logbook -->
                <div class="flex flex-col gap-8 w-full">
                    <h2>Logiraamat</h2>

                    <div class="flex flex-col lg:flex-row gap-8">
                        <!-- New Entry Form -->
                        <div class="w-full lg:w-1/3 bg-white/5 p-6 rounded-lg">
                            <h3 class="mb-4 font-bold">Uus sissekanne</h3>
                            <div class="flex flex-col gap-4">
                                <InputField
                                    label="Sinu nimi"
                                    placeholder="Nimi"
                                    bind:value={logAuthor}
                                    required
                                />
                                <TextArea
                                    label="Mida mõtled?"
                                    placeholder="Kirjuta siia..."
                                    bind:value={logEntry}
                                    rows={6}
                                    required
                                />
                                <Button
                                    variant="primary"
                                    text="Postita"
                                    onclick={createLog}
                                />
                            </div>
                        </div>

                        <!-- Welcome Message -->
                        <div class="w-full lg:w-2/3 bg-white/5 p-6 rounded-lg">
                            <p class="italic text-white/80">"Tervist!</p>
                            <p class="mt-3 text-white/70">
                                Siin meie kodulehe hetke versiooni arendajad
                                väikse teadaandega - kui sa veel aru ei ole
                                saanud, siis sul on erakordne võimalus olla osa
                                ITÜKi kodulehe administraatoritest!
                            </p>
                            <p class="mt-3 italic text-white/80">
                                Tunne vabalt rantida logiraamatusse, ehk leiad
                                sealt lohutust ka. ;D"
                            </p>
                        </div>
                    </div>

                    <!-- Log Entries -->
                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    >
                        {#each logbook as log, index}
                            <div
                                class="min-h-48 p-4 rounded-lg shadow-filled transform transition-transform hover:scale-105 hover:rotate-0 {(index +
                                    1) %
                                    3 ===
                                0
                                    ? 'rotate-3 bg-gray text-white'
                                    : (index + 1) % 4 === 0
                                      ? '-rotate-2 bg-white text-background'
                                      : (index + 1) % 5 === 0
                                        ? 'rotate-1 bg-[#4dbed2] text-background'
                                        : (index + 1) % 2 === 0
                                          ? '-rotate-1 bg-yellow-300 text-background'
                                          : 'bg-primary text-white'}"
                            >
                                <h5 class="font-bold text-sm">{log.author}</h5>
                                <p class="text-xs opacity-70 mb-3">
                                    {log.date?.toLocaleString?.("et-EE") || ""}
                                </p>
                                <p class="text-sm leading-relaxed">
                                    {log.entry}
                                </p>
                            </div>
                        {/each}
                    </div>
                </div>
            {:else}
                <!-- Default welcome -->
                <div class="flex justify-center items-center py-16">
                    <h2 class="italic text-green-500">
                        Tervist, {user.email}!
                    </h2>
                </div>
            {/if}
        </div>
    {/if}
</div>
