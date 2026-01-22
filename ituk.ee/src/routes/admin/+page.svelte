<script lang="ts">
    import { onMount } from "svelte";
    import {
        signInWithEmailAndPassword,
        onAuthStateChanged,
        signOut,
        type User,
    } from "firebase/auth";
    import { auth, db, getBoardMembers, type BoardMember } from "$lib/firebase";
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
    import Card from "$lib/components/Card.svelte";

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

    // Form state for editing
    let editingMember = $state<BoardMember | null>(null);
    let newMember = $state({
        name: "",
        position: "",
        position_en: "",
        email: "",
        imagePath: "",
    });

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
        } catch (error: any) {
            alert("Login failed: " + error.message);
        }
    }

    async function handleLogout() {
        await signOut(auth);
    }

    // Board member CRUD
    async function saveMember() {
        if (!newMember.name || !newMember.position) {
            alert("Please fill in required fields");
            return;
        }
        try {
            if (editingMember?.id) {
                await updateDoc(doc(db, "board", editingMember.id), newMember);
                alert("Member updated");
            } else {
                await addDoc(collection(db, "board"), newMember);
                alert("Member created");
            }
            resetMemberForm();
            boardMembers = await getBoardMembers();
        } catch (e) {
            console.error("Error saving member:", e);
            alert("Error saving member");
        }
    }

    async function deleteMember(id: string) {
        if (!confirm("Are you sure you want to delete this member?")) return;
        try {
            await deleteDoc(doc(db, "board", id));
            boardMembers = await getBoardMembers();
        } catch (e) {
            console.error("Error deleting member:", e);
        }
    }

    function editMember(member: BoardMember) {
        editingMember = member;
        newMember = { ...member };
    }

    function resetMemberForm() {
        editingMember = null;
        newMember = {
            name: "",
            position: "",
            position_en: "",
            email: "",
            imagePath: "",
        };
    }

    // Logbook
    let logAuthor = $state("");
    let logEntry = $state("");

    async function createLog() {
        if (!logAuthor || !logEntry) {
            alert("Please fill in all fields");
            return;
        }
        try {
            await addDoc(collection(db, "logbook"), {
                authorUID: user?.uid,
                author: logAuthor,
                entry: logEntry,
                date: Timestamp.fromDate(new Date()),
            });
            alert("Log entry created");
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
                class="flex flex-col gap-4 w-full max-w-md"
                onsubmit={handleLogin}
            >
                <label>
                    <span class="text-primary">* </span>Email
                    <input
                        type="email"
                        bind:value={email}
                        required
                        class="w-full mt-1 p-2 bg-white/10 border border-white/20 rounded"
                        placeholder="Email address"
                    />
                </label>
                <label>
                    <span class="text-primary">* </span>Password
                    <input
                        type="password"
                        bind:value={password}
                        required
                        class="w-full mt-1 p-2 bg-white/10 border border-white/20 rounded"
                        placeholder="Password"
                    />
                </label>
                <Button variant="primary" type="submit" text="Login" />
            </form>
        </div>
    {:else}
        <!-- Admin Dashboard -->
        <div class="bg-[url('/headers/derp.jpg')] bg-top bg-cover">
            <div class="section-padding w-full bg-epic-gradient">
                <h1 class="text-center text-big">Dashboard</h1>
            </div>
        </div>

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
                <div class="flex flex-col gap-8 items-center">
                    <h2>Juhatuse koosseis</h2>

                    <ul class="flex flex-col gap-2 text-sm">
                        <li>
                            • Pilt croppida ruudukujuliseks, kasutada .jpg
                            failiformaati
                        </li>
                        <li>• Kaust: "static/board/(aasta)"</li>
                        <li>
                            • Järjekord on sorteeritud failinime järgi (nt
                            "1_esimees.jpg")
                        </li>
                    </ul>

                    <!-- Add/Edit Form -->
                    <div class="w-full max-w-md bg-white/5 p-4 rounded">
                        <h3 class="mb-4">
                            {editingMember ? "Edit Member" : "Add New Member"}
                        </h3>
                        <div class="flex flex-col gap-3">
                            <input
                                bind:value={newMember.name}
                                placeholder="Name"
                                class="p-2 bg-white/10 rounded"
                            />
                            <input
                                bind:value={newMember.position}
                                placeholder="Position (ET)"
                                class="p-2 bg-white/10 rounded"
                            />
                            <input
                                bind:value={newMember.position_en}
                                placeholder="Position (EN)"
                                class="p-2 bg-white/10 rounded"
                            />
                            <input
                                bind:value={newMember.email}
                                placeholder="Email"
                                class="p-2 bg-white/10 rounded"
                            />
                            <input
                                bind:value={newMember.imagePath}
                                placeholder="Image Path (e.g. /board/2025/1_name.jpg)"
                                class="p-2 bg-white/10 rounded"
                            />
                            <div class="flex gap-2">
                                <Button
                                    variant="primary"
                                    text="Save"
                                    onclick={saveMember}
                                />
                                {#if editingMember}
                                    <Button
                                        variant="secondary"
                                        text="Cancel"
                                        onclick={resetMemberForm}
                                    />
                                {/if}
                            </div>
                        </div>
                    </div>

                    <!-- Member Grid -->
                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {#each boardMembers as member}
                            <div class="relative group">
                                <Card
                                    title={member.name}
                                    image={member.imagePath}
                                    description={member.position}
                                    type="board"
                                    email={member.email}
                                />
                                <div
                                    class="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <button
                                        onclick={() => editMember(member)}
                                        class="bg-primary p-2 rounded text-xs"
                                        >Edit</button
                                    >
                                    <button
                                        onclick={() => deleteMember(member.id!)}
                                        class="bg-red-600 p-2 rounded text-xs"
                                        >Delete</button
                                    >
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {:else if currentPage === "uritused"}
                <!-- Events -->
                <div class="flex flex-col gap-8 items-center">
                    <h2>Üritused</h2>
                    <p class="text-gray">
                        Events management - full implementation pending
                    </p>
                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {#each events as event}
                            <Card
                                title={event.name}
                                image={event.banner}
                                description={event.description}
                                type="default"
                            />
                        {/each}
                    </div>
                </div>
            {:else if currentPage === "rent"}
                <!-- Rentables -->
                <div class="flex flex-col gap-8 items-center">
                    <h2>Renditavad seadmed</h2>
                    <p class="text-gray">
                        Rent management - full implementation pending
                    </p>
                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {#each rentables as item}
                            <Card
                                title={item.name}
                                image={item.imagePath}
                                description="{item.price}€/{item.unit}"
                                type="default"
                            />
                        {/each}
                    </div>
                </div>
            {:else if currentPage === "logiraamat"}
                <!-- Logbook -->
                <div class="flex flex-col gap-8 items-center w-full">
                    <h2>Logiraamat</h2>

                    <div class="flex flex-col md:flex-row gap-8 w-full">
                        <!-- New Entry Form -->
                        <div class="w-full md:w-1/2 bg-white/5 p-4 rounded">
                            <h3 class="mb-4">New Entry</h3>
                            <div class="flex flex-col gap-3">
                                <input
                                    bind:value={logAuthor}
                                    placeholder="Your name"
                                    class="p-2 bg-white/10 rounded"
                                />
                                <textarea
                                    bind:value={logEntry}
                                    placeholder="What's on your mind?"
                                    class="p-2 bg-white/10 rounded min-h-32"
                                ></textarea>
                                <Button
                                    variant="primary"
                                    text="Submit"
                                    onclick={createLog}
                                />
                            </div>
                        </div>

                        <!-- Welcome Message -->
                        <div class="w-full md:w-1/2 italic text-sm">
                            <p>"Tervist!</p>
                            <p class="mt-2">
                                Siin meie kodulehe hetke versiooni arendajad
                                väikse teadaandega - kui sa veel aru ei ole
                                saanud, siis sul on erakordne võimalus olla osa
                                ITÜKi kodulehe administraatoritest!
                            </p>
                            <p class="mt-2">
                                Tunne vabalt rantida logiraamatusse, ehk leiad
                                sealt lohutust ka. ;D"
                            </p>
                        </div>
                    </div>

                    <!-- Log Entries -->
                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full"
                    >
                        {#each logbook as log, index}
                            <div
                                class="min-h-60 p-4 shadow-filled transform transition-transform hover:scale-105 hover:rotate-0 {(index +
                                    1) %
                                    3 ===
                                0
                                    ? 'rotate-6 bg-gray text-white'
                                    : (index + 1) % 4 === 0
                                      ? '-rotate-3 bg-white text-background'
                                      : (index + 1) % 5 === 0
                                        ? 'rotate-2 bg-[#4dbed2] text-background'
                                        : (index + 1) % 2 === 0
                                          ? '-rotate-2 bg-yellow-300 text-background'
                                          : 'bg-primary text-white'}"
                            >
                                <h5 class="font-bold">{log.author}</h5>
                                <p class="text-xs">
                                    {log.date?.toLocaleString?.("et-EE") || ""}
                                </p>
                                <br />
                                <p class="text-xs">{log.entry}</p>
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
