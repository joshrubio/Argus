import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Argus — Simulated C2 Operations Dashboard",
  description:
    "Argus fuses simulated drone, sensor, and event feeds on a live map with a rules-based recommendation panel. A portfolio demo — every feed is synthetic.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${robotoMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Suspense>
            <Header />
          </Suspense>
          <div className="flex-1 min-h-0 flex flex-col">{children}</div>
          <Suspense>
            <Footer />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
