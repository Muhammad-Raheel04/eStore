import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaPinterest, FaTwitterSquare } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className='bg-black text-gray-200 py-10'>
      <div className='max-w-7xl mx-auto px-4 md:flex md:justify-between'>
        {/* info */}
        <div className='mb-6 md:mb-0'>

          <p className='mt-2 text-sm'>Powering Your World with the Best in eCommerce.</p>
          <p className='mt-2 text-sm'>Rajput & Co. Bahria Town Phase 8, RWP</p>
          <p className='text-sm'><a href="mailto:hamzaraj541@gmail.com">Email: hamzaraj541@gmail.com</a></p>
          <p className='text-sm mt-2'>
            <a
              href="https://wa.me/923295694485"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-300 hover:text-white"
            >
              Contact Developer
            </a>
          </p>
        </div>

        {/* customer service links */}
        <div className='mb-6 md:mb-0'>
          <h3 className='text-xl font-semibold'>Customer Service</h3>
          <ul className='mt-2 text-sm space-y-2'>
            <li><a href="mailto:hamzaraj541@gmail.com">Contact Us</a></li>
          
          </ul>
        </div>

        {/* social media links */}
        <div className='mb-6 md:mb-0'>
          <h3 className='text-xl font-semibold'>Follow Us</h3>
          <div className='flex space-x-4 mt-4'>
            <FaFacebook className='text-2xl hover:text-white cursor-pointer' />
            <FaInstagram className='text-2xl hover:text-white cursor-pointer' />
            <FaPinterest className='text-2xl hover:text-white cursor-pointer' />
            <FaTwitterSquare className='text-2xl hover:text-white cursor-pointer' />
          </div>
        </div>
      </div>

      {/* bottom section */}
      <div className='mt-8 border-t border-gray-700 pt-6 text-center text-sm'>
        <p>&copy; {new Date().getFullYear()} <span className='text-white'>Hamza Rajput</span>. All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;