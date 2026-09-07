import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HostelGallery from '../components/Hostel/HostelGallery';
import HostelMap from '../components/Hostel/HostelMap';
import RatingStars from '../components/Common/RatingStars';
import RatingBreakdown from '../components/Reviews/RatingBreakdown';
import ReviewCard from '../components/Reviews/ReviewCard';
import ReviewModal from '../components/Hostel/ReviewModal';
import { GenderBadge, FacilityBadge } from '../components/Common/RoomBadge';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { hostelAPI, reviewAPI } from '../services/api';
import { MapPin, Phone, Mail, MessageSquare, Heart, Share2, Shield, Utensils, Wifi, Wind, GraduationCap, Check, Plus, AlertCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const HostelDetailPage = () => {
  const { id } = useParams();
  const { user, toggleSaveHostel } = useAuth();
  
  const [hostel, setHostel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'rooms', 'food', 'rules', 'reviews'

  const isSaved = user?.savedHostels?.includes(hostel?._id);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [hostelRes, reviewRes] = await Promise.all([
        hostelAPI.getById(id),
        reviewAPI.getByHostel(id),
      ]);
      setHostel(hostelRes.data);
      setReviews(reviewRes.data);
    } catch (error) {
      toast.error('Failed to load hostel details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleReviewSubmit = async (reviewData) => {
    try {
      if (editingReview) {
        await reviewAPI.update(editingReview._id, reviewData);
        toast.success('Your review has been updated!');
      } else {
        await reviewAPI.create({ ...reviewData, hostelId: hostel._id });
        toast.success('Your review has been published!');
      }
      setEditingReview(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post review');
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setIsReviewModalOpen(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewAPI.delete(reviewId);
      toast.success('Review deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const handleLikeReview = async (reviewId) => {
    if (!user) {
      toast.error('Please login to react to reviews');
      return;
    }
    try {
      await reviewAPI.toggleLike(reviewId);
      fetchData();
    } catch (error) {
      toast.error('Like action failed');
    }
  };

  const handleReportReview = async (reviewId, reason) => {
    try {
      await reviewAPI.report(reviewId, reason);
      toast.success('Review reported to administrators for moderation');
    } catch (error) {
      toast.error('Failed to report review');
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading hostel details and reviews..." />;
  }

  if (!hostel) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Hostel Not Found</h2>
        <p className="text-sm text-gray-500">The requested accommodation page could not be located.</p>
        <Link to="/hostels" className="inline-block px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl">
          Back to Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Link */}
      <div>
        <Link to="/hostels" className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-blue-600">
          <ArrowLeft size={14} /> Back to Hostel Listings
        </Link>
      </div>

      {/* Header Info Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <GenderBadge gender={hostel.genderType} />
              {hostel.verified && (
                <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  ✓ Verified Hostel
                </span>
              )}
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <GraduationCap size={14} className="text-blue-600" />
                {hostel.nearestCollege} ({hostel.distanceFromCollege} km away)
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              {hostel.name}
            </h1>

            <p className="flex items-center gap-1.5 text-sm text-gray-600">
              <MapPin size={16} className="text-blue-600 flex-shrink-0" />
              <span>{hostel.address}, {hostel.area}, {hostel.city}</span>
            </p>

            <div className="flex items-center gap-4 text-sm pt-1">
              <RatingStars rating={hostel.ratings?.overall || 0} size={18} />
              <span className="text-xs font-bold text-gray-600">
                ({hostel.reviewCount || 0} student reviews)
              </span>
            </div>
          </div>

          {/* Pricing & Contact Actions */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col sm:flex-row lg:flex-col items-center lg:items-end justify-between gap-4 lg:min-w-[280px]">
            <div>
              <span className="text-xs font-bold uppercase text-gray-400 block">Monthly Rent Starting From</span>
              <div className="text-2xl font-extrabold text-gray-900">
                ₹{hostel.monthlyRent?.min?.toLocaleString()}
                <span className="text-xs text-gray-500 font-normal"> / month</span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => toggleSaveHostel(hostel._id)}
                className={`p-3 rounded-xl border transition-colors ${
                  isSaved
                    ? 'bg-red-500 text-white border-red-500 shadow'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
                title={isSaved ? 'Remove Bookmark' : 'Save Hostel'}
              >
                <Heart size={18} className={isSaved ? 'fill-white' : ''} />
              </button>

              <a
                href={`tel:${hostel.contact?.phone || '+919876543210'}`}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                <Phone size={15} />
                Contact Owner
              </a>
            </div>
          </div>

        </div>

        {/* Gallery Showcase */}
        <HostelGallery photos={hostel.photos} title={hostel.name} />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Overview & Rooms' },
          { id: 'food', label: 'Mess & Food Details' },
          { id: 'rules', label: 'Hostel Rules' },
          { id: 'location', label: 'Location Map' },
          { id: 'reviews', label: `Reviews (${reviews.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: Overview & Rooms */}
      {(activeTab === 'overview' || activeTab === 'rooms') && (
        <div className="space-y-8">
          
          {/* Description & About */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-gray-900">About {hostel.name}</h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {hostel.description}
            </p>
          </div>

          {/* Room Types & Pricing Cards */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Available Room Types & Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hostel.roomTypes && hostel.roomTypes.length > 0 ? (
                hostel.roomTypes.map((rt) => (
                  <div key={rt._id || rt.type} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-900 text-base">{rt.type}</h4>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          rt.available ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {rt.available ? 'Available' : 'Full'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{rt.description || 'Fully furnished with bed, study table, and wardrobe.'}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-baseline justify-between">
                      <span className="text-xs font-semibold text-gray-400">Rent</span>
                      <span className="text-xl font-extrabold text-blue-600">₹{rt.rent?.toLocaleString()}<span className="text-xs text-gray-500 font-normal">/mo</span></span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-xs text-gray-500 bg-white p-6 rounded-2xl border">
                  Single, Double, and Triple Sharing rooms available starting from ₹{hostel.monthlyRent?.min?.toLocaleString()}/mo.
                </div>
              )}
            </div>
          </div>

          {/* Facilities Badges Grid */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Hostel Amenities & Facilities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {hostel.facilities?.map((fac, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs font-bold text-gray-800">
                  <Check size={16} className="text-emerald-500 flex-shrink-0" />
                  <span>{fac}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT: Mess & Food Details */}
      {activeTab === 'food' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Utensils size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Mess & Meal Facilities</h3>
              <p className="text-xs text-gray-500">Dietary options and daily meal menu highlights</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-gray-400">Dietary Type</span>
              <p className="font-extrabold text-gray-900 text-lg">{hostel.foodDetails?.type || 'Veg & Non-Veg'}</p>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-gray-400">Rent Inclusion</span>
              <p className="font-extrabold text-emerald-600 text-lg">
                {hostel.foodDetails?.includedInRent ? '✓ Included in Monthly Rent' : 'Optional Paid Extra'}
              </p>
            </div>
            <div className="md:col-span-2 space-y-2">
              <span className="text-xs font-bold uppercase text-gray-400">Mess Schedule & Menu Summary</span>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border leading-relaxed">
                {hostel.foodDetails?.description || '3 fresh hygienic meals served daily (Breakfast, Lunch, Dinner). Clean filtered drinking water available 24/7.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Hostel Rules */}
      {activeTab === 'rules' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Hostel Rules & Regulations</h3>
          <div className="space-y-3">
            {hostel.rules?.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs sm:text-sm font-medium text-gray-800">
                <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Location Map */}
      {activeTab === 'location' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Exact Location & Neighborhood</h3>
          <p className="text-xs text-gray-500">
            📍 {hostel.address}, {hostel.area}, {hostel.city} (Proximity: {hostel.distanceFromCollege} km to {hostel.nearestCollege})
          </p>
          <HostelMap hostels={[hostel]} selectedHostelId={hostel._id} height="450px" />
        </div>
      )}

      {/* TAB CONTENT & ALWAYS VISIBLE: Reviews Section */}
      <div className="space-y-8 pt-4 border-t border-gray-200">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Student Reviews & Feedback</h2>
            <p className="text-xs text-gray-500 mt-1">Real ratings from college residents</p>
          </div>

          <button
            onClick={() => {
              if (!user) {
                toast.error('Please login to write a review');
                return;
              }
              setEditingReview(null);
              setIsReviewModalOpen(true);
            }}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Write a Review
          </button>
        </div>

        {/* Rating Breakdown Bar Visualizer */}
        <RatingBreakdown ratings={hostel.ratings} totalReviews={hostel.reviewCount} />

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center border border-gray-100 space-y-2">
              <MessageSquare className="mx-auto text-gray-300" size={32} />
              <p className="font-bold text-gray-800">No reviews submitted yet</p>
              <p className="text-xs text-gray-500">Be the first student to rate and review {hostel.name}!</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <ReviewCard
                key={rev._id}
                review={rev}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
                onLike={handleLikeReview}
                onReport={handleReportReview}
              />
            ))
          )}
        </div>

      </div>

      {/* Review Modal Trigger */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        hostelName={hostel.name}
        initialData={editingReview}
      />

    </div>
  );
};

export default HostelDetailPage;
