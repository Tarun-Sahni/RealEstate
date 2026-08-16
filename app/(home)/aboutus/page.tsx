import DesignOne from "@/components/user/common/design1";
import { Award, CircleCheckBig, Handshake, Star, Users } from "lucide-react";
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { getTeamMembers } from "@/lib/queries/team";

export const metadata = {
    title: "About Us",
    description: "Learn about Gurgaon Elite Estate - a trusted real estate agency helping buyers, sellers and investors find apartments, villas, plots and commercial properties across Gurgaon.",
}

// Always render fresh from the database — admin-managed content (team members)
// should never be served from a stale build-time cache.
export const dynamic = "force-dynamic"

const About = async () => {
    const teamMembers = await getTeamMembers();

    return (
        <div className="min-h-screen mt-9 md:my-18 container mx-auto py-16 px-4 space-y-16 md:space-y-32">
            {/* Our Journey */}
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 justify-between items-center gap-8 lg:gap-4">
                <div className="flex flex-col lg:order-1 order-2 items-center lg:items-start">
                    <DesignOne />
                    <div className="flex flex-col gap-3 items-center lg:items-start">
                        <h1 className="text-4xl md:text-7xl font-playfair text-center lg:text-start">Our Journey</h1>
                        <p className="tracking-wider font-inter max-w-xl text-muted-foreground text-center lg:text-start text-sm md:text-base">Our story is one of continuous growth and evolution. We started as a small team with big dreams, determined to create a real estate platform that transcended the ordinary. Over the years, we've expanded our reach, forged valuable partnerships, and gained the trust of countless clients.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-12">
                        <div className="flex flex-col justify-between items-center md:items-start gap-2 bg-white dark:bg-muted p-4 rounded-lg shadow">
                            <h2 className="font-playfair text-3xl md:text-4xl">200+</h2>
                            <p className="md:text-sm tracking-wider text-xs text-wrap text-center md:text-start">Happy Customers</p>
                        </div>
                        <div className="flex flex-col justify-between items-center md:items-start gap-2 bg-white dark:bg-muted p-4 rounded-lg shadow">
                            <h2 className="font-playfair text-3xl md:text-4xl">10k+</h2>
                            <p className="md:text-sm tracking-wider text-xs text-wrap text-center md:text-start">Properties for Clients</p>
                        </div>
                        <div className="flex flex-col justify-between items-center md:items-start gap-2 bg-white dark:bg-muted p-4 rounded-lg shadow">
                            <h2 className="font-playfair text-3xl md:text-4xl">10+</h2>
                            <p className="md:text-sm tracking-wider text-xs text-wrap text-center md:text-start">Years of Experience</p>
                        </div>
                    </div>
                </div>
                <div className='flex justify-center lg:justify-end items-center lg:order-2 order-1'>
                    <Image
                        src="/aboutus.png"
                        alt='aboutus'
                        width={600}
                        height={600}
                        className="bg-[radial-gradient(#71717a_1px,transparent_1px)] bg-size-[16px_16px]"
                    />
                </div>
            </div>
            {/* Our Values */}
            <div className="container mx-auto flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start gap-4 p-4">
                    <DesignOne />
                    <h1 className="text-4xl md:text-7xl font-playfair text-center lg:text-start">Our Values</h1>
                    <p className="tracking-wider font-inter max-w-xl text-muted-foreground text-center lg:text-start text-sm md:text-base">These principles guide every property we list and every client relationship we build, from your first enquiry to the day you get the keys.</p>
                </div>
                <div className="w-full border-8 rounded-lg grid grid-cols-1 md:grid-cols-2 p-2 md:p-8 border-neutral-200/50 dark:border-neutral-800">
                    <div className="flex flex-col gap-4 border-b p-6 lg:p-10">
                        <div className="flex flex-row gap-4 items-center justify-center lg:justify-start">
                            <div className="rounded-full border border-yellow-500/50 bg-yellow-500/10 w-12 h-12 flex justify-center items-center">
                                <Handshake size={24} color="#eab308" />
                            </div>
                            <h2 className="text-3xl font-bold font-playfair">Trust</h2>
                        </div>
                        <p className="tracking-wider font-inter max-w-xl text-muted-foreground text-center lg:text-start text-sm md:text-base">Verified listings, honest pricing and clear communication at every stage - so you always know exactly what you're buying, selling or renting.</p>
                    </div>
                    <div className="flex flex-col gap-4 border-b p-6 lg:p-10 md:border-l">
                        <div className="flex flex-row gap-4 items-center justify-center lg:justify-start">
                            <div className="rounded-full border border-yellow-500/50 bg-yellow-500/10 w-12 h-12 flex justify-center items-center">
                                <Award size={24} color="#eab308" />
                            </div>
                            <h2 className="text-3xl font-bold font-playfair">Excellence</h2>
                        </div>
                        <p className="tracking-wider font-inter max-w-xl text-muted-foreground text-center lg:text-start text-sm md:text-base">Deep local market knowledge and meticulous attention to detail, from property shortlisting and site visits through to paperwork and handover.</p>
                    </div>
                    <div className="flex flex-col gap-4 p-6 lg:p-10 border-b md:border-b-0">
                        <div className="flex flex-row gap-4 items-center justify-center lg:justify-start">
                            <div className="rounded-full border border-yellow-500/50 bg-yellow-500/10 w-12 h-12 flex justify-center items-center">
                                <Users size={24} color="#eab308" />
                            </div>
                            <h2 className="text-3xl font-bold font-playfair">Client-Specific</h2>
                        </div>
                        <p className="tracking-wider font-inter max-w-xl text-muted-foreground text-center lg:text-start text-sm md:text-base">No two buyers are alike. We take the time to understand your budget, lifestyle and goals before recommending a single property.</p>
                    </div>
                    <div className="flex flex-col gap-4 p-6 lg:p-10 md:border-l">
                        <div className="flex flex-row gap-4 items-center justify-center lg:justify-start">
                            <div className="rounded-full border border-yellow-500/50 bg-yellow-500/10 w-12 h-12 flex justify-center items-center">
                                <CircleCheckBig size={24} color="#eab308" />
                            </div>
                            <h2 className="text-3xl font-bold font-playfair">Our Commitment</h2>
                        </div>
                        <p className="tracking-wider font-inter max-w-xl text-muted-foreground text-center lg:text-start text-sm md:text-base">Our support doesn't end at the sale - we're on hand for documentation, financing questions and after-sales support whenever you need us.</p>
                    </div>
                </div>
            </div>
            {/* Our Achievements */}
            <div className="mx-auto space-y-12 max-w-7xl">
                <div className="flex flex-col gap-3 items-center">
                    <DesignOne />
                    <h1 className="text-4xl md:text-7xl font-playfair text-center lg:text-start">Our Achievements</h1>
                    <p className="tracking-wider font-inter max-w-3xl text-muted-foreground text-center text-sm md:text-base">A track record built one successful deal at a time, across Gurgaon's most sought-after neighborhoods.</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col items-center md:items-start gap-4 p-4 md:p-8 bg-linear-to-b from-neutral-500/10 to-transparent rounded-md">
                        <h2 className="font-playfair text-3xl">3+ Years of Excellence</h2>
                        <p className="tracking-wider text-muted-foreground text-sm md:text-base text-center md:text-left">Since our founding, we've helped hundreds of families and investors find the right apartment, villa, plot or commercial space across Gurgaon.</p>
                    </div>
                    <div className="flex flex-col items-center md:items-start gap-4 p-4 md:p-8 bg-linear-to-b from-neutral-500/10 to-transparent rounded-md">
                        <h2 className="font-playfair text-3xl">Happy Clients</h2>
                        <p className="tracking-wider text-muted-foreground text-sm md:text-base text-center md:text-left">A client-first approach has earned the trust of 200+ buyers, sellers and tenants who return to us for every real estate decision.</p>
                    </div>
                    <div className="flex flex-col items-center md:items-start gap-4 p-4 md:p-8 bg-linear-to-b from-neutral-500/10 to-transparent rounded-md">
                        <h2 className="font-playfair text-3xl">Industry Recognition</h2>
                        <p className="tracking-wider text-muted-foreground text-sm md:text-base text-center md:text-left">Recognized among Gurgaon's emerging real estate consultancies for transparent dealings and deep local market expertise.</p>
                    </div>
                </div>
            </div>
            {/* Our Team */}
            {teamMembers.length > 0 && (
                <div className="container mx-auto space-y-12">
                    <div className="flex flex-col items-center">
                        <DesignOne />
                        <h1 className="text-4xl md:text-7xl font-playfair text-center lg:text-start">Meet Our Team</h1>
                        <p className="tracking-wider font-inter max-w-3xl text-muted-foreground text-center text-sm md:text-base">The consultants and negotiators behind every successful deal, dedicated to finding you the right property in Gurgaon.</p>
                    </div>
                    <Carousel className="w-full">
                        <CarouselContent>
                            {teamMembers.map((member) => (
                                <CarouselItem key={member._id} className="basis-1/2 lg:basis-1/4">
                                    <div className="w-full border p-4 rounded-md space-y-4">
                                        <Image
                                            src={member.photo}
                                            alt={member.name}
                                            width={500}
                                            height={500}
                                            className="aspect-square w-full rounded-md object-cover"
                                        />
                                        <div className="px-2 text-center">
                                            <p className="font-playfair text-lg capitalize">{member.name}</p>
                                            <p className="text-xs tracking-wider text-yellow-500 uppercase font-semibold">{member.designation}</p>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            )}
        </div>
    );
};

export default About;
