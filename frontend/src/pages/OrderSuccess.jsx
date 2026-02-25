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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <Card className="max-w-md w-full shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-green-600">🎉 Order Placed Successfully!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-700">
                        Your order has been placed successfully. Check your email for confirmation.
                    </p>
                    <p className="text-gray-700">
                        Our team will reach out to you soon with shipping details.
                    </p>
                    <Button
                        onClick={() => navigate("/products")}
                        className="w-full bg-pink-600 hover:bg-pink-700"
                    >
                        Keep Shopping
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default OrderSuccess;