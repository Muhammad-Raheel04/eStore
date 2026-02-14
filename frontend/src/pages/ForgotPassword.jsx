import React, { useState } from 'react'
import axios from 'axios';
import API from "@/utils/API";

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from "sonner";

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.post("/user/forgot-password", { email });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate(`/verify-otp/${email}`);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-pink-100'>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your email to receive a password reset OTP.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <CardFooter className="flex-col gap-2 mt-4">
                            <Button type="submit" className="w-full cursor-pointer bg-pink-600 hover:bg-pink-500" disabled={loading}>
                                {loading ? <><Loader2 className='h-4 w-4 animate-spin mr-2' />Please wait</> : 'Send OTP'}
                            </Button>
                            <p className="text-gray-700 text-sm">Remember your password? <Link to={'/login'} className='hover:underline cursor-pointer text-pink-800'>Login</Link></p>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;
