import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, IndianRupee, Users, Search } from "lucide-react";

export default function Hero() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    area: '',
    rent: '',
    sharing: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Build URL search parameters based on form data
    const searchParams = new URLSearchParams();
    
    if (formData.area.trim()) {
      // Normalize common location terms
      let locationValue = formData.area.trim();
      if (locationValue.toLowerCase().includes('law gate')) {
        locationValue = 'Law Gate';
      } else if (locationValue.toLowerCase().includes('phagwara')) {
        locationValue = 'Phagwara';
      } else if (locationValue.toLowerCase().includes('deep nagar')) {
        locationValue = 'Deep Nagar';
      }
      searchParams.set('location', locationValue);
    }
    
    if (formData.rent && formData.rent !== 'Select range') {
      // Parse rent range and set min/max prices
      switch (formData.rent) {
        case '₹0 - ₹5,000':
          searchParams.set('minPrice', '0');
          searchParams.set('maxPrice', '5000');
          break;
        case '₹5,001 - ₹8,000':
          searchParams.set('minPrice', '5001');
          searchParams.set('maxPrice', '8000');
          break;
        case '₹8,001 - ₹12,000':
          searchParams.set('minPrice', '8001');
          searchParams.set('maxPrice', '12000');
          break;
      }
    }
    
    if (formData.sharing && formData.sharing !== 'Any') {
      searchParams.set('roomType', formData.sharing);
    }
    
    // Navigate to listings page with search parameters
    navigate(`/listings?${searchParams.toString()}`);
  };
  return (
    <section
      className="relative flex items-center justify-center h-[680px] bg-cover bg-center"
      style={{ backgroundImage: `url('/hero-bg-webp.webp')` }}
    >
      {/* overlay (use hero-overlay class from index.css for nicer gradient) */}
      <div className="absolute inset-0 hero-overlay"></div>

      {/* content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center text-white">
        {/* Heading */}
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight drop-shadow-2xl" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7), 0px 0px 16px rgba(0,0,0,0.5)'}}>
          Find Your Perfect <br />
          <span className="text-[var(--accent)]" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.6), 0px 0px 16px rgba(0,0,0,0.6)'}}>Stay Near LPU</span>
        </h1>

        <p className="mt-4 text-lg text-sky-100 max-w-2xl mx-auto">
          Discover verified PGs and rooms in Law Gate area. Quick, easy, and trusted by thousands of students.
        </p>

        {/* Search card */}
        <div className="mt-8 max-w-4xl mx-auto relative">
          <div className="bg-white rounded-xl p-6 shadow-soft-lg card-floating text-gray-800">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* Area */}
              <div>
                <label htmlFor="area" className="text-xs font-medium text-gray-600 flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  Area
                </label>
                <input
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Law Gate, Phagwara"
                />
              </div>

              {/* Rent */}
              <div>
                <label htmlFor="rent" className="text-xs font-medium text-gray-600 flex items-center gap-2">
                  <IndianRupee size={16} className="text-gray-400" />
                  Rent Range
                </label>
                <select
                  id="rent"
                  name="rent"
                  value={formData.rent}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option>Select range</option>
                  <option>₹0 - ₹5,000</option>
                  <option>₹5,001 - ₹8,000</option>
                  <option>₹8,001 - ₹12,000</option>
                </select>
              </div>

              {/* Sharing */}
              <div>
                <label htmlFor="sharing" className="text-xs font-medium text-gray-600 flex items-center gap-2">
                  <Users size={16} className="text-gray-400" />
                  Sharing
                </label>
                <select
                  id="sharing"
                  name="sharing"
                  value={formData.sharing}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option>Any</option>
                  <option>Single</option>
                  <option>Double</option>
                  <option>Triple</option>
                </select>
              </div>

              {/* Search button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full btn-primary btn-press flex items-center justify-center gap-2"
                >
                  <Search size={16} /> <span className="text-lg font-semibold">Search</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
