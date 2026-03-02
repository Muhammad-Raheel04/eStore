import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/redux/userSlice';
import API from '@/utils/API';
import { toast } from "sonner";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector(state => state.user);
  const { cart } = useSelector(state => state.product);
  const admin = user?.role === 'admin';
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <span className="text-xl text-black inline-block tracking-widest hover:tracking-normal transition-all duration-500">
           Hamza Rajput
          </span>

        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="hover:text-gray-500 transition">Home</Link>
          <Link to="/products" className="hover:text-gray-500 transition">Products</Link>
          {user ?
            <Link to={`/profile/${user._id}`} className="hover:text-gray-500 transition">Hello, {user.firstName}</Link> : <Link className="hover:text-gray-500 transition">Hello, Guest</Link>
          }
          {admin && <Link to="/dashboard/sales" className="hover:text-gray-500 transition">Dashboard</Link>}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <Link to="/cart" className="relative hover:text-gray-500 transition">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-black text-white text-xs font-bold rounded-full px-2 py-0.5">{cartCount}</span>
            )}
          </Link>

          {/* Login / Logout */}
          <div className="hidden md:flex items-center">
          {user ? (
            <Button
              onClick={logoutHandler}
              className="bg-white hover:bg-black hover:text-white text-black border-1 border-black px-4 py-2  transition"
            >
              Logout
            </Button>
          ) : (
            <Link to="/login">
              <Button className="bg-white hover:bg-black hover:text-white text-black border-1 border-black px-4 py-2  transition">
                Login
              </Button>
            </Link>
          )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div className={`fixed top-0 right-0 h-90 border-l-1 border-b-1 border-black w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}>

        <div className="flex justify-between items-center border-b border-white p-4 border-b">
          <h2 className="text-lg  text-black">Menu</h2>
          <button onClick={() => setIsMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col p-6 gap-6 ">

          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="hover:text-gray-500 pb-2 border-b border-black transition"
          >
            Home
          </Link>
          
          <Link
            to="/products"
            onClick={() => setIsMenuOpen(false)}
            className="hover:text-gray-500 pb-2 border-b border-black transition"
          >
            Products
          </Link>

          <Link
            to="/cart"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center pb-2 border-b border-black justify-between hover:text-gray-500 transition"
          >
            Cart
            {cartCount > 0 && (
              <span className="bg-black text-white text-xs font-bold rounded-full px-2 py-0.5">
                {cartCount}
              </span>
            )}
          </Link>

          {user && (
            <Link
              to={`/profile/${user._id}`}
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-gray-500 transition"
            >
              Hello, {user.firstName}
            </Link>
          )}

          {admin && (
            <Link
              to="/dashboard/sales"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-gray-500 transition"
            >
              Dashboard
            </Link>
          )}

          <div className="mt-6">
            {user ? (
              <Button
                onClick={() => { logoutHandler(); setIsMenuOpen(false); }}
                className="w-full bg-white hover:bg-pink-700 text-white py-3 "
              >
                Logout
              </Button>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-white text-black border-1 border-black hover:bg-black hover:text-white py-3 ">
                  Login
                </Button>
              </Link>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;