import { model, models, Schema } from "mongoose";

const PropertySchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    }, slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    }, description: {
        type: String,
        required: true,
        trim: true,
    }, propertyType: {
        type: String,
        enum: ["apartment", "villa", "house", "commercial"],
        required: true,
    }, purpose: {
        type: String,
        enum: ["sale", "rent"],
        required: true,
    }, price: {
        type: Number,
        required: true,
        min: 0,
    }, bedrooms: {
        type: Number,
        default: 0,
        min: 0,
    }, bathrooms: {
        type: Number,
        default: 0,
        min: 0,
    }, area: {
        type: Number,
        required: true,
        min: 0,
    }, areaUnit: {
        type: String,
        enum: ["sqft", "sqm", "acre"],
        default: "sqft",
    }, furnishing: {
        type: String,
        enum: ["furnished", "semi-furnished", "unfurnished"],
        default: "unfurnished",
    }, parking: {
        type: Number,
        default: 0,
    }, floors: {
        type: Number,
        default: 1,
    }, yearBuilt: {
        type: Number,
    }, address: {
        street: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        state: {
            type: String,
            required: true,
            trim: true,
        },
        country: {
            type: String,
            default: "India",
        },
        pincode: {
            type: String,
            trim: true,
        },
    }, location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        }, coordinates: {
            type: [Number], // [longitude, latitude]
            default: undefined,
        },
    }, images: [{ type: String }],
    amenities: [{
        type: String,
        trim: true,
    }], featured: {
        type: Boolean,
        default: false,
    }, status: {
        type: String,
        enum: ["available", "reserved", "sold"],
        default: "available",
    }
},
    { timestamps: true }
);

// For location-based searches
PropertySchema.index({ location: "2dsphere" });

// Faster searches
PropertySchema.index({
    title: "text",
    description: "text",
    "address.city": "text",
    "address.state": "text",
});

export const Property = models.Property || model("Property", PropertySchema);