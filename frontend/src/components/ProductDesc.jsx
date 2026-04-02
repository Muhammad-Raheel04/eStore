import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "./ui/button";
import API from "@/utils/API";
import { toast } from "sonner";
import { setCart, setCartOpen } from "@/redux/productSlice";

const ProductDesc = ({ product }) => {
    const [loading, setLoading] = useState();
    const dispatch = useDispatch();
    const accessToken = localStorage.getItem("accessToken");
    const [quantity, setQuantity] = useState(1);

    const addToCart = async () => {
        try {
            const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};
            const res = await API.post("cart/add", { productId: product._id, quantity }, config);

            if (res.data.success) {
                toast.success("Added to bag");
                dispatch(setCart(res.data.cart));
                dispatch(setCartOpen(true));
            }
        } catch (error) {
            toast.error("Failed to add product");
        }
    };

    return (
        <>
            {/* Content Card */}
            <div className="bg-white rounded-t-3xl -mt-6 mb-10 p-6 shadow-lg space-y-4 md:rounded-none md:mt-0 md:mb-0 md:shadow-none md:p-0">
                <h1 className="text-2xl font-bold text-gray-500 text-center md:text-left">
                    {product?.productName}
                </h1>

                <p className="text-gray-500 text-sm">{product?.category}</p>

                <div className="flex items-center justify-between md:justify-start md:gap-4">
                    <span className="text-2xl font-normal text-red-500">
                        Rs. {product?.productPrice}
                    </span>
                </div>
                <div
                    className="prose prose-sm max-w-none w-full text-gray-700
                               prose-p:my-1 prose-ul:my-1 prose-ul:pl-4 
                               prose-li:my-0 prose-headings:mb-1 prose-headings:mt-3 
                             prose-strong:text-black break-words overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: product?.productDesc }}
                />
                {/* Quantity Stepper with Add to Cart below for Desktop */}
                <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between md:justify-start md:gap-8">
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

                    {/* Desktop Add to Cart Button - hidden on mobile */}
                    <div className="hidden md:block">
                        <Button
                            onClick={async () => {
                                try {
                                    setLoading(true);
                                    await addToCart();
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            disabled={loading}
                            className="
                                w-full 
                                bg-white
                                text-black
                                border
                                border-black
                                hover:bg-black
                                hover:text-white
                                py-3 
                                transition-all 
                                duration-300
                                hover:bg-black
                            "
                        >
                            {loading ? "Processing" : `Add to Cart • Rs. ${product?.productPrice * quantity}`}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Add to Cart - ONLY visible on mobile */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-md md:hidden">
                <Button
                    onClick={async () => {
                        try {
                            setLoading(true);
                            await addToCart();
                        } finally {
                            setLoading(false);
                        }
                    }}
                    disabled={loading}
                    className={`
                        w-full 
                        bg-white
                        text-black
                        border
                        border-black
                        hover:bg-black
                        hover:text-white
                        py-3 
                        transition-all 
                        duration-300
                        ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-black'}
                    `}
                >
                    {loading ? "Processing" : `Add to Cart • Rs. ${product?.productPrice * quantity}`}
                </Button>
            </div>
        </>
    );
};

export default ProductDesc;