import { model, models, Schema } from "mongoose";

const InquirySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, property: {
        type: Schema.Types.ObjectId,
        ref: "Property",
        required: true
    }, message: {
        type: String,
        required: true,
        trim: true
    }, status: {
        type: String,
        enum: ["pending", "contacted", "closed"],
        default: "pending"
    }
}, { timestamps: true });

export const Inquiry = models.Inquiry || model("Inquiry", InquirySchema);