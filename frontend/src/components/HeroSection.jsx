import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    image: 'https://res.cloudinary.com/dxdywv9xl/image/upload/v1775202726/hero1_1_n1j5oo.avif',
    tag: 'timeless leather',
    heading: 'CRAFTED\nELEGANCE',
    subtext: 'Premium leather bags designed for modern men & women.',
    cta: 'Shop Bags',
    path: '/products',
  },
  {
    image: 'https://res.cloudinary.com/dxdywv9xl/image/upload/v1775210403/archive_bfwqkh.zip.avif',
    tag: 'minimal & refined',
    heading: 'EVERYDAY\nESSENTIALS',
    subtext: 'Sleek wallets and accessories built for style and function.',
    cta: 'Shop Wallets',
    path: '/products',
  },
  {
    image: 'https://res.cloudinary.com/dxdywv9xl/image/upload/v1775058382/hero_img_1_u58buo.avif',
    tag: 'new collection',
    heading: 'LATEST\nARRIVALS',
    subtext: 'Discover fresh designs crafted with precision and premium leather.',
    cta: 'Explore Collection',
    path: '/products',
  },
];
const HeroSection = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState('next');

  const goTo = useCallback((index, dir = 'next') => {
    if (animating || index === current) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 600);
  }, [animating, current]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, 'next');
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, 'prev');
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">

      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            i === current
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-110'
          }`}
        >
          <img
            src={s.image}
            alt=""
            className="w-full h-full object-cover"
          
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent z-10" />

      <div className="absolute inset-0 z-20 flex flex-col justify-center px-[8%] md:px-[12%] text-white">
        <div className="max-w-[700px]">
          <p className="text-[#e8d87f] tracking-[0.4em] uppercase text-xs md:text-sm mb-6 animate-fadeInLeft">
            {slide.tag}
          </p>

          <h1 className="text-4xl md:text-7xl lg:text-6xl font-serif font-light leading-[1.1] uppercase mb-8 animate-fadeInLeft delay-200 tracking-[0.2em] md:tracking-[0.2em]">
            {slide.heading}
          </h1>

          <p className="text-white/70 text-base md:text-lg lg:text-xl font-light leading-relaxed mb-10 max-w-[450px] animate-fadeInLeft delay-400">
            {slide.subtext}
          </p>

          <div className="animate-fadeInLeft delay-600">
            <button
              onClick={() => navigate(slide.path)}
              className="group relative px-10 py-4 overflow-hidden border border-[#e8d87f] text-[#e8d87f] text-sm tracking-[0.3em] uppercase transition-all duration-500 hover:text-black"
            >
              <span className="absolute inset-0 w-0 bg-[#e8d87f] transition-all duration-500 ease-out group-hover:w-full -z-10"></span>
              {slide.cta}
            </button>
          </div>
        </div>
      </div>

      {/* NAVIGATION CONTROLS */}
      <div className="absolute bottom-12 right-12 z-30 flex items-center gap-8">
        <div className="flex gap-4">
          <button
            onClick={prev}
            className="w-12 h-12 flex items-center justify-center border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="w-12 h-12 flex items-center justify-center border border-white/20 text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            ›
          </button>
        </div>

        <div className="flex items-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 'next' : 'prev')}
              className={`transition-all duration-500 ${
                i === current
                  ? 'w-12 h-[2px] bg-[#e8d87f]'
                  : 'w-6 h-[1px] bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="absolute bottom-0 left-0 h-[3px] bg-[#e8d87f] animate-progress z-30 w-full opacity-50" />

      {/* ANIMATIONS */}
      <style>{`
        @keyframes progress {
          from { transform: scaleX(0); transform-origin: left; }
          to { transform: scaleX(1); transform-origin: left; }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-progress {
          animation: progress 6s linear infinite;
        }
        .animate-fadeInLeft {
          animation: fadeInLeft 0.8s ease-out forwards;
        }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-600 { animation-delay: 0.6s; }
      `}</style>
    </section>
  );
};

export default HeroSection;