import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addAddress, deleteAddress, setSelectedAddress } from '@/redux/productSlice';
import { Separator } from '@/components/ui/separator';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import API from '@/utils/API';

const AddressForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "",
    });
  const requiredFields = ["fullName", "phone", "email", "address", "city", "state", "zip", "country"];
  const getMissingFields = (addr) => {
    if (!addr) return requiredFields;
    return requiredFields.filter((k) => {
      const v = addr[k];
      return typeof v !== "string" || v.trim() === "";
    });
  };

    const { cart, addresses, selectedAddress } = useSelector((store) => store.product);
    const [showForm, setShowForm] = useState(addresses?.length > 0 ? false : true);
    const [savingAddress, setSavingAddress] = useState(false);
    const [placingOrder, setPlacingOrder] = useState(false);

    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

  const handleSave = () => {
    const missing = getMissingFields(formData);
    if (missing.length) {
      toast.error(`Please fill: ${missing.join(", ")}`);
      return;
    }
        setSavingAddress(true);
        setTimeout(() => {
            dispatch(addAddress(formData));
            const newIndex = addresses.length;
            dispatch(setSelectedAddress(newIndex));
            setShowForm(false);
            setSavingAddress(false);
            toast.success("Address saved successfully!");
        }, 500); // simulate async saving
    };

    const handleplaceOrder = async () => {
        if (!cart || cart.items.length === 0) {
            toast.error("Your cart is empty!");
            return;
        }

    const addr = selectedAddress !== null ? addresses[selectedAddress] : null;
    if (!addr) {
      toast.error("Please select a shipping address");
      return;
    }
    const missing = getMissingFields(addr);
    if (missing.length) {
      toast.error(`Please complete address fields: ${missing.join(", ")}`);
      setShowForm(true);
      setFormData({ ...formData, ...addr });
      return;
    }

        try {
            setPlacingOrder(true);
            const token = localStorage.getItem("accessToken");
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await API.post("order/cod", { shippingAddress: addr }, config);
            if (res.data.success) {
                toast.success("Order Placed Successfully!");
                navigate("/order-success");
            }
        } catch (error) {
            console.log(error);
            const apiMsg = error?.response?.data?.message || error.message || "Failed to place order. Try again!";
            toast.error(apiMsg);
        } finally {
            setPlacingOrder(false);
        }
    };

    const subtotal = cart.totalPrice;
    const shipping = subtotal > 50 ? 0 : 10;
    const tax = parseFloat((subtotal * 0.05).toFixed(2));
    const total = subtotal + shipping + tax;

    return (
        <div className="max-w-7xl mx-auto p-2 sm:px-10 sm:pt-4 sm:pb-10">
            <h1 className='text-center p-2  text-lg border-t  border-b border-gray-300  '>Checkout </h1>
            <div className="pt-2 grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left: Address Form */}
                <div className="space-y-4 p-6 bg-white border border-gray-300 shadow-md">
                    {showForm ? (
                        <>
                            <div>
                                <Label htmlFor="fullName"></Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    required
                                    placeholder="Full Name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone"></Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    required
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="email"></Label>
                                <Input
                                    id="email"
                                    name="email"
                                    required
                                    placeholder="example@gmail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="address"></Label>
                                <Input
                                    id="address"
                                    name="address"
                                    required
                                    placeholder="Address e.g,123 street, Area"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="city"></Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        required
                                        placeholder="Enter Your City"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="state"></Label>
                                    <Input
                                        id="state"
                                        name="state"
                                        required
                                        placeholder="Your Province"
                                        value={formData.state}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="zip"></Label>
                                    <Input
                                        id="zip"
                                        name="zip"
                                        required
                                        placeholder="Provide Zip Code"
                                        value={formData.zip}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="country"></Label>
                                    <Input
                                        id="country"
                                        name="country"
                                        required
                                        placeholder="Your country"
                                        value={formData.country}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={handleSave}
                                className="w-full mt-2"
                                disabled={savingAddress}
                            >
                                {savingAddress ? "Saving..." : "Save & Continue"}
                            </Button>
                        </>
                    ) : (
                        <div>
                            <h2 className="text-lg font-semibold mb-4 text-center">Saved Addresses</h2>
                            {addresses.map((addr, index) => (
                                <div
                                    key={index}
                                    onClick={() => dispatch(setSelectedAddress(index))}
                                    className={`border p-4  hover:bg-gray-50 cursor-pointer relative mb-3 ${selectedAddress === index
                                            ? "border-gray-500 bg-gray-100"
                                            : "border-gray-300"
                                        }`}
                                >
                                    <p className="font-medium">{addr.fullName}</p>
                                    <p>{addr.phone}</p>
                                    <p>{addr.email}</p>
                                    <p>
                                        {addr.address}, {addr.city}, {addr.state}, {addr.zip},{" "}
                                        {addr.country}
                                    </p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(deleteAddress(index));
                                        }}
                                        className="absolute top-2 right-2 text-gray-500 hover:text-black text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                className="w-full mt-2 border border-gray-300 hover:bg-black hover:text-white"
                                onClick={() => setShowForm(true)}
                            >
                                + Add new Address
                            </Button>
                        </div>
                    )}
                </div>

                {/* Right: Order Summary */}
                <div className="w-full lg:w-auto">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span>Subtotal ({cart.items.length} items)</span>
                                <span>Rs. {subtotal.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>Rs. {shipping}</span>
                            </div> 
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>Rs. {tax}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>Rs. {total.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="space-y-3 pt-4">
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Input placeholder="Promo Code" className="flex-1" />
                                    <Button variant="outline" className='bg-white text-black border border-gray-300 hover:bg-black hover:text-white'>Apply</Button>
                                </div>
                                <Button
                                    disabled={selectedAddress === null || placingOrder}
                                    className="w-full bg-white text-black border border-gray-300 hover:bg-black hover:text-white"
                                    onClick={handleplaceOrder}
                                >
                                    {placingOrder ? "Placing Order..." : "Place order (Cash on Delivery)"}
                                </Button>
                                <Button variant="outline" className="w-full bg-white text-black border border-gray-300 hover:bg-black hover:text-white">
                                    <Link to="/products">Continue Shopping</Link>
                                </Button>
                            </div>
                           
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AddressForm;
