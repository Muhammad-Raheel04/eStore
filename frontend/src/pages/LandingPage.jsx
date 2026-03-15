import React, { useEffect, useState } from 'react';

import HeroSection from '../components/HeroSection';
import TestimonialsSection from '../components/TestimonialsSection';
import { Truck, Lock, Headphones ,ShoppingCart} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import API from '@/utils/API';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setCart } from '@/redux/productSlice';


const LandingPage = () => {
  const navigate = useNavigate();
  const handleTypeClick = (type) => {
    navigate(`/products?type=${type}`);
  };
  const [open, setOpen] = useState(false);
  const [arrivals, setArrivals] = useState([]);
  const [loadingArrivals, setLoadingArrivals] = useState(false);
  const [fetched, setFetched] = useState(false);
  const accessToken = localStorage.getItem('accessToken');
  const [loadingCart, setLoadingCart] = useState(false);
  const dispatch = useDispatch()
  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoadingArrivals(true);
        const res = await API.get('product/getallproducts');
        if (res.data?.success && Array.isArray(res.data.products)) {
          const sorted = [...res.data.products]
            .filter(p => p?.createdAt)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
          setArrivals(sorted);
          setFetched(true);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoadingArrivals(false);
      }
    };
    if (open && !fetched) {
      fetchNewArrivals();
    }
  }, [open, fetched]);

  const addToCart = async (productId) => {
    try {
      setLoadingCart(true);
      const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};
      const res = await API.post('cart/add', { productId }, config);
      if (res.data.success) {
        toast.success("Product added to Cart");
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to cart");
    } finally {
      setLoadingCart(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[90vw]  max-w-[380px] sm:max-w-[420px] rounded-xl p-4 animate-in fade-in-0 zoom-in-95 duration-300">
          <DialogHeader>
            <DialogTitle>New Arrivals</DialogTitle>
            <DialogDescription>
              Fresh products just added. Check them out!
            </DialogDescription>
          </DialogHeader>

          {loadingArrivals ? (

            <div className="flex justify-center mt-4">
              <div className="w-full max-w-sm border rounded-md p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-md mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-9 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : (
            <Carousel
              arrivals={arrivals}
              loading={loadingArrivals}
              addToCart={addToCart}
              loadingCart={loadingCart}
            />
          )}

          <div className="mt-4 flex justify-end">

          </div>
        </DialogContent>
      </Dialog>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Us?</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature Card 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <Truck className="w-16 h-16 text-black mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600">
                Enjoy free shipping on all orders above $50, delivered right to your doorstep.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <Lock className="w-16 h-16 text-black mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-gray-600">
                Your payments are safe and secure with our encrypted payment gateway.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <Headphones className="w-16 h-16 text-black mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our dedicated support team is available round the clock to assist you.
              </p>
            </div>
          </div>


        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Shop by Category</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
            {/* Category Card 1 */}
            <div>
              <div onClick={() => handleTypeClick("men")} className="relative group overflow-hidden rounded-sm shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                <img
                  src="/men.jpg"
                  alt="Mens"
                  className="w-full h-90 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40  flex items-center justify-center opacity-0 hover:opacity-45 transition-opacity duration-300">
                  <h3 className="text-white text-xl font-semibold">Mens</h3>
                </div>
              </div>
              <div
                onClick={() => handleTypeClick("men")}
                className="md:hidden relative group overflow-hidden p-2 shadow-md hover:shadow-lg transition duration-300 cursor-pointer border border-black mt-2 text-center hover:bg-black hover:text-white"
              >Men</div>
            </div>

            {/* Category Card 2 */}
            <div>
              <div onClick={() => handleTypeClick("women")} className="relative group overflow-hidden rounded-sm shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                <img
                  src="/women.jpg"
                  alt="womens"
                  className="w-full h-90 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-45 transition-opacity duration-300">
                  <h3 className="text-white text-xl font-semibold">Women</h3>
                </div>
              </div>
              <div
                onClick={() => handleTypeClick("women")}
                className="md:hidden relative group overflow-hidden shadow-md hover:shadow-lg transition duration-300 cursor-pointer  border border-black p-2 mt-2 text-center hover:bg-black hover:text-white"
              >Women</div>
            </div>

            {/* Category Card 3 */}
            <div>
              <div onClick={() => handleTypeClick("unisex")} className="relative group overflow-hidden rounded-sm shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                <img
                  src="/leatherBags.avif"
                  alt="Leather Products"
                  className="w-full h-90 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                  <h3 className="text-white text-xl font-semibold">Leather Product</h3>
                </div>
              </div>
              <div
                onClick={() => handleTypeClick("unisex")}
                className="md:hidden relative group overflow-hidden shadow-md hover:shadow-lg transition duration-300 cursor-pointer border border-black p-2 mt-2 text-center hover:bg-black hover:text-white"
              >Leather Product</div>
            </div>

            {/* Category Card 4 */}
            {/* <div className="relative group overflow-hidden rounded-sm shadow-md hover:shadow-lg transition duration-300">
              <img
                src="/homeGoods.jpg"
                alt="Home Goods"
                className="w-full h-90 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                <h3 className="text-white text-xl font-semibold">Home Goods</h3>
              </div>
            </div> */}
          </div>

          {/* Button to Products Page */}
          <div className="mt-8 flex justify-center">
            <a
              href="/products"
              className="px-6 py-3 bg-white  border-1 border-black text-black font-semibold  shadow-md hover:bg-black hover:text-white transition duration-300"
            >
              View All Products
            </a>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Latest from Our Blog</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blog Post Card 1 */}
            <div className="bg-white  shadow-md hover:shadow-lg transition duration-300 overflow-hidden">
              <img src="/blog_1.png" alt="Blog Post 1" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">The Future of E-commerce</h3>
                <p className="text-gray-600 text-sm">
                  Discover the latest trends shaping online shopping, from AI-powered recommendations to sustainable packaging and mobile-first experiences.
                </p>
                <a href="#" className="mt-4 inline-block text-black hover:text-gray-500 font-semibold">Read More</a>
              </div>
            </div>

            {/* Blog Post Card 2 */}
            <div className="bg-white  shadow-md hover:shadow-lg transition duration-300 overflow-hidden">
              <img src="/blog_2.png" alt="Blog Post 2" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Top 10 Must-Have Gadgets</h3>
                <p className="text-gray-600 text-sm">
                  Check out the latest gadgets that are revolutionizing the way we shop, work, and stay connected, featuring smart home devices and wearable tech.
                </p>
                <a href="#" className="mt-4 inline-block text-black hover:text-gray-500 font-semibold">Read More</a>
              </div>
            </div>

            {/* Blog Post Card 3 */}
            <div className="bg-white shadow-md hover:shadow-lg transition duration-300 overflow-hidden">
              <img src="/blog_3.png" alt="Blog Post 3" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustainable Shopping Guide</h3>
                <p className="text-gray-600 text-sm">
                  Learn how to make eco-friendly choices while shopping online, including sustainable brands, reusable packaging, and energy-efficient shipping options.
                </p>
                <a href="#" className="mt-4 inline-block text-black hover:text-gray-500 font-semibold">Read More</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section
      <TestimonialsSection /> */}
    </div>
  );
};

