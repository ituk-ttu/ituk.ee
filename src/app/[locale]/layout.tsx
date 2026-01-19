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
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await props.params;
  const locale = localeParam as Locale;

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
        <meta name="description" content="Tere tulemast ITÜKi kodulehele! Siit leiad kogu vajaliku info IT-teaduskonna üliõpilaskogu tegemistest, sündmustest ja õppimist toetavatest võimalustest. Oleme siin, et kuulata, esindada ja muuta tudengite elu stressivabamaks ning põnevamaks!" />
        <meta name="keywords" content="ITÜK, IT, TalTech, tudeng, üliõpilaskogu" />
        <meta name="author" content="ITÜK" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#870042" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ITÜK | TalTechi IT-teaduskonna üliõpilaskogu" />
        <meta name="twitter:description" content="Tere tulemast ITÜKi kodulehele! Siit leiad kogu vajaliku info IT-teaduskonna üliõpilaskogu tegemistest, sündmustest ja õppimist toetavatest võimalustest. Oleme siin, et kuulata, esindada ja muuta tudengite elu stressivabamaks ning põnevamaks!" />
        <meta name="twitter:image" content="/banners/ituk_banner.jpg" />
        <meta name="twitter:image:width" content="1200" />
        <meta name="twitter:image:height" content="630" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="ITÜK | TalTechi IT-teaduskonna üliõpilaskogu" />
        <meta property="og:description" content="Tere tulemast ITÜKi kodulehele! Siit leiad kogu vajaliku info IT-teaduskonna üliõpilaskogu tegemistest, sündmustest ja õppimist toetavatest võimalustest. Oleme siin, et kuulata, esindada ja muuta tudengite elu stressivabamaks ning põnevamaks!" />
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
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar dictionary={dictionary.navbar} />
        <main className="flex-grow">
          <DictionaryProvider dictionary={dictionary}>
            {props.children}
          </DictionaryProvider>
        </main>
        <Footer dictionary={dictionary.footer} />
      </body>
    </html>
  );
}