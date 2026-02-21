import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "./ui/button";
import API from "@/utils/API";
import { toast } from "sonner";
import { setCart } from "@/redux/productSlice";

const ProductDesc = ({ product }) => {
    const dispatch = useDispatch();
    const accessToken = localStorage.getItem("accessToken");
    const [quantity, setQuantity] = useState(1);

    const addToCart = async () => {
        try {
            const res = await API.post(
                "cart/add",
                { productId: product._id, quantity },
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            if (res.data.success) {
                toast.success("Added to cart");
                dispatch(setCart(res.data.cart));
            }
        } catch (error) {
            toast.error("Failed to add product");
        }
    };

    return (
        <>
            {/* Content Card */}
            <div className="bg-white rounded-t-3xl -mt-6 p-6 shadow-lg space-y-4">

                <h1 className="text-2xl font-bold">{product.productName}</h1>

                <p className="text-gray-500 text-sm">{product.category}</p>

                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-pink-600">
                        Rs. {product.productPrice}
                    </span>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">
                    {product.productDesc}
                </p>

                {/* Quantity Stepper */}
                <div className="flex items-center justify-between pt-4">
                    <span className="font-semibold text-sm sm:text-base">
                        Quantity
                    </span>

                    <div className="flex items-center border rounded-xl overflow-hidden">

                        <button
                            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                            className="w-10 h-10 flex items-center justify-center text-xl font-bold 
                 active:scale-95 transition"
                        >
                            −
                        </button>

                        <div className="w-12 h-10 flex items-center justify-center text-base font-medium">
                            {quantity}
                        </div>

                        <button
                            onClick={() => setQuantity((prev) => prev + 1)}
                            className="w-10 h-10 flex items-center justify-center text-xl font-bold 
                 active:scale-95 transition"
                        >
                            +
                        </button>

                    </div>
                </div>
            </div>

            {/* Sticky Bottom Add to Cart */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-md">
                <Button
                    onClick={addToCart}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-lg"
                >
                    Add to Cart • Rs. {product.productPrice * quantity}
                </Button>
            </div>
        </>
    );
};

export default ProductDesc;