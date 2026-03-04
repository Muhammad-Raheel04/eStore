import React, { useEffect, useState } from 'react';
import API from '@/utils/API';
import { toast } from 'sonner';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const fetchOrders = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await API.get('/order/all-orders', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Status Cycle: pending → paid → delivered
  const getNextStatus = (current) => {
    const c = (current || '').toLowerCase();
    if (c === 'pending') return 'paid';
    if (c === 'paid') return 'delivered';
    return 'pending';
  };

  const handleStatusChange = async (orderId, currentStatus) => {
    const newStatus = getNextStatus(currentStatus);
    try {
      const accessToken = localStorage.getItem("accessToken");
      await API.put(`/order/${orderId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      // Re-fetch to get accurate data
      fetchOrders();
      toast.success(`Order updated to ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update order status');
    }
  };
  const filteredOrders = orders.filter(order => {
    const email = (order.user?.email || order.guestInfo?.email || '').toLowerCase();
    const orderId = (order.orderId || order._id || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return email.includes(term) || orderId.includes(term);
  });
  if (loading) {
    // Real table skeleton
    return (
      <div className="pl-[350px] py-20 pr-20 mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">User Orders</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-500 text-white">
              <tr>
                <th className="p-3 border-b">Order ID</th>
                <th className="p-3 border-b">User</th>
                <th className="p-3 border-b">Address</th>
                <th className="p-3 border-b">Items</th>
                <th className="p-3 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse border-b">
                  <td className="p-3"><div className="h-4 bg-gray-300 rounded w-20"></div></td>
                  <td className="p-3"><div className="h-4 bg-gray-300 rounded w-28"></div></td>
                  <td className="p-3"><div className="h-4 bg-gray-300 rounded w-32"></div></td>
                  <td className="p-3">
                    <div className="space-y-1">
                      <div className="h-3 bg-gray-300 rounded w-20"></div>
                      <div className="h-3 bg-gray-300 rounded w-16"></div>
                    </div>
                  </td>
                  <td className="p-3"><div className="h-4 bg-gray-300 rounded w-16"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return <div className="pl-[350px] pt-20  h-screen overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-500 text-white">
            <tr>
              <th className="text-left p-1 border-b">Order ID</th>
              <th className="text-left p-1 border-b">User</th>
              <th className="text-left p-1 border-b">Type</th>
              <th className="text-left p-1 border-b">Address</th>
              <th className="text-left p-1 border-b">Items</th>
              <th className="text-left p-1 border-b">Status</th>
            </tr>

          </thead>

          <tbody>
            <tr>
              <td colSpan="6" className="text-center p-2">
                No Orders
              </td>
            </tr>
          </tbody>

        </table>
      </div>
    </div>
  }

  return (
    <div className="pl-[350px] pt-20  h-screen overflow-hidden flex flex-col">
      <h2 className="text-2xl font-bold mb-6">User Orders</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Order ID or Email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600"
        />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-500 text-white">
            <tr>
              <th className="text-left p-1 border-b">Order ID</th>
              <th className="text-left p-1 border-b">User</th>
              <th className="text-left p-1 border-b">Type</th>
              <th className="text-left p-1 border-b">Address</th>
              <th className="text-left p-1 border-b">Items</th>
              <th className="text-left p-1 border-b">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map(order => {
              const os = (order.orderStatus || '').toLowerCase();
              const ps = (order.paymentStatus || '').toLowerCase();
              const status = os === 'delivered' ? 'delivered' : (ps === 'paid' ? 'paid' : 'pending');

              return (
                <tr key={order._id} className="hover:bg-gray-50 align-top">
                  <td className="p-1 border-b font-mono text-sm">{order.orderId || order._id}</td>
                  <td className="p-1 border-b">
                    <p className="font-medium">
                      {order.isGuest ? order.guestInfo?.fullName : `${order.user?.firstName || ''} ${order.user?.lastName || ''}`}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {order.isGuest ? order.guestInfo?.email : order.user?.email}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {order.isGuest ? order.guestInfo?.phone : ''}
                    </p>
                  </td>
                  <td className="p-1 border-b">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${order.isGuest ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {order.isGuest ? 'Guest Order' : 'Registered User'}
                    </span>
                  </td>
                  <td className="p-1 border-b">
                    <p>{order?.shippingAddress?.address}, {order?.shippingAddress?.city}</p>
                    <p>{order?.shippingAddress?.phone}</p>
                    <p>Zip ({order?.shippingAddress?.zip})</p>
                    <p>{order?.shippingAddress?.country}</p>
                  </td>
                  <td className="p-1 border-b">
                    {order.products?.map((item, index) => (
                      <div key={index} className="mb-2">
                        <p className="font-medium">{item.productId?.productName}</p>
                        <p className="text-gray-500 text-sm">
                          Qty: {item.quantity} | Rs {item.productId?.productPrice} | Tax: Rs {(item.productId?.productPrice * item.quantity * 0.05).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </td>
                  <td className="p-1 border-b">
                    <div className="mb-2">
                      <span className={`px-1 py-1 rounded-full text-white text-sm ${status === 'pending' ? 'bg-yellow-500' : status === 'paid' ? 'bg-blue-500' : 'bg-green-500'}`}>
                        {status}
                      </span>
                    </div>
                    <button
                      onClick={() => handleStatusChange(order._id, status)}
                      className="px-1 py-1 rounded-full bg-pink-600 text-white text-sm hover:bg-gray-800"
                    >
                      Change Status
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
