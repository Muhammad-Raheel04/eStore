import Breadcrumbs from '@/components/Breadcrums';
import ProductDesc from '@/components/ProductDesc'
import ProductImg from '@/components/ProductImg'
import ProductCard from '@/components/ProductCard'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import API from '@/utils/API';
import { setProducts } from '@/redux/productSlice';

const SingleProduct = () => {
    const params = useParams()
    const productId = params.id
    const dispatch = useDispatch()
    const products = useSelector(store => store.product?.products) || []
    const productFromRedux = products.find(item => item?._id === productId)

    const [localProduct, setLocalProduct] = useState(null)
    const [loading, setLoading] = useState(!productFromRedux)
    const [fetched, setFetched] = useState(false)

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth' // optional (can remove if you want instant jump)
        });
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

        // Fetch all products if they aren't in Redux to populate "You May Also Like"
        if (products.length === 0) {
            const fetchAllProducts = async () => {
                try {
                    const res = await API.get('product/getallproducts');
                    if (res.data?.success) {
                        dispatch(setProducts(res.data.products));
                    }
                } catch (err) {
                    console.error("Error fetching all products for related section:", err);
                }
            };
            fetchAllProducts();
        }
    }, [productId, productFromRedux, products.length, dispatch])

    const product = productFromRedux || localProduct

    // Filter related products
    const relatedProducts = products
        .filter(item => item?.category === product?.category && item?._id !== product?._id)
        .slice(0, 4)

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

            {/* You May Also Like Section */}
            {relatedProducts.length > 0 && (
                <div className="mt-24">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-serif font-light tracking-[0.2em] uppercase text-gray-900">
                            You May Also Like
                        </h2>
                        <div className="h-[1px] w-24 bg-[#b08d57] mx-auto mt-4 opacity-50" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-6 sm:gap-y-16">
                        {relatedProducts.map((related) => (
                            <ProductCard
                                key={related._id}
                                product={related}
                                loading={false}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SingleProduct