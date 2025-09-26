import React from "react";
import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  const handleStartSearching = () => {
    navigate('/listings');
  };

  const handleListPG = () => {
    navigate('/post-pg');
  };
  return (
    <div className="bg-gradient-to-r from-sky-200 to-blue-200 border rounded-3xl p-12 text-center border-sky-100 shadow-lg shadow-gray-300">
      <h3 className="text-3xl font-extrabold text-gray-800">Ready to find your perfect PG?</h3>
      <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
        Join thousands of satisfied students who found their ideal accommodation with PG wale Bhaiya.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button 
          onClick={handleStartSearching}
          className="px-6 py-3 bg-blue-500 text-white rounded-full text-lg font-semibold shadow-md shadow-blue-300 transform transition-all duration-300 hover:scale-105 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-400"
        >
          Start Searching
        </button>

        <button 
          onClick={handleListPG}
          className="px-6 py-3 border-2 border-blue-500 text-blue-600 bg-white rounded-full text-lg font-semibold shadow-sm transform transition-all duration-300 hover:scale-105 hover:bg-blue-50 hover:border-blue-600"
        >
          List Your PG
        </button>
      </div>
    </div>
  );
}
