import { cache } from "react";
import connectDB from "@/lib/database";
import { SiteSettings } from "@/models";

export interface PublicSiteSettings {
    phone?: string;
    email?: string;
    supportEmail?: string;
    officeAddress?: string;
    mapEmbedUrl?: string;
    officeHours?: string;
    whatsappNumber?: string;
    facebook?: string;
    youtube?: string;
    instagram?: string;
}

// Cached per-request so the Footer (rendered on every page) and any page-level
// consumer share one DB call instead of each triggering their own.
export const getSiteSettings = cache(async (): Promise<PublicSiteSettings> => {
    await connectDB();
    const settings = await SiteSettings.findOne().lean();
    if (!settings) return {};

    return JSON.parse(JSON.stringify(settings));
});
