import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const initial = user?.email?.charAt(0)?.toUpperCase() || 'U';
  const role = user?.role || 'employee';

  return (
    <header className="navbar">
      <div className="navbar-title">
        Welcome, {user?.email?.split('@')[0] || 'User'}
      </div>
      <div className="navbar-right">
        <span className={`badge badge-${role}`}>{role}</span>
        <div className="navbar-avatar">{initial}</div>
      </div>
    </header>
  );
};

export default Navbar;
