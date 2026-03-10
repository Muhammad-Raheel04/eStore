import mongoose from "mongoose";

const productTypeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    categories: {
        type: [String],
        default: []
    }
}, { timestamps: true });

export const ProductType = mongoose.model("ProductType", productTypeSchema);
