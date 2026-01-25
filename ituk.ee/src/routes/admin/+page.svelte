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
    import Dropdown from "$lib/components/Dropdown.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import { toasts } from "$lib/stores/toast";
    import {
        saveTimelineEvent as saveTimelineEventService,
        deleteTimelineEvent as deleteTimelineEventService,
        saveEvent as saveEventService,
        deleteEvent as deleteEventService,
        saveEventYear as saveEventYearService,
        deleteEventYear as deleteEventYearService,
        saveRentItem as saveRentItemService,
        deleteRentItem as deleteRentItemService,
        saveSponsor as saveSponsorService,
        deleteSponsor as deleteSponsorService,
        savePartner as savePartnerService,
        deletePartner as deletePartnerService,
        loadTimelineEvents,
        loadRentItems,
        loadEvents,
        loadSponsors,
        loadPartners,
        loadLogbook,
    } from "$lib/admin";

    // Auth state
    let user = $state<User | null>(null);
    let email = $state("");
    let password = $state("");
    let loading = $state(true);

    // Page state
    let currentPage = $state<
        | "uldine"
        | "juhatus"
        | "ajalugu"
        | "uritused"
        | "rent"
        | "sponsorid"
        | "partnerid"
        | "logiraamat"
        | ""
    >("");

    // Data
    let boardMembers = $state<BoardMember[]>([]);
    let timelineEvents = $state<any[]>([]);
    let rentables = $state<any[]>([]);
    let events = $state<any[]>([]);
    let logbook = $state<any[]>([]);
    let sponsors = $state<any[]>([]);
    let partners = $state<any[]>([]);

    // General settings (footer info)
    let contactEmail = $state("kontakt@ituk.ee");
    let contactPhone = $state("+372 5851 7633");
    let contactAddress = $state("ICO-210, Raja 4c, Tallinn");
    let contactAddressLink = $state(
        "https://www.google.com/maps/place/TalTech+IT+College/@59.3954482,24.6617187,17z",
    );
    let orgName = $state("MTÜ FOR Tsükkel");
    let orgRegCode = $state("80391807");
    let orgBankAccount = $state("LHV EE617700771002582855");
    let socialFacebook = $state("https://www.facebook.com/ituk.taltech/");
    let socialInstagram = $state("https://www.instagram.com/ituk.taltech/");
    let socialGithub = $state("https://www.github.com/ituk-ttu/");
    let hubLink = $state("https://hub.ituk.ee/");

    // Statistics - values
    let statMembersAllTime = $state("1200+");
    let statActiveMembers = $state("45");
    let statGoals = $state("1");
    let statInstagramFollowers = $state("1170");
    let statFacebookFollowers = $state("2000");
    let statDiscordMembers = $state("450");
    let statEventsPerYear = $state("30+");
    // Statistics - descriptions (Estonian)
    let statMembersAllTimeDesc = $state("liiget läbi aegade");
    let statActiveMembersDesc = $state("aktiivset liiget");
    let statGoalsDesc = $state("eesmärk");
    let statInstagramDesc = $state("Instagrami jälgijat");
    let statFacebookDesc = $state("Facebooki jälgijat");
    let statDiscordDesc = $state("Discordi liiget");
    let statEventsDesc = $state("üritust aastas");
    // Statistics - descriptions (English)
    let statMembersAllTimeDescEn = $state("members through the years");
    let statActiveMembersDescEn = $state("active members");
    let statGoalsDescEn = $state("goal");
    let statInstagramDescEn = $state("Instagram followers");
    let statFacebookDescEn = $state("Facebook followers");
    let statDiscordDescEn = $state("Discord members");
    let statEventsDescEn = $state("events per year");

    // Form state for adding/editing items
    let showAddForm = $state<string | null>(null);
    let selectedBoardMember = $state<BoardMember | null>(null);
    let selectedEvent = $state<any | null>(null);
    let selectedEventYear = $state<any | null>(null);
    let eventYears = $state<any[]>([]);
    let selectedRentItem = $state<any | null>(null);
    let selectedSponsor = $state<any | null>(null);
    let selectedPartner = $state<any | null>(null);

    // Timeline
    let selectedTimelineEvent = $state<any | null>(null);

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

    async function selectEvent(event: any | null) {
        if (formIsDirty && selectedEvent && event?.id !== selectedEvent.id) {
            if (
                !confirm("Sul on salvestamata muudatused. Kas soovid jätkata?")
            ) {
                return;
            }
        }
        selectedEvent = event;
        selectedEventYear = null;
        showAddForm = null;
        formIsDirty = false;

        // Load event years for this event
        if (event?.id) {
            try {
                const { getEventYears } = await import("$lib/firebase");
                eventYears = await getEventYears(event.id);
            } catch (e) {
                console.error("Error loading event years:", e);
                eventYears = [];
            }
        } else {
            eventYears = [];
        }
    }

    function selectEventYear(year: any | null) {
        if (
            formIsDirty &&
            selectedEventYear &&
            year?.id !== selectedEventYear.id
        ) {
            if (
                !confirm("Sul on salvestamata muudatused. Kas soovid jätkata?")
            ) {
                return;
            }
        }
        selectedEventYear = year;
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

    function selectSponsor(item: any | null) {
        if (formIsDirty && selectedSponsor && item?.id !== selectedSponsor.id) {
            if (
                !confirm("Sul on salvestamata muudatused. Kas soovid jätkata?")
            ) {
                return;
            }
        }
        selectedSponsor = item;
        showAddForm = null;
        formIsDirty = false;
    }

    function selectPartner(item: any | null) {
        if (formIsDirty && selectedPartner && item?.id !== selectedPartner.id) {
            if (
                !confirm("Sul on salvestamata muudatused. Kas soovid jätkata?")
            ) {
                return;
            }
        }
        selectedPartner = item;
        showAddForm = null;
        formIsDirty = false;
    }

    function selectTimelineEvent(item: any | null) {
        if (
            formIsDirty &&
            selectedTimelineEvent &&
            item?.id !== selectedTimelineEvent.id
        ) {
            if (
                !confirm("Sul on salvestamata muudatused. Kas soovid jätkata?")
            ) {
                return;
            }
        }
        selectedTimelineEvent = item;
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

            // Load sponsors
            const sponsorsSnapshot = await getDocs(collection(db, "sponsors"));
            sponsors = sponsorsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Load partners (student orgs)
            const partnersSnapshot = await getDocs(collection(db, "partners"));
            partners = partnersSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Load timeline events
            const timelineSnapshot = await getDocs(
                query(
                    collection(db, "timeline-events"),
                    orderBy("date", "asc"),
                ),
            );
            timelineEvents = timelineSnapshot.docs.map((doc) => {
                const data = doc.data();
                const dateObj = data.date?.toDate?.() || new Date(data.date);
                return {
                    id: doc.id,
                    ...data,
                    date: dateObj.toISOString().split("T")[0],
                };
            });

            // Load all footer settings
            const [
                savedEmail,
                savedPhone,
                savedAddress,
                savedAddressLink,
                savedOrgName,
                savedOrgRegCode,
                savedOrgBankAccount,
                savedFacebook,
                savedInstagram,
                savedGithub,
                savedHub,
            ] = await Promise.all([
                getSetting("contactEmail"),
                getSetting("contactPhone"),
                getSetting("contactAddress"),
                getSetting("contactAddressLink"),
                getSetting("orgName"),
                getSetting("orgRegCode"),
                getSetting("orgBankAccount"),
                getSetting("socialFacebook"),
                getSetting("socialInstagram"),
                getSetting("socialGithub"),
                getSetting("hubLink"),
            ]);
            if (savedEmail) contactEmail = savedEmail;
            if (savedPhone) contactPhone = savedPhone;
            if (savedAddress) contactAddress = savedAddress;
            if (savedAddressLink) contactAddressLink = savedAddressLink;
            if (savedOrgName) orgName = savedOrgName;
            if (savedOrgRegCode) orgRegCode = savedOrgRegCode;
            if (savedOrgBankAccount) orgBankAccount = savedOrgBankAccount;
            if (savedFacebook) socialFacebook = savedFacebook;
            if (savedInstagram) socialInstagram = savedInstagram;
            if (savedGithub) socialGithub = savedGithub;
            if (savedHub) hubLink = savedHub;

            // Load statistics
            const [
                savedMembersAllTime,
                savedActiveMembers,
                savedGoals,
                savedInstagramFollowers,
                savedFacebookFollowers,
                savedDiscordMembers,
                savedEventsPerYear,
            ] = await Promise.all([
                getSetting("statMembersAllTime"),
                getSetting("statActiveMembers"),
                getSetting("statGoals"),
                getSetting("statInstagramFollowers"),
                getSetting("statFacebookFollowers"),
                getSetting("statDiscordMembers"),
                getSetting("statEventsPerYear"),
            ]);
            if (savedMembersAllTime) statMembersAllTime = savedMembersAllTime;
            if (savedActiveMembers) statActiveMembers = savedActiveMembers;
            if (savedGoals) statGoals = savedGoals;
            if (savedInstagramFollowers)
                statInstagramFollowers = savedInstagramFollowers;
            if (savedFacebookFollowers)
                statFacebookFollowers = savedFacebookFollowers;
            if (savedDiscordMembers) statDiscordMembers = savedDiscordMembers;
            if (savedEventsPerYear) statEventsPerYear = savedEventsPerYear;

            // Load statistics descriptions
            const [
                savedMembersAllTimeDesc,
                savedActiveMembersDesc,
                savedGoalsDesc,
                savedInstagramDesc,
                savedFacebookDesc,
                savedDiscordDesc,
                savedEventsDesc,
                savedMembersAllTimeDescEn,
                savedActiveMembersDescEn,
                savedGoalsDescEn,
                savedInstagramDescEn,
                savedFacebookDescEn,
                savedDiscordDescEn,
                savedEventsDescEn,
            ] = await Promise.all([
                getSetting("statMembersAllTimeDesc"),
                getSetting("statActiveMembersDesc"),
                getSetting("statGoalsDesc"),
                getSetting("statInstagramDesc"),
                getSetting("statFacebookDesc"),
                getSetting("statDiscordDesc"),
                getSetting("statEventsDesc"),
                getSetting("statMembersAllTimeDescEn"),
                getSetting("statActiveMembersDescEn"),
                getSetting("statGoalsDescEn"),
                getSetting("statInstagramDescEn"),
                getSetting("statFacebookDescEn"),
                getSetting("statDiscordDescEn"),
                getSetting("statEventsDescEn"),
            ]);
            if (savedMembersAllTimeDesc)
                statMembersAllTimeDesc = savedMembersAllTimeDesc;
            if (savedActiveMembersDesc)
                statActiveMembersDesc = savedActiveMembersDesc;
            if (savedGoalsDesc) statGoalsDesc = savedGoalsDesc;
            if (savedInstagramDesc) statInstagramDesc = savedInstagramDesc;
            if (savedFacebookDesc) statFacebookDesc = savedFacebookDesc;
            if (savedDiscordDesc) statDiscordDesc = savedDiscordDesc;
            if (savedEventsDesc) statEventsDesc = savedEventsDesc;
            if (savedMembersAllTimeDescEn)
                statMembersAllTimeDescEn = savedMembersAllTimeDescEn;
            if (savedActiveMembersDescEn)
                statActiveMembersDescEn = savedActiveMembersDescEn;
            if (savedGoalsDescEn) statGoalsDescEn = savedGoalsDescEn;
            if (savedInstagramDescEn)
                statInstagramDescEn = savedInstagramDescEn;
            if (savedFacebookDescEn) statFacebookDescEn = savedFacebookDescEn;
            if (savedDiscordDescEn) statDiscordDescEn = savedDiscordDescEn;
            if (savedEventsDescEn) statEventsDescEn = savedEventsDescEn;
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

    // Event CRUD (using admin services)
    async function saveEvent(data: Record<string, string>) {
        const success = await saveEventService(data);
        if (success) {
            showAddForm = null;
            selectedEvent = null;
            loadData();
        }
    }

    async function deleteEvent(id: string) {
        const success = await deleteEventService(id);
        if (success) {
            selectedEvent = null;
            loadData();
        }
    }

    // EventYear CRUD (using admin services)
    async function saveEventYear(data: Record<string, string>) {
        if (!selectedEvent?.id) return;
        const success = await saveEventYearService(selectedEvent.id, data);
        if (success) {
            showAddForm = null;
            selectedEventYear = null;
            const { getEventYears } = await import("$lib/firebase");
            eventYears = await getEventYears(selectedEvent.id);
        }
    }

    async function deleteEventYear(id: string) {
        if (!selectedEvent?.id) return;
        const success = await deleteEventYearService(selectedEvent.id, id);
        if (success) {
            selectedEventYear = null;
            const { getEventYears } = await import("$lib/firebase");
            eventYears = await getEventYears(selectedEvent.id);
        }
    }

    // Rent CRUD (using admin services)
    async function saveRentItem(data: Record<string, string>) {
        const success = await saveRentItemService(data);
        if (success) {
            showAddForm = null;
            selectedRentItem = null;
            loadData();
        }
    }

    async function deleteRentItem(id: string) {
        const success = await deleteRentItemService(id);
        if (success) {
            selectedRentItem = null;
            loadData();
        }
    }

    // Sponsor CRUD (using admin services)
    async function saveSponsor(data: Record<string, string>) {
        const success = await saveSponsorService(data);
        if (success) {
            showAddForm = null;
            selectedSponsor = null;
            loadData();
        }
    }

    async function deleteSponsor(id: string) {
        const success = await deleteSponsorService(id);
        if (success) {
            selectedSponsor = null;
            loadData();
        }
    }

    // Partner CRUD (using admin services)
    async function savePartner(data: Record<string, string>) {
        const success = await savePartnerService(data);
        if (success) {
            showAddForm = null;
            selectedPartner = null;
            loadData();
        }
    }

    async function deletePartner(id: string) {
        const success = await deletePartnerService(id);
        if (success) {
            selectedPartner = null;
            loadData();
        }
    }

    // Timeline CRUD (using admin services)
    async function saveTimelineEvent(data: Record<string, string>) {
        const success = await saveTimelineEventService(data);
        if (success) {
            showAddForm = null;
            selectedTimelineEvent = null;
            loadData();
        }
    }

    async function deleteTimelineEvent(id: string) {
        const success = await deleteTimelineEventService(id);
        if (success) {
            selectedTimelineEvent = null;
            loadData();
        }
    }

    // General settings
    async function saveContactSettings() {
        try {
            await Promise.all([
                setSetting("contactEmail", contactEmail),
                setSetting("contactPhone", contactPhone),
                setSetting("contactAddress", contactAddress),
                setSetting("contactAddressLink", contactAddressLink),
                setSetting("orgName", orgName),
                setSetting("orgRegCode", orgRegCode),
                setSetting("orgBankAccount", orgBankAccount),
                setSetting("socialFacebook", socialFacebook),
                setSetting("socialInstagram", socialInstagram),
                setSetting("socialGithub", socialGithub),
                setSetting("hubLink", hubLink),
                setSetting("statMembersAllTime", statMembersAllTime),
                setSetting("statActiveMembers", statActiveMembers),
                setSetting("statGoals", statGoals),
                setSetting("statInstagramFollowers", statInstagramFollowers),
                setSetting("statFacebookFollowers", statFacebookFollowers),
                setSetting("statDiscordMembers", statDiscordMembers),
                setSetting("statEventsPerYear", statEventsPerYear),
                setSetting("statMembersAllTimeDesc", statMembersAllTimeDesc),
                setSetting("statActiveMembersDesc", statActiveMembersDesc),
                setSetting("statGoalsDesc", statGoalsDesc),
                setSetting("statInstagramDesc", statInstagramDesc),
                setSetting("statFacebookDesc", statFacebookDesc),
                setSetting("statDiscordDesc", statDiscordDesc),
                setSetting("statEventsDesc", statEventsDesc),
                setSetting(
                    "statMembersAllTimeDescEn",
                    statMembersAllTimeDescEn,
                ),
                setSetting("statActiveMembersDescEn", statActiveMembersDescEn),
                setSetting("statGoalsDescEn", statGoalsDescEn),
                setSetting("statInstagramDescEn", statInstagramDescEn),
                setSetting("statFacebookDescEn", statFacebookDescEn),
                setSetting("statDiscordDescEn", statDiscordDescEn),
                setSetting("statEventsDescEn", statEventsDescEn),
            ]);
            toasts.success(
                "Salvestatud",
                "Üldised seaded edukalt salvestatud!",
            );
        } catch (e) {
            console.error("Error saving contact settings:", e);
            toasts.error("Viga", "Kontaktandmete salvestamisel tekkis viga");
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

<div class="min-h-[calc(100vh-80px)]">
    {#if loading}
        <Loading fullHeight />
    {:else if !user}
        <!-- Login Form -->
        <div
            class="section-padding container-content flex flex-col items-center gap-8 min-h-[calc(100vh-80px)]"
        >
            <h1>Sisselogimine</h1>
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
        <div class="section-padding container-content flex flex-col gap-8 pt-8">
            <!-- Navigation -->
            <div class="flex flex-wrap justify-center gap-4">
                <Button
                    variant="secondary"
                    text="Üldine"
                    onclick={() => (currentPage = "uldine")}
                />
                <Button
                    variant="secondary"
                    text="Juhatus"
                    onclick={() => (currentPage = "juhatus")}
                />
                <Button
                    variant="secondary"
                    text="Ajalugu"
                    onclick={() => (currentPage = "ajalugu")}
                />
                <Button
                    variant="secondary"
                    text="Üritused"
                    onclick={() => (currentPage = "uritused")}
                />
                <Button
                    variant="secondary"
                    text="Sponsorid"
                    onclick={() => (currentPage = "sponsorid")}
                />
                <Button
                    variant="secondary"
                    text="Partnerid"
                    onclick={() => (currentPage = "partnerid")}
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

            {#if currentPage === "uldine"}
                <!-- General Settings -->
                <div class="flex flex-col gap-8 w-full">
                    <h2>Üldised seaded</h2>

                    <div
                        class="bg-white/5 p-4 rounded-lg text-sm text-white/70"
                    >
                        <p class="font-medium text-white mb-2">Info:</p>
                        <ul class="list-disc list-inside space-y-1">
                            <li>Need andmed kuvatakse veebilehe jaluses</li>
                            <li>
                                Statistika kuvatakse "Meist" ja "Partnerlus"
                                lehel
                            </li>
                            <li>
                                Muudatused jõustuvad kohe pärast salvestamist
                            </li>
                            <li>Stiiliraamat link on fikseeritud (/stiil)</li>
                        </ul>
                    </div>

                    <!-- Contact Info -->
                    <div class="bg-white/5 p-6 rounded-lg flex flex-col gap-4">
                        <h3>Kontaktandmed</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                label="Email"
                                type="email"
                                placeholder="kontakt@ituk.ee"
                                bind:value={contactEmail}
                            />
                            <InputField
                                label="Telefon"
                                placeholder="+372 5851 7633"
                                bind:value={contactPhone}
                            />
                            <InputField
                                label="Aadress"
                                placeholder="ICO-210, Raja 4c, Tallinn"
                                bind:value={contactAddress}
                            />
                            <InputField
                                label="Aadressi link (Google Maps)"
                                placeholder="https://www.google.com/maps/..."
                                bind:value={contactAddressLink}
                            />
                        </div>
                    </div>

                    <!-- Organization Info -->
                    <div class="bg-white/5 p-6 rounded-lg flex flex-col gap-4">
                        <h3>Organisatsiooni andmed</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputField
                                label="MTÜ nimi"
                                placeholder="MTÜ FOR Tsükkel"
                                bind:value={orgName}
                            />
                            <InputField
                                label="Registrikood"
                                placeholder="80391807"
                                bind:value={orgRegCode}
                            />
                            <InputField
                                label="Pangakonto"
                                placeholder="LHV EE617700771002582855"
                                bind:value={orgBankAccount}
                            />
                        </div>
                    </div>

                    <!-- Social Media & Links -->
                    <div class="bg-white/5 p-6 rounded-lg flex flex-col gap-4">
                        <h3>Sotsiaalmeedia ja lingid</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                                label="Facebook"
                                placeholder="https://www.facebook.com/ituk.taltech/"
                                bind:value={socialFacebook}
                            />
                            <InputField
                                label="Instagram"
                                placeholder="https://www.instagram.com/ituk.taltech/"
                                bind:value={socialInstagram}
                            />
                            <InputField
                                label="GitHub"
                                placeholder="https://www.github.com/ituk-ttu/"
                                bind:value={socialGithub}
                            />
                            <InputField
                                label="HUB link"
                                placeholder="https://hub.ituk.ee/"
                                bind:value={hubLink}
                            />
                        </div>
                    </div>

                    <!-- Statistics -->
                    <div class="bg-white/5 p-6 rounded-lg flex flex-col gap-6">
                        <div>
                            <h3>Statistika</h3>
                            <p class="text-sm text-white/70 mt-1">
                                Need numbrid ja kirjeldused kuvatakse "Meist" ja
                                "Partnerlus" lehel.
                            </p>
                        </div>

                        <!-- About page stats -->
                        <div class="border-t border-white/10 pt-4">
                            <h4 class="text-sm font-medium mb-3">Meist leht</h4>
                            <div
                                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                            >
                                <div class="flex flex-col gap-2">
                                    <InputField
                                        label="Liikmeid läbi aegade"
                                        placeholder="1200+"
                                        bind:value={statMembersAllTime}
                                    />
                                    <InputField
                                        label="Kirjeldus (ET)"
                                        placeholder="liiget läbi aegade"
                                        bind:value={statMembersAllTimeDesc}
                                    />
                                    <InputField
                                        label="Kirjeldus (EN)"
                                        placeholder="members through the years"
                                        bind:value={statMembersAllTimeDescEn}
                                    />
                                </div>
                                <div class="flex flex-col gap-2">
                                    <InputField
                                        label="Aktiivseid liikmeid"
                                        placeholder="45"
                                        bind:value={statActiveMembers}
                                    />
                                    <InputField
                                        label="Kirjeldus (ET)"
                                        placeholder="aktiivset liiget"
                                        bind:value={statActiveMembersDesc}
                                    />
                                    <InputField
                                        label="Kirjeldus (EN)"
                                        placeholder="active members"
                                        bind:value={statActiveMembersDescEn}
                                    />
                                </div>
                                <div class="flex flex-col gap-2">
                                    <InputField
                                        label="Eesmärke"
                                        placeholder="1"
                                        bind:value={statGoals}
                                    />
                                    <InputField
                                        label="Kirjeldus (ET)"
                                        placeholder="eesmärk"
                                        bind:value={statGoalsDesc}
                                    />
                                    <InputField
                                        label="Kirjeldus (EN)"
                                        placeholder="goal"
                                        bind:value={statGoalsDescEn}
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Partnership page stats -->
                        <div class="border-t border-white/10 pt-4">
                            <h4 class="text-sm font-medium mb-3">
                                Partnerlus leht
                            </h4>
                            <div
                                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                            >
                                <div class="flex flex-col gap-2">
                                    <InputField
                                        label="Instagram jälgijad"
                                        placeholder="1170"
                                        bind:value={statInstagramFollowers}
                                    />
                                    <InputField
                                        label="Kirjeldus (ET)"
                                        placeholder="Instagrami jälgijat"
                                        bind:value={statInstagramDesc}
                                    />
                                    <InputField
                                        label="Kirjeldus (EN)"
                                        placeholder="Instagram followers"
                                        bind:value={statInstagramDescEn}
                                    />
                                </div>
                                <div class="flex flex-col gap-2">
                                    <InputField
                                        label="Facebook jälgijad"
                                        placeholder="2000"
                                        bind:value={statFacebookFollowers}
                                    />
                                    <InputField
                                        label="Kirjeldus (ET)"
                                        placeholder="Facebooki jälgijat"
                                        bind:value={statFacebookDesc}
                                    />
                                    <InputField
                                        label="Kirjeldus (EN)"
                                        placeholder="Facebook followers"
                                        bind:value={statFacebookDescEn}
                                    />
                                </div>
                                <div class="flex flex-col gap-2">
                                    <InputField
                                        label="Discord liikmeid"
                                        placeholder="450"
                                        bind:value={statDiscordMembers}
                                    />
                                    <InputField
                                        label="Kirjeldus (ET)"
                                        placeholder="Discordi liiget"
                                        bind:value={statDiscordDesc}
                                    />
                                    <InputField
                                        label="Kirjeldus (EN)"
                                        placeholder="Discord members"
                                        bind:value={statDiscordDescEn}
                                    />
                                </div>
                                <div class="flex flex-col gap-2">
                                    <InputField
                                        label="Üritusi aastas"
                                        placeholder="30+"
                                        bind:value={statEventsPerYear}
                                    />
                                    <InputField
                                        label="Kirjeldus (ET)"
                                        placeholder="üritust aastas"
                                        bind:value={statEventsDesc}
                                    />
                                    <InputField
                                        label="Kirjeldus (EN)"
                                        placeholder="events per year"
                                        bind:value={statEventsDescEn}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end">
                        <Button
                            variant="primary"
                            text="Salvesta kõik"
                            onclick={saveContactSettings}
                        />
                    </div>
                </div>
            {:else if currentPage === "juhatus"}
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
                        class="flex flex-col sm:flex-row gap-4 bg-white/5 p-4 rounded-lg items-end"
                    >
                        <div class="flex items-end gap-3">
                            <div class="w-40">
                                <Dropdown
                                    label="Aktiivne aasta"
                                    bind:value={boardYear}
                                    options={yearOptions.map((y) => ({
                                        value: y,
                                        label: y,
                                    }))}
                                />
                            </div>
                            <Button
                                variant="primary"
                                text="Salvesta"
                                onclick={saveBoardYear}
                            />
                        </div>
                        <div class="w-40">
                            <Dropdown
                                label="Vaata aastat"
                                bind:value={viewYear}
                                options={yearOptions.map((y) => ({
                                    value: y,
                                    label: y,
                                }))}
                            />
                        </div>
                    </div>

                    <!-- List of members -->
                    <div class="flex flex-col gap-2">
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
                            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2"
                        >
                            {#each filteredBoardMembers as member}
                                <AdminPreviewCard
                                    title={member.name}
                                    subtitle={member.position}
                                    image={member.imagePath}
                                    selected={selectedBoardMember?.id ===
                                        member.id}
                                    onclick={() => selectBoardMember(member)}
                                />
                            {/each}
                        </div>
                    </div>

                    <!-- Edit form (shown when item selected or adding new) -->
                    {#if showAddForm === "board" || selectedBoardMember}
                        <div class="max-w-md">
                            {#if showAddForm === "board"}
                                <div
                                    class="flex items-center justify-between mb-3"
                                >
                                    <h3 class="font-bold">Lisa uus liige</h3>
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
                            {:else if selectedBoardMember}
                                <div
                                    class="flex items-center justify-between mb-3"
                                >
                                    <h3 class="font-bold">Muuda liiget</h3>
                                    <button
                                        class="text-xs text-white/60 hover:text-white"
                                        onclick={() => selectBoardMember(null)}
                                    >
                                        Tühista
                                    </button>
                                </div>
                                <AdminCard
                                    id={selectedBoardMember.id}
                                    type="board"
                                    initialData={{
                                        name: selectedBoardMember.name || "",
                                        position:
                                            selectedBoardMember.position || "",
                                        position_en:
                                            selectedBoardMember.position_en ||
                                            "",
                                        email: selectedBoardMember.email || "",
                                        imagePath:
                                            selectedBoardMember.imagePath || "",
                                    }}
                                    onSave={saveBoardMember}
                                    onDelete={deleteBoardMember}
                                    onDirtyChange={(dirty) =>
                                        (formIsDirty = dirty)}
                                />
                            {/if}
                        </div>
                    {/if}
                </div>
            {:else if currentPage === "ajalugu"}
                <!-- Timeline -->
                <div class="flex flex-col gap-8 w-full">
                    <div
                        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                        <h2>Ajalugu (Timeline)</h2>
                        <Button
                            variant="primary"
                            text="+ Lisa uus"
                            onclick={() =>
                                (showAddForm =
                                    showAddForm === "timeline"
                                        ? null
                                        : "timeline")}
                        />
                    </div>

                    <div
                        class="bg-white/5 p-4 rounded-lg text-sm text-white/70"
                    >
                        <p class="font-medium text-white mb-2">Info:</p>
                        <ul class="list-disc list-inside space-y-1">
                            <li>Ajalugu kuvatakse "Meist" lehel</li>
                            <li>Sündmused sorteeritakse aasta järgi</li>
                        </ul>
                    </div>

                    <!-- List of timeline events -->
                    <div class="flex flex-col gap-2">
                        <div class="flex items-center justify-between mb-2">
                            <p class="text-sm text-white/60">
                                {timelineEvents.length} sündmust
                            </p>
                            {#if selectedTimelineEvent}
                                <button
                                    class="text-xs text-white/60 hover:text-white"
                                    onclick={() => selectTimelineEvent(null)}
                                >
                                    Tühista valik
                                </button>
                            {/if}
                        </div>
                        <div
                            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2"
                        >
                            {#each timelineEvents as event}
                                <AdminPreviewCard
                                    title={event.name}
                                    subtitle={event.date}
                                    image={event.imagePath}
                                    selected={selectedTimelineEvent?.id ===
                                        event.id}
                                    onclick={() => selectTimelineEvent(event)}
                                />
                            {/each}
                        </div>
                    </div>

                    <!-- Edit form -->
                    {#if showAddForm === "timeline" || selectedTimelineEvent}
                        <div class="max-w-md">
                            {#if showAddForm === "timeline"}
                                <div
                                    class="flex items-center justify-between mb-3"
                                >
                                    <h3 class="font-bold">Lisa uus sündmus</h3>
                                    <button
                                        class="text-xs text-white/60 hover:text-white"
                                        onclick={() => (showAddForm = null)}
                                        >Tühista</button
                                    >
                                </div>
                                <AdminCard
                                    type="timeline"
                                    onSave={saveTimelineEvent}
                                />
                            {:else if selectedTimelineEvent}
                                <div
                                    class="flex items-center justify-between mb-3"
                                >
                                    <h3 class="font-bold">Muuda sündmust</h3>
                                    <button
                                        class="text-xs text-white/60 hover:text-white"
                                        onclick={() =>
                                            selectTimelineEvent(null)}
                                        >Tühista</button
                                    >
                                </div>
                                <AdminCard
                                    id={selectedTimelineEvent.id}
                                    type="timeline"
                                    initialData={{
                                        name: selectedTimelineEvent.name || "",
                                        date: selectedTimelineEvent.date || "",
                                        imagePath:
                                            selectedTimelineEvent.imagePath ||
                                            "",
                                    }}
                                    onSave={saveTimelineEvent}
                                    onDelete={deleteTimelineEvent}
                                    onDirtyChange={(dirty) =>
                                        (formIsDirty = dirty)}
                                />
                            {/if}
                        </div>
                    {/if}
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
                    <div class="flex items-end gap-3 bg-white/5 p-4 rounded-lg">
                        <div class="w-48">
                            <Dropdown
                                label="Filtreeri kategooria järgi"
                                bind:value={eventCategoryFilter}
                                options={[
                                    { value: "all", label: "Kõik" },
                                    ...eventCategories.map((cat) => ({
                                        value: cat,
                                        label: cat,
                                    })),
                                ]}
                            />
                        </div>
                    </div>

                    <!-- List of events -->
                    <div class="flex flex-col gap-2">
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
                            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2"
                        >
                            {#each filteredEvents as event}
                                <AdminPreviewCard
                                    title={event.name}
                                    subtitle={event.category}
                                    image={event.banner}
                                    selected={selectedEvent?.id === event.id}
                                    onclick={() => selectEvent(event)}
                                />
                            {/each}
                        </div>
                    </div>

                    <!-- Edit forms row -->
                    {#if showAddForm === "event"}
                        <div class="max-w-md">
                            <div class="flex items-center justify-between mb-3">
                                <h3 class="font-bold">Lisa uus üritus</h3>
                                <button
                                    class="text-xs text-white/60 hover:text-white"
                                    onclick={() => (showAddForm = null)}
                                    >Tühista</button
                                >
                            </div>
                            <AdminCard type="event" onSave={saveEvent} />
                        </div>
                    {:else if selectedEvent}
                        <div class="flex flex-col lg:flex-row gap-6">
                            <!-- Event edit card -->
                            <div class="w-full lg:w-80 shrink-0">
                                <div
                                    class="flex items-center justify-between mb-3"
                                >
                                    <h3 class="font-bold">Muuda üritust</h3>
                                    <button
                                        class="text-xs text-white/60 hover:text-white"
                                        onclick={() => selectEvent(null)}
                                        >Tühista</button
                                    >
                                </div>
                                <AdminCard
                                    id={selectedEvent.id}
                                    type="event"
                                    initialData={{
                                        name: selectedEvent.name || "",
                                        name_en: selectedEvent.name_en || "",
                                        description:
                                            selectedEvent.description || "",
                                        description_en:
                                            selectedEvent.description_en || "",
                                        banner: selectedEvent.banner || "",
                                        category: selectedEvent.category || "",
                                        handle: selectedEvent.handle || "",
                                    }}
                                    onSave={saveEvent}
                                    onDelete={deleteEvent}
                                    onDirtyChange={(dirty) =>
                                        (formIsDirty = dirty)}
                                />
                            </div>

                            <!-- Event Years list -->
                            <div class="w-full lg:w-64 shrink-0">
                                <div
                                    class="flex items-center justify-between mb-3"
                                >
                                    <h3 class="font-bold text-sm">
                                        Aastad ({eventYears.length})
                                    </h3>
                                    <button
                                        class="text-xs text-primary hover:underline"
                                        onclick={() => {
                                            showAddForm =
                                                showAddForm === "eventYear"
                                                    ? null
                                                    : "eventYear";
                                            selectedEventYear = null;
                                        }}
                                    >
                                        + Lisa aasta
                                    </button>
                                </div>
                                <div class="bg-white/5 rounded-lg p-3">
                                    {#if eventYears.length > 0}
                                        <div
                                            class="flex flex-col gap-1 max-h-64 overflow-y-auto"
                                        >
                                            {#each eventYears as year}
                                                <button
                                                    class="text-left text-sm px-2 py-1 rounded hover:bg-white/10 {selectedEventYear?.id ===
                                                    year.id
                                                        ? 'bg-primary/20 text-primary'
                                                        : ''}"
                                                    onclick={() => {
                                                        selectEventYear(year);
                                                        showAddForm = null;
                                                    }}
                                                >
                                                    {year.title ||
                                                        year.date ||
                                                        "Nimetu"}
                                                </button>
                                            {/each}
                                        </div>
                                    {:else}
                                        <p class="text-xs text-white/40">
                                            Aastaid pole lisatud
                                        </p>
                                    {/if}
                                </div>
                            </div>

                            <!-- Event Year edit card -->
                            {#if showAddForm === "eventYear"}
                                <div class="w-full lg:w-80 shrink-0">
                                    <div
                                        class="flex items-center justify-between mb-3"
                                    >
                                        <h3 class="font-bold text-sm">
                                            Lisa uus aasta
                                        </h3>
                                        <button
                                            class="text-xs text-white/60 hover:text-white"
                                            onclick={() => (showAddForm = null)}
                                            >Tühista</button
                                        >
                                    </div>
                                    <AdminCard
                                        type="eventYear"
                                        onSave={saveEventYear}
                                    />
                                </div>
                            {:else if selectedEventYear}
                                <div class="w-full lg:w-80 shrink-0">
                                    <div
                                        class="flex items-center justify-between mb-3"
                                    >
                                        <h3 class="font-bold text-sm">
                                            Muuda aastat
                                        </h3>
                                        <button
                                            class="text-xs text-white/60 hover:text-white"
                                            onclick={() =>
                                                selectEventYear(null)}
                                            >Tühista</button
                                        >
                                    </div>
                                    <AdminCard
                                        id={selectedEventYear.id}
                                        type="eventYear"
                                        initialData={{
                                            name: selectedEventYear.title || "",
                                            name_en:
                                                selectedEventYear.title_en ||
                                                "",
                                            description:
                                                selectedEventYear.description ||
                                                "",
                                            description_en:
                                                selectedEventYear.description_en ||
                                                "",
                                            extraInformation:
                                                selectedEventYear.extraInformation ||
                                                "",
                                            extraInformation_en:
                                                selectedEventYear.extraInformation_en ||
                                                "",
                                            imagePath:
                                                selectedEventYear.banner || "",
                                            date: selectedEventYear.date || "",
                                            handle:
                                                selectedEventYear.handle || "",
                                        }}
                                        onSave={saveEventYear}
                                        onDelete={deleteEventYear}
                                        onDirtyChange={(dirty) =>
                                            (formIsDirty = dirty)}
                                    />
                                </div>
                            {/if}
                        </div>
                    {/if}
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

                    <!-- List of rent items -->
                    <div class="flex flex-col gap-2">
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
                            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2"
                        >
                            {#each rentables as item}
                                <AdminPreviewCard
                                    title={item.name}
                                    subtitle={item.description || ""}
                                    image={item.imagePath}
                                    selected={selectedRentItem?.id === item.id}
                                    onclick={() => selectRentItem(item)}
                                />
                            {/each}
                        </div>
                    </div>

                    <!-- Edit form -->
                    {#if showAddForm === "rent" || selectedRentItem}
                        <div class="max-w-md">
                            {#if showAddForm === "rent"}
                                <div
                                    class="flex items-center justify-between mb-3"
                                >
                                    <h3 class="font-bold">Lisa uus seade</h3>
                                    <button
                                        class="text-xs text-white/60 hover:text-white"
                                        onclick={() => (showAddForm = null)}
                                        >Tühista</button
                                    >
                                </div>
                                <AdminCard type="rent" onSave={saveRentItem} />
                            {:else if selectedRentItem}
                                <div
                                    class="flex items-center justify-between mb-3"
                                >
                                    <h3 class="font-bold">Muuda seadet</h3>
                                    <button
                                        class="text-xs text-white/60 hover:text-white"
                                        onclick={() => selectRentItem(null)}
                                        >Tühista</button
                                    >
                                </div>
                                <AdminCard
                                    id={selectedRentItem.id}
                                    type="rent"
                                    initialData={{
                                        name: selectedRentItem.name || "",
                                        name_en: selectedRentItem.name_en || "",
                                        description:
                                            selectedRentItem.description || "",
                                        description_en:
                                            selectedRentItem.description_en ||
                                            "",
                                        imagePath:
                                            selectedRentItem.imagePath || "",
                                    }}
                                    onSave={saveRentItem}
                                    onDelete={deleteRentItem}
                                    onDirtyChange={(dirty) =>
                                        (formIsDirty = dirty)}
                                />
                            {/if}
                        </div>
                    {/if}
                </div>
            {:else if currentPage === "sponsorid"}
                <!-- Sponsors -->
                <div class="flex flex-col gap-8 w-full">
                    <div
                        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                        <h2>Sponsorid</h2>
                        <Button
                            variant="primary"
                            text="+ Lisa uus"
                            onclick={() =>
                                (showAddForm =
                                    showAddForm === "sponsor"
                                        ? null
                                        : "sponsor")}
                        />
                    </div>

                    <div
                        class="bg-white/5 p-4 rounded-lg text-sm text-white/70"
                    >
                        <p class="font-medium text-white mb-2">Juhised:</p>
                        <ul class="list-disc list-inside space-y-1">
                            <li>
                                Logo peaks olema PNG formaadis läbipaistva
                                taustaga
                            </li>
                            <li>Kaust: "static/images/partners/"</li>
                            <li>Taustavärv hex formaadis (nt #FFFFFF)</li>
                        </ul>
                    </div>

                    <!-- List of sponsors -->
                    <div class="flex flex-col gap-2">
                        <p class="text-sm text-white/60">
                            {sponsors.length} sponsorit
                        </p>
                        <div
                            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2"
                        >
                            {#each sponsors as sponsor}
                                <AdminPreviewCard
                                    title={sponsor.name}
                                    subtitle={sponsor.link}
                                    image={sponsor.imagePath}
                                    selected={selectedSponsor?.id ===
                                        sponsor.id}
                                    onclick={() => selectSponsor(sponsor)}
                                />
                            {/each}
                        </div>
                    </div>

                    <!-- Edit form -->
                    {#if showAddForm === "sponsor" || selectedSponsor}
                        <div class="max-w-md">
                            {#if showAddForm === "sponsor"}
                                <div
                                    class="flex items-center justify-between mb-3"
                                >
                                    <h3 class="font-bold">Lisa sponsor</h3>
                                    <button
                                        class="text-xs text-white/60 hover:text-white"
                                        onclick={() => (showAddForm = null)}
                                        >Tühista</button
                                    >
                                </div>
                                <AdminCard
                                    type="sponsor"
                                    onSave={saveSponsor}
                                />
                            {:else if selectedSponsor}
                                <div
                                    class="flex items-center justify-between mb-3"
                                >
                                    <h3 class="font-bold">Muuda sponsorit</h3>
                                    <button
                                        class="text-xs text-white/60 hover:text-white"
                                        onclick={() => selectSponsor(null)}
                                        >Tühista</button
                                    >
                                </div>
                                <AdminCard
                                    id={selectedSponsor.id}
                                    type="sponsor"
                                    initialData={{
                                        name: selectedSponsor.name || "",
                                        imagePath:
                                            selectedSponsor.imagePath || "",
                                        link: selectedSponsor.link || "",
                                        bgColor:
                                            selectedSponsor.bgColor ||
                                            "#FFFFFF",
                                    }}
                                    onSave={saveSponsor}
                                    onDelete={deleteSponsor}
                                    onDirtyChange={(dirty) =>
                                        (formIsDirty = dirty)}
                                />
                            {/if}
                        </div>
                    {/if}
                </div>
            {:else if currentPage === "partnerid"}
                <!-- Partners (Student Orgs) -->
                <div class="flex flex-col gap-8 w-full">
                    <div
                        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                        <h2>Partnerid (Tudengorganisatsioonid)</h2>
                        <Button
                            variant="primary"
                            text="+ Lisa uus"
                            onclick={() =>
                                (showAddForm =
                                    showAddForm === "partner"
                                        ? null
                                        : "partner")}
                        />
                    </div>

                    <div
                        class="bg-white/5 p-4 rounded-lg text-sm text-white/70"
                    >
                        <p class="font-medium text-white mb-2">Juhised:</p>
                        <ul class="list-disc list-inside space-y-1">
                            <li>Logo peaks olema ruudukujuline</li>
                            <li>Kaust: "static/partners/"</li>
                            <li>Projektid eraldada komadega</li>
                        </ul>
                    </div>

                    <!-- List of partners -->
                    <div class="flex flex-col gap-2">
                        <p class="text-sm text-white/60">
                            {partners.length} partnerit
                        </p>
                        <div
                            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2"
                        >
                            {#each partners as partner}
                                <AdminPreviewCard
                                    title={partner.name}
                                    subtitle={partner.link}
                                    image={partner.imagePath}
                                    selected={selectedPartner?.id ===
                                        partner.id}
                                    onclick={() => selectPartner(partner)}
                                />
                            {/each}
                        </div>
                    </div>

                    <!-- Edit form -->
                    {#if showAddForm === "partner" || selectedPartner}
                        <div class="max-w-md">
                            {#if showAddForm === "partner"}
                                <div
                                    class="flex items-center justify-between mb-3"
                                >
                                    <h3 class="font-bold">Lisa partner</h3>
                                    <button
                                        class="text-xs text-white/60 hover:text-white"
                                        onclick={() => (showAddForm = null)}
                                        >Tühista</button
                                    >
                                </div>
                                <AdminCard
                                    type="partner"
                                    onSave={savePartner}
                                />
                            {:else if selectedPartner}
                                <div
                                    class="flex items-center justify-between mb-3"
                                >
                                    <h3 class="font-bold">Muuda partnerit</h3>
                                    <button
                                        class="text-xs text-white/60 hover:text-white"
                                        onclick={() => selectPartner(null)}
                                        >Tühista</button
                                    >
                                </div>
                                <AdminCard
                                    id={selectedPartner.id}
                                    type="partner"
                                    initialData={{
                                        name: selectedPartner.name || "",
                                        name_en: selectedPartner.name_en || "",
                                        imagePath:
                                            selectedPartner.imagePath || "",
                                        link: selectedPartner.link || "",
                                        projects:
                                            selectedPartner.projects?.join(
                                                ", ",
                                            ) || "",
                                    }}
                                    onSave={savePartner}
                                    onDelete={deletePartner}
                                    onDirtyChange={(dirty) =>
                                        (formIsDirty = dirty)}
                                />
                            {/if}
                        </div>
                    {/if}
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
