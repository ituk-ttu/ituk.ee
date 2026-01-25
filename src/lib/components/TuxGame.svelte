<script lang="ts">
    import { onMount } from "svelte";
    import * as m from "$lib/paraglide/messages";
    import {
        getLeaderboard,
        addLeaderboardEntry,
        type LeaderboardEntry,
    } from "$lib/firebase";
    import {
        ArcadeButton,
        ArcadeButtonSmall,
        ArcadeText,
        ArcadeDpad,
    } from "$lib/components/arcade";

    interface Props {
        onClose: () => void;
    }

    let { onClose }: Props = $props();

    // Animation states
    let isVisible = $state(false);
    let isClosing = $state(false);
    let showExplosion = $state(false);
    let explosionFrame = $state(0);
    const EXPLOSION_FRAMES = 18;
    const EXPLOSION_FRAME_MS = 80;

    // Game states
    type GameScreen =
        | "menu"
        | "settings"
        | "playing"
        | "gameover"
        | "leaderboard"
        | "enterinit"
        | "credits";
    let screen = $state<GameScreen>("menu");

    // Leaderboard
    let leaderboard = $state<LeaderboardEntry[]>([]);
    let loadingLeaderboard = $state(false);
    let playerInitials = $state(["A", "A", "A"]);
    let currentInitialIndex = $state(0);
    let isNewHighScore = $state(false);
    let playerRank = $state(0);

    // Settings
    type Difficulty = "easy" | "medium" | "hard";
    const DIFFICULTY_LABELS: Record<Difficulty, () => string> = {
        easy: () => m.tux_easy(),
        medium: () => m.tux_medium(),
        hard: () => m.tux_hard(),
    };
    let difficulty = $state<Difficulty>("medium");
    let hasWalls = $state(false);
    let fishCount = $state(1);
    let goldenFishEnabled = $state(true);

    // Audio settings
    let masterVolume = $state(100);
    let musicVolume = $state(50);
    let sfxVolume = $state(50);

    const SPEEDS: Record<Difficulty, number> = {
        easy: 200,
        medium: 130,
        hard: 80,
    };

    // Grid config
    const GRID_SIZE = 15;
    let cellSize = $state(20);
    let canvasSize = $derived(GRID_SIZE * cellSize);

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let gameLoop: ReturnType<typeof setInterval> | null = null;
    let score = $state(0);
    let highScore = $state(0);

    type Point = { x: number; y: number };
    type Fish = Point & { golden?: boolean; variant?: number };
    let snake: Point[] = [];
    let direction: Point = { x: 1, y: 0 };
    let nextDirection: Point = { x: 1, y: 0 };
    let fishes: Fish[] = [];

    // Audio elements
    const sounds: Record<string, HTMLAudioElement | null> = {
        click: null,
        eat: null,
        golden: null,
        gameover: null,
    };
    let musicAudio: HTMLAudioElement | null = null;

    // Image sprites
    let tuxImg: HTMLImageElement | null = null;
    let fishImgs: HTMLImageElement[] = []; // fish1-9.png
    let goldenImg: HTMLImageElement | null = null; // golden.png
    let imagesLoaded = false;

    // Sound effect playback
    function playSfx(sound: "click" | "eat" | "golden" | "gameover") {
        const volume = (masterVolume / 100) * (sfxVolume / 100);
        if (volume === 0) return;
        const audio = sounds[sound];
        if (audio) {
            audio.volume = volume;
            audio.currentTime = 0;
            audio.play().catch(() => {});
        }
    }

    function playMusic(action: "start" | "stop") {
        if (!musicAudio) return;
        const volume = (masterVolume / 100) * (musicVolume / 100);
        musicAudio.volume = volume;
        if (action === "start") {
            musicAudio.loop = true;
            musicAudio.play().catch(() => {});
        } else {
            musicAudio.pause();
            musicAudio.currentTime = 0;
        }
    }

    function updateMusicVolume() {
        if (musicAudio) {
            musicAudio.volume = (masterVolume / 100) * (musicVolume / 100);
        }
    }

    // Lock scrolling when game is open
    onMount(() => {
        document.body.style.overflow = "hidden";
        highScore = parseInt(localStorage.getItem("tuxHighScore") || "0");

        // Load audio settings from localStorage
        masterVolume = parseInt(
            localStorage.getItem("tuxMasterVolume") || "100",
        );
        musicVolume = parseInt(localStorage.getItem("tuxMusicVolume") || "50");
        sfxVolume = parseInt(localStorage.getItem("tuxSfxVolume") || "50");

        // Load sound effects
        const soundFiles = ["click", "eat", "golden", "gameover"];
        soundFiles.forEach((name) => {
            const audio = new Audio(`/tux/sounds/${name}.mp3`);
            audio.preload = "auto";
            sounds[name] = audio;
        });

        // Load music and start playing on menu (1/1000 chance for music2)
        const musicFile = Math.random() < 0.001 ? "music2.mp3" : "music.mp3";
        musicAudio = new Audio(`/tux/sounds/${musicFile}`);
        musicAudio.preload = "auto";
        musicAudio.loop = true;
        musicAudio.volume = (masterVolume / 100) * (musicVolume / 100);
        musicAudio.play().catch(() => {});

        // Load images
        const loadImage = (src: string): Promise<HTMLImageElement> => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => resolve(img); // Still resolve on error, will use fallback
                img.src = src;
            });
        };

        Promise.all([
            loadImage("/tux/images/tux.png"),
            loadImage("/tux/images/fish1.png"),
            loadImage("/tux/images/fish2.png"),
            loadImage("/tux/images/fish3.png"),
            loadImage("/tux/images/fish4.png"),
            loadImage("/tux/images/fish5.png"),
            loadImage("/tux/images/fish6.png"),
            loadImage("/tux/images/fish7.png"),
            loadImage("/tux/images/fish8.png"),
            loadImage("/tux/images/fish9.png"),
            loadImage("/tux/images/golden.png"),
        ]).then(
            ([
                tux,
                fish1,
                fish2,
                fish3,
                fish4,
                fish5,
                fish6,
                fish7,
                fish8,
                fish9,
                golden,
            ]) => {
                tuxImg = tux;
                fishImgs = [
                    fish1,
                    fish2,
                    fish3,
                    fish4,
                    fish5,
                    fish6,
                    fish7,
                    fish8,
                    fish9,
                ];
                goldenImg = golden;
                imagesLoaded = tux.complete && tux.naturalWidth > 0;
            },
        );

        // Calculate responsive cell size
        const updateSize = () => {
            const maxSize = Math.min(window.innerWidth - 48, 400);
            cellSize = Math.floor(maxSize / GRID_SIZE);
        };
        updateSize();
        window.addEventListener("resize", updateSize);

        // Animate in
        requestAnimationFrame(() => {
            isVisible = true;
        });

        return () => {
            document.body.style.overflow = "";
            if (gameLoop) clearInterval(gameLoop);
            if (musicAudio) {
                musicAudio.pause();
                musicAudio = null;
            }
            window.removeEventListener("resize", updateSize);
        };
    });

    function spawnFish() {
        let newFish: Fish;
        let attempts = 0;
        const isGolden = goldenFishEnabled && Math.random() < 0.1;
        do {
            newFish = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE),
                golden: isGolden,
                variant: isGolden ? undefined : Math.floor(Math.random() * 9), // 0-8 for fish1-9
            };
            attempts++;
        } while (
            attempts < 100 &&
            (snake.some((s) => s.x === newFish.x && s.y === newFish.y) ||
                fishes.some((f) => f.x === newFish.x && f.y === newFish.y))
        );
        return newFish;
    }

    function initFishes() {
        fishes = [];
        for (let i = 0; i < fishCount; i++) {
            fishes.push(spawnFish());
        }
    }

    function draw() {
        if (!ctx) return;

        // Clear canvas
        ctx.fillStyle = "#131313";
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        // Draw grid lines (subtle)
        ctx.strokeStyle = "#222";
        ctx.lineWidth = 1;
        for (let i = 0; i <= GRID_SIZE; i++) {
            ctx.beginPath();
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, canvasSize);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(canvasSize, i * cellSize);
            ctx.stroke();
        }

        // Draw walls if enabled
        if (hasWalls) {
            ctx.strokeStyle = "#870042";
            ctx.lineWidth = 3;
            ctx.strokeRect(1, 1, canvasSize - 2, canvasSize - 2);
        }

        // Draw fishes
        fishes.forEach((fish) => {
            const img = fish.golden ? goldenImg : fishImgs[fish.variant ?? 0];
            if (imagesLoaded && img && img.naturalWidth > 0) {
                ctx.drawImage(
                    img,
                    fish.x * cellSize + 2,
                    fish.y * cellSize + 2,
                    cellSize - 4,
                    cellSize - 4,
                );
            } else {
                // Fallback to emoji
                ctx.font = `${cellSize - 4}px serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(
                    fish.golden ? "⭐" : "🐟",
                    fish.x * cellSize + cellSize / 2,
                    fish.y * cellSize + cellSize / 2,
                );
            }
        });

        // Draw snake (penguins)
        snake.forEach((segment) => {
            if (imagesLoaded && tuxImg && tuxImg.naturalWidth > 0) {
                ctx.drawImage(
                    tuxImg,
                    segment.x * cellSize + 2,
                    segment.y * cellSize + 2,
                    cellSize - 4,
                    cellSize - 4,
                );
            } else {
                // Fallback to emoji
                ctx.font = `${cellSize - 4}px serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(
                    "🐧",
                    segment.x * cellSize + cellSize / 2,
                    segment.y * cellSize + cellSize / 2,
                );
            }
        });
    }

    function update() {
        if (screen !== "playing") return;

        direction = nextDirection;

        let newX = snake[0].x + direction.x;
        let newY = snake[0].y + direction.y;

        // Handle walls or wrapping
        if (hasWalls) {
            if (
                newX < 0 ||
                newX >= GRID_SIZE ||
                newY < 0 ||
                newY >= GRID_SIZE
            ) {
                endGame();
                return;
            }
        } else {
            newX = (newX + GRID_SIZE) % GRID_SIZE;
            newY = (newY + GRID_SIZE) % GRID_SIZE;
        }

        const head = { x: newX, y: newY };

        // Check self collision
        if (snake.some((s) => s.x === head.x && s.y === head.y)) {
            endGame();
            return;
        }

        snake.unshift(head);

        // Check if ate fish
        const eatenFishIndex = fishes.findIndex(
            (f) => f.x === head.x && f.y === head.y,
        );
        if (eatenFishIndex !== -1) {
            const eatenFish = fishes[eatenFishIndex];
            score += eatenFish.golden ? 5 : 1;
            playSfx(eatenFish.golden ? "golden" : "eat");
            fishes.splice(eatenFishIndex, 1);
            fishes.push(spawnFish());
        } else {
            snake.pop();
        }

        draw();
    }

    async function endGame() {
        showExplosion = true;
        explosionFrame = 0;
        playSfx("gameover");
        playMusic("stop");
        if (gameLoop) {
            clearInterval(gameLoop);
            gameLoop = null;
        }
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("tuxHighScore", String(highScore));
        }
        // Animate explosion sprite sheet
        const explosionInterval = setInterval(() => {
            explosionFrame++;
            if (explosionFrame >= EXPLOSION_FRAMES) {
                clearInterval(explosionInterval);
                showExplosion = false;
                explosionFrame = 0;
            }
        }, EXPLOSION_FRAME_MS);

        // Check if score qualifies for leaderboard
        try {
            const entries = await getLeaderboard(10);
            leaderboard = entries;
            const lowestScore =
                entries.length < 10
                    ? 0
                    : entries[entries.length - 1]?.score || 0;
            if (score > lowestScore || entries.length < 10) {
                isNewHighScore = true;
                playerRank = entries.filter((e) => e.score > score).length + 1;
                playerInitials = ["A", "A", "A"];
                currentInitialIndex = 0;
                screen = "enterinit";
            } else {
                isNewHighScore = false;
                screen = "gameover";
            }
        } catch {
            isNewHighScore = false;
            screen = "gameover";
        }
    }

    async function submitHighScore() {
        const name = playerInitials.join("");
        try {
            await addLeaderboardEntry(name, score);
            leaderboard = await getLeaderboard(10);
        } catch (e) {
            console.error("Error submitting score:", e);
        }
        screen = "gameover";
    }

    function cycleInitial(direction: 1 | -1) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const currentChar = playerInitials[currentInitialIndex];
        const currentIndex = chars.indexOf(currentChar);
        const newIndex =
            (currentIndex + direction + chars.length) % chars.length;
        playerInitials[currentInitialIndex] = chars[newIndex];
    }

    async function loadLeaderboardData() {
        loadingLeaderboard = true;
        try {
            leaderboard = await getLeaderboard(14);
        } catch (e) {
            console.error("Error loading leaderboard:", e);
        }
        loadingLeaderboard = false;
    }

    function handleKeydown(e: KeyboardEvent) {
        // Handle initials entry screen
        if (screen === "enterinit") {
            e.preventDefault();
            switch (e.key) {
                case "ArrowUp":
                    cycleInitial(1);
                    break;
                case "ArrowDown":
                    cycleInitial(-1);
                    break;
                case "ArrowLeft":
                    currentInitialIndex = Math.max(0, currentInitialIndex - 1);
                    break;
                case "ArrowRight":
                    currentInitialIndex = Math.min(2, currentInitialIndex + 1);
                    break;
                case "Enter":
                case " ":
                    submitHighScore();
                    break;
            }
            return;
        }

        if (screen === "gameover") {
            if (e.key === " " || e.key === "Enter") {
                startGame();
            }
            return;
        }

        if (screen !== "playing") return;

        e.preventDefault();
        switch (e.key) {
            case "ArrowUp":
            case "w":
            case "W":
                if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
                break;
            case "ArrowDown":
            case "s":
            case "S":
                if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
                break;
            case "ArrowLeft":
            case "a":
            case "A":
                if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
                break;
            case "ArrowRight":
            case "d":
            case "D":
                if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
                break;
        }
    }

    function startGame() {
        playSfx("click");
        snake = [
            { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) },
        ];
        direction = { x: 1, y: 0 };
        nextDirection = { x: 1, y: 0 };
        score = 0;
        initFishes();
        screen = "playing";
        playMusic("start");

        // Wait for canvas to be ready
        setTimeout(() => {
            if (canvas) {
                ctx = canvas.getContext("2d")!;
                draw();
                if (gameLoop) clearInterval(gameLoop);
                gameLoop = setInterval(update, SPEEDS[difficulty]);
            }
        }, 10);
    }

    function closeGame() {
        if (gameLoop) clearInterval(gameLoop);
        playMusic("stop");
        isClosing = true;
        setTimeout(() => {
            onClose();
        }, 500);
    }

    function handleBackdropClick(e: MouseEvent) {
        if (e.target === e.currentTarget) {
            closeGame();
        }
    }

    function saveAudioSettings() {
        localStorage.setItem("tuxMasterVolume", String(masterVolume));
        localStorage.setItem("tuxMusicVolume", String(musicVolume));
        localStorage.setItem("tuxSfxVolume", String(sfxVolume));
        updateMusicVolume();
    }

    function changeDirection(dir: "up" | "down" | "left" | "right") {
        if (screen !== "playing") return;
        switch (dir) {
            case "up":
                if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
                break;
            case "down":
                if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
                break;
            case "left":
                if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
                break;
            case "right":
                if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
                break;
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
    class="fixed inset-0 bg-black flex items-center justify-center z-40 p-4 touch-manipulation
        transition-opacity duration-500 {isVisible && !isClosing
        ? 'opacity-100'
        : 'opacity-0'}"
    role="dialog"
    aria-modal="true"
    aria-label="TUX GAME"
    tabindex="-1"
    onclick={handleBackdropClick}
    onkeydown={(e) => e.key === "Escape" && closeGame()}
>
    <div
        class="bg-black border-4 border-white p-4 flex flex-col gap-3 max-h-[90vh] overflow-y-auto
            {isVisible && !isClosing ? 'opacity-100' : 'opacity-0'}"
        style="width: {canvasSize + 48}px; min-width: 320px;"
    >
        <!-- Header -->
        <div
            class="flex justify-between items-center border-b-2 border-white pb-2"
        >
            <ArcadeText tag="h3" class="text-white">{m.tux_title()}</ArcadeText>
            <ArcadeButtonSmall onclick={closeGame}>X</ArcadeButtonSmall>
        </div>

        <!-- Menu Screen -->
        {#if screen === "menu"}
            <div class="flex flex-col items-center gap-4 py-4">
                <img src="/tux/images/tux.png" alt="Tux" class="w-16 h-16" />
                <ArcadeText tag="h3" class="text-center text-white"
                    >{m.tux_tagline()}</ArcadeText
                >
                <div class="flex flex-col gap-3 w-full">
                    <ArcadeButton onclick={startGame}
                        >{m.tux_play()}</ArcadeButton
                    >
                    <ArcadeButton
                        onclick={() => {
                            playSfx("click");
                            screen = "settings";
                        }}>{m.tux_settings()}</ArcadeButton
                    >
                    <ArcadeButton
                        onclick={() => {
                            playSfx("click");
                            loadLeaderboardData();
                            screen = "leaderboard";
                        }}>{m.tux_highscores()}</ArcadeButton
                    >
                    <ArcadeButton
                        onclick={() => {
                            playSfx("click");
                            screen = "credits";
                        }}>{m.tux_credits()}</ArcadeButton
                    >
                </div>
                <ArcadeText tag="p" class="text-white"
                    >{m.tux_best({ score: highScore })}</ArcadeText
                >
            </div>

            <!-- Settings Screen -->
        {:else if screen === "settings"}
            <div class="flex flex-col gap-3">
                <ArcadeText tag="h1" class="text-white text-center"
                    >{m.tux_settings()}</ArcadeText
                >

                <!-- Audio Settings -->
                <div class="flex flex-col gap-2 border-t-2 border-white pt-2">
                    <ArcadeText tag="h3" class="text-white"
                        >{m.tux_audio()}</ArcadeText
                    >
                    <div class="flex justify-between items-center">
                        <ArcadeText tag="h3" class="text-white"
                            >{m.tux_master({ level: masterVolume })}</ArcadeText
                        >
                        <div class="flex gap-1">
                            <ArcadeButtonSmall
                                onclick={() => {
                                    masterVolume = Math.max(
                                        0,
                                        masterVolume - 10,
                                    );
                                    saveAudioSettings();
                                }}>-</ArcadeButtonSmall
                            >
                            <ArcadeButtonSmall
                                onclick={() => {
                                    masterVolume = Math.min(
                                        100,
                                        masterVolume + 10,
                                    );
                                    saveAudioSettings();
                                }}>+</ArcadeButtonSmall
                            >
                        </div>
                    </div>
                    <div class="flex justify-between items-center">
                        <ArcadeText tag="h3" class="text-white"
                            >{m.tux_music({ level: musicVolume })}</ArcadeText
                        >
                        <div class="flex gap-1">
                            <ArcadeButtonSmall
                                onclick={() => {
                                    musicVolume = Math.max(0, musicVolume - 10);
                                    saveAudioSettings();
                                }}>-</ArcadeButtonSmall
                            >
                            <ArcadeButtonSmall
                                onclick={() => {
                                    musicVolume = Math.min(
                                        100,
                                        musicVolume + 10,
                                    );
                                    saveAudioSettings();
                                }}>+</ArcadeButtonSmall
                            >
                        </div>
                    </div>
                    <div class="flex justify-between items-center">
                        <ArcadeText tag="h3" class="text-white"
                            >{m.tux_sfx({ level: sfxVolume })}</ArcadeText
                        >
                        <div class="flex gap-1">
                            <ArcadeButtonSmall
                                onclick={() => {
                                    sfxVolume = Math.max(0, sfxVolume - 10);
                                    saveAudioSettings();
                                }}>-</ArcadeButtonSmall
                            >
                            <ArcadeButtonSmall
                                onclick={() => {
                                    sfxVolume = Math.min(100, sfxVolume + 10);
                                    saveAudioSettings();
                                }}>+</ArcadeButtonSmall
                            >
                        </div>
                    </div>
                </div>

                <!-- Difficulty -->
                <div class="flex flex-col gap-2 border-t-2 border-white pt-2">
                    <ArcadeText tag="h3" class="text-white"
                        >{m.tux_speed()}</ArcadeText
                    >
                    <div class="flex gap-1">
                        {#each ["easy", "medium", "hard"] as diff (diff)}
                            <ArcadeButton
                                onclick={() => {
                                    playSfx("click");
                                    difficulty = diff as Difficulty;
                                }}
                                active={difficulty === diff}
                                class="flex-1"
                                >{DIFFICULTY_LABELS[
                                    diff as Difficulty
                                ]()}</ArcadeButton
                            >
                        {/each}
                    </div>
                </div>

                <!-- Walls -->
                <div
                    class="flex items-center justify-between border-t-2 border-white pt-2"
                >
                    <ArcadeText tag="h3" class="text-white"
                        >{m.tux_walls()}</ArcadeText
                    >
                    <ArcadeButtonSmall
                        onclick={() => {
                            playSfx("click");
                            hasWalls = !hasWalls;
                        }}
                        active={hasWalls}
                        >{hasWalls
                            ? m.tux_on()
                            : m.tux_off()}</ArcadeButtonSmall
                    >
                </div>

                <!-- Fish Count -->
                <div class="flex items-center justify-between">
                    <ArcadeText tag="h3" class="text-white"
                        >{m.tux_fish({ count: fishCount })}</ArcadeText
                    >
                    <div class="flex gap-1">
                        <ArcadeButtonSmall
                            onclick={() => {
                                fishCount = Math.max(1, fishCount - 1);
                            }}>-</ArcadeButtonSmall
                        >
                        <ArcadeButtonSmall
                            onclick={() => {
                                fishCount = Math.min(69, fishCount + 1);
                            }}>+</ArcadeButtonSmall
                        >
                    </div>
                </div>

                <!-- Golden Fish -->
                <div class="flex items-center justify-between">
                    <ArcadeText tag="h3" class="text-white"
                        >{m.tux_goldenfish()}</ArcadeText
                    >
                    <ArcadeButtonSmall
                        onclick={() => {
                            playSfx("click");
                            goldenFishEnabled = !goldenFishEnabled;
                        }}
                        active={goldenFishEnabled}
                        >{goldenFishEnabled
                            ? m.tux_on()
                            : m.tux_off()}</ArcadeButtonSmall
                    >
                </div>

                <ArcadeButton
                    class="mt-2"
                    onclick={() => {
                        playSfx("click");
                        screen = "menu";
                    }}>{m.tux_back()}</ArcadeButton
                >
            </div>

            <!-- Leaderboard Screen -->
        {:else if screen === "leaderboard"}
            <div class="flex flex-col gap-2">
                <ArcadeText tag="h3" class="text-white text-center"
                    >{m.tux_highscores()}</ArcadeText
                >

                {#if loadingLeaderboard}
                    <ArcadeText tag="p" class="text-white text-center"
                        >{m.tux_loading()}</ArcadeText
                    >
                {:else if leaderboard.length === 0}
                    <ArcadeText tag="p" class="text-white text-center"
                        >{m.tux_noscores()}</ArcadeText
                    >
                {:else}
                    <div class="border-2 border-white p-2">
                        <ArcadeText
                            tag="div"
                            class="flex justify-between text-white border-b border-white pb-1 mb-1"
                        >
                            <span class="w-12">{m.tux_rank()}</span>
                            <span class="w-16">{m.tux_name()}</span>
                            <span class="flex-1 text-right"
                                >{m.tux_score({ score: "" })}</span
                            >
                        </ArcadeText>
                        {#each leaderboard as entry, i (entry.id)}
                            <ArcadeText
                                tag="div"
                                class="flex justify-between {i === 0
                                    ? 'text-yellow-400'
                                    : 'text-white'}"
                            >
                                <span class="w-12"
                                    >{i === 0
                                        ? m.tux_rank_1st()
                                        : i === 1
                                          ? m.tux_rank_2nd()
                                          : i === 2
                                            ? m.tux_rank_3rd()
                                            : m.tux_rank_th({
                                                  rank: i + 1,
                                              })}</span
                                >
                                <span class="w-16">{entry.name}</span>
                                <span class="flex-1 text-right"
                                    >{entry.score}</span
                                >
                            </ArcadeText>
                        {/each}
                    </div>
                {/if}

                <ArcadeButton
                    class="mt-2"
                    onclick={() => {
                        playSfx("click");
                        screen = "menu";
                    }}>{m.tux_back()}</ArcadeButton
                >
            </div>

            <!-- Playing Screen -->
        {:else if screen === "playing"}
            <ArcadeText tag="div" class="flex justify-between text-white">
                <span>{m.tux_score({ score })}</span>
                <span>{m.tux_best({ score: highScore })}</span>
            </ArcadeText>

            <div class="flex justify-center">
                <canvas
                    bind:this={canvas}
                    width={canvasSize}
                    height={canvasSize}
                    class="border-2 border-white"
                ></canvas>
            </div>

            <ArcadeText tag="p" class="text-center text-white hidden sm:block"
                >{m.tux_controls()}</ArcadeText
            >

            <!-- Mobile D-Pad Controls -->
            <ArcadeDpad
                onUp={() => changeDirection("up")}
                onDown={() => changeDirection("down")}
                onLeft={() => changeDirection("left")}
                onRight={() => changeDirection("right")}
            />

            <!-- Enter Initials Screen -->
        {:else if screen === "enterinit"}
            <div class="flex flex-col items-center gap-4 py-4">
                <ArcadeText tag="h3" class="text-yellow-400 text-center"
                    >{m.tux_newhighscore()}</ArcadeText
                >
                <ArcadeText tag="h1" class="text-white">{score}</ArcadeText>
                <ArcadeText tag="p" class="text-white"
                    >({playerRank === 1
                        ? m.tux_rank_1st()
                        : playerRank === 2
                          ? m.tux_rank_2nd()
                          : playerRank === 3
                            ? m.tux_rank_3rd()
                            : m.tux_rank_th({ rank: playerRank })})</ArcadeText
                >

                <!-- Initials Entry -->
                <div class="flex gap-4 my-4">
                    {#each playerInitials as initial, i (i)}
                        <div class="flex flex-col items-center gap-1">
                            <ArcadeButtonSmall
                                onclick={() => {
                                    currentInitialIndex = i;
                                    cycleInitial(1);
                                }}>▲</ArcadeButtonSmall
                            >
                            <ArcadeText
                                class="bg-transparent border-0 border-b-4 px-2 cursor-pointer {currentInitialIndex ===
                                i
                                    ? 'text-yellow-400 border-yellow-400'
                                    : 'text-white border-white'}"
                                onclick={() => (currentInitialIndex = i)}
                                >{initial}</ArcadeText
                            >
                            <ArcadeButtonSmall
                                onclick={() => {
                                    currentInitialIndex = i;
                                    cycleInitial(-1);
                                }}>▼</ArcadeButtonSmall
                            >
                        </div>
                    {/each}
                </div>

                <ArcadeText tag="p" class="text-white"
                    >{m.tux_enterinitials()}</ArcadeText
                >

                <ArcadeButton onclick={submitHighScore}
                    >{m.tux_submit()}</ArcadeButton
                >
            </div>

            <!-- Credits Screen -->
        {:else if screen === "credits"}
            <div class="flex flex-col gap-4 py-4">
                <ArcadeText tag="p" class="text-white text-center"
                    >{m.tux_credits()}</ArcadeText
                >

                <div class="border-t-2 border-white pt-3">
                    <ArcadeText tag="p" class="text-yellow-400"
                        >{m.tux_credits_music()}</ArcadeText
                    >
                    <div class="mt-2 flex flex-col gap-1">
                        <ArcadeText tag="p" class="text-white"
                            >{m.tux_credits_music1()}</ArcadeText
                        >
                        <ArcadeText tag="p" class="text-white"
                            >{m.tux_credits_music2()}</ArcadeText
                        >
                        <ArcadeText tag="p" class="text-gray"
                            >{m.tux_credits_remix()}</ArcadeText
                        >
                    </div>
                </div>

                <div class="border-t-2 border-white pt-3">
                    <ArcadeText tag="p" class="text-yellow-400"
                        >{m.tux_credits_fish()}</ArcadeText
                    >
                    <div class="mt-2 grid grid-cols-2 gap-1">
                        <ArcadeText tag="p" class="text-white"
                            >FEDORA</ArcadeText
                        >
                        <ArcadeText tag="p" class="text-white"
                            >DEBIAN</ArcadeText
                        >
                        <ArcadeText tag="p" class="text-white"
                            >UBUNTU</ArcadeText
                        >
                        <ArcadeText tag="p" class="text-white">MINT</ArcadeText>
                        <ArcadeText tag="p" class="text-white">ARCH</ArcadeText>
                        <ArcadeText tag="p" class="text-white"
                            >TEMPLEOS</ArcadeText
                        >
                        <ArcadeText tag="p" class="text-white">POP</ArcadeText>
                        <ArcadeText tag="p" class="text-white">NIXOS</ArcadeText
                        >
                        <ArcadeText tag="p" class="text-white">SUSE</ArcadeText>
                        <ArcadeText tag="p" class="text-white"
                            >STEAMOS</ArcadeText
                        >
                    </div>
                </div>

                <ArcadeButton
                    class="mt-2"
                    onclick={() => {
                        playSfx("click");
                        screen = "menu";
                    }}>{m.tux_back()}</ArcadeButton
                >
            </div>

            <!-- Game Over Screen -->
        {:else if screen === "gameover"}
            <div class="flex flex-col items-center gap-3 py-2 relative">
                {#if showExplosion}
                    <div
                        class="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <div
                            class="w-32 h-32 bg-no-repeat"
                            style="
                                background-image: url('/tux/images/explosion.png');
                                background-size: {EXPLOSION_FRAMES * 100}% 100%;
                                background-position: {explosionFrame *
                                (100 / (EXPLOSION_FRAMES - 1))}% 0;
                            "
                        ></div>
                    </div>
                {/if}
                <ArcadeText tag="h1" class="text-white"
                    >{m.tux_gameover()}</ArcadeText
                >
                <ArcadeText tag="p" class="text-yellow-400">{score}</ArcadeText>
                <ArcadeText tag="p" class="text-white"
                    >{m.tux_best({ score: highScore })}</ArcadeText
                >
                <div class="flex flex-col gap-2 w-full mt-2">
                    <ArcadeButton onclick={startGame}
                        >{m.tux_playagain()}</ArcadeButton
                    >
                    <ArcadeButton
                        onclick={() => {
                            playSfx("click");
                            loadLeaderboardData();
                            screen = "leaderboard";
                        }}>{m.tux_highscores()}</ArcadeButton
                    >
                    <ArcadeButton
                        onclick={() => {
                            playSfx("click");
                            screen = "menu";
                        }}>{m.tux_menu()}</ArcadeButton
                    >
                </div>
            </div>
        {/if}
    </div>
</div>
