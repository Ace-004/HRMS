import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './Dashboard/AdminDashboard';
import HRDashboard from './Dashboard/HRDashboard';
import EmployeeDashboard from './Dashboard/EmployeeDashboard';
import Layout from '../components/Layout';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin': return <AdminDashboard />;
      case 'hr': return <HRDashboard />;
      default: return <EmployeeDashboard />;
    }
  };

  return <Layout>{renderDashboard()}</Layout>;
};

export default Dashboard;
