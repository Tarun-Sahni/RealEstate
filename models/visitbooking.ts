import { model, models, Schema, Types } from "mongoose";

const VisitBookingSchema = new Schema(
    {
        property: { type: Types.ObjectId, ref: "Property", required: true },
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        phone: { type: String, required: true, trim: true },
        message: { type: String, trim: true },
        status: { type: String, enum: ["PENDING", "COMPLETED"], default: "PENDING" },
    },
    { timestamps: true }
);

export const VisitBooking = models.VisitBooking || model("VisitBooking", VisitBookingSchema);
