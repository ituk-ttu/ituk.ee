import type { Metadata } from "next";
import { Raleway, Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getDictionary } from "@/dictionaries/dictionaries";

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

export const metadata: Metadata = {
  title: "ITÜK | IT-teaduskonna üliõpilaskogu",
  description: "ITÜK",
};

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: "est" | "en" }>;
}) {
  const { locale } = await props.params;

  const dictionary = await getDictionary(locale);
  return (
    <html
      lang="en"
      className={`${raleway.variable} ${noto_sans_georgian.variable}`}
    >
      <body className="main-min">
        <Navbar dictionary={dictionary.navbar}/>
        {props.children}
        <Footer />
      </body>
    </html>
  );
}
