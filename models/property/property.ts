import { model, models, Schema, Types } from "mongoose";

const PropertySchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Property title is required"],
            trim: true,
            maxlength: [150, "Title cannot exceed 150 characters"],
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
        category: {
            type: Types.ObjectId,
            ref: "Category",
            required: [true, "Category is required"],
        },
        subcategory: {
            type: Types.ObjectId,
            ref: "SubCategory",
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        shortDescription: {
            type: String,
            trim: true,
            maxlength: [300, "Short description cannot exceed 300 characters"],
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

        // Classification
        listingType: {
            type: Types.ObjectId,
            ref: "ListingType",
            required: [true, "Listing type is required"],
        },
        propertyType: {
            type: Types.ObjectId,
            ref: "PropertyType",
            required: [true, "Property type is required"],
        },
        status: {
            type: String,
            enum: ["New Launch", "Under Construction", "Ready to Move", "Resale"],
            default: "Ready to Move",
        },

        // Pricing
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },
        pricePerUnitArea: {
            type: Number,
            min: 0,
        },
        priceLabel: {
            type: String,
            trim: true,
        },

        // Unit details, for a single-configuration listing (e.g. a resale flat)
        bedrooms: { type: Number, min: 0 },
        bathrooms: { type: Number, min: 0 },
        balconies: { type: Number, min: 0 },
        area: {
            value: { type: Number, min: 0 },
            unit: { type: String, enum: ["sqft", "sqm", "acre"], default: "sqft" },
        },

        // Multiple unit configurations, for project-style listings (e.g. "2.5 BHK & 3.5 BHK")
        configurations: [
            {
                type: { type: String, trim: true },
                superArea: { type: Number, min: 0 },
                carpetArea: { type: Number, min: 0 },
                price: { type: Number, min: 0 },
            },
        ],

        // Location
        address: {
            line1: { type: String, trim: true },
            landmark: { type: String, trim: true },
            city: { type: String, trim: true, required: [true, "City is required"] },
            state: { type: String, trim: true, required: [true, "State is required"] },
            country: { type: String, trim: true, default: "India" },
            pincode: { type: String, trim: true },
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
            },
        },

        // Project details
        developer: { type: String, trim: true },
        reraNumber: { type: String, trim: true },
        projectArea: { type: String, trim: true },
        totalUnits: { type: Number, min: 0 },
        totalTowers: { type: Number, min: 0 },
        possessionDate: { type: Date },

        // Media
        coverImage: { type: String, trim: true },
        images: [{ type: String, trim: true }],
        floorPlanImages: [{ type: String, trim: true }],
        videoUrl: { type: String, trim: true },
        brochureUrl: { type: String, trim: true },

        // Marketing content
        amenities: [{ type: String, trim: true }],
        highlights: [{ type: String, trim: true }],
        faqs: [
            {
                question: { type: String, trim: true },
                answer: { type: String, trim: true },
            },
        ],

        // Contact
        contactName: { type: String, trim: true },
        contactPhone: { type: String, trim: true },

        // Flags
        isFeatured: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        views: { type: Number, default: 0, min: 0 },
    },
    { timestamps: true }
);

// Matches the search shape documented in CLAUDE.md: geo search on `location`,
// full-text search across title/description/city/state.
PropertySchema.index({ location: "2dsphere" });
PropertySchema.index({
    title: "text",
    description: "text",
    "address.city": "text",
    "address.state": "text",
});

export const Property = models.Property || model("Property", PropertySchema);
