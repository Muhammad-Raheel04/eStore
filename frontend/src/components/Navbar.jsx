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
          <span className="font-bold text-xl text-pink-600 inline-block tracking-widest hover:tracking-normal transition-all duration-500">
            <i>Hamza Rajput</i>
          </span>

        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="hover:text-pink-600 transition">Home</Link>
          <Link to="/products" className="hover:text-pink-600 transition">Products</Link>
          {user && <Link to={`/profile/${user._id}`} className="hover:text-pink-600 transition">Hello, {user.firstName}</Link>}
          {admin && <Link to="/dashboard/sales" className="hover:text-pink-600 transition">Dashboard</Link>}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <Link to="/cart" className="relative hover:text-pink-600 transition">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-pink-600 text-white text-xs font-bold rounded-full px-2 py-0.5">{cartCount}</span>
            )}
          </Link>

          {/* Login / Logout */}
          {user ? (
            <Button
              onClick={logoutHandler}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md transition"
            >
              Logout
            </Button>
          ) : (
            <Link to="/login">
              <Button className="bg-gradient-to-tr from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md hover:opacity-90 transition">
                Login
              </Button>
            </Link>
          )}

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
      <div className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}>

        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-pink-600">Menu</h2>
          <button onClick={() => setIsMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col p-6 gap-6 text-lg font-medium">

          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="hover:text-pink-600 transition"
          >
            Home
          </Link>

          <Link
            to="/products"
            onClick={() => setIsMenuOpen(false)}
            className="hover:text-pink-600 transition"
          >
            Products
          </Link>

          <Link
            to="/cart"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-between hover:text-pink-600 transition"
          >
            Cart
            {cartCount > 0 && (
              <span className="bg-pink-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {cartCount}
              </span>
            )}
          </Link>

          {user && (
            <Link
              to={`/profile/${user._id}`}
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-pink-600 transition"
            >
              Hello, {user.firstName}
            </Link>
          )}

          {admin && (
            <Link
              to="/dashboard/sales"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-pink-600 transition"
            >
              Dashboard
            </Link>
          )}

          <div className="mt-6">
            {user ? (
              <Button
                onClick={() => { logoutHandler(); setIsMenuOpen(false); }}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg"
              >
                Logout
              </Button>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white py-3 rounded-lg">
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