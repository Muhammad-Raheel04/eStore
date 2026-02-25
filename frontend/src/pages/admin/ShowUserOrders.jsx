import React, { useEffect, useState } from 'react';
import API from '@/utils/API'; // your axios instance or fetch wrapper
import { toast } from 'sonner';

const ShowUserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await API.get('/orders'); // GET all orders
        setOrders(response.data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Handle status change
  const handleStatusChange = async (orderId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'paid' : 'pending';
    try {
      await API.put(`/orders/${orderId}`, { status: newStatus });
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update order status');
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr>
              <th className="border p-2">Order ID</th>
              <th className="border p-2">User ID</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td className="border p-2">{order._id}</td>
                <td className="border p-2">{order.userId}</td>
                <td className="border p-2">{order.status}</td>
                <td className="border p-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    onClick={() => handleStatusChange(order._id, order.status)}
                  >
                    {order.status === 'pending' ? 'Mark as Paid' : 'Mark as Pending'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShowUserOrders;