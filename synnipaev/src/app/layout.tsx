import { Raleway, Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Metadata from "@/components/metadata";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="et"
      className={`${raleway.variable} ${noto_sans_georgian.variable}`}
    >
      <head>
        <Metadata />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
