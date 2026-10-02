import { Benefits } from "@/sections/benefits/benefits";
import { Experiences } from "@/sections/experiences/experiences";
import { Hero } from "@/sections/hero/hero";

export default function Home({ searchParams }: PageProps<"/">) {
    return (
        <>
            <Hero />
            <Experiences searchParams={searchParams} />
            <Benefits />
        </>
    );
}
