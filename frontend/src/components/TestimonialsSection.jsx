import React from 'react';

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Testimonial Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center text-center">
            <img src="https://via.placeholder.com/100x100" alt="Customer 1" className="w-20 h-20 rounded-full object-cover mb-4" />
            <p className="text-gray-700 italic mb-4">"Absolutely love the products! The quality is superb and the customer service is outstanding."</p>
            <p className="font-semibold text-gray-900">- Jane Doe</p>
          </div>
          {/* Testimonial Card 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center text-center">
            <img src="https://via.placeholder.com/100x100" alt="Customer 2" className="w-20 h-20 rounded-full object-cover mb-4" />
            <p className="text-gray-700 italic mb-4">"Fast shipping and great prices. I'm a loyal customer now!"</p>
            <p className="font-semibold text-gray-900">- John Smith</p>
          </div>
          {/* Testimonial Card 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center text-center">
            <img src="https://via.placeholder.com/100x100" alt="Customer 3" className="w-20 h-20 rounded-full object-cover mb-4" />
            <p className="text-gray-700 italic mb-4">"The best online shopping experience I've had. Highly recommend!"</p>
            <p className="font-semibold text-gray-900">- Emily White</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
