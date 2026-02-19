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

  }
  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await API.put(`cart/update`, { productId, type }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
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
      const res = await API.delete(`cart/remove`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        data: { productId }
      });

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
    <div className="pt-20 bg-gray-50 min-h-screen">
      {cart?.items?.length > 0 ?
        <div className="max-w-7xl mx-auto">
          <div className="max-w-7xl mx-auto flex gap-7">
            <div className="flex flex-col gap-5 flex-1">
              {cart?.items?.length > 0 ? (
                <div className='max-w-7xl mx-auto'>
                  <h1 className="text-2xl font-bold text-gray-800 mb-7">Shopping Cart</h1>
                  <div className="max-w-7xl mx-auto flex gap-7">
                    <div className="flex flex-col gap-5 flex-1">
                      {cart?.items?.map((product, index) => {
                        return (
                          <Card key={index} className="p-4 shadow-sm hover:shadow-md transition rounded-xl">
                            <div className="flex justify-between items-center gap-8">

                              {/* Product Info */}
                              <div className="flex items-center gap-4 w-[400px]">
                                <img
                                  src={product?.productId?.productImg?.[0]?.url || userLogo}
                                  alt={product?.productId?.productName || "Product image"}
                                  className="w-24 h-24 object-cover rounded-lg border"
                                />

                                <div className="w-[280px] space-y-1">
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
                                PKR {product?.productId?.productPrice * product?.quantity}
                              </p>

                              {/* Remove */}
                              <p onClick={() => handleRemove(product?.productId?._id)} className="flex text-red-500 items-center gap-1 cursor-pointer hover:text-red-600 transition">
                                <Trash className="w-4 h-4" />
                                Remove
                              </p>

                            </div>
                          </Card>

                        );
                      })}
                    </div>
                    <Card className="w-[400px]">
                      <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>${shipping}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax(5%)</span>
                          <span>${tax}</span>
                        </div>
                        <Separator />
                        <div className='flex justify-between font-bold text-lg'>
                          <span>Total</span>
                          <span>${total}</span>
                        </div>
                        <div className='space-y-3 pt-4'>
                          <div className='flex space-x-2'>
                            <Input placeholder="Promo Code" />
                            <Button variant='outline'>Apply</Button>
                          </div>
                          <Button className='w-full bg-pink-600'>PLACE ORDER</Button>
                          <Button variant='outline' className='w-full bg-transparent'>
                            <Link to="/products">Continue Shopping</Link>
                          </Button>
                        </div>
                        <div className='text-sm text-muted-foreground pt-4'>
                          <p>* Free shipping on orders over 299</p>
                          <p>* 30-days return policy</p>
                          <p>* Secure checkout with SSL encryption</p>
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
          <div className="bg-pink-100 p-6 rounded-full">
            <ShoppingCart className="w-16 h-16 text-pink-600" />
          </div>
          {/* title */}
          <h2 className="mt-6 text-2xl font-bold text-gray-800">Your Cart is Empty</h2>
          <p className="mt-2 text-gray-600">Looks like you haven't added anything to your cart yet</p>
          <Button onClick={() => navigate('/products')} className='mt-6 cursor-pointer bg-pink-600 text-white py-3 hover:bg-pink-700'>Shop now</Button>
        </div>
      }
    </div >
  );
};

export default Cart;