import React from "react";

const BespokeSection = () => {
  return (
    <section className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden">
      <img
        src="https://res.cloudinary.com/dxdywv9xl/image/upload/v1775202726/hero1_1_n1j5oo.avif" // replace with your image
        alt="Bespoke Process"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
        
        <h2 className="text-white text-2xl md:text-5xl tracking-[0.4em] font-light uppercase">
          Bespoke Process
        </h2>

        <p className="mt-4 text-white/80 text-sm md:text-lg max-w-xl">
          From concept to creation, we craft pieces that are truly yours
        </p>

      </div>
    </section>
  );
};

export default BespokeSection;