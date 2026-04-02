import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, X, User, LayoutDashboard, Home, ShoppingBasket, LogOut, LogIn } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/redux/userSlice';
import API from '@/utils/API';
import { toast } from "sonner";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useSelector(state => state.user);
  const { cart } = useSelector(state => state.product);
  const admin = user?.role === 'admin';
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoutHandler = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return toast.error("You are not logged in");

    try {
      const res = await API.post('/user/logout', {}, { headers: { Authorization: `Bearer ${accessToken}` } });
      if (res.data.success) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        dispatch(setUser(null));
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      if (error.response?.data?.message === "Access token has expired") {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        dispatch(setUser(null));
        toast.success("Logged out due to expired session.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Logout failed");
      }
    }
  };

  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const isHomePage = location.pathname === '/';
  const navbarClasses = `fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
    isHomePage 
      ? isScrolled 
        ? 'bg-white shadow-md py-3' 
        : 'bg-transparent py-5'
      : 'bg-white shadow-md py-3'
  }`;

  const textClasses = isHomePage && !isScrolled ? 'text-white' : 'text-black';

  return (
    <>
      <header className={navbarClasses}>
        <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
          
          <div className="flex-1 flex justify-start">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className={`${textClasses} hover:opacity-70 transition-opacity p-2`}
              aria-label="Open Menu"
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>

          {/* CENTER: Logo / Brand Name */}
          <div className="flex-1 flex justify-center">
            <Link to="/" className="flex items-center">
              <span className={`text-2xl md:text-3xl font-serif tracking-[0.2em] uppercase hover:tracking-normal transition-all duration-700 ${textClasses}`}>
                Hamza Rajput
              </span>
            </Link>
          </div>

          {/* RIGHT: Shopping Bag */}
          <div className="flex-1 flex justify-end">
            <Link to="/cart" className={`relative hover:opacity-70 transition-opacity p-2 ${textClasses}`}>
              <ShoppingBag className="w-7 h-7" />
              {cartCount > 0 && (
                <span className={`absolute top-0 right-0 ${isHomePage && !isScrolled ? 'bg-[#e8d87f] text-black' : 'bg-black text-white'} text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce shadow-sm`}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

        </div>
      </header>

      {/* Slide-in Menu Drawer (Left Side) */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      <div className={`fixed top-0 left-0 h-full w-[320px] bg-white z-[70] shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col ${
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        
        {/* Drawer Header */}
        <div className="flex justify-between items-center p-8 border-b border-gray-100">
          <h2 className="text-xl font-serif tracking-widest uppercase text-black">Menu</h2>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="p-2 hover:rotate-90 transition-transform duration-300"
          >
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        {/* Drawer Links */}
        <nav className="flex-1 flex flex-col p-8 gap-8 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-4 text-lg font-light tracking-widest uppercase hover:text-[#e8d87f] transition group"
          >
            <Home className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
            Home
          </Link>
          
          <Link
            to="/products"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-4 text-lg font-light tracking-widest uppercase hover:text-[#e8d87f] transition group"
          >
            <ShoppingBasket className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
            Products
          </Link>

          {user && (
            <Link
              to={`/profile/${user._id}`}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-4 text-lg font-light tracking-widest uppercase hover:text-[#e8d87f] transition group"
            >
              <User className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
              Profile
            </Link>
          )}

          {admin && (
            <Link
              to="/dashboard/sales"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-4 text-lg font-light tracking-widest uppercase hover:text-[#e8d87f] transition group"
            >
              <LayoutDashboard className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
              Dashboard
            </Link>
          )}
        </nav>

        {/* Drawer Footer: Login/Logout */}
        <div className="p-8 border-t border-gray-100">
          {user ? (
            <button
              onClick={() => { logoutHandler(); setIsMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-3 bg-black text-white py-4 px-6 tracking-[0.2em] uppercase text-sm hover:bg-[#e8d87f] hover:text-black transition duration-300 group shadow-lg"
            >
              <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              Logout
            </button>
          ) : (
            <Link 
              to="/login" 
              onClick={() => setIsMenuOpen(false)}
              className="w-full flex items-center justify-center gap-3 bg-black text-white py-4 px-6 tracking-[0.2em] uppercase text-sm hover:bg-[#e8d87f] hover:text-black transition duration-300 group shadow-lg"
            >
              <LogIn className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;