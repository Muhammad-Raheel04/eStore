import Sidebar from '@/components/Sidebar';
import React from 'react';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 bg-gray-100 min-h-screen p-10 pt-24">
       <Outlet/>
      </div>
    </div>
  );
};

export default Dashboard;