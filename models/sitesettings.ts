import { model, models, Schema } from "mongoose";

const SiteSettingsSchema = new Schema(
    {
        phone: { type: String, trim: true },
        email: { type: String, trim: true },
        supportEmail: { type: String, trim: true, required: [true, "Support email is required."] },
        officeAddress: { type: String, trim: true },
        mapEmbedUrl: { type: String, trim: true },
        officeHours: { type: String, trim: true },
        whatsappNumber: { type: String, trim: true },
        facebook: { type: String, trim: true },
        youtube: { type: String, trim: true },
        instagram: { type: String, trim: true },
    },
    { timestamps: true }
);

export const SiteSettings = models.SiteSettings || model("SiteSettings", SiteSettingsSchema);
