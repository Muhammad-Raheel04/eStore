import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    isGuest: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    guestInfo: {
        fullName: String,
        phone: String,
        email: String
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    shippingAddress: {
        fullName: String,
        phone: String,
        email: String,
        address: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    amount: { type: Number, required: true },
    tax: { type: Number, required: true },
    shipping: { type: Number, required: true },
    currency: { type: String, default: "PKR" },

    paymentMethod: {
        type: String,
        default: "Cash On Delivery"
    },

    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid"],
        default: "Pending"
    },

    orderStatus: {
        type: String,
        enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Processing"
    }

}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
