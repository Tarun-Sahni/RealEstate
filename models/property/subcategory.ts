import { model, models, Schema, Types } from "mongoose";

const SubCategorySchema = new Schema(
    {
        category: {
            type: Types.ObjectId,
            ref: "Category",
            required: [true, "Parent category is required"],
        },
        name: {
            type: String,
            required: [true, "Subcategory name is required"],
            trim: true,
            maxlength: [60, "Subcategory name cannot exceed 60 characters"],
        },
        slug: {
            type: String,
            required: true,
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

// Slug/name only need to be unique within their parent category, since URLs are
// nested (e.g. /residential/studio-apartments) rather than global.
SubCategorySchema.index({ category: 1, slug: 1 }, { unique: true });
SubCategorySchema.index(
    { category: 1, name: 1 },
    { unique: true, collation: { locale: "en", strength: 2 } }
);
SubCategorySchema.index({ category: 1, isActive: 1, order: 1 });
SubCategorySchema.index({ name: "text", description: "text" });

SubCategorySchema.pre("validate", function () {
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

export const SubCategory = models.SubCategory || model("SubCategory", SubCategorySchema);
