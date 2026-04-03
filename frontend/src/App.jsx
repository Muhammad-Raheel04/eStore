import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Eager — tiny layout components, needed on every page
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy — regular pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Signup = lazy(() => import('./pages/Signup'));
const Login = lazy(() => import('./pages/Login'));
const Verify = lazy(() => import('./pages/Verify'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const VerifyOTP = lazy(() => import('./pages/VerifyOTP'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));
const Profile = lazy(() => import('./pages/Profile'));
const Products = lazy(() => import('./pages/Product'));
const SingleProduct = lazy(() => import('./pages/SingleProduct'));
const Cart = lazy(() => import('./pages/Cart'));
const AddressForm = lazy(() => import('./pages/AddressForm'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));

// Lazy — admin pages (heaviest ones, only admins ever load these)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminSales = lazy(() => import('./pages/admin/AdminSales'));     // recharts 1.1MB lives here
const AdminProduct = lazy(() => import('./pages/admin/AdminProduct'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUser'));
const AddProduct = lazy(() => import('./pages/admin/AddProduct'));
const ShowUserOrders = lazy(() => import('./pages/admin/ShowUserOrders'));

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <span>Loading...</span>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <><Navbar /><LandingPage /><Footer /></>
  },
  { path: '/signup', element: <Signup /> },
  { path: '/login', element: <Login /> },
  { path: '/verify', element: <Verify /> },
  { path: '/verify/:token', element: <VerifyEmail /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/verify-otp/:email', element: <VerifyOTP /> },
  { path: '/change-password/:email', element: <ChangePassword /> },
  {
    path: '/profile/:userId',
    element: <ProtectedRoute><Navbar /><Profile /><Footer /></ProtectedRoute>
  },
  { path: '/products', element: <><Navbar /><Products /><Footer /></> },
  { path: '/products/:id', element: <><Navbar /><SingleProduct /><Footer/></> },
  { path: '/cart', element: <><Navbar /><Cart /><Footer /></> },
  { path: '/address', element: <><Navbar /><AddressForm /><Footer /></> },
  { path: '/order-success', element: <OrderSuccess /> },
  {
    path: '/dashboard',
    element: <ProtectedRoute adminOnly={true}><Navbar /><Dashboard /></ProtectedRoute>,
    children: [
      { path: 'sales', element: <AdminSales /> },
      { path: 'add-product', element: <AddProduct /> },
      { path: 'products', element: <AdminProduct /> },
      { path: 'orders', element: <AdminOrders /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'user/order/:userId', element: <ShowUserOrders /> },
    ]
  }
]);

const App = () => (
  <Suspense fallback={<PageLoader />}>
    <RouterProvider router={router} />
  </Suspense>
);

export default App;