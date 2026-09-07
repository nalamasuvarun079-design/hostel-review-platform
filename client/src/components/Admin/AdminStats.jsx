import React from 'react';
import { Building2, MessageSquare, Users, Flag, TrendingUp } from 'lucide-react';

const AdminStats = ({ stats }) => {
  const cards = [
    { title: 'Total Hostels', value: stats.totalHostels || 0, icon: <Building2 className="text-blue-600" size={24} />, bg: 'bg-blue-50' },
    { title: 'Student Reviews', value: stats.totalReviews || 0, icon: <MessageSquare className="text-emerald-600" size={24} />, bg: 'bg-emerald-50' },
    { title: 'Active Users', value: stats.totalUsers || 0, icon: <Users className="text-purple-600" size={24} />, bg: 'bg-purple-50' },
    { title: 'Pending Reports', value: stats.pendingReports || 0, icon: <Flag className="text-amber-600" size={24} />, bg: 'bg-amber-50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((c) => (
        <div key={c.title} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{c.title}</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{c.value}</h3>
          </div>
          <div className={`p-3 rounded-2xl ${c.bg}`}>
            {c.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
