import React from 'react'
import { Button } from "@/components/ui/button";
import Features from './components/Features';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from "./pages/Home";
import Signup from './pages/Signup';
import Login from './pages/Login';
import Verify from './pages/Verify';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ChangePassword from './pages/ChangePassword';
import VerifyEmail from './pages/VerifyEmail';
import Footer from './components/Footer';
import Profile from './pages/Profile';
const router = createBrowserRouter([
  {
    path: '/',
    element: <><Navbar /><Home /><Footer /></>
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
    element: <><Navbar/><Profile /><Footer /></>
  },
])
const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
