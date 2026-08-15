import { model, models, Schema } from "mongoose";

const TeamMemberSchema = new Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 80 },
        designation: { type: String, required: true, trim: true, maxlength: 80 },
        photo: { type: String, required: true, trim: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const TeamMember = models.TeamMember || model("TeamMember", TeamMemberSchema);
