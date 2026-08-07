import { model, models, Schema } from "mongoose";

const CategorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            trim: true,
            maxlength: [60, "Category name cannot exceed 60 characters"],
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                "Slug must be URL-friendly (lowercase letters, numbers, hyphens only)",
            ],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"],
        },
        metaTitle: {
            type: String,
            trim: true,
            maxlength: [70, "Meta title should stay under 70 characters for SEO"],
        },
        metaDescription: {
            type: String,
            trim: true,
            maxlength: [160, "Meta description should stay under 160 characters for SEO"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);


export const Category = models.Category || model("Category", CategorySchema);
