import Head from "next/head";

type MetadataProps = {
    title?: string;
    description?: string;
    ogImage?: string;
    url?: string;
};

const Metadata = ({
    title = "ITÜK | IT-teaduskonna üliõpilaskogu",
    description = "ITÜK description here",
    ogImage = "/ituk_banner.png",
    url = "https://ituk.ee/",
}: MetadataProps) => {
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="author" content="ITÜK" />
            <meta name="robots" content="index, follow" />
            <meta name="theme-color" content="#870042" />

            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content="/ituk_banner.png" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:url" content="https://ituk.ee/" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="ITÜK" />
            <meta name="twitter:description" content="ITÜK description here" />
            <meta name="twitter:image" content="/ituk_banner.png" />
            <meta name="twitter:image:width" content="1200" />
            <meta name="twitter:image:height" content="630" />

            <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            <link rel="shortcut icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <meta name="apple-mobile-web-app-title" content="ITÜK" />
            <link rel="manifest" href="/site.webmanifest" />
        </Head>
    );
};

export default Metadata;
