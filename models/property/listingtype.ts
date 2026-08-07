import { model, models, Schema } from "mongoose";

const ListingTypeSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Listing type name is required"],
            trim: true,
            maxlength: [60, "Listing type name cannot exceed 60 characters"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const ListingType = models.ListingType || model("ListingType", ListingTypeSchema);
