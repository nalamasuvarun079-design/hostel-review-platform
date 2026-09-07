import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import FilterSidebar from '../components/Hostel/FilterSidebar';
import HostelCard from '../components/Hostel/HostelCard';
import HostelMap from '../components/Hostel/HostelMap';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { hostelAPI } from '../services/api';
import { LayoutGrid, Map, ArrowLeftRight, SlidersHorizontal, X } from 'lucide-react';
import toast from 'react-hot-toast';

const HostelListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [comparedHostels, setComparedHostels] = useState([]);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    college: searchParams.get('college') || '',
    gender: searchParams.get('gender') || 'All',
    maxPrice: searchParams.get('maxPrice') || '30000',
    minRating: searchParams.get('minRating') || '',
    food: searchParams.get('food') === 'true',
    wifi: searchParams.get('wifi') === 'true',
    ac: searchParams.get('ac') === 'true',
    distance: searchParams.get('distance') || '',
    sortBy: 'rating_desc',
  });

  const fetchHostels = async () => {
    setLoading(true);
    try {
      const res = await hostelAPI.getAll(filters);
      setHostels(res.data);
    } catch (error) {
      toast.error('Failed to load hostels.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, [filters]);

  const resetFilters = () => {
    setFilters({
      search: '',
      location: '',
      college: '',
      gender: 'All',
      maxPrice: '30000',
      minRating: '',
      food: false,
      wifi: false,
      ac: false,
      distance: '',
      sortBy: 'rating_desc',
    });
    setSearchParams({});
  };

  const handleToggleCompare = (hostel) => {
    const exists = comparedHostels.some((h) => h._id === hostel._id);
    if (exists) {
      setComparedHostels(comparedHostels.filter((h) => h._id !== hostel._id));
    } else {
      if (comparedHostels.length >= 3) {
        toast.error('You can compare maximum 3 hostels at a time.');
        return;
      }
      setComparedHostels([...comparedHostels, hostel]);
      toast.success(`Added ${hostel.name} to comparison list.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Student Hostel Listings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Compare monthly rent, verified student ratings, facilities, mess food details & location maps.
          </p>
        </div>

        {/* View Toggle & Mobile Filter Trigger */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-gray-100 border rounded-xl"
          >
            <SlidersHorizontal size={15} />
            Filters
          </button>

          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              <LayoutGrid size={15} />
              Grid View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              <Map size={15} />
              Map View
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
            className="py-2 px-3 text-xs bg-white border border-gray-200 rounded-xl font-medium focus:outline-none"
          >
            <option value="rating_desc">Highest Rated</option>
            <option value="price_asc">Rent: Low to High</option>
            <option value="price_desc">Rent: High to Low</option>
            <option value="reviews_desc">Most Reviewed</option>
          </select>
        </div>
      </div>

      {/* Floating Comparison Drawer Bar */}
      {comparedHostels.length > 0 && (
        <div className="sticky top-20 z-40 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold">
              <ArrowLeftRight size={18} />
            </div>
            <div>
              <p className="text-xs font-bold">Hostel Comparison Drawer ({comparedHostels.length}/3)</p>
              <div className="flex gap-2 mt-1">
                {comparedHostels.map((h) => (
                  <span key={h._id} className="text-[11px] bg-slate-800 text-slate-200 px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                    {h.name}
                    <button onClick={() => handleToggleCompare(h)} className="hover:text-red-400">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setComparedHostels([])}
              className="text-xs text-slate-400 hover:text-white px-2 py-1"
            >
              Clear All
            </button>
            <Link
              to={`/compare?ids=${comparedHostels.map((h) => h._id).join(',')}`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow"
            >
              Compare Now
            </Link>
          </div>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Filter Sidebar (Desktop & Mobile drawer) */}
        <div className={`lg:block ${showMobileFilter ? 'block' : 'hidden'} lg:col-span-1`}>
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            resetFilters={resetFilters}
            totalResults={hostels.length}
          />
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {loading ? (
            <LoadingSpinner label="Searching hostels matching your filters..." />
          ) : hostels.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto text-2xl">
                🔍
              </div>
              <h3 className="text-xl font-bold text-gray-900">No hostels match your search</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try clearing some filters, increasing the price range, or searching for a different college or area.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'map' ? (
            <div className="space-y-4">
              <HostelMap hostels={hostels} height="550px" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hostels.map((hostel) => (
                  <HostelCard
                    key={hostel._id}
                    hostel={hostel}
                    isCompared={comparedHostels.some((h) => h._id === hostel._id)}
                    onToggleCompare={handleToggleCompare}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {hostels.map((hostel) => (
                <HostelCard
                  key={hostel._id}
                  hostel={hostel}
                  isCompared={comparedHostels.some((h) => h._id === hostel._id)}
                  onToggleCompare={handleToggleCompare}
                />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default HostelListPage;
