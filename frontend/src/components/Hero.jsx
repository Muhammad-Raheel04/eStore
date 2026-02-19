import React from 'react';

const Hero = () => {
    return (
        <section className="relative h-[70vh] md:h-[80vh] bg-gray-100 flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-70"></div>
            <div className="relative text-center px-4">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">New Arrivals</h1>
                <p className="text-lg md:text-2xl text-white mb-6">Shop the latest trends and exclusive offers</p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                    Shop Now
                </button>
            </div>
        </section>
    );
};

export default Hero;
