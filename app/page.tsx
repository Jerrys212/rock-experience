import { Benefits } from "@/sections/benefits/benefits";
import { Contact } from "@/sections/contact/contact";
import { Experiences } from "@/sections/experiences/experiences";
import { Hero } from "@/sections/hero/hero";

export default function Home({ searchParams }: PageProps<"/">) {
    return (
        <>
            <Hero />
            <Experiences searchParams={searchParams} />
            <Benefits />
            <Contact />
        </>
    );
}
