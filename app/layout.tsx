import type { Metadata } from "next";
import { Sora, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

// Sora is fathom.ai's real brand typeface — verified from their site's
// computed styles (body, h1-h5 all resolve to "Sora, Arial, sans-serif").
const sora = Sora({ variable: "--font-sora", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fathom — AI Meeting Notetaker",
  description:
    "A rebuild of Fathom: records, transcribes and summarizes your meetings with switchable templates, action items, highlights, search and shareable clips.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sora.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full" suppressHydrationWarning>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
