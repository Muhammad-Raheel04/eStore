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
import { setCart, setCartOpen } from '@/redux/productSlice';
import BespokeSection from '@/components/Bespoke';
import LuxuryFeaturedSection from '@/components/LuxuryFeaturedSection';


const LandingPage = () => {
  const navigate = useNavigate();
  const handleTypeClick = (type) => {
    navigate(`/products?type=${type}`);
  };
  const [open, setOpen] = useState(false);
  const [arrivals, setArrivals] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingArrivals, setLoadingArrivals] = useState(false);
  const [loadingFeatured, setLoadingFeatured] = useState(false);
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

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoadingFeatured(true);
        const res = await API.get('product/featured');
        if (res.data?.success) {
          setFeaturedProducts(res.data.products);
        }
      } catch (e) {
        console.log("Error fetching featured products:", e);
      } finally {
        setLoadingFeatured(false);
      }
    };
    fetchFeatured();
  }, []);

  const addToCart = async (productId) => {
    try {
      setLoadingCart(true);
      const config = accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {};
      const res = await API.post('cart/add', { productId, quantity: 1 }, config);
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        dispatch(setCartOpen(true));
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
        <DialogContent className="w-[90vw] max-w-[380px] sm:max-w-[420px] rounded-none p-6 animate-in fade-in-0 zoom-in-95 duration-300 border-none bg-white">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-light tracking-[0.2em] uppercase text-center">New Arrivals</DialogTitle>
            <DialogDescription className="text-center font-light text-gray-500 text-xs tracking-widest mt-2 uppercase">
              Fresh products just added
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
      {/* Featured Products Section */}
      <LuxuryFeaturedSection products={featuredProducts} loading={loadingFeatured} />
      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto ">
          <div className="text-center mb-24 px-4">

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.35em] text-gray-900 uppercase leading-tight">
              Our Collection
            </h2>

            <div className="w-16 h-[1px] bg-black mx-auto mt-6"></div>

            <p className="mt-6 text-gray-500 text-sm md:text-base max-w-lg mx-auto font-light leading-relaxed">
              Crafted for those who value timeless design, premium quality, and everyday elegance.
            </p>

          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0">
            {/* Category Card 1 */}
            <div onClick={() => handleTypeClick("men")} className="relative group overflow-hidden cursor-pointer">
              <img
                loading='lazy'
                src='https://res.cloudinary.com/dxdywv9xl/image/upload/v1775210593/category_img_1_wrg2ik.avif'
                alt="Mens"
                className="w-full h-130 md:h-150 object-cover aspect-ratio[3/4] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>

              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h3 className="text-white text-2xl md:text-3xl font-light tracking-[0.2em] uppercase mb-2">Mens</h3>
                <p className="text-[#e8d87f] text-xs md:text-sm tracking-widest uppercase font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500">Shop Collection</p>
              </div>
            </div>

            {/* Category Card 2 */}
            <div onClick={() => handleTypeClick("women")} className="relative group overflow-hidden cursor-pointer">
              <img
                loading='lazy'
                src="https://res.cloudinary.com/dxdywv9xl/image/upload/v1775210964/category_img_2_igsyb8.avif"
                alt="womens"
                className="w-full h-130 md:h-150  object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>

              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h3 className="text-white text-2xl md:text-3xl font-light tracking-[0.2em] uppercase mb-2">Women</h3>
                <p className="text-[#e8d87f] text-xs md:text-sm tracking-widest uppercase font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500">Shop Collection</p>
              </div>
            </div>

            {/* Category Card 3 */}
            <div onClick={() => handleTypeClick("leather products")} className="relative group overflow-hidden cursor-pointer">
              <img
                loading='lazy'
                src="https://res.cloudinary.com/dxdywv9xl/image/upload/v1773570038/leatherBags_fjtrd7.avif"
                alt="Leather Products"
                className="w-full h-130 md:h-150  object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>

              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h3 className="text-white text-2xl md:text-3xl font-light tracking-[0.2em] uppercase mb-2">Leather</h3>
                <p className="text-[#e8d87f] text-xs md:text-sm tracking-widest uppercase font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500">Shop Collection</p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <a
              href="/products"
              className="group relative inline-flex items-center gap-2 px-10 py-4 border border-black text-black text-sm tracking-[0.2em] uppercase font-medium overflow-hidden transition-all duration-500"
            >
              <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                View Collection
              </span>

              <span className="absolute left-0 top-0 w-0 h-full bg-black transition-all duration-500 group-hover:w-full"></span>

              <span className="relative z-10 transform group-hover:translate-x-1 transition-transform duration-300">

              </span>
            </a>
          </div>
        </div>
      </section>

      <BespokeSection />



      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">

          {/* Heading */}
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-light tracking-[0.3em] uppercase text-gray-900">
              Why Choose Us
            </h2>
            <div className="w-12 h-[1px] bg-black mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {/* Feature 1 */}
            <div className="text-center group">
              <Truck className="w-10 h-10 mx-auto text-gray-800 mb-6 transition-transform duration-500 group-hover:-translate-y-1" />

              <h3 className="text-sm font-light tracking-[0.25em] uppercase text-gray-900 mb-4">
                Fast Delivery
              </h3>

              <p className="text-gray-500 text-sm font-light leading-relaxed max-w-xs mx-auto">
                We ensure that your premium products reach you in the shortest possible time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center group">
              <Lock className="w-10 h-10 mx-auto text-gray-800 mb-6 transition-transform duration-500 group-hover:-translate-y-1" />

              <h3 className="text-sm font-light tracking-[0.25em] uppercase text-gray-900 mb-4">
                Secure Payment
              </h3>

              <p className="text-gray-500 text-sm font-light leading-relaxed max-w-xs mx-auto">
                Your transactions are protected with the highest level of security protocols.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center group">
              <Headphones className="w-10 h-10 mx-auto text-gray-800 mb-6 transition-transform duration-500 group-hover:-translate-y-1" />

              <h3 className="text-sm font-light tracking-[0.25em] uppercase text-gray-900 mb-4">
                Dedicated Support
              </h3>

              <p className="text-gray-500 text-sm font-light leading-relaxed max-w-xs mx-auto">
                Our team is always available to assist you with a seamless experience.
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
    <div className="relative mx-auto md:h-[72vh] sm:h-[40vh] w-full max-w-[320px] sm:max-w-[360px]">

      <div className="h-full flex flex-col overflow-hidden rounded-md border bg-white shadow-sm">

        <div className="flex-1 overflow-hidden">
          <img
            loading='lazy'
            src={img0}
            alt={p.productName}
            onClick={() => navigate(`/products/${p._id}`)}
            className="w-full h-full max-h-[300px] sm:max-h-[60vh] md:max-h-[70vh] object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="p-4 space-y-4 text-center bg-white">

          <h4 className="text-sm font-light tracking-[0.15em] uppercase line-clamp-1 text-gray-900">
            {p.productName}
          </h4>


          <div className="text-xs font-light tracking-widest text-gray-500 uppercase">
            Rs. {p.productPrice}
          </div>


          <Button
            onClick={() => addToCart(p._id)}
            className='bg-black text-white hover:bg-[#e8d87f] hover:text-black border-none w-full py-6 rounded-none tracking-[0.2em] uppercase text-[10px]'
            disabled={loadingCart}
          >
            {loadingCart ? (
              <span className="animate-pulse">Adding...</span>
            ) : (
              "Add to Bag"
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
