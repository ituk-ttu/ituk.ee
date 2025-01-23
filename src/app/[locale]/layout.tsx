import { Raleway, Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getDictionary } from "@/dictionaries/dictionaries";
import { Locale } from "../../../i18nConfig";
import DictionaryProvider from "@/components/dictionary-provider";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

const noto_sans_georgian = Noto_Sans_Georgian({
  subsets: ["latin"],
  variable: "--font-noto-sans-georgian",
  display: "swap",
});

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params;

  const dictionary = await getDictionary(locale);
  return (
    <html
      lang="et"
      className={`${raleway.variable} ${noto_sans_georgian.variable}`}
    >
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>ITÜK | TalTechi IT-teaduskonna üliõpilaskogu</title>
        <meta name="description" content="ITÜK" />
        <meta name="keywords" content="ITÜK, IT, TalTech, tudeng, üliõpilaskogu" />
        <meta name="author" content="ITÜK" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#870042" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ITÜK | TalTechi IT-teaduskonna üliõpilaskogu" />
        <meta name="twitter:description" content="ITÜK" />
        <meta name="twitter:image" content="/banners/ituk_banner.jpg" />
        <meta name="twitter:image:width" content="1200" />
        <meta name="twitter:image:height" content="630" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="ITÜK | TalTechi IT-teaduskonna üliõpilaskogu" />
        <meta property="og:description" content="ITÜK" />
        <meta property="og:image" content="/banners/ituk_banner.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://ituk.ee/" />

        <link rel="icon" type="image/png" href="/favicons/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicons/favicon.svg" />
        <link rel="shortcut icon" href="/favicons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="ITÜK" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
      </head>
      <body className="main-min">
        <Navbar dictionary={dictionary.navbar} />
          <DictionaryProvider dictionary={dictionary}>
            {props.children}
          </DictionaryProvider>
        <Footer dictionary={dictionary.footer} />
      </body>
    </html>
  );
}
