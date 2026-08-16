import connectDB from "@/lib/database";
import { Testimonial } from "@/models";

export interface PublicTestimonial {
    _id: string;
    name: string;
    designation: string;
    photo: string;
    rating: number;
    message: string;
}

export async function getTestimonials(limit = 9): Promise<PublicTestimonial[]> {
    await connectDB();
    const testimonials = await Testimonial.find({ isActive: true })
        .select("name designation photo rating message")
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

    return JSON.parse(JSON.stringify(testimonials));
}
