import React from 'react';
import { User, Users, Shield, Wifi, Utensils, Zap, Wind } from 'lucide-react';

export const GenderBadge = ({ gender }) => {
  const isBoys = gender === 'Boys';
  const isGirls = gender === 'Girls';
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
        isBoys
          ? 'bg-blue-50 text-blue-700 border border-blue-200'
          : isGirls
          ? 'bg-pink-50 text-pink-700 border border-pink-200'
          : 'bg-purple-50 text-purple-700 border border-purple-200'
      }`}
    >
      <Users size={12} />
      {gender} Hostel
    </span>
  );
};

export const FacilityBadge = ({ name }) => {
  const getIcon = () => {
    switch (name.toLowerCase()) {
      case 'wi-fi':
      case 'wifi':
        return <Wifi size={13} className="text-blue-500" />;
      case 'mess food':
      case 'food':
        return <Utensils size={13} className="text-amber-500" />;
      case 'ac':
        return <Wind size={13} className="text-cyan-500" />;
      case 'power backup':
        return <Zap size={13} className="text-yellow-500" />;
      case 'security':
      case 'cctv':
        return <Shield size={13} className="text-emerald-500" />;
      default:
        return null;
    }
  };

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md border border-gray-200">
      {getIcon()}
      {name}
    </span>
  );
};
