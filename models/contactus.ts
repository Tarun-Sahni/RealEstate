import { model, models, Schema } from "mongoose";

const ContactUsSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    }, lastname: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    }, email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    }, phone: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    }, message: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    }
}, { timestamps: true })

export const ContactUs = models.ContactUs || model("ContactUs", ContactUsSchema)