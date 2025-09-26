import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Use Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        credentials.email, 
        credentials.password
      );
      const user = userCredential.user;
      // Only allow your account to access admin panel
      const allowedAdminEmail = "hello.pgwalebhaiya@gmail.com"; // <-- set your admin email here
      if (user.email !== allowedAdminEmail) {
        setError("Access denied. Only the owner can log in to the admin panel.");
        setLoading(false);
        return;
      }
      // Get Firebase ID token for API calls
      const token = await user.getIdToken();
      // Store admin authentication state
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminData', JSON.stringify({
        email: user.email,
        uid: user.uid,
        role: 'admin'
      }));
      localStorage.setItem('authToken', token);
      // Navigate to dashboard (updated secret path)
      navigate('/admin-final-boss-1q2w/dashboard');
    } catch (error) {
      console.error('Firebase auth error:', error);
      // Handle different Firebase auth errors
      let errorMessage = 'Invalid credentials. Please try again.';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Admin account not found.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Invalid password.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Admin account has been disabled.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        default:
          errorMessage = 'Login failed. Please try again.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <LockClosedIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in to access the admin panel
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={credentials.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <p>Demo credentials:</p>
            <p>Email: <code className="bg-gray-100 px-1 rounded">hello.pgwalebhaiya@gmail.com</code></p>
            <p>Password: <code className="bg-gray-100 px-1 rounded">pgw@lebh@1y@@)@%</code></p>
          </div>
          
          <div className="text-center">
            <Link 
              to="/" 
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              ← Back to Home Page
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
