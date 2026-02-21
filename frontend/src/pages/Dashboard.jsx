import Sidebar from '@/components/Sidebar';
import AddProduct from '@/pages/admin/AddProduct'; // import your AddProduct page
import React from 'react';

const Dashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 bg-gray-100 min-h-screen p-10">
        <AddProduct />
      </div>
    </div>
  );
};

export default Dashboard;