import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center">
            <span>🧠</span>
            <span className="ml-2">MindConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-green-300 transition">Home</Link>
            <Link to="/resources" className="hover:text-green-300 transition">Resources</Link>
            <Link to="/about" className="hover:text-green-300 transition">About</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-green-300 transition">Dashboard</Link>
                <Link to="/support" className="hover:text-green-300 transition">Support</Link>
                <div className="flex items-center space-x-4">
                  <span className="text-sm">👋 {user?.fullName}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-gray-100 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-green-300 transition">Login</Link>
                <Link
                  to="/register"
                  className="bg-green-500 px-4 py-2 rounded-full hover:bg-green-600 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-2">
            <Link to="/" className="block py-2 hover:text-green-300">Home</Link>
            <Link to="/resources" className="block py-2 hover:text-green-300">Resources</Link>
            <Link to="/about" className="block py-2 hover:text-green-300">About</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block py-2 hover:text-green-300">Dashboard</Link>
                <Link to="/support" className="block py-2 hover:text-green-300">Support</Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 hover:text-green-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-green-300">Login</Link>
                <Link to="/register" className="block py-2 hover:text-green-300">Register</Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
