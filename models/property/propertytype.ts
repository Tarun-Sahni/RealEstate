import { model, models, Schema } from "mongoose";

const PropertyTypeSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Property type name is required"],
            trim: true,
            maxlength: [60, "Property type name cannot exceed 60 characters"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const PropertyType = models.PropertyType || model("PropertyType", PropertyTypeSchema);
