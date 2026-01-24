<script lang="ts">
    import { onMount } from "svelte";
    import * as m from "$lib/paraglide/messages";
    import Button from "$lib/components/Button.svelte";
    import Toggle from "$lib/components/Toggle.svelte";
    import Slider from "$lib/components/Slider.svelte";

    interface Props {
        onClose: () => void;
    }

    let { onClose }: Props = $props();

    // Animation states
    let isVisible = $state(false);
    let isClosing = $state(false);
    let showExplosion = $state(false);
    let explosionFrame = $state(0);
    const EXPLOSION_FRAMES = 18; // Number of frames in sprite sheet (horizontal)
    const EXPLOSION_FRAME_MS = 80; // Duration per frame

    // Game states
    type GameScreen = "menu" | "settings" | "playing" | "gameover";
    let screen = $state<GameScreen>("menu");

    // Settings
    type Difficulty = "easy" | "medium" | "hard";

    // Difficulty labels for translations
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
    let fishImgs: HTMLImageElement[] = []; // fish1-4.png
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

        // Load music and start playing on menu
        musicAudio = new Audio("/tux/sounds/music.mp3");
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
            loadImage("/tux/images/golden.png"),
        ]).then(([tux, fish1, fish2, fish3, fish4, golden]) => {
            tuxImg = tux;
            fishImgs = [fish1, fish2, fish3, fish4];
            goldenImg = golden;
            imagesLoaded = tux.complete && tux.naturalWidth > 0;
        });

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
                variant: isGolden ? undefined : Math.floor(Math.random() * 4), // 0-3 for fish1-4
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

    function endGame() {
        screen = "gameover";
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
    }

    function handleKeydown(e: KeyboardEvent) {
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
    class="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 touch-manipulation
        transition-opacity duration-500 {isVisible && !isClosing
        ? 'opacity-100'
        : 'opacity-0'}"
    role="dialog"
    aria-modal="true"
    aria-label={m.tux_title()}
    tabindex="-1"
    onclick={handleBackdropClick}
    onkeydown={(e) => e.key === "Escape" && closeGame()}
>
    <div
        class="bg-background rounded-xl p-4 flex flex-col gap-3 max-h-[90vh] overflow-y-auto
            transition-transform duration-500 origin-center
            {isVisible && !isClosing ? 'tux-spin-in' : 'tux-spin-out'}"
        style="width: {canvasSize + 32}px;"
    >
        <!-- Header -->
        <div class="flex justify-between items-center">
            <h3 class="text-lg font-bold">{m.tux_title()}</h3>
            <button
                onclick={closeGame}
                class="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors rounded-full hover:bg-white/10"
                aria-label="Close"
            >
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>

        <!-- Menu Screen -->
        {#if screen === "menu"}
            <div class="flex flex-col items-center gap-4 py-4">
                <p class="text-6xl">🐧</p>
                <p class="text-center text-sm">
                    {m.tux_description()}
                </p>
                <div class="flex flex-col gap-2">
                    <Button text={m.tux_play()} onclick={startGame} size="lg" />
                    <Button
                        text={m.tux_settings()}
                        onclick={() => {
                            playSfx("click");
                            screen = "settings";
                        }}
                        variant="tertiary"
                        size="md"
                    />
                </div>
                <p class="text-xs text-gray">
                    {m.tux_highscore({ score: highScore })}
                </p>
            </div>

            <!-- Settings Screen -->
        {:else if screen === "settings"}
            <div class="flex flex-col gap-3">
                <!-- Audio Settings -->
                <div class="flex flex-col gap-1 pt-2 border-t border-gray/20">
                    <span class="text-xs text-gray font-bold"
                        >{m.tux_audio()}</span
                    >
                    <div class="flex flex-col gap-1">
                        <span class="text-xs text-gray"
                            >{m.tux_master_volume({
                                level: masterVolume,
                            })}</span
                        >
                        <Slider
                            bind:value={masterVolume}
                            step={10}
                            onchange={saveAudioSettings}
                            ariaLabel="Master volume"
                        />
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-xs text-gray"
                            >{m.tux_music_volume({ level: musicVolume })}</span
                        >
                        <Slider
                            bind:value={musicVolume}
                            step={10}
                            onchange={saveAudioSettings}
                            ariaLabel="Music volume"
                        />
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-xs text-gray"
                            >{m.tux_sfx_volume({ level: sfxVolume })}</span
                        >
                        <Slider
                            bind:value={sfxVolume}
                            step={10}
                            onchange={saveAudioSettings}
                            ariaLabel="Effects volume"
                        />
                    </div>
                </div>

                <!-- Difficulty -->
                <div class="flex flex-col gap-1">
                    <span class="text-xs text-gray">{m.tux_speed()}</span>
                    <div class="flex gap-1">
                        {#each ["easy", "medium", "hard"] as diff (diff)}
                            <Button
                                onclick={() => {
                                    playSfx("click");
                                    difficulty = diff as Difficulty;
                                }}
                                variant={difficulty === diff
                                    ? "primary"
                                    : "secondary"}
                                size="md"
                                text={DIFFICULTY_LABELS[diff as Difficulty]()}
                            />
                        {/each}
                    </div>
                </div>

                <!-- Walls -->
                <div class="flex items-center justify-between">
                    <span class="text-xs">{m.tux_walls()}</span>
                    <Toggle
                        checked={hasWalls}
                        onchange={(v) => {
                            playSfx("click");
                            hasWalls = v;
                        }}
                        ariaLabel="Toggle walls"
                    />
                </div>

                <!-- Fish Count -->
                <div class="flex flex-col gap-1">
                    <span class="text-xs text-gray"
                        >{m.tux_fishcount({ count: fishCount })}</span
                    >
                    <Slider
                        bind:value={fishCount}
                        min={1}
                        max={69}
                        ariaLabel="Fish count"
                    />
                </div>

                <!-- Golden Fish -->
                <div class="flex items-center justify-between">
                    <span class="text-xs">{m.tux_goldenfish()}</span>
                    <Toggle
                        checked={goldenFishEnabled}
                        onchange={(v) => {
                            playSfx("click");
                            goldenFishEnabled = v;
                        }}
                        ariaLabel="Toggle golden fish"
                    />
                </div>

                <Button
                    text={m.tux_back()}
                    onclick={() => {
                        playSfx("click");
                        screen = "menu";
                    }}
                    variant="secondary"
                    size="sm"
                />
            </div>

            <!-- Playing Screen -->
        {:else if screen === "playing"}
            <div class="flex justify-between text-xs">
                <span>{m.tux_score({ score })}</span>
                <span>{m.tux_highscore({ score: highScore })}</span>
            </div>

            <div class="flex justify-center">
                <canvas
                    bind:this={canvas}
                    width={canvasSize}
                    height={canvasSize}
                    class="rounded border border-gray"
                ></canvas>
            </div>

            <p class="text-center text-xs text-gray hidden sm:block">
                {m.tux_controls()}
            </p>

            <!-- Mobile D-Pad Controls -->
            <div
                class="flex flex-col items-center gap-1 sm:hidden touch-manipulation select-none"
            >
                <button
                    onclick={() => changeDirection("up")}
                    class="w-12 h-12 bg-gray/30 rounded active:bg-primary flex items-center justify-center text-xl touch-manipulation"
                    aria-label="Up">▲</button
                >
                <div class="flex gap-1">
                    <button
                        onclick={() => changeDirection("left")}
                        class="w-12 h-12 bg-gray/30 rounded active:bg-primary flex items-center justify-center text-xl touch-manipulation"
                        aria-label="Left">◀</button
                    >
                    <div class="w-12 h-12"></div>
                    <button
                        onclick={() => changeDirection("right")}
                        class="w-12 h-12 bg-gray/30 rounded active:bg-primary flex items-center justify-center text-xl touch-manipulation"
                        aria-label="Right">▶</button
                    >
                </div>
                <button
                    onclick={() => changeDirection("down")}
                    class="w-12 h-12 bg-gray/30 rounded active:bg-primary flex items-center justify-center text-xl touch-manipulation"
                    aria-label="Down">▼</button
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
                <p class="text-5xl">💀</p>
                <p class="text-lg font-bold">{m.tux_gameover()}</p>
                <p class="text-2xl font-bold text-primary">{score}</p>
                <p class="text-xs text-gray">
                    {score > highScore
                        ? m.tux_newhighscore()
                        : m.tux_highscore({ score: highScore })}
                </p>
                <div class="flex gap-2">
                    <Button
                        text={m.tux_playagain()}
                        onclick={startGame}
                        size="md"
                        class="flex-1"
                    />
                    <Button
                        text={m.tux_menu()}
                        onclick={() => {
                            playSfx("click");
                            screen = "menu";
                        }}
                        variant="tertiary"
                        size="md"
                        class="flex-1"
                    />
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    @keyframes spinIn {
        from {
            transform: scale(0) rotate(-360deg);
            opacity: 0;
        }
        to {
            transform: scale(1) rotate(0deg);
            opacity: 1;
        }
    }

    @keyframes spinOut {
        from {
            transform: scale(1) rotate(0deg);
            opacity: 1;
        }
        to {
            transform: scale(0) rotate(360deg);
            opacity: 0;
        }
    }

    .tux-spin-in {
        animation: spinIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    .tux-spin-out {
        animation: spinOut 0.5s cubic-bezier(0.36, 0, 0.66, -0.56) forwards;
    }
</style>
