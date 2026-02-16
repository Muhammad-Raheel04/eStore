import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import API from "@/utils/API";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router-dom";
import userLogo from "../assets/user.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { toast } from "sonner";
import { setUser } from "@/redux/userSlice";
const Profile = () => {
    const { user } = useSelector(store => store.user)
    const params = useParams()
    const userId = params.userId
    const [updateUser, setUpdateUser] = useState({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phoneNo: user?.phoneNo,
        address: user?.address,
        city: user?.city,
        zipCode: user?.zipCode,
        profilePic: user?.profilePic,
        role: user?.role
    })

    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const handleChange = (e) => {
        setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        setFile(selectedFile)
        setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem('accessToken');
        try {
            setLoading(true);
            // use FormData for text + file
            const formData = new FormData()
            formData.append("firstName", updateUser.firstName)
            formData.append("lastName", updateUser.lastName)
            formData.append("email", updateUser.email)
            formData.append("phoneNo", updateUser.phoneNo)
            formData.append("address", updateUser.address)
            formData.append("city", updateUser.city)
            formData.append("zipCode", updateUser.zipCode)
            formData.append("role", updateUser.role)

            if (file) {
                formData.append("file", file);// image file for backend multer
            }
            const res = await API.put(`user/update/${userId}`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setUser(res.data.user));
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to update profile");

        }finally{
            setLoading(false);
        }
    }
    return (
        <div className="pt-24 min-h-screen bg-gray-50 flex justify-center items-start">
            <Tabs defaultValue="profile" className="max-w-7xl mx-auto items-center">

                {/* Tabs */}
                <TabsList className="bg-gray-100 border">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="orders">orders</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile">
                    <div>
                        <div className="flex flex-col justify-center items-center bg-gray-100 rounded-xl p-5">
                            <h1 className="font-bold mb-7 text-2xl text-gray-800">Update Profile</h1>
                            <div className="w-full flex gap-10 justify-between items-start px-7 max-w-2xl">
                                {/* profile picture */}
                                <div className="flex flex-col items-center">
                                    <img src={updateUser?.profilePic || userLogo} alt="profile" className="w-32 h-32 rounded-full object-fill border-4 border-pink-800" />

                                    <Label className='mt-4 cusor-pointer bg-pink-600 text-white px-4 py-2 rounded-xl hover:bg-pink-700'>Change Picture
                                        <input
                                            type='file'
                                            accept='image/*'
                                            className="hidden"
                                            onChange={handleFileChange}
                                        ></input>
                                    </Label>
                                </div>
                                {/* profile form */}
                                <form onSubmit={handleSubmit} className="space-y-4 shadow-lg p-5 rounded-lg bg-white">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                className="block text-sm font-medium">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                placeholder="John"
                                                value={updateUser.firstName}
                                                onChange={handleChange}
                                                className="w-full border rounded-lg px-3 py-2 mt-1" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                placeholder="Doe"
                                                value={updateUser.lastName}
                                                onChange={handleChange}
                                                className="w-full border rounded-lg px-3 py-2 mt-1" />
                                        </div>
                                    </div>
                                    <div>
                                        <Label className='block text-sm font-medium'>Email</Label>
                                        <Input
                                            type='email'
                                            name="email"
                                            disabled
                                            value={updateUser.email}
                                            onChange={handleChange}
                                            className='w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100' />
                                    </div>

                                    <div>
                                        <Label className='block text-sm font-medium'>Phone Number</Label>
                                        <input
                                            type='text'
                                            name="phoneNo"
                                            value={updateUser.phoneNo}
                                            onChange={handleChange}
                                            placeholder="Enter your contact No"
                                            className='w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100'
                                        />
                                    </div>
                                    <div>
                                        <Label className='block text-sm font-medium'>Address</Label>
                                        <input
                                            type='text'
                                            name="address"
                                            value={updateUser.address}
                                            onChange={handleChange}
                                            placeholder="Enter your address"
                                            className='w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100'
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className='block text-sm font-medium'>City</Label>
                                            <input
                                                type='text'
                                                name="city"
                                                value={updateUser.city}
                                                onChange={handleChange}
                                                placeholder="Enter your city"
                                                className='w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100'
                                            />
                                        </div>
                                        <div>
                                            <Label className='block text-sm font-medium'>Zip Code</Label>
                                            <input
                                                type='text'
                                                name="zipCode"
                                                value={updateUser.zipCode}
                                                onChange={handleChange}
                                                placeholder="Enter your zipCode"
                                                className='w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100'
                                            />
                                        </div>
                                    </div>
                                    <Button 
                                    type='submit' 
                                    className='w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg' 
                                    disabled={loading}>
                                    {loading ? "Updating..." : "Update Profile"}
                                    </Button>

                                </form>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Password Tab */}
                <TabsContent value="orders">
                    <Card className="mt-4 shadow-sm">
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>
                                Change your orders here. After saving, you'll be logged out.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-600">
                                    Current Password
                                </label>
                                <Input type="orders" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-600">
                                    New Password
                                </label>
                                <Input type="orders" />
                            </div>

                            <Button className="bg-black text-white hover:bg-gray-800">
                                Save orders
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
};

export default Profile;
