import { model, models, Schema, Types } from "mongoose";

const FavoriteSchema = new Schema({
    user:{
        type:Types.ObjectId,
        ref:"User",
        required:true
    },
    property:{
        type:Types.ObjectId,
        ref:"Property",
        required:true
    }
},{timestamps: true});
export const Favorite = models.Favorite || model("Favorite", FavoriteSchema);