import React from 'react';
import RatingStars from '../Common/RatingStars';
import { Sparkles, Shield, Utensils, Wifi, MapPin } from 'lucide-react';

const RatingBreakdown = ({ ratings = {}, totalReviews = 0 }) => {
  const criteria = [
    { label: 'Cleanliness', score: ratings.cleanliness || 0, icon: <Sparkles size={14} className="text-emerald-500" /> },
    { label: 'Food Quality', score: ratings.food || 0, icon: <Utensils size={14} className="text-amber-500" /> },
    { label: 'Safety & Security', score: ratings.safety || 0, icon: <Shield size={14} className="text-blue-500" /> },
    { label: 'Wi-Fi Speed', score: ratings.wifi || 0, icon: <Wifi size={14} className="text-indigo-500" /> },
    { label: 'Location & Access', score: ratings.location || 0, icon: <MapPin size={14} className="text-rose-500" /> },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md border border-slate-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Left: Overall Big Score */}
        <div className="flex flex-col items-center justify-center text-center md:border-r border-slate-700 pr-0 md:pr-6 py-2">
          <span className="text-5xl font-extrabold text-white tracking-tight">
            {Number(ratings.overall || 0).toFixed(1)}
          </span>
          <div className="mt-2">
            <RatingStars rating={ratings.overall || 0} size={18} showLabel={false} />
          </div>
          <span className="text-xs text-slate-400 mt-2 font-medium">
            Based on {totalReviews} verified student {totalReviews === 1 ? 'review' : 'reviews'}
          </span>
        </div>

        {/* Right: Sub-criteria Bars */}
        <div className="md:col-span-2 space-y-3">
          {criteria.map((item) => {
            const percentage = (item.score / 5) * 100;
            return (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    {item.icon}
                    {item.label}
                  </span>
                  <span className="text-white font-mono">{Number(item.score).toFixed(1)} / 5</span>
                </div>
                <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default RatingBreakdown;
