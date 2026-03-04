import mongoose from "mongoose";

export const categoriesByType = {
    men: ["shirts", "pants", "shoes", "watches"],
    women: ["dresses", "heels", "bags", "jewelry"],
    kids: ["toys", "school-wear", "kids-shoes"],
    unisex: ["hoodies", "caps"]
};

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
        validate: {
            validator: function (val) {
                if (!this.type) return true;
                const allowed = categoriesByType[this.type] || [];
                return allowed.includes(val);
            },
            message: props => `Invalid category '${props.value}' for type`
        }
    },
    type: {
        type: String,
        enum: ["men", "women", "kids", "unisex"],
        required: true,
        default: "unisex"
    }
}, {
    timestamps: true
});

export const Product = mongoose.model("Product", productSchema);
