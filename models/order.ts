import { model, models, Schema, Types } from "mongoose";

const OrderSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    }, property: {
        type: Types.ObjectId,
        ref: "Property",
        required: true
    }, orderdate: {
        type: Date,
        required: true
    }, pyamentstatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },orderstatus:{
        type: String,
        enum: ["initiated", "processing", "completed","cancelled"],
        default: "pending"
    },transactionid: {
        type: String
    }
},{timestamps: true});

export const Order = models.Order || model("Order", OrderSchema);