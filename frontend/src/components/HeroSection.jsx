import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate=useNavigate();
  return (
    <section className="relative bg-cover bg-center h-[60vh] md:h-[80vh]" style={{ backgroundImage: "url('https://res.cloudinary.com/dxdywv9xl/image/upload/v1774628315/hero_image_1_bwssy3.avif')" }}>
      <div className="absolute inset-0 bg-black opacity-25"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">New Arrivals & Exciting Sales!</h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl">Discover our latest collection and grab amazing deals on your favorite products.</p>
        <button className="bg-white hover:bg-black text-black hover:text-white border-1 border-black border py-3 px-8 text-lg transition duration-300" onClick={()=>navigate('/products')}>Shop Now</button>
      </div>
    </section>
  );
};

export default HeroSection;
