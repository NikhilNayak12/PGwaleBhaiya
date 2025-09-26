import React, { useState, useEffect } from "react";
import { getAllPGs } from "@/utils/api";

export default function SimpleListings() {
  const [pgs, setPGs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Simple Listings: Fetching data...');
        const response = await getAllPGs({ status: 'approved' });
        console.log('Simple Listings: Response:', response);
        
        const data = response.data?.data || [];
        console.log('Simple Listings: Setting data:', data);
        setPGs(data);
      } catch (error) {
        console.error('Simple Listings: Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8 pt-32 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Simple PG Listings</h1>
        
        <div className="mb-4 p-4 bg-yellow-100 rounded">
          <p>Found {pgs.length} PGs</p>
        </div>

        {pgs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No PGs found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pgs.map((pg) => (
              <div key={pg.id} className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold">{pg.name || pg.title}</h2>
                <p className="text-gray-600">ID: {pg.id}</p>
                <p className="text-gray-600">Price: ₹{pg.price || pg.monthlyRent}</p>
                <p className="text-gray-600">Type: {pg.type || pg.roomType}</p>
                <p className="text-gray-600">Status: {pg.status}</p>
                <p className="text-gray-600">Location: {JSON.stringify(pg.location)}</p>
                
                <div className="mt-4">
                  <a
                    href={`/pg/${pg.id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