export default LandingPage;

const Carousel = ({ arrivals, loading, addToCart,loadingCart }) => {
  const [index, setIndex] = useState(0);
  const count = arrivals?.length || 0;

  useEffect(() => {
    if (index >= count) setIndex(0);
  }, [count, index]);

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-full max-w-md h-64 rounded-md animate-pulse bg-gray-100" />
      </div>
    );
  }
  if (!count) {
    return null;
  }

  const p = arrivals[index];
  const img0 = Array.isArray(p.productImg)
    ? (typeof p.productImg[0] === 'string' ? p.productImg[0] : p.productImg[0]?.url)
    : undefined;

  return (
    <div className="relative mx-auto h-[78vh] w-full max-w-[320px] sm:max-w-[360px]">

      <div className="h-full flex flex-col overflow-hidden rounded-md border bg-white shadow-sm">

        <div className="flex-1 overflow-hidden">
          <img
            src={img0}
            alt={p.productName}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="p-4 space-y-2 text-center">

          <div className="font-semibold line-clamp-1">
            {p.productName}
          </div>


          <div className="font-bold">
            Rs. {p.productPrice}
          </div>

         
  <Button
              onClick={() => addToCart(p._id)}
              className='bg-white text-black hover:text-white border-1 border-black w-full'
              disabled={loadingCart} 
            >
              {loadingCart ? (
                <span className="animate-pulse">Adding...</span> 
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </>
              )}
            </Button>
        </div>

      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black text-white hover:bg-white hover:text-black"
      >
        ‹
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white hover:bg-white hover:text-black"
      >
        ›
      </Button>

      <div className="mt-2 text-center text-xs text-gray-500">
        {index + 1} / {count}
      </div>

    </div>
  );
}
