import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getAllPGs, searchPGs } from "@/utils/api";
import PGCard from "@/components/PGCard";
import { Search, Filter, MapPin, Home, IndianRupee, Loader2 } from "lucide-react";

export default function Listings() {
  const location = useLocation();
  const [pgs, setPGs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Helper function to get initial filters from URL params
  const getInitialFilters = () => {
    const searchParams = new URLSearchParams(location.search);
    return {
      search: searchParams.get('search') || '',
      location: searchParams.get('location') || 'All Cities',
      roomType: searchParams.get('roomType') || 'All Types',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || ''
    };
  };

  const [filters, setFilters] = useState(getInitialFilters);
  const [appliedFilters, setAppliedFilters] = useState(getInitialFilters);

  // Fetch PGs data from API
  useEffect(() => {
    const fetchPGs = async () => {
      try {
        setLoading(true);
        
        // Build clean search params - exclude "All" values that would cause empty results
        const searchParams = {
          status: 'approved'
        };

        // Only add filters that are not "All" values
        if (appliedFilters.search && appliedFilters.search.trim()) {
          searchParams.search = appliedFilters.search.trim();
        }

        if (appliedFilters.location && appliedFilters.location !== 'All Cities') {
          searchParams.location = appliedFilters.location;
        }

        if (appliedFilters.roomType && appliedFilters.roomType !== 'All Types') {
          searchParams.roomType = appliedFilters.roomType;
        }

        if (appliedFilters.minPrice) {
          searchParams.minPrice = parseInt(appliedFilters.minPrice);
        }

        if (appliedFilters.maxPrice) {
          searchParams.maxPrice = parseInt(appliedFilters.maxPrice);
        }
        
        const response = await getAllPGs(searchParams);
        setPGs(response.data?.data || []);
        
      } catch (err) {
        console.error('Error fetching PGs:', err);
        setError('Failed to load PG listings. Please try again.');
        setPGs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPGs();
  }, [appliedFilters]);

  // Update filters when URL changes
  useEffect(() => {
    const initialFilters = getInitialFilters();
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  }, [location.search]);

  const locations = ['All Cities', 'Law Gate', 'Phagwara', 'Deep Nagar', 'Green Avenue', 'Model Town', 'Urban Estate', 'Civil Lines', 'Banga Road'];
  const roomTypes = ['All Types', 'Single', 'Double', 'Triple', '1 BHK', '2 BHK', '3 BHK'];

  // Filter function - now we'll let the API handle most filtering
  const applyFiltersToAPI = async () => {
    try {
      setLoading(true);
      
      const searchParams = {
        status: 'approved',
        page: 1,
        limit: 50
      };

      // Add search query
      if (filters.search.trim()) {
        searchParams.search = filters.search.trim();
      }

      // Add location filter - Only add if not "All Cities"
      if (filters.location && filters.location !== 'All Cities') {
        searchParams.location = filters.location;
      }

      // Add room type filter - Only add if not "All Types"
      if (filters.roomType && filters.roomType !== 'All Types') {
        searchParams.roomType = filters.roomType;
      }

      // Add price filters
      if (filters.minPrice) {
        searchParams.minPrice = parseInt(filters.minPrice);
      }
      if (filters.maxPrice) {
        searchParams.maxPrice = parseInt(filters.maxPrice);
      }

      const response = await getAllPGs(searchParams);
      setPGs(response.data.data || []);
      setAppliedFilters(filters);
    } catch (err) {
      console.error('Error searching PGs:', err);
      setError('Failed to search PGs. Please try again.');
      setPGs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = () => {
    applyFiltersToAPI();
  };

  const clearFilters = () => {
    const resetFilters = {
      search: '',
      location: 'All Cities',
      roomType: 'All Types',
      minPrice: '',
      maxPrice: ''
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
    // Also refresh the PGs list
    getAllPGs({ status: 'approved' })
      .then(response => {
        setPGs(response.data.data || []);
      })
      .catch(err => {
        console.error('Error clearing filters:', err);
        setError('Failed to clear filters. Please try again.');
      });
  };

  return (
    <div className="min-h-screen pt-36 pb-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900">All PG Listings</h1>
          <p className="mt-4 text-lg text-gray-600">
            Browse through all available PG accommodations near LPU
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Filter Section */}
        <div className="bg-sky-200 rounded-2xl shadow-lg p-4 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Filter Your Search</h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Bar */}
            <div className="flex-1 min-w-16 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full placeholder-gray-500 bg-sky-100 pl-10 pr-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Location Dropdown */}
            <div className="relative min-w-40">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full bg-sky-100 pl-10 pr-8 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none"
              >
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Room Type Dropdown */}
            <div className="relative min-w-36">
              <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <select
                value={filters.roomType}
                onChange={(e) => handleFilterChange('roomType', e.target.value)}
                className="w-full bg-sky-100 pl-10 pr-8 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none"
              >
                {roomTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Price Range */}
            <div className="flex gap-2">
              <div className="relative w-28">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full placeholder-gray-500 bg-sky-100 pl-8 pr-3 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="relative w-28">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full placeholder-gray-500 bg-sky-100 pl-8 pr-3 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Filter Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={applyFilters}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                {loading ? 'Searching...' : 'Search'}
              </button>
              <button
                onClick={clearFilters}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-400 hover:bg-blue-600 disabled:bg-gray-400 border border-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Loading PG listings...
              </span>
            ) : (
              <>
                Showing <span className="font-semibold">{pgs.length}</span> PG listings
              </>
            )}
          </p>
          
          {/* Active Filters Display */}
          {(appliedFilters.location !== 'All Cities' || appliedFilters.roomType !== 'All Types' || 
            appliedFilters.minPrice || appliedFilters.maxPrice || appliedFilters.search) && (
            <div className="flex flex-wrap gap-2">
              {appliedFilters.search && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Search: {appliedFilters.search}
                </span>
              )}
              {appliedFilters.location !== 'All Cities' && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Location: {appliedFilters.location}
                </span>
              )}
              {appliedFilters.roomType !== 'All Types' && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  Room: {appliedFilters.roomType}
                </span>
              )}
              {(appliedFilters.minPrice || appliedFilters.maxPrice) && (
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  Price: ₹{appliedFilters.minPrice || '0'} - ₹{appliedFilters.maxPrice || '∞'}
                </span>
              )}
            </div>
          )}
        </div>

        {/* PG Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : pgs.length > 0 ? (
            pgs.map((pg) => (
              <PGCard key={pg.id} item={pg} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                {error ? 'Error loading PG listings.' : 'No PGs found matching your criteria.'}
              </p>
              <p className="text-gray-400 mt-2">
                {error ? 'Please try refreshing the page.' : 'Try adjusting your filters to see more results.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
