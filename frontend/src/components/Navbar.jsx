import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import API from "@/utils/API";
import { toast } from "sonner";
import { ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/userSlice';
const Navbar = () => {
  const { user } = useSelector(store => store.user)
  const accessToken = localStorage.getItem('accessToken');
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
      }
    } catch (error) {
        console.log("Logout error:", error);
        if (error.response?.data?.message === "Access token has expired") {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          dispatch(setUser(null));
          toast.success("Logged out successfully due to expired session.");
        } else {
          toast.error(error.response?.data?.message || "Logout failed");
        }
      }
  };

  return (
    <header className="bg-pink-50 fixed w-full z-20 border-b border-pink-200">
      <div className='max-w-7xl mx-auto flex justify-between items-center py-3'>
        {/* {logo section} */}
        <div >
          <img src='/eStore.svg' alt='' className='w-[100px]' />
        </div>
        {/* {nav section} */}
        <nav className='flex gap-10 justify-between items-center'>
          <ul className='flex gap-7 items-center text-xl font-semibold'>
            <Link to={'/'}><li>Home</li></Link>
            <Link to={'/products'}><li>Products</li></Link>
            {
              user && <Link to={`/profile/${user._id}`}><li>Hello, {user.firstName}</li></Link>
            }
          </ul>
          <Link to={'/cart'} className='relative'>
            <ShoppingCart>
              <span className='bg-pink-500 rounded-full absolute text-white -top-3 -right-5 px-2'>0</span>
            </ShoppingCart>
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
      </div>
    </header>
  );
};

export default Navbar;
