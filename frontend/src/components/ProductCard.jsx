import React from 'react'
import { Button } from './ui/button'

const ProductCard = ({ product,loading }) => {
  const { productImg, productPrice, productName } = product
  return (
    <div className='shadow-lg rounded-lg overflow-hidden h-max'>
      <div className='w-full h-full aspect-square overflow-hidden'>
        <img src={productImg[0]?.url} alt="" className='w-full h-full transition-transform duration-300 hover:scale-105' />
      </div>
      <div className='px-2 space-y-1'>
        <h1 className='font-semibold h-12 line-clamp-2'>{productName}</h1>
        <h2 className='font-bold'>${productPrice}</h2>
        <Button className="bg-pink-600 mb-3 w-full">ShoppingCart</Button>
      </div>
      
    </div>
    
  )
}
export default ProductCard