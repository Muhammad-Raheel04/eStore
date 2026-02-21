import { ShoppingCart, Trash } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setCart, setProducts } from '@/redux/productSlice'
import API from '@/utils/API'
import { toast } from 'sonner'

const ProductCard = ({ product, loading, isAdmin }) => {
  const { productImg, productPrice, productName } = product;
  const accessToken = localStorage.getItem("accessToken");
  const dispatch=useDispatch();
  const navigate =useNavigate();
  const addToCart = async (productId) => {
    try {
      const res = await API.post('cart/add',{productId},{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      });
      if(res.data.success){
        toast.success("Product added to Cart");
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.error(error)
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
    <div className='shadow-lg rounded-lg overflow-hidden h-max'>
      <div className='w-full h-full aspect-square overflow-hidden'>
        {loading ? (
          <Skeleton className='w-full h-full rounded-lg' />
        ) : (
          <img
            src={productImg[0]?.url}
            onClick={()=>navigate(`/products/${product._id}`)}
            alt={productName}
            className='w-full h-full transition-transform duration-300 hover:scale-105 cursor-pointer'
          />
        )}
      </div>

      {loading ? (
        <div className='px-2 space-y-2 my-2'>
          <Skeleton className='w-[200px] h-4' />
          <Skeleton className='w-[100px] h-4' />
          <Skeleton className='w-[150px] h-8' />
        </div>
      ) : (
        <div className='px-2 space-y-1'>
          <h1 className='font-semibold h-12 line-clamp-2'>{productName}</h1>
          <h2 className='font-bold'>${productPrice}</h2>
          <div className='flex gap-2 mt-3 mb-4'>
            <Button onClick={()=>addToCart(product._id)} className='bg-pink-600 w-full'>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            {isAdmin && (
              <Button onClick={() => handleDelete(product._id)} className='bg-red-500 hover:bg-red-600'>
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductCard