import { sendOrderEmail } from "../emailVerify/sendOrderEmail.js";
import { Cart } from "../models/CartModel.js";
import { Order } from '../models/orderModel.js';
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";

export const createCODOrder = async (req, res) => {
    try {
        const { shippingAddress } = req.body || {};
        const isRegistered = Boolean(req.userId);
        const cart = await Cart.findOne(req.cartQuery || {}).populate("items.productId");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Remove invalid items from cart in-place and persist immediately
        const hadInvalidItems = cart.items.some(item => item.productId == null);
        cart.items = cart.items.filter(item => item.productId != null);

        if (hadInvalidItems) {
            // Recalculate totalPrice after removing stale items
            cart.totalPrice = cart.items.reduce(
                (sum, item) => sum + item.productId.productPrice * item.quantity, 0
            );
            await cart.save();
        }

        // After cleanup, re-check if anything remains
        if (cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "All items in your cart are no longer available. Your cart has been cleared."
            });
        }

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
        const total = subtotal + shipping ;

        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

        const baseOrder = {
            orderId,
            products: cart.items.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity
            })),
            shippingAddress,
            amount: total,
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

        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

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
        res.status(500).json({ 
            success:false,
            message: `Server error`,
            error:error.message, 
        });
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
export const getSalesData = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({})
        const totalProducts = await Product.countDocuments({})
        const totalOrders = await Order.countDocuments({ orderStatus: "Delivered" })

        const totalSalesAgg = await Order.aggregate([
            { $match: { orderStatus: "Delivered" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ])

        const totalSales = totalSalesAgg.length > 0 ? totalSalesAgg[0].total : 0;

        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const salesByDate = await Order.aggregate([
            { $match: { orderStatus: "Delivered", createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    amount: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ])
        console.log(salesByDate);

        const formattedSales = salesByDate.map((item) => ({
            date: item._id,
            amount: item.amount,
        }))

        console.log(formattedSales);

        res.json({
            success: true,
            totalUsers,
            totalOrders,
            totalProducts,
            totalSales,
            sales: formattedSales
        })
    } catch (error) {
        console.error("Error fetching sales data", error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
export const getMyOrder=async(req,res)=>{
    try{
        const userId=req.user.id;
        const orders=await Order.find({user:userId})
            .sort({createdAt:-1})
            .select("_id orderId products paymentStatus orderStatus createdAt amount productIm")
            .lean();

        if(orders.length===0){
            return res.status(200).json({
                success:true,
                message:"No Orders found",
                orders,
            })
        }

        return res.status(200).json({
            success:true,
            message:"Orders fetched successfully",
            orders,
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message,
        })
    };
}