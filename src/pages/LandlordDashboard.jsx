import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Home, 
  Eye, 
  MapPin, 
  Edit, 
  MoreVertical, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Building,
  Users,
  Calendar,
  Settings,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { db, auth } from "@/config/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getAllPGs, updatePGStatus } from '../utils/api';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    live: { 
      label: 'Live', 
      className: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle 
    },
    pending: { 
      label: 'Pending', 
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Clock 
    },
    sold: { 
      label: 'Sold Out', 
      className: 'bg-red-100 text-red-800 border-red-200',
      icon: DollarSign 
    },
    rejected: {
      label: 'Rejected',
      className: 'bg-red-100 text-red-700 border-red-200',
      icon: Clock
    }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${config.className}`}>
      <Icon size={12} />
      {config.label}
    </span>
  );
};

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600", 
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600"
  };

  return (
    <div className="bg-white rounded-xl shadow-soft-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon: Icon, label, onClick, variant = 'secondary' }) => {
  const baseClasses = "inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    success: "bg-green-100 text-green-700 hover:bg-green-200",
    danger: "bg-red-100 text-red-700 hover:bg-red-200"
  };
  
  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
};

const EmptyState = ({ onAddPG }) => (
  <div className="text-center py-16">
    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
      <Building className="w-10 h-10 text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">No PG listings found</h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">
      You haven't submitted any PG listings yet. Get started by posting your first PG - it only takes a few minutes!
    </p>
    <div className="space-y-4">
      <button 
        onClick={onAddPG}
        className="btn-primary inline-flex items-center gap-2"
      >
        <Plus size={20} />
        Post Your First PG
      </button>
      <p className="text-sm text-gray-500">
        Once submitted, your PG will appear here with status updates
      </p>
    </div>
  </div>
);

export default function LandlordDashboard() {
  const navigate = useNavigate();
  const [pgData, setPgData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [landlordName, setLandlordName] = useState("");

  const fetchLandlordName = async () => {
    // Get landlord ID from localStorage
    const landlordData = JSON.parse(localStorage.getItem('landlordData') || '{}');
    const landlordId = landlordData.id;
    if (!landlordId) return;
    try {
      const docRef = doc(db, "landlords", landlordId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlordName(docSnap.data().name || "");
      }
    } catch {}
  };

  useEffect(() => {
    fetchDashboardData();
    fetchLandlordName();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get landlord ID from localStorage
      const landlordData = JSON.parse(localStorage.getItem('landlordData') || '{}');
      const landlordEmail = landlordData.email || localStorage.getItem('landlordEmail');
      
      if (!landlordEmail) {
        throw new Error('No landlord information found. Please submit a PG first or log in.');
      }

      // Fetch all PGs and filter by landlord email
      const response = await getAllPGs({ includeAll: true });
      
      if (response.data?.success && response.data?.data) {
        const landlordPGs = response.data.data
          .filter(pg => pg.landlordId && landlordData.id && pg.landlordId === landlordData.id)
          .map(pg => ({
            id: pg.id,
            title: pg.name || pg.title,
            location: typeof pg.location === 'object' 
              ? `${pg.location.locality || ''}, ${pg.location.area || ''}`.trim()
              : pg.location || pg.area,
            status: pg.status === 'approved' ? 'live' : pg.status, // Convert approved to live
            price: pg.price || pg.monthlyRent,
            rooms: pg.totalRooms || 0,
            occupied: pg.totalRooms ? (pg.totalRooms - pg.availableRooms) : 0,
            datePosted: pg.submittedAt || pg.createdAt,
            views: pg.views || 0,
            image: pg.images?.[0] || "/pgs/green-1.jpg", // Default image
            featured: pg.featured || false,
            type: pg.type || pg.roomType,
            availableRooms: pg.availableRooms,
            pgCode: pg.pgCode || ''
          }));
        
        setPgData(landlordPGs);
        
        // If no PGs found but landlord exists, show empty state
        if (landlordPGs.length === 0) {
          console.log('No PGs found for landlord email:', landlordEmail);
        }
      } else {
        throw new Error('Failed to fetch PG data');
      }
    } catch (err) {
      console.warn('Failed to fetch dashboard data:', err.message);
      setPgData([]);
      setError(`Unable to load your PGs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchDashboardData();
  };

  // Calculate stats from current data
  const stats = {
  total: pgData.length,
  live: pgData.filter(pg => pg.status === 'live').length,
  pending: pgData.filter(pg => pg.status === 'pending').length,
  sold: pgData.filter(pg => pg.status === 'sold').length,
  rejected: pgData.filter(pg => pg.status === 'rejected').length,
  featured: pgData.filter(pg => pg.featured).length,
  };

  // Filter PGs based on search and status
  const filteredPGs = pgData.filter(pg => {
  const matchesSearch = pg.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             pg.location?.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesStatus = statusFilter === 'all' || pg.status === statusFilter;
  return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
            <div className="bg-gray-300 rounded-xl h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleAddPG = () => {
    // Navigate to add PG page
    navigate('/post-pg');
  };

  const handleEdit = (pgId) => {
    // Navigate to edit PG page (if exists) or show edit modal
    console.log('Edit PG:', pgId);
    // For now, show an alert with edit functionality
    alert(`Edit functionality for PG ${pgId} will be implemented. For now, please post a new PG if you need to make changes.`);
  };

  const handleMarkSold = async (pgId) => {
    try {
      await updatePGStatus(pgId, { status: 'sold' });
      alert('PG marked as sold successfully!');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error marking PG as sold:', error);
      alert('Failed to update PG status. Please try again.');
    }
  };

  const handleViewDetails = (pgId) => {
    // Navigate to PG details page
    navigate(`/pg/${pgId}`);
  };

  return (
    <div className="min-h-screen pt-28 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-blue-700">Welcome, {landlordName || 'Landlord'}!</h1>
              <p className="text-sm text-gray-600">Manage your property listings</p>
            </div>
            {/* Logout button top right */}
            <button
              onClick={async () => {
                if (window.confirm('Are you sure you want to logout?')) {
                  try {
                    await signOut(auth);
                  } catch {}
                  localStorage.removeItem('landlordData');
                  localStorage.removeItem('landlordLoggedIn');
                  localStorage.removeItem('landlordEmail');
                  window.location.href = '/';
                }
              }}
              className="bg-red-50 hover:bg-red-100 text-red-700 font-semibold px-5 py-2 rounded-full shadow transition-all text-base"
              style={{ marginLeft: 'auto' }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Total Properties" 
            value={stats.total} 
            icon={Building} 
            color="blue"
          />
          <StatsCard 
            title="Live Listings" 
            value={stats.live} 
            icon={CheckCircle} 
            color="green"
          />
          <StatsCard 
            title="Pending Review" 
            value={stats.pending} 
            icon={Clock} 
            color="yellow"
          />
          <StatsCard 
            title="Sold Out" 
            value={stats.sold} 
            icon={DollarSign} 
            color="red"
          />
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-soft-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search your properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="live">Live</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold Out</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Add New PG Button */}
            <div className="flex gap-3">
              <button 
                onClick={handleRetry}
                className="btn-secondary inline-flex items-center gap-2 whitespace-nowrap"
                disabled={loading}
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
              <button 
                onClick={handleAddPG}
                className="btn-primary inline-flex items-center gap-2 whitespace-nowrap"
              >
                <Plus size={20} />
                Add New PG
              </button>
            </div>
          </div>
        </div>

        {/* Listings Table */}
        {filteredPGs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-soft-lg">
            <EmptyState onAddPG={handleAddPG} />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-soft-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PG Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPGs.map((pg) => (
                    <tr key={pg.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            className="h-12 w-12 rounded-lg object-cover" 
                            src={pg.image} 
                            alt={pg.title}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {pg.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              Posted {new Date(pg.datePosted).toLocaleDateString('en-GB')}
                            </div>
                            {pg.status === 'rejected' && (
                              <div className="mt-1 text-xs text-red-600 font-semibold">This PG was rejected by admin.</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 font-bold">
                        {pg.pgCode ? pg.pgCode : <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <MapPin size={16} className="mr-1 text-gray-400" />
                          {pg.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={pg.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{pg.price.toLocaleString()}/month
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Eye size={16} className="mr-1 text-gray-400" />
                          {pg.views}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <ActionButton
                            icon={Eye}
                            label="View"
                            onClick={() => handleViewDetails(pg.id)}
                            variant="secondary"
                          />
                          {/* Mark Sold button temporarily removed */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
