import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaPinterestP, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] text-gray-400 py-20">
      <div className="max-w-6xl mx-auto px-6">

        <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">

          <div>
            <h2 className="text-white text-lg tracking-[0.3em] uppercase mb-4">
              Hamza Rajput
            </h2>
            <p className="text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Crafted with precision and passion — delivering timeless pieces that elevate everyday style.
            </p>
          </div>

          <div>
            <h3 className="text-white text-sm tracking-[0.25em] uppercase mb-6">
              Contact
            </h3>

            <ul className="space-y-3 text-sm">
              <li className="hover:text-white transition">
                <a href="mailto:hamzaraj541@gmail.com">hamzaraj541@gmail.com</a>
              </li>

              <li>Rajput & Co. Bahria Town Phase 8, RWP</li>

              <li className="pt-4 text-xs tracking-wide text-[#d6eb18]">
                <a
                  href="https://wa.me/923295694485"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition underline underline-offset-4"
                >
                 Contact Devloper
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm tracking-[0.25em] uppercase mb-6">
              Follow
            </h3>

            <div className="flex justify-center md:justify-start gap-5">
              <a href='https://www.facebook.com/share/1APt8mnSDy/'><FaFacebookF className="text-lg hover:text-white transition duration-300 cursor-pointer" /></a>
              <a href="https://www.instagram.com/rajputco?igsh=d2xtazAxYjliZmx0"><FaInstagram className="text-lg hover:text-white transition duration-300 cursor-pointer" ></FaInstagram></a>
              <FaPinterestP className="text-lg hover:text-white transition duration-300 cursor-pointer" />
              <FaTwitter className="text-lg hover:text-white transition duration-300 cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 my-12"></div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs tracking-wide text-gray-500">
          <p>
            &copy; {new Date().getFullYear()}
            <span className="text-white ml-1">Hamza Rajput</span>. All rights reserved.
          </p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/" className="hover:text-white transition">Privacy</Link>
            <Link to="/" className="hover:text-white transition">Terms</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;