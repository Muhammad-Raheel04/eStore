import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate=useNavigate();
  return (
    <section className="relative bg-cover bg-center h-[60vh] md:h-[80vh]" style={{ backgroundImage: "url('https://via.placeholder.com/1920x1080')" }}>
      <div className="absolute inset-0 bg-pink-600 opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">New Arrivals & Exciting Sales!</h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl">Discover our latest collection and grab amazing deals on your favorite products.</p>
        <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300" onClick={()=>navigate('/products')}>Shop Now</button>
      </div>
    </section>
  );
};

export default HeroSection;
