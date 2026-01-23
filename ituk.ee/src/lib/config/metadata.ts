// Centralized metadata configuration for all pages
// Edit this file to update SEO metadata across the site

export interface PageMetadata {
    title: string;
    title_en?: string;
    description: string;
    description_en?: string;
    image: string;
    type?: string;
}

export const siteMetadata = {
    siteName: "ITÜK",
    siteUrl: "https://ituk.ee",
    defaultImage: "/images/hero.jpg",
    defaultType: "website",
};

export const pageMetadata: Record<string, PageMetadata> = {
    home: {
        title: "ITÜK | TalTechi IT-teaduskonna üliõpilaskogu",
        title_en: "ITÜK | TalTech School of IT Student Council",
        description: "ITÜK on TalTech IT-teaduskonna üliõpilaskogu - tudengite organisatsioon, mis korraldab üritusi ja esindab üliõpilaste huve.",
        description_en: "ITÜK is the TalTech School of IT Student Council - a student organization that organizes events and represents student interests.",
        image: "/images/hero.jpg",
    },
    meist: {
        title: "Meist | ITÜK",
        title_en: "About Us | ITÜK",
        description: "Tutvu ITÜKi struktuuriga, juhatusega ja ajalooga. ITÜK on TalTech IT-teaduskonna üliõpilaskogu.",
        description_en: "Learn about ITÜK's structure, board, and history. ITÜK is the TalTech School of IT Student Council.",
        image: "/headers/meist.jpg",
    },
    liitu: {
        title: "Liitu | ITÜK",
        title_en: "Join Us | ITÜK",
        description: "Liitu ITÜKiga ja saa osa põnevatest üritustest, koolitustest ja võrgustikust. Ootame kõiki TalTech IT-teaduskonna tudengeid!",
        description_en: "Join ITÜK and be part of exciting events, trainings, and networking. We welcome all TalTech School of IT students!",
        image: "/headers/liitu.jpg",
    },
    partnerlus: {
        title: "Partnerlus | ITÜK",
        title_en: "Partnership | ITÜK",
        description: "ITÜKi partnerid ja koostöövõimalused. Tutvu meie partneritega ja võta ühendust koostööks.",
        description_en: "ITÜK partners and collaboration opportunities. Meet our partners and contact us for cooperation.",
        image: "/headers/cooperation.jpg",
    },
    rent: {
        title: "Rent | ITÜK",
        title_en: "Rental | ITÜK",
        description: "ITÜKi renditeenused - laenuta kaableid, juhtmeid ja muid tarvikuid ürituste korraldamiseks.",
        description_en: "ITÜK rental services - borrow cables, wires, and other supplies for organizing events.",
        image: "/headers/rent.jpg",
    },
    uritused: {
        title: "Üritused | ITÜK",
        title_en: "Events | ITÜK",
        description: "ITÜKi üritused - haridus, meelelahutus ja siseüritused. Vaata, mida me korraldame!",
        description_en: "ITÜK events - education, entertainment, and internal events. See what we organize!",
        image: "/events/haridus.jpg",
    },
    stiil: {
        title: "Stiiliraamat | ITÜK",
        title_en: "Style Guide | ITÜK",
        description: "ITÜKi stiiliraamat - logod, värvid ja brändijuhised.",
        description_en: "ITÜK style guide - logos, colors, and brand guidelines.",
        image: "/headers/style.jpg",
    },
};

// Helper function to get localized metadata
export function getLocalizedMetadata(pageKey: string, locale: string = "et"): {
    title: string;
    description: string;
    image: string;
    type: string;
} {
    const page = pageMetadata[pageKey];
    if (!page) {
        return {
            title: siteMetadata.siteName,
            description: "",
            image: siteMetadata.defaultImage,
            type: siteMetadata.defaultType,
        };
    }

    const isEnglish = locale === "en";
    return {
        title: isEnglish && page.title_en ? page.title_en : page.title,
        description: isEnglish && page.description_en ? page.description_en : page.description,
        image: page.image,
        type: page.type || siteMetadata.defaultType,
    };
}
