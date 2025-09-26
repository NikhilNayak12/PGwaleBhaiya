import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllPGs } from "../utils/api";
import PGCard from "./PGCard";

export default function FeaturedGrid() {
  const [featuredPGs, setFeaturedPGs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedPGs = async () => {
      try {
        setLoading(true);
        // Fetch approved PGs for featured section
  const response = await getAllPGs({ status: 'approved', limit: 3 });
        
        if (response.data.success) {
          setFeaturedPGs(response.data.data);
        } else {
          throw new Error(response.data.message || 'Failed to fetch PGs');
        }
      } catch (err) {
        console.error('Error fetching featured PGs:', err);
        setError(err.message);
        // Fallback to demo data if API fails
        setFeaturedPGs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPGs();
  }, []);

  return (
    <section className="mt-24 px-1">
      <div className="text-center">
        <h2 className="text-5xl font-extrabold">Featured PGs Near LPU</h2>
        <p className="mt-6 text-xl text-slate-500">Hand-picked accommodations with verified amenities and quality service</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-10 h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Loading featured PGs...</span>
        </div>
      ) : error ? (
        <div className="text-center mt-10 p-8">
          <div className="text-red-600 mb-4">⚠️ Unable to load featured PGs</div>
          <p className="text-gray-600">{error}</p>
          <Link to="/listings" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            View All Listings
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {featuredPGs.length > 0 ? (
              featuredPGs.map((pg) => (
                <PGCard 
                  key={pg.id} 
                  item={pg} // Pass the raw API data, let PGCard handle the mapping
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 text-lg">No featured PGs available at the moment</div>
                <Link to="/listings" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  View All Listings
                </Link>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <Link to="/listings">
              <button className="px-6 py-2 rounded-lg bg-white font-semibold border border-gray-300 shadow-lg shadow-gray-300 hover:bg-gray-50 transition-colors">
                View All PGs
              </button>
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
