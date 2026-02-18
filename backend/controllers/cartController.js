import { Cart } from "../models/CartModel.js";
import { Product } from "../models/productModel.js";

export const getCart = async (req, res) => {
    try {
        const userId = req.id;

        const cart = await Cart.findOne({ userId }).populate("items.productId");

        if (!cart) {
            return res.json({
                success: true,
                cart: { items: [], totalPrice: 0 }
            });
        }


        res.status(200).json({ success: true, cart });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const addToCart = async (req, res) => {
    try {
        const userId = req.id;
        const { productId } = req.body;

        // Check if product exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Find the user's cart (if exists)
        let cart = await Cart.findOne({ userId });

        // If cart doesn't exist, create a new one
        if (!cart) {
            cart = await Cart.create({
                userId,
                items: [{
                    productId,
                    quantity: 1,
                    price: product.productPrice
                }],
                totalPrice: product.productPrice
            });
        } else {
            // Find if product is already in the cart
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

            if (itemIndex > -1) {
                // If product exists -> just increase quantity
                cart.items[itemIndex].quantity += 1;
            } else {
                // If new product -> push to cart
                cart.items.push({
                    productId,
                    quantity: 1,
                    price: product.productPrice
                });
            }

            // Recalculate total price
            cart.totalPrice = cart.items.reduce(
                (acc, item) => acc + (item.price * item.quantity), 0
            );

            // Save updated cart
            await cart.save();
        }

        // Populate product details before sending response
        const populatedCart = await Cart.findById(cart._id).populate("items.productId");

        res.status(200).json({
            success: true,
            message: "Product added to cart successfully",
            cart: populatedCart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const userId = req.id;
        const { productId, type } = req.body;

        // Find user's cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        // Find the item in cart
        const item = cart.items.find(item => item.productId.toString() === productId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }

        // Update quantity based on type
        if (type === "increase") {
            item.quantity += 1;
        } else if (type === "decrease") {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Quantity cannot be less than 1"
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid operation type"
            });
        }

        // Recalculate total price
        cart.totalPrice = cart.items.reduce(
            (acc, item) => acc + (item.price * item.quantity), 0
        );

        // Save updated cart
        await cart.save();

        // Populate product details before sending response
        cart = await cart.populate("items.productId");

        res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.id;
        const { productId } = req.body;

        // Find user's cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        // Filter out the item to remove
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        // Recalculate total price (handle empty cart case)
        cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        // Save updated cart
        await cart.save();

        // Populate product details before sending response
        cart = await cart.populate("items.productId");

        res.status(200).json({
            success: true,
            message: "Item removed from cart successfully",
            cart
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};