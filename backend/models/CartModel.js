import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    sessionId: {
        type: String,
        required: false,
        trim: true,
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalPrice: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

// Ensure there is at most one cart per user or per guest session
cartSchema.index(
    { userId: 1 },
    {
        unique: true,
        partialFilterExpression: { userId: { $exists: true, $type: "objectId" } },
    }
);
cartSchema.index(
    { sessionId: 1 },
    {
        unique: true,
        partialFilterExpression: { sessionId: { $exists: true, $type: "string" } },
    }
);

export const Cart = mongoose.model("Cart", cartSchema);
