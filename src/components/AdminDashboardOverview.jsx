import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BuildingOfficeIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { getAllPGs, updatePGStatus } from '../utils/api';

const AdminDashboardOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    { title: 'Total PGs', value: 0, icon: BuildingOfficeIcon, color: 'blue' },
    { title: 'Pending PGs', value: 0, icon: ClockIcon, color: 'yellow' },
    { title: 'Approved PGs', value: 0, icon: CheckCircleIcon, color: 'green' },
    { title: 'Sold PGs', value: 0, icon: XCircleIcon, color: 'red' },
  ]);

  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getAllPGs({ status: 'all' });
      
      if (response.data?.success && response.data?.data) {
        const allPGs = response.data.data;
        
        // Calculate stats
        const totalPGs = allPGs.length;
        const pendingPGs = allPGs.filter(pg => pg.status === 'pending').length;
        const approvedPGs = allPGs.filter(pg => pg.status === 'approved').length;
        const soldPGs = allPGs.filter(pg => pg.status === 'sold').length;

        setStats([
          { title: 'Total PGs', value: totalPGs, icon: BuildingOfficeIcon, color: 'blue' },
          { title: 'Pending PGs', value: pendingPGs, icon: ClockIcon, color: 'yellow' },
          { title: 'Approved PGs', value: approvedPGs, icon: CheckCircleIcon, color: 'green' },
          { title: 'Sold PGs', value: soldPGs, icon: XCircleIcon, color: 'red' },
        ]);

        // Get recent submissions (latest 5) with safe date handling
        const recent = allPGs
          .sort((a, b) => {
            // Safe date comparison
            const getValidDate = (pg) => {
              try {
                const dateStr = pg.submittedAt || pg.createdAt;
                if (!dateStr) return new Date(0); // Very old date as fallback
                const date = new Date(dateStr);
                return isNaN(date.getTime()) ? new Date(0) : date;
              } catch (error) {
                return new Date(0);
              }
            };
            return getValidDate(b) - getValidDate(a);
          })
          .slice(0, 5)
          .map(pg => ({
            id: pg.id || pg._id,
            pgName: pg.name || pg.title,
            landlord: pg.contact?.name || pg.contactPerson || 'Unknown',
            status: pg.status || 'pending'
          }));

        setRecentSubmissions(recent);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      console.log('Approving PG with ID:', id);
      const response = await updatePGStatus(id, { status: 'approved' });
      console.log('Approval response:', response);
      
      // Refresh data after approval
      await fetchDashboardData();
      alert('✅ PG approved successfully!');
    } catch (error) {
      console.error('Failed to approve PG:', error);
      alert('❌ Failed to approve PG. Please try again.');
    }
  };

  const handleReject = async (id) => {
    try {
      console.log('Rejecting PG with ID:', id);
      const response = await updatePGStatus(id, { status: 'rejected' });
      console.log('Rejection response:', response);
      
      // Refresh data after rejection  
      await fetchDashboardData();
      alert('✅ PG rejected successfully!');
    } catch (error) {
      console.error('Failed to reject PG:', error);
      alert('❌ Failed to reject PG. Please try again.');
    }
  };

  const handleViewDetails = (id) => {
    console.log('Navigating to PG details:', id);
    navigate(`/pg/${id}`);
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className='pt-8'>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600">Loading dashboard data...</span>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Submissions Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent PG Submissions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PG Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Landlord
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <p className="text-lg mb-2">🏠 No PG submissions yet</p>
                    <p className="text-sm">PG submissions will appear here once landlords start posting their listings.</p>
                  </td>
                </tr>
              ) : (
                recentSubmissions.map((submission) => (
                <tr key={submission.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {submission.pgName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {submission.landlord}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(submission.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewDetails(submission.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <EyeIcon className="w-6 h-6" />
                      </button>
                      {submission.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(submission.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircleIcon className="w-6 h-6" />
                          </button>
                          <button
                            onClick={() => handleReject(submission.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircleIcon className="w-6 h-6" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardOverview;
