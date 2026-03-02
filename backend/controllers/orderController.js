import { sendOrderEmail } from "../emailVerify/sendOrderEmail.js";
import { Cart } from "../models/CartModel.js";
import { Order } from '../models/orderModel.js';
import { User } from "../models/userModel.js";

export const createCODOrder = async (req, res) => {
    try {
        const { shippingAddress } = req.body || {};
        const isRegistered = Boolean(req.userId);
        const cart = await Cart.findOne(req.cartQuery || {}).populate("items.productId");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Basic guest validation
        if (!isRegistered) {
            const required = ["fullName", "phone", "email", "address", "city", "state", "zip", "country"];
            const missing = required.filter(k => !shippingAddress?.[k]);
            if (missing.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Missing required fields: ${missing.join(", ")}`
                });
            }
        }

        const subtotal = cart.totalPrice;
        const shipping = subtotal > 299 ? 0 : 10;
        const tax = subtotal * 0.05;
        const total = subtotal + shipping + tax;

        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

        const baseOrder = {
            orderId,
            products: cart.items.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity
            })),
            shippingAddress,
            amount: total,
            tax,
            shipping
        };

        let emailToSend;
        let createdOrder;
        if (isRegistered) {
            const user = await User.findById(req.userId).select("email");
            createdOrder = await Order.create({
                ...baseOrder,
                isGuest: false,
                user: req.userId
            });
            emailToSend = user?.email || shippingAddress?.email;
        } else {
            createdOrder = await Order.create({
                ...baseOrder,
                isGuest: true,
                user: undefined,
                guestInfo: {
                    fullName: shippingAddress.fullName,
                    phone: shippingAddress.phone,
                    email: shippingAddress.email
                }
            });
            emailToSend = shippingAddress.email;
        }

        // clear cart
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        // Send Emails
        const populatedOrder = await Order.findById(createdOrder._id)
            .populate("products.productId", "productName productPrice");
        await sendOrderEmail(populatedOrder, emailToSend);

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: createdOrder
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "firstName lastName email")
            .populate("products.productId", "productName productPrice");

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || typeof status !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const normalized = status.toLowerCase();
        switch (normalized) {
            case "pending":
                order.paymentStatus = "Pending";
                order.orderStatus = "Processing";
                break;
            case "paid":
                order.paymentStatus = "Paid";
                order.orderStatus = "Processing";
                break;
            case "delivered":
                order.paymentStatus = "Paid";
                order.orderStatus = "Delivered";
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: "Invalid order status"
                });
        }
        await order.save();

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
