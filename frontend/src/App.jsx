import React from 'react'
import { Button } from "@/components/ui/button";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Verify from './pages/Verify';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ChangePassword from './pages/ChangePassword';
import VerifyEmail from './pages/VerifyEmail';
import Footer from './components/Footer';
import Profile from './pages/Profile';
import Products from './pages/Product';
import Cart from './pages/Cart';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AdminSales from './pages/admin/AdminSales';
import AdminProduct from './pages/admin/AdminProduct';
import AdminOrders from './pages/admin/AdminOrders';
import UserInfo from './pages/admin/UserInfo';
import showuserOrders from './pages/admin/showuserOrders';
import ProtectedRoute from './components/ProtectedRoute';
import SingleProduct from './pages/SingleProduct';
const router = createBrowserRouter([
  {
    path: '/',
    element: <><Navbar /><LandingPage /><Footer /></>
  },
  {
    path: '/signup',
    element: <><Signup /></>
  },
  {
    path: '/login',
    element: <><Login /></>
  },
  {
    path: '/verify',
    element: <><Verify /></>
  },
  {
    path: '/verify/:token',
    element: <><VerifyEmail /></>
  },
  {
    path: '/forgot-password',
    element: <><ForgotPassword /></>
  },
  {
    path: '/verify-otp/:email',
    element: <><VerifyOTP /></>
  },
  {
    path: '/change-password/:email',
    element: <><ChangePassword /></>
  },
  {
    path: '/profile/:userId',
    element: <ProtectedRoute><Navbar /><Profile /><Footer /></ProtectedRoute>
  },
  {
    path: '/products',
    element: <ProtectedRoute><Navbar /><Products /><Footer /></ProtectedRoute>
  },
  {
    path: '/products/:id',
    element: <><Navbar /><SingleProduct /></>

  },
  {
    path: '/cart',
    element: <ProtectedRoute><Navbar /><Cart /><Footer /></ProtectedRoute>
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute adminOnly={true}><Navbar></Navbar><Dashboard /></ProtectedRoute>,
    children: [
      {
        path: "sales",
        element: <AdminSales />
      },
      {
        path: "add-product",
        element: <AdminProduct />
      },
      {
        path: "products",
        element: <AdminProduct />
      },
      {
        path: "orders",
        element: <AdminOrders />
      },
      {
        path: "user/order/:userId",
        element: <showUserOrder />
      },
    ]
  }
])
const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
