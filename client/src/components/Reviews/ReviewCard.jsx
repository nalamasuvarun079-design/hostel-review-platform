import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import RatingStars from '../Common/RatingStars';
import { ThumbsUp, Flag, Edit, Trash2, CheckCircle2, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';

const ReviewCard = ({ review, onEdit, onDelete, onLike, onReport }) => {
  const { user } = useAuth();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  const reviewUserId = review.user?._id || review.user;
  const isAuthor = user && (user._id === reviewUserId || user.role === 'admin');
  const isLiked = user && review.likes?.includes(user._id);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportReason.trim()) {
      toast.error('Please enter a reason for reporting.');
      return;
    }
    setSubmittingReport(true);
    try {
      await onReport(review._id, reportReason);
      setShowReportModal(false);
      setReportReason('');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
      
      {/* Header: User Info & Actions */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={review.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
            alt={review.user?.name || 'Student'}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-gray-900 text-sm">{review.user?.name || 'Anonymous Student'}</h4>
              {review.verifiedStay && (
                <span className="inline-flex items-center gap-0.5 text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={11} />
                  Verified Resident
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">
              {review.user?.college ? `${review.user.college} • ` : ''}
              {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Action Options (Edit/Delete for author, Report for others) */}
        <div className="flex items-center gap-2">
          {isAuthor && (
            <div className="flex items-center gap-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(review)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Edit Review"
                >
                  <Edit size={16} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(review._id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Delete Review"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          )}

          {!isAuthor && user && (
            <button
              onClick={() => setShowReportModal(true)}
              className="p-1.5 text-gray-400 hover:text-amber-600 rounded-lg hover:bg-gray-50 transition-colors"
              title="Report Inappropriate Review"
            >
              <Flag size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Review Body */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <RatingStars rating={review.rating} size={15} />
          <h5 className="font-bold text-gray-900 text-sm">{review.title}</h5>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mt-2">
          {review.comment}
        </p>

        {/* Category Ratings Chips */}
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-600">
          <span className="bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-md">🧹 Cleanliness: <b>{review.cleanlinessRating || review.rating}/5</b></span>
          <span className="bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-md">🍲 Food: <b>{review.foodRating || review.rating}/5</b></span>
          <span className="bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-md">🛡️ Safety: <b>{review.safetyRating || review.rating}/5</b></span>
          <span className="bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-md">⚡ Wi-Fi: <b>{review.wifiRating || review.rating}/5</b></span>
          <span className="bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-md">📍 Location: <b>{review.locationRating || review.rating}/5</b></span>
        </div>

        {/* Attached Photos */}
        {review.photos && review.photos.length > 0 && (
          <div className="flex items-center gap-2 mt-3 overflow-x-auto">
            {review.photos.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="Review attachment"
                className="w-20 h-20 object-cover rounded-xl border border-gray-200 shadow-sm hover:scale-105 transition-transform"
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer: Helpful Likes */}
      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={() => onLike(review._id)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
            isLiked
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <ThumbsUp size={13} className={isLiked ? 'fill-blue-600' : ''} />
          <span>Helpful</span>
          <span>({review.likes?.length || 0})</span>
        </button>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Report Review</h3>
            <p className="text-xs text-gray-500">
              Please explain why this review violates platform guidelines (e.g., hate speech, false information, spam).
            </p>
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <textarea
                rows={3}
                required
                placeholder="Specify details..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReport}
                  className="px-4 py-2 text-xs font-semibold bg-red-600 text-white hover:bg-red-700 rounded-xl shadow-sm"
                >
                  {submittingReport ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReviewCard;
