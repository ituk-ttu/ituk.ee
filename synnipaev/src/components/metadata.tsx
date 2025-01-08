interface MetadataProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
}

const Metadata: React.FC<MetadataProps> = ({
    title = "ITÜK | TalTechi IT-teaduskonna üliõpilaskogu",
    description = "ITÜK",
    image = "/banners/ituk_banner.jpg",
    url = "https://ituk.ee/",
}) => {
    return (
        <head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content="ITÜK, IT, TalTech, tudeng, üliõpilaskogu" />
            <meta name="author" content="ITÜK Team" />
            <meta name="robots" content="index, follow" />
            <meta name="theme-color" content="#870042" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:image:width" content="1200" />
            <meta name="twitter:image:height" content="630" />

            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:url" content={url} />

            <link rel="icon" type="image/png" href="/favicons/favicon-96x96.png" sizes="96x96" />
            <link rel="icon" type="image/svg+xml" href="/favicons/favicon.svg" />
            <link rel="shortcut icon" href="/favicons/favicon.ico" />
            <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
            <meta name="apple-mobile-web-app-title" content="ITÜK" />
            <link rel="manifest" href="/favicons/site.webmanifest" />
        </head>
    );
};

export default Metadata;