import { model, models, Schema } from "mongoose";

const VisitBookingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, property: {
        type: Schema.Types.ObjectId,
        ref: "Property",
        required: true
    }, visitingdate: {
        type: Date,
        required: true
    }, status: {
        type: String,
        enum: ["pending", "approved", "completed","rejected"],
        default: "pending"
    },notes:{
        type:String
    }
},{timestamps: true});

export const VisitBooking = models.VisitBooking || model("VisitBooking", VisitBookingSchema);