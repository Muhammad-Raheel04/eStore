import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/productSlice";

const OrderSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearCart());
    }, [dispatch]);
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <Card className="max-w-md w-full shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-black text-center ">Order Placed Successfully!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-700 text-center">
                        Your order has been placed successfully. Check your email for confirmation.
                    </p>
                    <p className="text-gray-700 text-center">
                        Our team will reach out to you soon with shipping details.
                    </p>
                    <Button
                        onClick={() => navigate("/products")}
                        className="w-full bg-white text-black border border-black hover:bg-black hover:text-white"
                    >
                        Keep Shopping
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default OrderSuccess;