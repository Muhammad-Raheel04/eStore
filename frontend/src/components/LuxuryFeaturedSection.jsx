import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from './ui/skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
 
const LuxuryFeaturedSection = ({ products, loading }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);
  const scrollRef = useRef(null);
 
  // Responsive items to show
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsToShow(2);
      else if (window.innerWidth < 1024) setItemsToShow(3);
      else setItemsToShow(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
 
  // Sync scroll position → currentIndex
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const itemWidth = el.scrollWidth / (products?.length || 1);
      const idx = Math.round(el.scrollLeft / itemWidth);
      setCurrentIndex(idx);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [products]);
 
  const scrollTo = (index) => {
    const el = scrollRef.current;
    if (!el) return;
    const itemWidth = el.scrollWidth / (products?.length || 1);
    el.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
    setCurrentIndex(index);
  };
 
  const nextSlide = () => {
    const max = (products?.length ?? 0) - itemsToShow;
    scrollTo(currentIndex < max ? currentIndex + 1 : 0);
  };
 
  const prevSlide = () => {
    const max = (products?.length ?? 0) - itemsToShow;
    scrollTo(currentIndex > 0 ? currentIndex - 1 : Math.max(0, max));
  };
 
  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-4xl font-light tracking-[0.3em] uppercase mb-12">Featured</h2>
          <div className="flex gap-4 overflow-hidden justify-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-[45%] sm:min-w-[30%] lg:min-w-[23%] flex flex-col items-center">
                <Skeleton className="w-full aspect-[3/4] bg-gray-100" />
                <Skeleton className="h-3 w-28 mt-4 bg-gray-100" />
                <Skeleton className="h-2 w-16 mt-2 bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
 
  if (!products || products.length === 0) return null;
 
  const dotCount = Math.max(0, products.length - itemsToShow + 1);
 
  return (
    <section className="py-16 bg-white overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
 
        {/* Header */}
        <div className="text-center mb-10 relative">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-[0.4em] uppercase text-gray-900">
            Featured Products
          </h2>
          <div className="w-10 h-[1px] bg-black mx-auto mt-3" />
 
        
        </div>
 
        {/* Scrollable Slider — native scroll snap */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-0 scroll-smooth"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',       /* Firefox */
            msOverflowStyle: 'none',      /* IE/Edge */
          }}
        >
          {/* Hide scrollbar in WebKit */}
          <style>{`
            .featured-scroll::-webkit-scrollbar { display: none; }
          `}</style>
 
          {products.map((product) => (
            <div
              key={product._id}
              className="flex-shrink-0 px-2 sm:px-3"
              style={{
                width: `${100 / itemsToShow}%`,
                scrollSnapAlign: 'start',
              }}
            >
              <div
                onClick={() => navigate(`/products/${product._id}`)}
                className="group cursor-pointer flex flex-col items-center"
              >
                {/* Image — tighter aspect ratio on desktop */}
                <div className="w-full aspect-[3/4] sm:aspect-[2/3] lg:aspect-[3/4] overflow-hidden bg-gray-50 mb-4">
                  <img
                    src={product?.productImg?.[0]?.url || product?.thumbnail}
                    alt={product?.productName}
                    draggable={false}
                    className="w-full h-full object-fill transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
 
                <div className="text-center space-y-1 w-full px-1">
                  <h3 className="text-[9px] sm:text-[10px] font-light tracking-[0.18em] uppercase text-gray-900 truncate">
                    {product.productName}
                  </h3>
                  <p className="text-[8px] sm:text-[9px] font-light tracking-widest text-gray-400">
                    Rs. {product?.productPrice?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
 
        {/* Pagination Dots */}
        {dotCount > 1 && (
          <div className="flex justify-center gap-3 mt-10">
            {Array.from({ length: dotCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`h-[1px] transition-all duration-500 ${
                  currentIndex === i ? 'w-8 bg-black' : 'w-4 bg-gray-200 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
 
export default LuxuryFeaturedSection;