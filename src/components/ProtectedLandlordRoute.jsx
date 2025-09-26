import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProtectedLandlordRoute({ children }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = () => {
      // Check if landlord is logged in
      const landlordData = localStorage.getItem('landlordData');
      const landlordLoggedIn = localStorage.getItem('landlordLoggedIn');
      
      if (landlordData && landlordLoggedIn === 'true') {
        setIsAuthenticated(true);
      } else {
        // Redirect to login page
        navigate('/login', { 
          state: { 
            returnUrl: window.location.pathname,
            message: 'Please login to access this page'
          }
        });
      }
      setIsLoading(false);
    };

    checkAuthentication();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
}
