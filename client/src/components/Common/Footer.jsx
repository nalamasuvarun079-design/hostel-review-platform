import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Heart, ShieldCheck, Star, MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand & About */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <Building2 size={20} />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">Hosteller</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              India's premier student hostel review & comparison platform. Helping students find safe, comfortable, and budget-friendly accommodations near top universities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/hostels" className="hover:text-white transition-colors">Browse All Hostels</Link></li>
              <li><Link to="/compare" className="hover:text-white transition-colors">Compare Accommodations</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Student Registration</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Hostel Owner Login</Link></li>
            </ul>
          </div>

          {/* Popular Hubs */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Popular College Hubs</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/hostels?search=North+Campus" className="hover:text-white transition-colors">North Campus, DU</Link></li>
              <li><Link to="/hostels?search=Koramangala" className="hover:text-white transition-colors">Koramangala, Bangalore</Link></li>
              <li><Link to="/hostels?search=Powai" className="hover:text-white transition-colors">Powai, Mumbai (IIT)</Link></li>
              <li><Link to="/hostels?search=Rajiv+Gandhi+Nagar" className="hover:text-white transition-colors">Kota Coaching Hub</Link></li>
            </ul>
          </div>

          {/* Trust & Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact & Support</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2"><Mail size={14} className="text-blue-400" /> support@hosteller.com</p>
              <p className="flex items-center gap-2"><Phone size={14} className="text-blue-400" /> +91 (800) 123-4567</p>
              <p className="flex items-center gap-2"><MapPin size={14} className="text-blue-400" /> New Delhi, India</p>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-slate-800 border border-slate-700 text-[11px] text-slate-300 flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400 flex-shrink-0" />
              <span>100% Verified Reviews by Real College Students</span>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Hosteller Technologies Inc. All rights reserved.</p>
          <p className="flex items-center justify-center gap-1">
            Built for Students with <Heart size={14} className="text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
