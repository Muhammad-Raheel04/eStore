import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import API from '@/utils/API';
import { toast } from "sonner";
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/userSlice';
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector(store => store.user);
  const { cart } = useSelector(store => store.product);
  const accessToken = localStorage.getItem('accessToken');
  const admin = user?.role === 'admin' ? true : false;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error("You are not logged in");
      return;
    }

    try {
      const res = await API.post('/user/logout', {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

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
        toast.success("Logged out successfully due to expired session.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Logout failed");
      }
    }
  };

  return (
    <header className="bg-pink-100 fixed w-full z-20 border-b border-pink-200 px-4">
      <div className='max-w-7xl mx-auto flex justify-between items-center py-3'>
        <div className='flex items-center gap-4'>
          <img src='/ehamza.jpg' alt='' className='w-[50px] h-[50px] rounded-full object-fill shadow-md' />
        </div>
        {/* Hamburger menu for mobile */}
        <div className="md:hidden flex items-center gap-4">
          {user && <span className='text-gray-800 text-lg font-semibold'>Hello, {user.firstName}</span>}
          <Link to={'/cart'} className='relative'>
            <div className='relative'>
              <ShoppingCart className='w-6 h-6' />
              {cart?.items?.length > 0 && (
                <span className='absolute -top-2 -right-3 bg-pink-500 text-white text-xs rounded-full px-2 py-0.5'>
                  {cart.items.length}
                </span>
              )}
            </div>
          </Link>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 focus:outline-none">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {/* {nav section for desktop} */}
        <nav className='hidden md:flex gap-10 justify-between items-center'>
          <ul className='flex gap-7 items-center text-xl font-semibold'>
            <Link to={'/'}><li>Home</li></Link>
            <Link to={'/products'}><li>Products</li></Link>
            {
              user && <Link to={`/profile/${user._id}`}><li>Hello, {user.firstName}</li></Link>
            }
            {
              admin && <Link to={`/dashboard/sales`}><li>Dashboard</li></Link>
            }
          </ul>
          <Link to={'/cart'} className='relative'>
            <div className='relative'>
              <ShoppingCart className='w-6 h-6' />
              {cart?.items?.length > 0 && (
                <span className='absolute -top-2 -right-3 bg-pink-500 text-white text-xs rounded-full px-2 py-0.5'>
                  {cart.items.length}
                </span>
              )}
            </div>
          </Link>

          {
            user ? <Button onClick={logoutHandler} className='bg-pink-600 text-white cursor-pointer'>Logout</Button> :
              <Link to="/login">
                <Button className='bg-gradient-to-tl from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md hover:opacity-90'>
                  Login
                </Button>
              </Link>
          }
        </nav>
        {/* Mobile Menu */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-pink-100 shadow-lg transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <ul className='flex flex-col items-center py-4 text-xl font-semibold'>
            <Link to={'/'} onClick={() => setIsMenuOpen(false)} className='py-2'><li>Home</li></Link>
            <Link to={'/products'} onClick={() => setIsMenuOpen(false)} className='py-2'><li>Products</li></Link>
            <li className='py-2'>
              {
                user ? <Button onClick={() => { logoutHandler(); setIsMenuOpen(false); }} className='bg-pink-600 text-white cursor-pointer'>Logout</Button> :
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button className='bg-gradient-to-tl from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md hover:opacity-90'>
                      Login
                    </Button>
                  </Link>
              }
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
