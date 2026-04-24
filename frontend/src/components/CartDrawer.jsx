import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setCart } from '@/redux/productSlice';
import API from '@/utils/API';
import { toast } from 'sonner';

const CartDrawer = ({ isOpen, onClose }) => {
  const cart = useSelector((store) => store.product.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const total = cart?.totalPrice || 0;

  const loadCart = async () => {
    try {
      const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};
      const res = await API.get(`cart/`, config);
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};
      const res = await API.put(`cart/update`, { productId, type }, config);
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const config = accessToken 
        ? { headers: { Authorization: `Bearer ${accessToken}` }, data: { productId } } 
        : { data: { productId } };
      const res = await API.delete(`cart/remove`, config);

      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success('Product removed from bag');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCart();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <div 
        className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div className={`fixed top-0 right-0 h-full w-full sm:w-[380px] bg-white z-[110] shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
      
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-serif font-light tracking-[0.2em] uppercase text-black">Your Cart</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:rotate-90 transition-transform duration-300 group"
          >
            <X className="w-6 h-6 text-black group-hover:text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {cart?.items?.length > 0 ? (
            cart.items.map((item, index) => (
              <div 
                key={index} 
                className="flex gap-4 group transition-all duration-300 hover:translate-x-1"
              >
                <div className="w-30 h-auto ">
                  <img
                    src={item?.productId?.productImg?.[0]?.url}
                    alt={item?.productId?.productName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-light tracking-wide text-black uppercase line-clamp-2 leading-relaxed">
                        {item?.productId?.productName}
                      </h3>
                      <button 
                        onClick={() => handleRemove(item?.productId?._id)}
                        className="text-gray-400 hover:text-black transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm font-light text-gray-500 mt-2">
                      Rs. {item?.productId?.productPrice}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center border border-gray-100">
                      <button 
                        onClick={() => handleUpdateQuantity(item.productId._id, 'decrease')}
                        className="p-2 hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-3 h-3 text-black" />
                      </button>
                      <span className="px-4 text-xs font-light">{item?.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.productId._id, 'increase')}
                        className="p-2 hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-3 h-3 text-black" />
                      </button>
                    </div>
                    <p className="text-sm font-medium text-black">
                      Rs. {item?.productId?.productPrice * item?.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <ShoppingBag className="w-12 h-12 text-gray-200" />
              <p className="text-sm font-light tracking-widest uppercase text-gray-500">Your bag is empty</p>
              <button 
                onClick={() => { onClose(); navigate('/products'); }}
                className="text-xs font-light tracking-[0.2em] uppercase underline hover:text-[#e8d87f] transition-colors"
              >
                Discover Collection
              </button>
            </div>
          )}
        </div>

        {cart?.items?.length > 0 && (
          <div className="p-6 border-t border-gray-100 space-y-4 sticky bottom-0 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
            <div className="space-y-2">
             
              <div className="flex justify-between text-xs font-light tracking-widest text-gray-500 uppercase">
                <span>Shipping</span>
                <span>Rs. 0</span>
              </div>
              <div className="flex justify-between text-sm font-medium tracking-[0.1em] text-black uppercase pt-2 border-t border-gray-50">
                <span>Total</span>
                <span>Rs. {total}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => { onClose(); navigate('/address'); }}
                className="w-full bg-black text-white py-4 px-6 tracking-[0.2em] uppercase text-sm hover:bg-[#e8d87f] hover:text-black transition duration-300 shadow-lg"
              >
                Checkout
              </button>
              <button
                onClick={onClose}
                className="w-full bg-transparent text-black py-4 px-6 tracking-[0.2em] uppercase text-[10px] font-light hover:text-gray-500 transition duration-300"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
