import connectDB from "@/lib/database";
import { TeamMember } from "@/models";

export interface PublicTeamMember {
    _id: string;
    name: string;
    designation: string;
    photo: string;
}

export async function getTeamMembers(): Promise<PublicTeamMember[]> {
    await connectDB();
    const teamMembers = await TeamMember.find({ isActive: true })
        .select("name designation photo")
        .sort({ createdAt: 1 })
        .lean();

    return JSON.parse(JSON.stringify(teamMembers));
}
