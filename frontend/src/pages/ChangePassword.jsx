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
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from "sonner";

const ChangePassword = () => {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });
    const navigate = useNavigate();
    const { email } = useParams();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.post(`/user/change-password/${email}`, formData);
            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/login');
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
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                        Enter your new password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-2 mb-4">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className='relative'>
                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    placeholder="Enter new password"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    type={showNewPassword ? 'text' : 'password'}
                                    required
                                />
                                {
                                    showNewPassword ? <EyeOff onClick={() => setShowNewPassword(false)} className='w-5 h-5 text-gray-700 absolute right-5 bottom-2 cursor-pointer' /> :
                                        <Eye onClick={() => setShowNewPassword(true)} className='w-5 h-5 text-gray-700 absolute right-5 bottom-2 cursor-pointer' />
                                }
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <div className='relative'>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirm new password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                />
                                {
                                    showConfirmPassword ? <EyeOff onClick={() => setShowConfirmPassword(false)} className='w-5 h-5 text-gray-700 absolute right-5 bottom-2 cursor-pointer' /> :
                                        <Eye onClick={() => setShowConfirmPassword(true)} className='w-5 h-5 text-gray-700 absolute right-5 bottom-2 cursor-pointer' />
                                }
                            </div>
                        </div>
                        <CardFooter className="flex-col gap-2 mt-4">
                            <Button type="submit" className="w-full cursor-pointer bg-pink-600 hover:bg-pink-500" disabled={loading}>
                                {loading ? <><Loader2 className='h-4 w-4 animate-spin mr-2' />Please wait</> : 'Change Password'}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ChangePassword;
