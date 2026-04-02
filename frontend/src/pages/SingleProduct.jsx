import Breadcrumbs from '@/components/Breadcrums';
import ProductDesc from '@/components/ProductDesc'
import ProductImg from '@/components/ProductImg'
import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const SingleProduct = () => {
    const params = useParams()
    const productId = params.id
    const products = useSelector(store => store.product.products)
    const product = products.find(item => item._id === productId)

    return (
        <div className="pt-24 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            
            <Breadcrumbs product={product} />

            <div className="
                mt-8
                grid 
                grid-cols-1 
                md:grid-cols-2 
                gap-8 
                items-start
            ">
                <div className="w-full">
                    <ProductImg images={product?.productImg} />
                </div>

                <div className="w-full">
                    <ProductDesc product={product} />
                </div>
            </div>
        </div>
    )
}

export default SingleProduct