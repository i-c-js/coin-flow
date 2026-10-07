import type { Metadata } from "next";
import { Unbounded, Onest } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import Header from "@/components/Header";

// Both fonts include Cyrillic + Latin Extended so Romanian (ă, î, ș, ț) and Russian display correctly.
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["600", "700", "800"],
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

export const metadata: Metadata = {
  title: "CoinFlow",
  description: "Personal finance for teens in Moldova",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ro" className={`${unbounded.variable} ${onest.variable} h-full antialiased`}>
      <body className="min-h-full">
        <LanguageProvider>
          <Header />
          <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 sm:pb-12">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
