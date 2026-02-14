import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import API from "@/utils/API";
import { toast } from "sonner";
import { ShoppingCart } from 'lucide-react';

const Navbar = () => {
  const user=false;


  return (
    <header className="bg-pink-50 fixed w-full z-20 border-b border-pink-200">
      <div className='max-w-7xl mx-auto flex justify-between items-center py-3'>
         {/* {logo section} */}
         <div >
          <img src='/eStore.svg' alt='' className='w-[100px]'/>
         </div>
         {/* {nav section} */}
         <nav className='flex gap-10 justify-between items-center'>
          <ul className='flex gap-7 items-center text-xl font-semibold'>
            <Link to={'/'}><li>Home</li></Link>
            <Link to={'/products'}><li>Products</li></Link>
            {
              user &&   <Link to={'/profile'}><li>Products</li></Link>
            }
          </ul>
          <Link to={'/cart'} className='relative'>
          <ShoppingCart>
            <span className='bg-pink-500 rounded-full absolute text-white -top-3 -right-5 px-2'>0</span>
          </ShoppingCart>
          </Link>
          {
            user? <Button className='bg-pink-600 text-white cursor-'>Logout</Button>:
                  <Button className='bg-gradient-to-tl from-blue-600 to-purple-600 text-white cursor-'>Login</Button>
          }
         </nav>
      </div>
    </header>
  );
};

export default Navbar;
