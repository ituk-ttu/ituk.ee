/**
 * Statistics Configuration
 * 
 * Easy to update social media follower counts and other statistics.
 * Update these values whenever needed - they will be reflected across the site.
 */

// ITÜK Birthday - used to calculate years of operation
export const ITUK_BIRTHDAY = new Date(2005, 0, 25); // January 25, 2005

/**
 * Calculate years since ITÜK was founded
 */
export function getYearsInAction(): number {
    const now = new Date();
    let years = now.getFullYear() - ITUK_BIRTHDAY.getFullYear();

    // If we haven't reached the birthday this year yet, subtract 1
    const hadBirthdayThisYear =
        now.getMonth() > ITUK_BIRTHDAY.getMonth() ||
        (now.getMonth() === ITUK_BIRTHDAY.getMonth() && now.getDate() >= ITUK_BIRTHDAY.getDate());

    if (!hadBirthdayThisYear) {
        years--;
    }

    return years;
}

// ===========================================
// ABOUT PAGE STATS
// ===========================================

export const ABOUT_STATS = {
    membersAllTime: 1200 + "+",
    activeMembers: 45,
    goals: 1,
};

// ===========================================
// SOCIAL MEDIA STATS - UPDATE THESE AS NEEDED
// ===========================================

export const SOCIAL_STATS = {
    instagram: {
        followers: 1170,
        link: "https://www.instagram.com/ituk.taltech/",
    },
    facebook: {
        followers: 2000,
        link: "https://www.facebook.com/ituk.taltech/",
    },
    discord: {
        members: 450,
        link: "https://discord.gg/ituk",
    },
};

// ===========================================
// PARTNERSHIP PAGE STATS  
// ===========================================

export const EVENTS_PER_YEAR = 30 + "+";
