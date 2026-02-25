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
      <div className={`md:hidden bg-white shadow-lg transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <ul className="flex flex-col gap-4 items-center text-lg font-semibold">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-pink-600 transition">Home</Link>
          <Link to="/products" onClick={() => setIsMenuOpen(false)} className="hover:text-pink-600 transition">Products</Link>
          {user && (
            <Link to={`/profile/${user._id}`} onClick={() => setIsMenuOpen(false)} className="hover:text-pink-600 transition">
              Hello, {user.firstName}
            </Link>
          )}
          <li>
            {user ? (
              <Button
                onClick={() => { logoutHandler(); setIsMenuOpen(false); }}
                className="bg-pink-600 text-white px-4 py-2 rounded-md transition"
              >
                Logout
              </Button>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button className="bg-gradient-to-tr from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md hover:opacity-90 transition">
                  Login
                </Button>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;