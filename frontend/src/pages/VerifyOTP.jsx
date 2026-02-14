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
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from "sonner";

const VerifyOTP = () => {
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const { email } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.post(`/user/verify-otp/${email}`, { otp });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate(`/change-password/${email}`);
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
                    <CardTitle>Verify OTP</CardTitle>
                    <CardDescription>
                        Enter the OTP sent to your email ({email}).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-2">
                            <Label htmlFor="otp">OTP</Label>
                            <Input
                                id="otp"
                                type="text"
                                placeholder="Enter your OTP"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <CardFooter className="flex-col gap-2 mt-4">
                            <Button type="submit" className="w-full cursor-pointer bg-pink-600 hover:bg-pink-500" disabled={loading}>
                                {loading ? <><Loader2 className='h-4 w-4 animate-spin mr-2' />Please wait</> : 'Verify OTP'}
                            </Button>
                            <p className="text-gray-700 text-sm">Didn't receive OTP? <Link to={'/forgot-password'} className='hover:underline cursor-pointer text-pink-800'>Resend</Link></p>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default VerifyOTP;
