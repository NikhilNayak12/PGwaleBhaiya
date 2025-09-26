import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminDashboardOverview from '@/components/AdminDashboardOverview';
import AdminPGListings from '@/components/AdminPGListings';
import AdminLandlords from '@/components/AdminLandlords';
import CashbackRequests from '@/components/CashbackRequests';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboardOverview />;
      case 'listings':
        return <AdminPGListings />;
      case 'landlords':
        return <AdminLandlords />;
      case 'cashback':
        return <CashbackRequests />;
      default:
        return <AdminDashboardOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
