import Breadcrumbs from '@/components/Breadcrums';
import ProductDesc from '@/components/ProductDesc'
import ProductImg from '@/components/ProductImg'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import API from '@/utils/API';

const SingleProduct = () => {
    const params = useParams()
    const productId = params.id
    const products = useSelector(store => store.product?.products) || []
    const productFromRedux = products.find(item => item?._id === productId)

    const [localProduct, setLocalProduct] = useState(null)
    const [loading, setLoading] = useState(!productFromRedux)
    const [fetched, setFetched] = useState(false)

    useEffect(() => {
        // Only fetch if product is not found in Redux
        if (!productFromRedux) {
            const fetchSingleProduct = async () => {
                try {
                    setLoading(true)
                    const res = await API.get(`product/${productId}`)
                    if (res.data.success) {
                        setLocalProduct(res.data.product)
                    }
                } catch (err) {
                    console.error("Error fetching single product:", err)
                } finally {
                    setLoading(false)
                    setFetched(true)
                }
            }
            fetchSingleProduct()
        }
    }, [productId, productFromRedux])

    const product = productFromRedux || localProduct

    if (loading) {
        return (
            <div className="pt-24 pb-10 flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
        )
    }

    if (!product && !loading && (productFromRedux === undefined || fetched)) {
        return (
            <div className="pt-24 pb-10 text-center">
                <h2 className="text-2xl font-bold text-gray-700">Product not found</h2>
                <p className="mt-2 text-gray-500">The product you are looking for does not exist or has been removed.</p>
            </div>
        )
    }

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