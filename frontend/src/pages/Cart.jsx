import { Card } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import userLogo from '../assets/user.jpg';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import API from '@/utils/API';
import { setCart } from '@/redux/productSlice';
import { toast } from 'sonner';

const Cart = () => {
  const cart = useSelector((store) => store.product.cart);
  const subTotal = cart?.totalPrice || 0;
  const shipping = subTotal > 299 ? 0 : 10;
  const tax = subTotal * 0.05;
  const total = subTotal + shipping + tax;
  const navigate = useNavigate();
  const dispatch = useDispatch()


  const accessToken = localStorage.getItem("accessToken")

  const loadCart = async () => {
    try {
      const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};
      const res = await API.get(`cart/`, config);
      if (res.data.success) {
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleUpdateQuantity = async (productId, type) => {
    try {
      const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};
      const res = await API.put(`cart/update`, { productId, type }, config);
      if (res.data.success) {
        dispatch(setCart(res.data.cart))
      }
    }
    catch (error) {
      console.log(error);
    }
  }
  const handleRemove = async (productId) => {
    try {
      const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` }, data: { productId } } : { data: { productId } };
      const res = await API.delete(`cart/remove`, config);

      if (res.data.success) {
        dispatch(setCart(res.data.cart))
        toast.success('Product removed from cart')
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadCart()
  }, [dispatch])
  return (
    <div className="pt-24 bg-gray-50 min-h-screen">
      {cart?.items?.length > 0 ?
        <div className="max-w-7xl mx-auto">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-7 px-4">
            <div className="flex flex-col gap-5 flex-1">
              {cart?.items?.length > 0 ? (
                <div className='max-w-7xl mx-auto'>
                  <h1 className="text-2xl p-2 text-gray-800 mb-7 text-center border-t border-b border-gray-500 w-full">Shopping Cart</h1>
                  <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-7">
                    <div className="flex flex-col gap-5 flex-1">
                      {cart?.items?.map((product, index) => {
                        return (
                          <Card key={index} className="p-4 shadow-sm border-1 border-gray-300 hover:shadow-md transition">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">

                              {/* Product Info */}
                              <div className="flex items-center gap-4 w-full sm:w-[400px]">
                                <img
                                  src={product?.productId?.productImg?.[0]?.url || userLogo}
                                  alt={product?.productId?.productName || "Product image"}
                                  className="w-24 h-24 object-cover border"
                                />

                                <div className="w-full sm:w-[280px] space-y-1">
                                  <h1 className="font-semibold text-gray-800 line-clamp-2">
                                    {product?.productId?.productName}
                                  </h1>
                                  <p className="text-sm text-gray-500">
                                    PKR {product?.productId?.productPrice}
                                  </p>
                                </div>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex gap-3 items-center">
                                <Button onClick={() => handleUpdateQuantity(product.productId._id, 'decrease')}
                                  variant="outline" size="sm">-</Button>
                                <span className="font-medium">{product?.quantity}</span>
                                <Button onClick={() => handleUpdateQuantity(product.productId._id, 'increase')}
                                  variant="outline" size="sm">+</Button>
                              </div>

                              {/* Total Price */}
                              <p className="font-semibold text-gray-800">
                                Rs. {product?.productId?.productPrice * product?.quantity}
                              </p>

                              {/* Remove */}
                              <p onClick={() => handleRemove(product?.productId?._id)} className="flex text-gray-500 items-center gap-1 cursor-pointer hover:text-black transition">
                                <Trash className="w-4 h-4" />
                                Remove
                              </p>

                            </div>
                          </Card>

                        );
                      })}
                    </div>
                    <Card className="w-full lg:w-[400px] mb-4 border border-gray-300">
                      <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>Rs. {shipping}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax(5%)</span>
                          <span>Rs. {tax}</span>
                        </div>
                        <Separator />
                        <div className='flex justify-between font-bold text-lg'>
                          <span>Total</span>
                          <span>Rs. {total}</span>
                        </div>
                        <div className='space-y-3 pt-4'>
                          <div className='flex space-x-2'>
                            <Input placeholder="Promo Code" />
                            <Button variant='outline' className='bg-white text-black hover:bg-black hover:text-white border border-gray-300'>Apply</Button>
                          </div>
                          <Button onClick={()=>navigate('/address')} className='w-full text-white hover:bg-white hover:text-black border border-gray-300'>PLACE ORDER</Button>
                          <Button variant='outline' className='w-full bg-white text-black hover:bg-black hover:text-white border border-gray-300'>
                            <Link to="/products">Continue Shopping</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        : <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          {/* Icon */}
          <div className="bg-gray-200 p-6 rounded-full">
            <ShoppingCart className="w-16 h-16 text-black" />
          </div>
          {/* title */}
          <h2 className="mt-6 text-2xl font-bold text-gray-800">Your Cart is Empty</h2>
          <p className="mt-2 text-gray-600">Looks like you haven't added anything to your cart yet</p>
          <Button onClick={() => navigate('/products')} className='mt-6 cursor-pointer bg-white text-black py-3 hover:bg-black hover:text-white border border-black'>Shop now</Button>
        </div>
      }
    </div >
  );
};

export default Cart;