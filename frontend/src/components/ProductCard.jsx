import { ShoppingCart, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setCart, setCartOpen, setProducts } from '@/redux/productSlice'
import API from '@/utils/API'
import { toast } from 'sonner'

const ProductCard = ({ product, loading, isAdmin }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-full aspect-[3/4] sm:aspect-[2/3] lg:aspect-[3/4] overflow-hidden bg-gray-50 mb-4">
          <Skeleton className="w-full h-full rounded-none" />
        </div>
        <div className="w-full space-y-2 px-1 flex flex-col items-center">
          <Skeleton className="h-3 w-3/4 bg-gray-100 rounded-none" />
          <Skeleton className="h-2 w-1/2 bg-gray-100 rounded-none" />
          <Skeleton className="h-9 w-full max-w-[140px] bg-gray-100 rounded-none mt-2" />
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const { productImg, productPrice, productName } = product;
  const accessToken = localStorage.getItem("accessToken");
  const [loadingCart, setLoadingCart] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addToCart = async (productId) => {
    try {
      setLoadingCart(true);
      const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};
      const res = await API.post('cart/add', { productId }, config);
      if (res.data.success) {
        toast.success("Product added to bag");
        dispatch(setCart(res.data.cart));
        dispatch(setCartOpen(true));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to bag");
    } finally {
      setLoadingCart(false);
    }
  }

  const handleDelete = async (productId) => {
    try {
      const res = await API.delete(`product/delete/${productId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (res.data.success) {
        toast.success("Product deleted successfully!");
        dispatch(setProducts((prevProducts) => prevProducts.filter((p) => p._id !== productId)));
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  }

  return (
    <div className="group select-none flex flex-col items-center">
      {/* Image Container */}
      <div className="w-full overflow-hidden bg-gray-50 mb-4 relative">
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <>
          <div className="w-full aspect-[4/4] overflow-hidden bg-gray-50 relative">
            <img
              src={productImg?.[0]?.url}
              onClick={() => navigate(`/products/${product._id}`)}
              alt={productName}
              draggable={false}
              className="w-auto h-auto object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer"
            /></div>
            {isAdmin && (
              <Button 
                onClick={() => handleDelete(product._id)} 
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-none opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </div>

      {/* Info Container */}
      <div className="text-center space-y-1 w-full px-1 flex flex-col items-center">
        {loading ? (
          <>
            <Skeleton className="h-3 w-3/4 mx-auto" />
            <Skeleton className="h-2 w-1/2 mx-auto" />
          </>
        ) : (
          <>
            <h3 
              onClick={() => navigate(`/products/${product._id}`)}
              className="text-[10px] sm:text-[11px] font-light tracking-[0.18em] uppercase text-gray-900 truncate cursor-pointer hover:text-gray-600 transition-colors w-full"
            >
              {productName}
            </h3>
            <p className="text-[9px] sm:text-[10px] font-light tracking-widest text-gray-400">
              Rs. {productPrice?.toLocaleString()}
            </p>
            
            <div className="pt-2 w-full max-w-[140px]">
              <Button
                onClick={() => addToCart(product._id)}
                className="bg-black text-white hover:bg-[#e8d87f] hover:text-black border-none w-full py-4 rounded-none tracking-[0.2em] uppercase text-[9px] h-auto font-light transition-all duration-300"
                disabled={loadingCart}
              >
                {loadingCart ? (
                  <span className="animate-pulse">Adding...</span>
                ) : (
                  "Add to Bag"
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ProductCard