import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RatingStars from '../Common/RatingStars';
import { GenderBadge, FacilityBadge } from '../Common/RoomBadge';
import { MapPin, Heart, ArrowUpRight, GraduationCap, IndianRupee } from 'lucide-react';

const HostelCard = ({ hostel, isCompared, onToggleCompare }) => {
  const { user, toggleSaveHostel } = useAuth();
  const isSaved = user?.savedHostels?.includes(hostel._id);

  const mainPhoto = hostel.photos && hostel.photos.length > 0
    ? hostel.photos[0]
    : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Image Header with Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100">
        <img
          src={mainPhoto}
          alt={hostel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <GenderBadge gender={hostel.genderType} />
          {hostel.verified && (
            <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow">
              Verified
            </span>
          )}
        </div>

        {/* Save / Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleSaveHostel(hostel._id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-transform active:scale-95 ${
            isSaved
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-white/80 text-gray-700 hover:bg-white'
          }`}
          title={isSaved ? 'Remove Bookmark' : 'Save Hostel'}
        >
          <Heart size={16} className={isSaved ? 'fill-white' : ''} />
        </button>

        {/* Bottom Image Info overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1 font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <GraduationCap size={14} className="text-yellow-400" />
            <span>{hostel.nearestCollege} ({hostel.distanceFromCollege} km)</span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Rating & Review Count */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <RatingStars rating={hostel.ratings?.overall || 0} size={15} />
            <span className="text-xs font-medium text-gray-500">
              ({hostel.reviewCount || 0} {hostel.reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          {/* Hostel Name */}
          <Link to={`/hostels/${hostel._id}`}>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {hostel.name}
            </h3>
          </Link>

          {/* Location Area */}
          <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <MapPin size={13} className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{hostel.area}, {hostel.city}</span>
          </p>

          {/* Facilities Summary */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {hostel.facilities?.slice(0, 4).map((fac, idx) => (
              <FacilityBadge key={idx} name={fac} />
            ))}
            {hostel.facilities?.length > 4 && (
              <span className="text-xs text-gray-400 self-center pl-1 font-medium">
                +{hostel.facilities.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Footer: Price & Details Action */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase text-gray-400 block">Monthly Rent</span>
            <div className="flex items-center font-extrabold text-gray-900 text-base">
              <span>₹{hostel.monthlyRent?.min?.toLocaleString()}</span>
              {hostel.monthlyRent?.max > hostel.monthlyRent?.min && (
                <span className="text-xs text-gray-500 font-normal ml-1">
                  - ₹{hostel.monthlyRent?.max?.toLocaleString()}
                </span>
              )}
              <span className="text-[11px] text-gray-400 font-normal ml-1">/mo</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onToggleCompare && (
              <label className="flex items-center gap-1 text-xs font-medium text-gray-600 cursor-pointer select-none border border-gray-200 px-2 py-1.5 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={isCompared}
                  onChange={() => onToggleCompare(hostel)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Compare
              </label>
            )}

            <Link
              to={`/hostels/${hostel._id}`}
              className="inline-flex items-center gap-1 px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              Details
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default HostelCard;
