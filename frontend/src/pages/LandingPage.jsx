import React from 'react';

import HeroSection from '../components/HeroSection';
import TestimonialsSection from '../components/TestimonialsSection';
import { Truck, Lock, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const LandingPage = () => {
  const navigate = useNavigate();
  const handleTypeClick = (type) => {
    navigate(`/products?type=${type}`);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />

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
