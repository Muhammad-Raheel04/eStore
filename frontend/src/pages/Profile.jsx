import React, { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { setUser } from "@/redux/userSlice";
import {
    Package,
    ShoppingBag,
    Truck,
    MapPin,
    Mail,
    Phone,
    User,
    Camera,
    Calendar,
    ChevronRight,
    CheckCircle,
    Clock,
    XCircle,
    Eye,
    ShoppingCart
} from "lucide-react";

const Profile = () => {
    const { user } = useSelector(store => store.user);
    const params = useParams();
    const userId = params.userId;
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
    });

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchOrders = async () => {
            const accessToken = localStorage.getItem('accessToken');
            try {
                setLoadingOrders(true);
                const res = await API.get(`order/my-orders`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                if (res.data.success) {
                    setOrders(res.data.orders);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                toast.error(error.response?.data?.message);
            } finally {
                setLoadingOrders(false);
            }
        };
        fetchOrders();
    }, []);

    const handleChange = (e) => {
        setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem('accessToken');
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("firstName", updateUser.firstName);
            formData.append("lastName", updateUser.lastName);
            formData.append("email", updateUser.email);
            formData.append("phoneNo", updateUser.phoneNo);
            formData.append("address", updateUser.address);
            formData.append("city", updateUser.city);
            formData.append("zipCode", updateUser.zipCode);
            formData.append("role", updateUser.role);
            if (file) formData.append("file", file);

            const res = await API.put(`user/update/${userId}`, formData, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setUser(res.data.user));
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const OrderStatusBadge = ({ status }) => {
        const statusConfig = {
            'pending': { icon: Clock, text: 'Pending', className: 'bg-amber-50 text-amber-700 border-amber-200' },
            'processing': { icon: Clock, text: 'Processing', className: 'bg-blue-50 text-blue-700 border-blue-200' },
            'shipped': { icon: Truck, text: 'Shipped', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
            'delivered': { icon: CheckCircle, text: 'Delivered', className: 'bg-green-50 text-green-700 border-green-200' },
            'cancelled': { icon: XCircle, text: 'Cancelled', className: 'bg-red-50 text-red-700 border-red-200' }
        };
        const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
        const Icon = config.icon;
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
                <Icon className="w-3 h-3" />
                {config.text}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-10 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-12 mt-4 bg-gray-200 px-4 py-6">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.35em] uppercase text-gray-900">
                        My Account
                    </h1>

                    <div className="w-12 h-[1px] bg-black mx-auto mt-6"></div>

                    <p className="mt-6 text-gray-500 text-sm tracking-wide max-w-md mx-auto font-light">
                        Manage your profile and track your orders
                    </p>
                </div>
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="flex justify-center bg-transparent border-b border-gray-200 rounded-none p-0 mb-8 space-x-8">
                        <TabsTrigger
                            value="profile"
                            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black px-6 pb-3 text-sm font-light tracking-[0.2em] uppercase text-gray-500 rounded-none bg-transparent"
                        >
                            Profile
                        </TabsTrigger>
                        <TabsTrigger
                            value="orders"
                            className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black px-6 pb-3 text-sm font-light tracking-[0.2em] uppercase text-gray-500 rounded-none bg-transparent"
                        >
                            Orders
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="mt-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white shadow-sm border border-gray-100 rounded-none overflow-hidden">
                                <div className="relative h-32 bg-gradient-to-r from-gray-900 to-gray-700"></div>

                                <div className="relative px-6 pb-6">
                                    <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 mb-6">
                                        <div className="relative group">
                                            <img
                                                src={updateUser?.profilePic || userLogo}
                                                alt="profile"
                                                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                                            />
                                            <label className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
                                                <Camera className="w-4 h-4 text-gray-600" />
                                                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                            </label>
                                        </div>
                                        <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                                            <h2 className="text-2xl font-light tracking-wide">
                                                {updateUser.firstName} {updateUser.lastName}
                                            </h2>
                                            <p className="text-gray-500 text-sm flex items-center justify-center sm:justify-start gap-1 mt-1">
                                                <User className="w-3 h-3" /> {updateUser.role || 'Customer'}
                                            </p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <Label className="block text-xs font-light tracking-wider text-gray-500 uppercase mb-2">First Name</Label>
                                                <Input
                                                    type="text"
                                                    name="firstName"
                                                    value={updateUser.firstName}
                                                    onChange={handleChange}
                                                    className="rounded-none border-gray-300 focus:border-black focus:ring-black"
                                                />
                                            </div>
                                            <div>
                                                <Label className="block text-xs font-light tracking-wider text-gray-500 uppercase mb-2">Last Name</Label>
                                                <Input
                                                    type="text"
                                                    name="lastName"
                                                    value={updateUser.lastName}
                                                    onChange={handleChange}
                                                    className="rounded-none border-gray-300 focus:border-black focus:ring-black"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="block text-xs font-light tracking-wider text-gray-500 uppercase mb-2 flex items-center gap-2">
                                                <Mail className="w-3 h-3" /> Email Address
                                            </Label>
                                            <Input
                                                type="email"
                                                name="email"
                                                disabled
                                                value={updateUser.email}
                                                className="rounded-none border-gray-300 bg-gray-50"
                                            />
                                        </div>

                                        <div>
                                            <Label className="block text-xs font-light tracking-wider text-gray-500 uppercase mb-2 flex items-center gap-2">
                                                <Phone className="w-3 h-3" /> Phone Number
                                            </Label>
                                            <Input
                                                type="text"
                                                name="phoneNo"
                                                value={updateUser.phoneNo}
                                                onChange={handleChange}
                                                className="rounded-none border-gray-300 focus:border-black focus:ring-black"
                                            />
                                        </div>

                                        <div>
                                            <Label className="block text-xs font-light tracking-wider text-gray-500 uppercase mb-2 flex items-center gap-2">
                                                <MapPin className="w-3 h-3" /> Address
                                            </Label>
                                            <Input
                                                type="text"
                                                name="address"
                                                value={updateUser.address}
                                                onChange={handleChange}
                                                className="rounded-none border-gray-300 focus:border-black focus:ring-black"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <Label className="block text-xs font-light tracking-wider text-gray-500 uppercase mb-2">City</Label>
                                                <Input
                                                    type="text"
                                                    name="city"
                                                    value={updateUser.city}
                                                    onChange={handleChange}
                                                    className="rounded-none border-gray-300 focus:border-black focus:ring-black"
                                                />
                                            </div>
                                            <div>
                                                <Label className="block text-xs font-light tracking-wider text-gray-500 uppercase mb-2">Zip Code</Label>
                                                <Input
                                                    type="text"
                                                    name="zipCode"
                                                    value={updateUser.zipCode}
                                                    onChange={handleChange}
                                                    className="rounded-none border-gray-300 focus:border-black focus:ring-black"
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-none tracking-[0.2em] uppercase text-sm font-light transition-all duration-300"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <span className="animate-pulse">Updating...</span>
                                            ) : (
                                                "Update Profile"
                                            )}
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="orders" className="mt-10">
                        {orders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-gray-100 shadow-sm">
                                <div className="w-24 h-24 flex items-center justify-center mb-6 bg-gray-50 rounded-full">
                                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                                </div>
                                <h2 className="text-xl tracking-[0.3em] uppercase text-gray-900 font-light">
                                    No Orders Yet
                                </h2>
                                <p className="mt-3 text-sm text-gray-500 max-w-md leading-relaxed font-light">
                                    You haven't placed any orders yet. Explore our premium collection and find something you'll love.
                                </p>
                                <button
                                    onClick={() => window.location.href = "/products"}
                                    className="group relative px-10 py-3.5 border border-black text-black text-xs tracking-[0.2em] uppercase overflow-hidden transition-all duration-500"
                                >
                                    {/* Sliding background */}
                                    <span className="absolute inset-0 bg-black transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100"></span>

                                    {/* Text */}
                                    <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                                        Start Shopping
                                    </span>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {orders.map((order) => (
                                    <div
                                        key={order._id}
                                        className="group bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                                    >
                                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
                                            <div className="flex flex-wrap justify-between items-center">
                                                <div>
                                                    <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase mb-1">
                                                        Order Number
                                                    </p>
                                                    <p className="text-white font-mono text-sm tracking-wide">
                                                        #{order.orderId}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <OrderStatusBadge status={order.orderStatus} />
                                                    <div className="text-right">
                                                        <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">
                                                            Placed on
                                                        </p>
                                                        <p className="text-white text-xs">
                                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <div className="space-y-4">
                                                {order.products?.map((item, idx) => (
                                                    <div key={idx} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">

                                                        <div className="flex-1">
                                                            <div className="flex flex-wrap justify-between items-start gap-2">
                                                                <div>

                                                                    {item.productName && (
                                                                        <p className="text-xs text-gray-500">{item.productName}</p>
                                                                    )}
                                                                    <div className="flex items-center gap-3 mt-2">
                                                                        <span className="text-xs text-gray-500">
                                                                            Quantity: <span className="text-gray-700 font-medium">{item.quantity || 1}</span>
                                                                        </span>
                                                                        {item.price && (
                                                                            <span className="text-xs text-gray-500">
                                                                                Price: <span className="text-gray-700 font-medium">Rs. {item.price}</span>
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {item.subtotal && (
                                                                    <div className="text-right">
                                                                        <p className="text-xs text-gray-500">Subtotal</p>
                                                                        <p className="text-sm font-medium text-gray-900">Rs. {item.subtotal}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Order Summary */}
                                            <div className="mt-6 pt-4 border-t border-gray-200">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs text-gray-500 uppercase tracking-wide">Subtotal</span>
                                                    <span className="text-sm text-gray-700">Rs. {order.amount || 0}</span>
                                                </div>

                                                {order.shippingCost && (
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-xs text-gray-500 uppercase tracking-wide">Shipping</span>
                                                        <span className="text-sm text-gray-700">Rs. {order.shippingCost}</span>
                                                    </div>
                                                )}

                                                {order.discount && (
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-xs text-gray-500 uppercase tracking-wide">Discount</span>
                                                        <span className="text-sm text-green-600">- Rs. {order.discount}</span>
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-200">
                                                    <span className="text-sm font-medium text-gray-900 uppercase tracking-wide">Total Amount</span>
                                                    <span className="text-xl font-light text-gray-900">Rs. {order.totalAmount || order.amount || 0}</span>
                                                </div>
                                            </div>

                                            {/* Payment & Shipping Info */}
                                            <div className="mt-6 pt-4 border-t border-gray-100">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase mb-2">
                                                            Payment Status
                                                        </p>
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${order.paymentStatus === 'paid'
                                                            ? 'bg-green-50 text-green-700 border border-green-200'
                                                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                            }`}>
                                                            {order.paymentStatus === 'paid' ? (
                                                                <CheckCircle className="w-3 h-3" />
                                                            ) : (
                                                                <Clock className="w-3 h-3" />
                                                            )}
                                                            {order.paymentStatus || 'Pending'}
                                                        </span>
                                                    </div>

                                                    {order.shippingAddress && (
                                                        <div>
                                                            <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase mb-2">
                                                                Shipping Address
                                                            </p>
                                                            <p className="text-xs text-gray-600">{order.shippingAddress}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Profile;