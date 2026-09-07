import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HostelCard from '../components/Hostel/HostelCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { hostelAPI } from '../services/api';
import { Search, Building2, ShieldCheck, Star, Users, ArrowRight, Sparkles, MapPin, CheckCircle } from 'lucide-react';

const HomePage = () => {
  const [popularHostels, setPopularHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await hostelAPI.getAll({ sortBy: 'rating_desc' });
        setPopularHostels(res.data.slice(0, 6));
      } catch (error) {
        console.error('Failed to load popular hostels', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() || selectedCity) {
      let url = '/hostels?';
      if (searchQuery.trim()) url += `search=${encodeURIComponent(searchQuery.trim())}&`;
      if (selectedCity) url += `location=${encodeURIComponent(selectedCity)}`;
      navigate(url);
    } else {
      navigate('/hostels');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-3xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center opacity-10 blur-sm" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles size={14} className="text-yellow-400" />
            <span>Trusted by 50,000+ College Students Nationwide</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Find Your Ideal <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Student Hostel</span> & PG
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Transparent ratings, real student reviews, verified photos, room rent breakdown, and interactive map locations near your university.
          </p>

          {/* Hero Search Box */}
          <form onSubmit={handleHeroSearch} className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md p-3 rounded-2xl sm:rounded-full shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-white/20">
            <div className="flex-1 flex items-center gap-2 px-4 py-2 w-full">
              <Search className="text-gray-400 flex-shrink-0" size={20} />
              <input
                type="text"
                placeholder="Search hostel name, college, or locality..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-gray-900 placeholder-gray-400 text-sm bg-transparent focus:outline-none"
              />
            </div>

            <div className="w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-gray-200 px-4 py-2 flex items-center gap-2">
              <MapPin className="text-gray-400 flex-shrink-0" size={18} />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="text-sm text-gray-700 bg-transparent focus:outline-none cursor-pointer w-full"
              >
                <option value="">All Cities</option>
                <option value="New Delhi">New Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Kota">Kota</option>
                <option value="Pune">Pune</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl sm:rounded-full shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Search Hostels</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="text-slate-400 font-medium">Quick Filter:</span>
            <Link to="/hostels?gender=Boys" className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full border border-white/10 transition-colors">👦 Boys Hostels</Link>
            <Link to="/hostels?gender=Girls" className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full border border-white/10 transition-colors">👧 Girls Hostels</Link>
            <Link to="/hostels?gender=Co-ed" className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full border border-white/10 transition-colors">🏢 Co-ed Living</Link>
            <Link to="/hostels?food=true" className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full border border-white/10 transition-colors">🍲 Mess Included</Link>
            <Link to="/hostels?ac=true" className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full border border-white/10 transition-colors">❄️ AC Rooms</Link>
          </div>

        </div>
      </section>

      {/* Stats Bar Ticker */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="text-3xl font-extrabold text-blue-600">500+</span>
            <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">Verified Hostels</p>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-blue-600">12,500+</span>
            <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">Student Reviews</p>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-blue-600">4.8 / 5</span>
            <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">Avg User Rating</p>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-blue-600">40+</span>
            <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">College Hubs</p>
          </div>
        </div>
      </div>

      {/* Top Rated Hostels Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Highest Rated Accommodations
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
              Popular Student Hostels
            </h2>
          </div>
          <Link
            to="/hostels"
            className="inline-flex items-center gap-1.5 font-bold text-sm text-blue-600 hover:text-blue-700"
          >
            <span>View All Hostels</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner label="Fetching top rated hostels..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularHostels.map((hostel) => (
              <HostelCard key={hostel._id} hostel={hostel} />
            ))}
          </div>
        )}
      </section>

      {/* Why Hosteller Feature Section */}
      <section className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto border border-gray-200">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Why Students Choose Hosteller</h2>
          <p className="text-sm text-gray-600 mt-2">
            No broker fees, zero fake pictures. Built specifically to empower college students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Star size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">5-Criteria Rating Breakdown</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Rate cleanliness, mess food quality, warden safety, high-speed Wi-Fi, and location proximity independently.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Verified Resident Feedback</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every review comes from authentic students staying at the hostel with report & moderation tools for safety.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <MapPin size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Interactive Map Locator</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Pinpoint exact hostel locations relative to college gates, metro stations, and coaching institutes.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold">Are you a Hostel Owner or Student?</h3>
            <p className="text-sm text-blue-100">
              Join Hosteller today. List your hostel, reach thousands of university students, or share your genuine review to help your juniors!
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/register"
              className="px-6 py-3 bg-white text-blue-700 font-bold text-sm rounded-xl shadow hover:bg-blue-50 transition-colors"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
