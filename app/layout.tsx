import type { Metadata } from "next";
import { Jost, Kaushan_Script } from "next/font/google";
import { Footer } from "@/components/layout/footer";
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
    metadataBase: new URL(site.url),
    title: { default: `${site.name} | ${site.tagline}`, template: `%s | ${site.name}` },
    description: site.description,
    openGraph: {
        type: "website",
        siteName: site.name,
        title: `${site.name} | ${site.tagline}`,
        description: site.description,
        url: "/",
        locale: site.ogLocale,
    },
    twitter: {
        card: "summary_large_image",
        title: `${site.name} | ${site.tagline}`,
        description: site.description,
    },
};

export default function RootLayout({ children, modal }: LayoutProps<"/">) {
    return (
        <html
            lang={site.locale}
            data-scroll-behavior="smooth"
            className={`${jost.variable} ${kaushanScript.variable} h-full antialiased`}
        >
            <body className="flex min-h-full flex-col bg-black font-sans text-white">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                {modal}
            </body>
        </html>
    );
}
