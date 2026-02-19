import React from 'react';

import HeroSection from '../components/HeroSection';
import TestimonialsSection from '../components/TestimonialsSection';
import { Truck, Lock, Headphones } from 'lucide-react';


const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Us?</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature Card 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <Truck className="w-16 h-16 text-pink-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600">
                Enjoy free shipping on all orders above $50, delivered right to your doorstep.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <Lock className="w-16 h-16 text-pink-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-gray-600">
                Your payments are safe and secure with our encrypted payment gateway.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <Headphones className="w-16 h-16 text-pink-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our dedicated support team is available round the clock to assist you.
              </p>
            </div>
          </div>


        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Category Card 1 */}
            <div className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <img src="/elctronics.jpg" alt="Electronics" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                <h3 className="text-white text-xl font-semibold">Electronics</h3>
              </div>
            </div>
            {/* Category Card 2 */}
            <div className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <img src="/cloths.jpg" alt="Clothing" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                <h3 className="text-white text-xl font-semibold">Clothing</h3>
              </div>
            </div>
            {/* Category Card 3 */}
            <div className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <img src="/accessories.jpg" alt="Accessories" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                <h3 className="text-white text-xl font-semibold">Accessories</h3>
              </div>
            </div>
            {/* Category Card 4 */}
            <div className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <img src="/homeGoods.jpg" alt="Home Goods" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                <h3 className="text-white text-xl font-semibold">Home Goods</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Latest from Our Blog</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blog Post Card 1 */}
            <div className="bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden">
              <img src="https://via.placeholder.com/600x400" alt="Blog Post 1" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">The Future of E-commerce</h3>
                <p className="text-gray-600 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <a href="#" className="mt-4 inline-block text-pink-600 hover:text-pink-800 font-semibold">Read More</a>
              </div>
            </div>
            {/* Blog Post Card 2 */}
            <div className="bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden">
              <img src="https://via.placeholder.com/600x400" alt="Blog Post 2" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Top 10 Must-Have Gadgets</h3>
                <p className="text-gray-600 text-sm">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <a href="#" className="mt-4 inline-block text-pink-600 hover:text-pink-800 font-semibold">Read More</a>
              </div>
            </div>
            {/* Blog Post Card 3 */}
            <div className="bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden">
              <img src="https://via.placeholder.com/600x400" alt="Blog Post 3" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustainable Shopping Guide</h3>
                <p className="text-gray-600 text-sm">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                <a href="#" className="mt-4 inline-block text-pink-600 hover:text-pink-800 font-semibold">Read More</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />
    </div>
  );
};

export default LandingPage;
