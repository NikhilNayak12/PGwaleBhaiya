import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [landlordLoggedIn, setLandlordLoggedIn] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [landlordData, setLandlordData] = useState(null);
  
  // Check login status on component mount and location change
  useEffect(() => {
    const checkLoginStatus = () => {
      const landlordDataStr = localStorage.getItem('landlordData');
      const adminData = localStorage.getItem('adminAuthenticated');
      setLandlordLoggedIn(!!landlordDataStr);
      setAdminLoggedIn(!!adminData);
      if (landlordDataStr) {
        setLandlordData(JSON.parse(landlordDataStr));
      } else {
        setLandlordData(null);
      }
    };
    checkLoginStatus();
    window.addEventListener('landlord-login', checkLoginStatus);
    return () => window.removeEventListener('landlord-login', checkLoginStatus);
  }, [location.pathname]);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('landlordData');
      localStorage.removeItem('landlordLoggedIn');
      localStorage.removeItem('landlordEmail');
      setLandlordLoggedIn(false);
      setLandlordData(null);
      window.location.href = '/';
    }
  };
  
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Listings", path: "/listings" },
    { name: "About", path: "/about" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact", path: "/contact" }
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path;
  };

  // Define baseClasses at component level to avoid scope issues
  const baseClasses = "relative px-4 py-2 rounded-full transition-all duration-300 ease-in-out hover:scale-105";

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] bg-white/30 backdrop-blur-lg rounded-full shadow-lg z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/image.png" 
              alt="PG wale Bhaiya" 
              className="h-16 w-auto object-cover object-center"
              style={{ marginTop: '-4px', marginBottom: '-4px' }}
            />
            <div className="text-xl font-bold text-gray-800">PG wale Bhaiya</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 text-sm">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const activeClasses = active 
                ? "bg-blue-100/80 text-blue-700 font-semibold shadow-sm" 
                : "text-slate-700 hover:bg-white/50 hover:text-blue-600";
              return item.path.startsWith('#') ? (
                <a
                  key={item.name}
                  className={`${baseClasses} ${activeClasses}`}
                  href={item.path}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`${baseClasses} ${activeClasses}`}
                >
                  {item.name}
                </Link>
              )
            })}
            {/* Dashboard Button for logged-in landlord */}
            {landlordLoggedIn && landlordData && (
              <Link
                to="/landlord-dashboard"
                className="bg-green-600/90 hover:bg-green-700 text-white px-6 py-2 rounded-full transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Hamburger for mobile */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
  <div className="md:hidden absolute left-0 w-full bg-white rounded-b-2xl shadow-lg z-50 animate-fade-in" style={{ top: '4.5rem', position: 'absolute' }}>
          <nav className="flex flex-col items-center py-4 space-y-2 text-base">
            {navItems.map((item) => (
              item.path.startsWith('#') ? (
                <a
                  key={item.name}
                  className="w-full px-6 py-3 text-center text-slate-700 hover:bg-blue-50 rounded-lg"
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className="w-full px-6 py-3 text-center text-slate-700 hover:bg-blue-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            ))}
            {landlordLoggedIn && landlordData && (
              <Link
                to="/landlord-dashboard"
                className="w-full px-6 py-3 text-center bg-green-600/90 hover:bg-green-700 text-white rounded-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
