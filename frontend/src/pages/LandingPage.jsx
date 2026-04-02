import React, { useEffect, useState } from 'react';

import HeroSection from '../components/HeroSection';
import TestimonialsSection from '../components/TestimonialsSection';
import { Truck, Lock, Headphones, ShoppingCart } from 'lucide-react';
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
    const hasSeen = sessionStorage.getItem('seenArrivals');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setOpen(true);
        sessionStorage.setItem('seenArrivals', 'true');
      }, 2500);
      return () => clearTimeout(timer);
    }
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
      const res = await API.post('cart/add', { productId, quantity: 1 }, config);
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success("Added to bag");
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to add to bag");
    } finally {
      setLoadingCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
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
              navigate={navigate}
            />
          )}

          <div className="mt-4 flex justify-end">

          </div>
        </DialogContent>
      </Dialog>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-[0.2em] text-gray-900 uppercase">
              Our Collection
            </h2>

            <div className="w-16 h-[2px] bg-black mx-auto mt-4"></div>

            <p className="mt-4 text-gray-500 text-sm md:text-base max-w-xl mx-auto">
              Crafted for those who value timeless design, premium quality, and everyday elegance.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-0">
            {/* Category Card 1 */}
            <div>
              <div onClick={() => handleTypeClick("men")} className="relative group overflow-hidden shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                <img
                  src="https://res.cloudinary.com/dxdywv9xl/image/upload/v1774254627/men_pwzico.avif"
                  alt="Mens"
                  className="w-full h-150 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-black/1 group-hover:bg-black/40 transition"></div>

                {/* LEFT TEXT */}
                <div className="absolute inset-0 flex flex-col justify-end">
                  <div className="pl-4 pb-4">
                    <h3 className="inline-block text-white text-4xl">Mens</h3>
                    <p className="text-[#FFD700] text-2xl mt-2">Shop latest collection</p>
                  </div>
                </div>
              </div>
              <div
                onClick={() => handleTypeClick("men")}
                className="md:hidden relative group overflow-hidden p-2 shadow-md hover:shadow-lg transition duration-300 cursor-pointer border border-black mt-2 text-center hover:bg-black hover:text-white"
              >Men</div>
            </div>

            {/* Category Card 2 */}
            <div>
              <div onClick={() => handleTypeClick("women")} className="relative group overflow-hidden  shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                <img
                  src="https://res.cloudinary.com/dxdywv9xl/image/upload/v1774465500/women_ucamwu.avif"
                  alt="womens"
                  className="w-full h-150 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-black/1 group-hover:bg-black/40 transition"></div>

                {/* LEFT TEXT */}
                <div className="absolute inset-0 flex flex-col justify-end">
                  <div className="pl-4 pb-4">
                    <h3 className="inline-block text-white text-4xl ">Women</h3>
                    <p className="text-[#FFD700] text-2xl mt-2">Shop latest collection</p>
                  </div>
                </div>
              </div>
              <div
                onClick={() => handleTypeClick("women")}
                className="md:hidden relative group overflow-hidden shadow-md hover:shadow-lg transition duration-300 cursor-pointer  border border-black p-2 mt-2 text-center hover:bg-black hover:text-white"
              >Women</div>
            </div>

            {/* Category Card 3 */}
            <div>
              <div onClick={() => handleTypeClick("unisex")} className="relative group overflow-hidden shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
                <img
                  src="https://res.cloudinary.com/dxdywv9xl/image/upload/v1773570038/leatherBags_fjtrd7.avif"
                  alt="Leather Products"
                  className="w-full h-150 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-black/1 group-hover:bg-black/40 transition"></div>

                {/* LEFT TEXT */}
                <div className="absolute inset-0 flex flex-col justify-end">
                  <div className="pl-4 pb-6">
                    <h3 className="inline-block text-white text-4xl">Leather</h3>
                    <p className="text-[#FFD700] text-2xl mt-2">Premimum Leather Products</p>
                  </div>
                </div>
              </div>
              <div
                onClick={() => handleTypeClick("unisex")}
                className="md:hidden relative group overflow-hidden shadow-md hover:shadow-lg transition duration-300 cursor-pointer border border-black p-2 mt-2 text-center hover:bg-black hover:text-white"
              >Leather Product</div>
            </div>
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


      {/* Testimonials Section
      <TestimonialsSection /> */}
    </div>
  );
};

export default LandingPage;

const Carousel = ({ arrivals, loading, addToCart, loadingCart, navigate }) => {
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
    <div className="relative mx-auto md:h-[78vh] sm:h-[40vh] w-full max-w-[320px] sm:max-w-[360px]">

      <div className="h-full flex flex-col overflow-hidden rounded-md border bg-white shadow-sm">

        <div className="flex-1 overflow-hidden">
          <img
            src={img0}
            alt={p.productName}
            onClick={() => navigate(`/products/${p._id}`)}
            className="w-full h-full max-h-[300px] sm:max-h-[60vh] md:max-h-[70vh] object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="p-4 space-y-2 text-center">

          <div className="font-semibold line-clamp-1">
            {p.productName}
          </div>


          <div className="font-normal text-red-500">
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
