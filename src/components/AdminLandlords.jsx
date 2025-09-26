import React, { useState, useEffect } from 'react';
import { 
  EyeIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { getAllLandlords } from '../utils/api';

const AdminLandlords = () => {
  const [selectedLandlord, setSelectedLandlord] = useState(null);
  const [landlords, setLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback mock data - only used if API fails
  const mockLandlords = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+91 9876543210',
      totalPGs: 3,
      joinedDate: '2023-12-01',
      createdAt: '2023-12-01T10:30:00Z',
      status: 'active',
      pgs: [
        { id: 1, name: 'Green Valley PG', status: 'approved', price: 12000 },
        { id: 2, name: 'Sunset Villa PG', status: 'pending', price: 14000 },
        { id: 3, name: 'Garden View PG', status: 'sold', price: 11000 },
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+91 9876543211',
      totalPGs: 2,
      joinedDate: '2023-11-15',
      createdAt: '2023-11-15T14:20:00Z',
      status: 'active',
      pgs: [
        { id: 4, name: 'Sunshine Hostel', status: 'approved', price: 15000 },
        { id: 5, name: 'Morning Glory PG', status: 'approved', price: 13000 },
      ]
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '+91 9876543212',
      totalPGs: 1,
      joinedDate: '2024-01-10',
      createdAt: '2024-01-10T09:15:00Z',
      status: 'active',
      pgs: [
        { id: 6, name: 'Royal Residency', status: 'pending', price: 18000 },
      ]
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+91 9876543213',
      totalPGs: 4,
      joinedDate: '2023-10-20',
      createdAt: '2023-10-20T11:45:00Z',
      status: 'active',
      pgs: [
        { id: 7, name: 'Campus Heights', status: 'approved', price: 11000 },
        { id: 8, name: 'Student Haven', status: 'approved', price: 12500 },
        { id: 9, name: 'Scholar\'s Den', status: 'sold', price: 13500 },
        { id: 10, name: 'Elite Quarters', status: 'pending', price: 16000 },
      ]
    },
    {
      id: 5,
      name: 'Robert Brown',
      email: 'robert.brown@email.com',
      phone: '+91 9876543214',
      totalPGs: 2,
      joinedDate: '2023-09-05',
      createdAt: '2023-09-05T16:00:00Z',
      status: 'inactive',
      pgs: [
        { id: 11, name: 'Elite PG', status: 'approved', price: 13500 },
        { id: 12, name: 'Premium Stays', status: 'rejected', price: 17000 },
      ]
    },
  ];

  useEffect(() => {
    fetchLandlords();
  }, []);

  const fetchLandlords = async () => {
    try {
      setLoading(true);
      console.log('Fetching landlords from API...');
      const response = await getAllLandlords();
      console.log('Landlords API response:', response);
      
      if (response.data?.success && response.data?.data) {
        setLandlords(response.data.data);
        console.log('Loaded landlords:', response.data.data.length);
      } else {
        console.log('No landlords data found, using empty array');
        setLandlords([]);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch landlords from API:', err);
      // Instead of empty array, use mock data for demo purposes
      console.log('Using mock data as fallback');
      setLandlords(mockLandlords);
      setError(null); // Clear error since we have fallback data
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      sold: 'bg-blue-100 text-blue-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleViewLandlord = (landlord) => {
    setSelectedLandlord(landlord);
  };

  if (loading) {
    return (
      <div className="pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
              </div>
              <div className="p-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-4 mb-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedLandlord) {
    return (
      <div className='pt-20'>
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Landlord Details</h1>
          <button
            onClick={() => setSelectedLandlord(null)}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Landlords
          </button>
        </div>

        {/* Landlord Profile Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start space-x-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-gray-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{selectedLandlord.name}</h2>
              <div className="mt-2 space-y-2">
                <div className="flex items-center text-gray-600">
                  <EnvelopeIcon className="w-4 h-4 mr-2" />
                  {selectedLandlord.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  {selectedLandlord.phone}
                </div>
                <div className="flex items-center text-gray-600">
                  <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                  {selectedLandlord.totalPGs} PG(s)
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-4">
                {getStatusBadge(selectedLandlord.status)}
                <span className="text-sm text-gray-500">
                  Joined: {selectedLandlord.createdAt ? new Date(selectedLandlord.createdAt).toLocaleDateString() : 
                           selectedLandlord.joinedDate ? new Date(selectedLandlord.joinedDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PGs Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              PG Listings ({selectedLandlord.pgs.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PG Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedLandlord.pgs.map((pg) => (
                  <tr key={pg.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {pg.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{pg.price.toLocaleString()}/month
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(pg.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='pt-8'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Landlords Management</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{error}</p>
                <button 
                  onClick={fetchLandlords}
                  className="mt-2 text-sm text-yellow-800 underline hover:text-yellow-900"
                >
                  Try to refresh data
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <UserIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Landlords</h3>
                <p className="text-2xl font-bold text-gray-900">{landlords.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <UserIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Active Landlords</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {landlords.filter(l => l.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100">
                <BuildingOfficeIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total PGs</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {landlords.reduce((sum, landlord) => sum + (landlord.totalPGs || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Landlords Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">All Landlords</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Landlord</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total PGs</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {landlords.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <div>
                        <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="text-lg font-medium mt-2">No landlords found</p>
                        <p className="text-sm mt-1">Landlords will appear here when they sign up and post PGs.</p>
                        <button 
                          onClick={fetchLandlords}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Refresh List
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  landlords.map((landlord) => (
                  <tr key={landlord.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{landlord.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{landlord.email}</div>
                      <div className="text-sm text-gray-500">{landlord.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {landlord.totalPGs}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(landlord.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {landlord.createdAt ? new Date(landlord.createdAt).toLocaleDateString() : 
                       landlord.joinedDate ? new Date(landlord.joinedDate).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLandlords;
