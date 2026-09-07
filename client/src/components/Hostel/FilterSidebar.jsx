import React from 'react';
import { Filter, RotateCcw, Search, DollarSign, Star, MapPin, Sparkles } from 'lucide-react';

const FilterSidebar = ({ filters, setFilters, resetFilters, totalResults = 0 }) => {
  const handleGenderChange = (gender) => {
    setFilters((prev) => ({ ...prev, gender }));
  };

  const handleCheckboxChange = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-blue-600" />
          <h3 className="font-bold text-gray-900 text-base">Filter Hostels</h3>
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
            {totalResults} found
          </span>
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors"
          title="Reset all filters"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      {/* 1. Search Query */}
      <div>
        <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
          Keyword Search
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Hostel name, college, area..."
            value={filters.search || ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={15} />
        </div>
      </div>

      {/* 2. Gender Type */}
      <div>
        <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
          Occupancy Type
        </label>
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-gray-100 rounded-xl">
          {['All', 'Boys', 'Girls', 'Co-ed'].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => handleGenderChange(g)}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                (filters.gender || 'All') === g
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Monthly Rent Range */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">
            Max Rent (₹/Month)
          </label>
          <span className="text-xs font-bold text-blue-600">
            ₹{(filters.maxPrice || 30000).toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min="5000"
          max="30000"
          step="1000"
          value={filters.maxPrice || 30000}
          onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
          className="w-full accent-blue-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 font-medium mt-1">
          <span>₹5,000</span>
          <span>₹17,500</span>
          <span>₹30,000+</span>
        </div>
      </div>

      {/* 4. Minimum Rating */}
      <div>
        <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
          Minimum Rating
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: 'Any', val: '' },
            { label: '3.0+', val: '3' },
            { label: '4.0+', val: '4' },
            { label: '4.5+', val: '4.5' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, minRating: item.val }))}
              className={`py-1.5 text-xs font-medium border rounded-xl flex items-center justify-center gap-1 transition-all ${
                (filters.minRating || '') === item.val
                  ? 'bg-amber-50 border-amber-300 text-amber-800 font-bold'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.val && <Star size={11} className="fill-amber-400 text-amber-400" />}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Essential Amenities Checkboxes */}
      <div>
        <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
          Amenities & Features
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!filters.food}
              onChange={() => handleCheckboxChange('food')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Mess Food Included
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!filters.wifi}
              onChange={() => handleCheckboxChange('wifi')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            High Speed Wi-Fi
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!filters.ac}
              onChange={() => handleCheckboxChange('ac')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Air Conditioning (AC)
          </label>
        </div>
      </div>

      {/* 6. Distance from College */}
      <div>
        <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
          Distance from College
        </label>
        <select
          value={filters.distance || ''}
          onChange={(e) => setFilters((prev) => ({ ...prev, distance: e.target.value }))}
          className="w-full py-2 px-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Any distance</option>
          <option value="0.5">Within 0.5 km (Walking distance)</option>
          <option value="1">Within 1 km</option>
          <option value="3">Within 3 km</option>
          <option value="5">Within 5 km</option>
        </select>
      </div>

    </div>
  );
};

export default FilterSidebar;
