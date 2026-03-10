import mongoose from "mongoose";
import { ProductType } from "./productTypeModel.js";

const productSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    productName: { type: String, required: true },
    productDesc: { type: String, required: true },
    productImg: [
        {
            url: { type: String, required: true },
            public_id: { type: String, required: true }
        }
    ],
    productPrice: { type: Number },
    category: { 
        type: String,
        required: true,
        validate: [
            {
                validator: async function (val) {
                    if (!this.type) return true;
                    const rec = await ProductType.findOne({ type: this.type });
                    if (!rec) return true; // allow if registry missing to keep backward compatibility
                    return rec.categories.includes(val);
                },
                message: props => `Invalid category '${props.value}' for selected type`
            }
        ]
    },
    type: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        default: "unisex"
    }
}, {
    timestamps: true
});

export const Product = mongoose.model("Product", productSchema);
