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
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Case-insensitive uniqueness on name (e.g. "Villas" and "villas" collide) while
// still allowing the display case to be preserved, unlike a forced-lowercase field.
CategorySchema.index({ name: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });
CategorySchema.index({ isActive: 1, order: 1 });
CategorySchema.index({ name: "text", description: "text" });

CategorySchema.pre("validate", function () {
    if (this.name && (!this.slug || this.isModified("name"))) {
        this.slug = this.name
            .toString()
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }
    if (!this.metaTitle && this.name) {
        this.metaTitle = this.name;
    }
    if (!this.metaDescription && this.description) {
        this.metaDescription = this.description.slice(0, 160);
    }
});

export const Category = models.Category || model("Category", CategorySchema);
