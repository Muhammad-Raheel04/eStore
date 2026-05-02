import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const images = [
  "https://res.cloudinary.com/dxdywv9xl/image/upload/v1777657895/img1_fixed_size_clwbvh.jpg",
  "https://res.cloudinary.com/dxdywv9xl/image/upload/v1777658029/img2_fixed_size_kyax8z.jpg",
];

const ImageSwitcher = () => {
  const [index, setIndex] = useState(0);
  const navigate=useNavigate();
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);
  const handleClick=()=>{
    navigate("/products")
  }
  return (
    <section className="w-full h-[80vh] md:h-[90vh] flex flex-col md:flex-row items-center justify-between  gap-6">

      <div className="w-full h-full relative overflow-hidden">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            onClick={handleClick}
            alt="Luxury Banner"
            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ease-in-out ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}
      </div>

      <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center text-center md:text-left">
        <h1 className="text-xl sm:text-cl md:text-5xl font-light tracking-[0.35em] text-gray-900 uppercase leading-tight">
          Luxury Fashion Collection
        </h1>

        <p className="text-gray-600 font-light text-base md:text-xl text-sm mb-6 pt-4 px-4 md:px-0 ">
          Discover premium quality products crafted with elegance and modern design.
          Elevate your lifestyle with our exclusive collection.
        </p>

          <div className="mt-12 flex justify-center">
            <Link
              to={"/products"}
              className="group relative inline-flex items-center gap-2 px-10 py-4 border border-black text-black text-sm tracking-[0.2em] uppercase font-medium overflow-hidden transition-all duration-500"
            >
              <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                Shop Now
              </span>

              <span className="absolute left-0 top-0 w-0 h-full bg-black transition-all duration-500 group-hover:w-full"></span>

              <span className="relative z-10 transform group-hover:translate-x-1 transition-transform duration-300">

              </span>
            </Link>
          </div>
      </div>

    </section>
  );
};

export default ImageSwitcher;