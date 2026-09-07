import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import RatingStars from '../components/Common/RatingStars';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { hostelAPI } from '../services/api';
import { ArrowLeftRight, Check, X, Building2, MapPin, GraduationCap, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const [allHostels, setAllHostels] = useState([]);
  const [selectedHostelIds, setSelectedHostelIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const res = await hostelAPI.getAll();
        setAllHostels(res.data);

        const urlIds = searchParams.get('ids');
        if (urlIds) {
          const ids = urlIds.split(',').filter(Boolean);
          setSelectedHostelIds(ids);
        } else if (res.data.length >= 2) {
          setSelectedHostelIds([res.data[0]._id, res.data[1]._id]);
        }
      } catch (error) {
        toast.error('Failed to load hostels for comparison');
      } finally {
        setLoading(false);
      }
    };
    fetchHostels();
  }, [searchParams]);

  const handleSelectHostel = (index, newId) => {
    const updated = [...selectedHostelIds];
    updated[index] = newId;
    setSelectedHostelIds(updated.filter(Boolean));
  };

  const removeHostelFromCompare = (idToRemove) => {
    setSelectedHostelIds(selectedHostelIds.filter((id) => id !== idToRemove));
  };

  const comparedHostels = selectedHostelIds
    .map((id) => allHostels.find((h) => h._id === id))
    .filter(Boolean);

  if (loading) {
    return <LoadingSpinner label="Preparing hostel comparison table..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            Hostel Comparison Tool
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
            Compare Hostels Side-by-Side
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Compare rent, student ratings, mess food, Wi-Fi speed, distance, and rules.
          </p>
        </div>

        {selectedHostelIds.length < 3 && (
          <button
            onClick={() => {
              const remaining = allHostels.find((h) => !selectedHostelIds.includes(h._id));
              if (remaining) setSelectedHostelIds([...selectedHostelIds, remaining._id]);
            }}
            className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow"
          >
            + Add Another Hostel ({selectedHostelIds.length}/3)
          </button>
        )}
      </div>

      {comparedHostels.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-4">
          <ArrowLeftRight className="mx-auto text-gray-300" size={40} />
          <h3 className="text-xl font-bold text-gray-900">No hostels selected for comparison</h3>
          <p className="text-xs text-gray-500">Pick hostels from the listings page or select from dropdown below.</p>
          <Link to="/hostels" className="inline-block px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow">
            Browse All Hostels
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              
              {/* Table Header: Dropdowns & Images */}
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="p-4 sm:p-6 w-48 text-gray-500 uppercase font-extrabold text-xs">Features</th>
                  {comparedHostels.map((hostel, idx) => (
                    <th key={hostel._id} className="p-4 sm:p-6 min-w-[240px] align-top border-l border-gray-200">
                      <div className="space-y-3">
                        
                        <div className="flex justify-between items-center">
                          <select
                            value={hostel._id}
                            onChange={(e) => handleSelectHostel(idx, e.target.value)}
                            className="text-xs bg-white border border-gray-300 rounded-lg p-1.5 font-bold w-full mr-2 focus:outline-none"
                          >
                            {allHostels.map((h) => (
                              <option key={h._id} value={h._id}>
                                {h.name}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => removeHostelFromCompare(hostel._id)}
                            className="text-gray-400 hover:text-red-500 p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        <img
                          src={hostel.photos?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800'}
                          alt={hostel.name}
                          className="w-full h-32 object-cover rounded-xl border border-gray-200"
                        />

                        <div>
                          <h4 className="font-extrabold text-gray-900 text-base">{hostel.name}</h4>
                          <p className="text-xs text-gray-500 truncate">{hostel.area}, {hostel.city}</p>
                        </div>

                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Comparison Rows */}
              <tbody className="divide-y divide-gray-200">
                
                {/* 1. Monthly Rent */}
                <tr>
                  <td className="p-4 font-bold text-gray-900 bg-gray-50/50">Monthly Rent</td>
                  {comparedHostels.map((h) => (
                    <td key={h._id} className="p-4 border-l font-extrabold text-blue-600 text-base">
                      ₹{h.monthlyRent?.min?.toLocaleString()}
                      {h.monthlyRent?.max > h.monthlyRent?.min && ` - ₹${h.monthlyRent?.max?.toLocaleString()}`}
                      <span className="text-xs text-gray-400 font-normal"> /mo</span>
                    </td>
                  ))}
                </tr>

                {/* 2. Overall Rating */}
                <tr>
                  <td className="p-4 font-bold text-gray-900 bg-gray-50/50">Overall Rating</td>
                  {comparedHostels.map((h) => (
                    <td key={h._id} className="p-4 border-l">
                      <RatingStars rating={h.ratings?.overall || 0} size={15} />
                      <span className="text-xs text-gray-500 font-medium block mt-1">
                        ({h.reviewCount || 0} reviews)
                      </span>
                    </td>
                  ))}
                </tr>

                {/* 3. Gender Type */}
                <tr>
                  <td className="p-4 font-bold text-gray-900 bg-gray-50/50">Occupancy Type</td>
                  {comparedHostels.map((h) => (
                    <td key={h._id} className="p-4 border-l font-semibold text-gray-800">
                      {h.genderType} Hostel
                    </td>
                  ))}
                </tr>

                {/* 4. College Proximity */}
                <tr>
                  <td className="p-4 font-bold text-gray-900 bg-gray-50/50">Distance to College</td>
                  {comparedHostels.map((h) => (
                    <td key={h._id} className="p-4 border-l text-gray-700">
                      <b>{h.distanceFromCollege} km</b> from {h.nearestCollege}
                    </td>
                  ))}
                </tr>

                {/* 5. Mess / Food Availability */}
                <tr>
                  <td className="p-4 font-bold text-gray-900 bg-gray-50/50">Mess Food Details</td>
                  {comparedHostels.map((h) => (
                    <td key={h._id} className="p-4 border-l">
                      {h.foodDetails?.available ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <Check size={16} />
                          {h.foodDetails.type} ({h.foodDetails.includedInRent ? 'Included' : 'Paid'})
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium">Self Cooking / Cafe</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 6. Wi-Fi Speed */}
                <tr>
                  <td className="p-4 font-bold text-gray-900 bg-gray-50/50">Wi-Fi Connection</td>
                  {comparedHostels.map((h) => (
                    <td key={h._id} className="p-4 border-l text-gray-700">
                      {h.wifiDetails?.available ? `${h.wifiDetails.speedMbps || 100} Mbps Fiber` : 'No Wi-Fi'}
                    </td>
                  ))}
                </tr>

                {/* 7. Cleanliness Rating */}
                <tr>
                  <td className="p-4 font-bold text-gray-900 bg-gray-50/50">Cleanliness Score</td>
                  {comparedHostels.map((h) => (
                    <td key={h._id} className="p-4 border-l font-bold text-gray-800">
                      {h.ratings?.cleanliness || 0} / 5.0
                    </td>
                  ))}
                </tr>

                {/* 8. Safety & Warden Score */}
                <tr>
                  <td className="p-4 font-bold text-gray-900 bg-gray-50/50">Safety Rating</td>
                  {comparedHostels.map((h) => (
                    <td key={h._id} className="p-4 border-l font-bold text-gray-800">
                      {h.ratings?.safety || 0} / 5.0
                    </td>
                  ))}
                </tr>

                {/* 9. Facilities Summary */}
                <tr>
                  <td className="p-4 font-bold text-gray-900 bg-gray-50/50">Key Facilities</td>
                  {comparedHostels.map((h) => (
                    <td key={h._id} className="p-4 border-l">
                      <div className="flex flex-wrap gap-1">
                        {h.facilities?.map((f, i) => (
                          <span key={i} className="text-[11px] bg-gray-100 border px-2 py-0.5 rounded">
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 10. Direct Action */}
                <tr>
                  <td className="p-4 font-bold text-gray-900 bg-gray-50/50">Actions</td>
                  {comparedHostels.map((h) => (
                    <td key={h._id} className="p-4 border-l">
                      <Link
                        to={`/hostels/${h._id}`}
                        className="inline-block w-full text-center py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow hover:bg-blue-700"
                      >
                        View Full Details
                      </Link>
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default ComparePage;
