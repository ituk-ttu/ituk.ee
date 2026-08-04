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
    defaultImage: "/banners/ituk_banner.jpg",
    defaultType: "website",
};

export const pageMetadata: Record<string, PageMetadata> = {
    home: {
        title: "ITÜK | TalTechi IT-teaduskonna üliõpilaskogu",
        title_en: "ITÜK | TalTech School of IT Student Council",
        description: "ITÜK on TalTech IT-teaduskonna üliõpilaskogu - tudengite organisatsioon, mis korraldab üritusi ja esindab üliõpilaste huve.",
        description_en: "ITÜK is the TalTech School of IT Student Council - a student organization that organizes events and represents student interests.",
        image: "/banners/ituk_banner.jpg",
    },
    meist: {
        title: "Meist | ITÜK",
        title_en: "About | ITÜK",
        description: "Tutvu ITÜKi struktuuriga, juhatusega ja ajalooga. ITÜK on TalTech IT-teaduskonna üliõpilaskogu.",
        description_en: "Learn about ITÜK's structure, board, and history. ITÜK is the TalTech School of IT Student Council.",
        image: "/banners/meist_banner.jpg",
    },
    liitu: {
        title: "Liitu | ITÜK",
        title_en: "Join Us | ITÜK",
        description: "Liitu ITÜKiga ja saa osa põnevatest üritustest, koolitustest ja võrgustikust. Ootame kõiki TalTech IT-teaduskonna tudengeid!",
        description_en: "Join ITÜK and be part of exciting events, trainings, and networking. We welcome all TalTech School of IT students!",
        image: "/banners/ituk_banner.jpg",
    },
    partnerlus: {
        title: "Koostöö | ITÜK",
        title_en: "Cooperation | ITÜK",
        description: "ITÜKi partnerid ja koostöövõimalused. Tutvu meie partneritega ja võta ühendust koostööks.",
        description_en: "ITÜK partners and collaboration opportunities. Meet our partners and contact us for cooperation.",
        image: "/banners/partnerlus_banner.jpg",
    },
    rent: {
        title: "Rent | ITÜK",
        title_en: "Rental | ITÜK",
        description: "ITÜKi renditeenused - laenuta kaableid, juhtmeid ja muid tarvikuid ürituste korraldamiseks.",
        description_en: "ITÜK rental services - borrow cables, wires, and other supplies for organizing events.",
        image: "/banners/rent_banner.jpg",
    },
    uritused: {
        title: "Üritused | ITÜK",
        title_en: "Events | ITÜK",
        description: "ITÜKi üritused - haridus, meelelahutus ja siseüritused. Vaata, mida me korraldame!",
        description_en: "ITÜK events - education, entertainment, and internal events. See what we organize!",
        image: "/banners/uritused_banner.jpg",
    },
    infoohtud: {
        title: "Infoõhtud | ITÜK",
        title_en: "Info Evenings | ITÜK",
        description: "ITÜKi infoõhtud - tule tutvu ITÜKiga ja saa teada, mida me teeme.",
        description_en: "ITÜK info evenings - come meet ITÜK and find out what we do.",
        image: "/banners/meist_banner.jpg",
    },
    stiil: {
        title: "Stiiliraamat | ITÜK",
        title_en: "Style Guide | ITÜK",
        description: "ITÜKi stiiliraamat - logod, värvid ja brändijuhised.",
        description_en: "ITÜK style guide - logos, colors, and brand guidelines.",
        image: "/banners/meist_banner.jpg",
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
