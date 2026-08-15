import { model, models, Schema } from "mongoose";

const TestimonialSchema = new Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 80 },
        designation: { type: String, required: true, trim: true, maxlength: 100 },
        photo: { type: String, trim: true, default: "" },
        rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
        message: { type: String, required: true, trim: true, maxlength: 600 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const Testimonial = models.Testimonial || model("Testimonial", TestimonialSchema);
