// src/components/PGCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Star } from "lucide-react";
import ImageLightbox from "./ImageLightbox";
import CashbackForm from "./CashbackForm";

export default function PGCard({ item }) {
  const [open, setOpen] = useState(false);
  const [lightboxKey, setLightboxKey] = useState(0);
  const [showCashbackForm, setShowCashbackForm] = useState(false);
  
  // Handle both frontend (static) and backend data formats
  const pgData = {
    id: item.id,
    name: item.title || item.name,
    location: item.area || (typeof item.location === 'object' ? item.location.area : item.location) || item.locality || '',
    locality: item.locality || (typeof item.location === 'object' ? item.location.locality : ''),
    distance: item.distance || item.distanceFromLPU || '2.5', // Default distance if not provided
    price: item.price || item.monthlyRent,
    type: item.roomType || item.type,
    tags: item.amenities || item.tags || [],
    images: item.images || (item.img ? [item.img] : [])
  };
  
  // Filter out invalid blob URLs and provide fallback images
  const validImages = pgData.images?.filter(img => 
    img && 
    typeof img === 'string' && 
    !img.startsWith('blob:') && 
    (img.startsWith('http') || img.startsWith('/'))
  ) || [];
  
  // Default fallback images based on PG location/area
  const fallbackImages = ['/pgs/campus-1.jpg', '/pgs/campus-2.jpg', '/pgs/campus-3.jpg'];
  const pgImages = validImages.length > 0 ? validImages : fallbackImages;
  const heroImage = pgImages[0];

  const handleOpenLightbox = () => {
    setLightboxKey(prev => prev + 1); // Force new instance
    setOpen(true);
  };

  const handleCloseLightbox = () => {
    setOpen(false);
  };

  const handleBookedClick = () => {
    setShowCashbackForm(true);
  };

  const handleCloseCashbackForm = () => {
    setShowCashbackForm(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-soft-lg overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative group">
          <button
            type="button"
            onClick={handleOpenLightbox}
            className="w-full block focus:outline-none"
            aria-label={`Open gallery for ${pgData.name}`}
          >
            <img
              src={heroImage}
              alt={pgData.name}
              className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // Fallback to a default image if the current one fails to load
                if (e.target.src !== '/pgs/campus-1.jpg') {
                  e.target.src = '/pgs/campus-1.jpg';
                }
              }}
            />
          </button>

          <div className="absolute left-3 top-3 bg-green-600 text-white px-2 py-1 text-xs rounded flex items-center gap-1">
            <CheckCircle size={12} /> Verified
          </div>
        </div>

        <div className="p-4">
          <Link to={`/pg/${pgData.id}`}>
            <h3 className="font-heading font-semibold text-lg hover:text-blue-600 transition-colors cursor-pointer">
              {pgData.name}
            </h3>
          </Link>
          <p className="text-sm text-slate-500 mt-1">{pgData.distance}</p>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            {pgData.location}
          </p>

          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-800">₹{pgData.price?.toLocaleString()}</span>
              <span className="text-sm text-slate-500">per month</span>
            </div>
            <div className="text-sm text-slate-500 mt-1">{pgData.type}</div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {pgData.tags?.slice(0, 4).map((tag, index) => (
              <span key={`${tag}-${index}`} className="text-xs bg-slate-100 text-gray-600 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <Link 
              to={`/pg/${pgData.id}`} 
              className="flex-1 px-3 py-2 border rounded-lg text-sm transition hover:bg-gray-100 text-center"
            >
              View Details
            </Link>
            <button 
              onClick={handleBookedClick}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm transition hover:bg-blue-700 font-medium"
            >
              Booked
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox - Only render when open and with unique key */}
      {open && pgImages.length > 0 && (
        <ImageLightbox 
          key={`${pgData.id}-${lightboxKey}`}
          images={[...pgImages]} // Create a new array to prevent reference issues
          startIndex={0} 
          onClose={handleCloseLightbox} 
        />
      )}

      {/* Cashback Form */}
      <CashbackForm
        isOpen={showCashbackForm}
        onClose={handleCloseCashbackForm}
        pgId={pgData.id}
        pgName={pgData.name}
      />
    </>
  );
}
