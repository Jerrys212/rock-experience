import type { Metadata } from "next";
import { Jost, Kaushan_Script } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { site } from "@/lib/site";

import "./globals.css";

const jost = Jost({
    variable: "--font-jost",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const kaushanScript = Kaushan_Script({
    variable: "--font-kaushan-script",
    subsets: ["latin"],
    weight: "400",
});

export const metadata: Metadata = {
    title: site.name,
    description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang={site.locale} className={`${jost.variable} ${kaushanScript.variable} h-full antialiased`}>
            <body className="flex min-h-full flex-col bg-black font-sans text-white">
                <Navbar />
                <main className="flex-1">{children}</main>
            </body>
        </html>
    );
}
