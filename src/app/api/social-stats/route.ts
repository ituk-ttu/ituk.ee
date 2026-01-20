import { NextResponse } from "next/server";

// Cache storage
let cachedStats: SocialStats | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface SocialStats {
    instagram: number;
    facebook: number;
    discord: number;
    lastUpdated: string;
}

async function fetchInstagramFollowers(): Promise<number> {
    // TODO: Implement Instagram Graph API
    // For now, return a placeholder that can be updated
    // You would need: INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID
    return 1070;
}

async function fetchFacebookFollowers(): Promise<number> {
    // TODO: Implement Facebook Graph API
    // For now, return a placeholder
    // You would need: FACEBOOK_ACCESS_TOKEN and FACEBOOK_PAGE_ID
    return 1900;
}

async function fetchDiscordMembers(): Promise<number> {
    // Discord widget API - can be enabled in server settings
    // Replace DISCORD_SERVER_ID with your actual server ID
    const DISCORD_SERVER_ID = process.env.DISCORD_SERVER_ID;

    if (!DISCORD_SERVER_ID) {
        return 320; // Fallback value
    }

    try {
        const response = await fetch(
            `https://discord.com/api/v9/guilds/${DISCORD_SERVER_ID}/widget.json`,
            { next: { revalidate: 300 } } // Cache for 5 minutes
        );

        if (response.ok) {
            const data = await response.json();
            return data.presence_count || 320;
        }
    } catch (error) {
        console.error("Error fetching Discord stats:", error);
    }

    return 320; // Fallback
}

export async function GET() {
    const now = Date.now();

    // Return cached data if within cooldown period
    if (cachedStats && (now - lastFetchTime) < CACHE_DURATION) {
        return NextResponse.json({
            ...cachedStats,
            cached: true,
            nextRefreshIn: Math.ceil((CACHE_DURATION - (now - lastFetchTime)) / 1000)
        });
    }

    // Fetch fresh stats
    try {
        const [instagram, facebook, discord] = await Promise.all([
            fetchInstagramFollowers(),
            fetchFacebookFollowers(),
            fetchDiscordMembers()
        ]);

        cachedStats = {
            instagram,
            facebook,
            discord,
            lastUpdated: new Date().toISOString()
        };
        lastFetchTime = now;

        return NextResponse.json({
            ...cachedStats,
            cached: false,
            nextRefreshIn: Math.ceil(CACHE_DURATION / 1000)
        });
    } catch (error) {
        console.error("Error fetching social stats:", error);

        // Return cached data if available, even if stale
        if (cachedStats) {
            return NextResponse.json({
                ...cachedStats,
                cached: true,
                stale: true,
                error: "Failed to fetch fresh stats"
            });
        }

        return NextResponse.json(
            { error: "Failed to fetch social stats" },
            { status: 500 }
        );
    }
}
