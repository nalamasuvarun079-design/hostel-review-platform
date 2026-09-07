import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import HostelCard from '../components/Hostel/HostelCard';
import ReviewCard from '../components/Reviews/ReviewCard';
import ReviewModal from '../components/Hostel/ReviewModal';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { reviewAPI, authAPI } from '../services/api';
import { User, Heart, MessageSquare, GraduationCap, Shield, Mail, Phone, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('saved'); // 'saved' or 'reviews'
  const [editingReview, setEditingReview] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const fetchProfileDetails = async () => {
    setLoading(true);
    try {
      const res = await authAPI.getProfile();
      setProfileData(res.data);

      // Fetch user's reviews across hostels
      if (res.data.savedHostels && res.data.savedHostels.length > 0) {
        const reviewPromises = res.data.savedHostels.map((h) =>
          reviewAPI.getByHostel(h._id || h)
        );
        const reviewResults = await Promise.all(reviewPromises);
        const allFetchedReviews = reviewResults.flatMap((r) => r.data);
        const myOwnReviews = allFetchedReviews.filter(
          (rev) => (rev.user?._id || rev.user) === user?._id
        );
        setUserReviews(myOwnReviews);
      }
    } catch (error) {
      toast.error('Failed to load user profile details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfileDetails();
    }
  }, [user]);

  const handleEditReview = (review) => {
    setEditingReview(review);
    setIsReviewModalOpen(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewAPI.delete(reviewId);
      toast.success('Review deleted successfully');
      fetchProfileDetails();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const handleUpdateReviewSubmit = async (data) => {
    try {
      await reviewAPI.update(editingReview._id, data);
      toast.success('Review updated!');
      setIsReviewModalOpen(false);
      fetchProfileDetails();
    } catch (error) {
      toast.error('Failed to update review');
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading user profile..." />;
  }

  const savedHostelsList = profileData?.savedHostels || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
          alt={user?.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-blue-50 shadow-md"
        />

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-extrabold text-gray-900">{user?.name}</h1>
            <span className="text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full">
              {user?.role}
            </span>
          </div>

          <p className="text-xs text-gray-500 flex items-center justify-center sm:justify-start gap-2">
            <Mail size={14} className="text-blue-500" /> {user?.email}
            {user?.college && (
              <span className="flex items-center gap-1">
                • <GraduationCap size={14} className="text-amber-500" /> {user.college}
              </span>
            )}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-bold text-gray-600">
            <span className="bg-gray-100 px-3 py-1 rounded-lg">
              ❤️ {savedHostelsList.length} Saved Hostels
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-lg">
              ✍️ {userReviews.length} Submitted Reviews
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'saved'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Heart size={16} /> Saved Hostels ({savedHostelsList.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'reviews'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <MessageSquare size={16} /> My Reviews ({userReviews.length})
        </button>
      </div>

      {/* Tab 1: Saved Hostels */}
      {activeTab === 'saved' && (
        <div>
          {savedHostelsList.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
              <Heart className="mx-auto text-gray-300" size={36} />
              <h3 className="font-bold text-gray-800 text-lg">No saved hostels yet</h3>
              <p className="text-xs text-gray-500">Click the heart icon on any hostel card to save it for quick reference.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedHostelsList.map((hostel) => (
                <HostelCard key={hostel._id} hostel={hostel} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: User Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {userReviews.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
              <MessageSquare className="mx-auto text-gray-300" size={36} />
              <h3 className="font-bold text-gray-800 text-lg">No reviews published yet</h3>
              <p className="text-xs text-gray-500">Visit any hostel page and click 'Write a Review' to share your experience!</p>
            </div>
          ) : (
            userReviews.map((rev) => (
              <ReviewCard
                key={rev._id}
                review={rev}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
                onLike={() => {}}
                onReport={() => {}}
              />
            ))
          )}
        </div>
      )}

      {/* Edit Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleUpdateReviewSubmit}
        hostelName="Hostel"
        initialData={editingReview}
      />

    </div>
  );
};

export default ProfilePage;
