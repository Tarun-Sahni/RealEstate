import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        lowercase: true,
        unique: true,
        minlength: [3, "Username must be at least 3 characters"],
        maxlength: [30, "Username cannot exceed 30 characters"],
    }, email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    }, password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"],
        select: false,
    }, avatar: {
        type: String,
        default: "",
    }, role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    }, isVerified: {
        type: Boolean,
        default: false,
    }, verificationToken: {
        type: String,
        default: null,
        select: false,
    }, verificationTokenExpires: {
        type: Date,
        default: null,
        select: false,
    }, passwordResetToken: {
        type: String,
        default: null,
        select: false,
    }, passwordResetExpires: {
        type: Date,
        default: null,
        select: false,
    }
}, { timestamps: true }
);

export const User = models.User || model("User", UserSchema);