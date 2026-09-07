import React, { useState, useEffect } from 'react';
import RatingStars from '../Common/RatingStars';
import { X, Star, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const ReviewModal = ({ isOpen, onClose, onSubmit, hostelName, initialData = null }) => {
  const [rating, setRating] = useState(5);
  const [cleanlinessRating, setCleanlinessRating] = useState(5);
  const [foodRating, setFoodRating] = useState(5);
  const [safetyRating, setSafetyRating] = useState(5);
  const [wifiRating, setWifiRating] = useState(5);
  const [locationRating, setLocationRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setRating(initialData.rating || 5);
      setCleanlinessRating(initialData.cleanlinessRating || initialData.rating || 5);
      setFoodRating(initialData.foodRating || initialData.rating || 5);
      setSafetyRating(initialData.safetyRating || initialData.rating || 5);
      setWifiRating(initialData.wifiRating || initialData.rating || 5);
      setLocationRating(initialData.locationRating || initialData.rating || 5);
      setTitle(initialData.title || '');
      setComment(initialData.comment || '');
      setPhotos(initialData.photos || []);
    } else {
      setRating(5);
      setCleanlinessRating(5);
      setFoodRating(5);
      setSafetyRating(5);
      setWifiRating(5);
      setLocationRating(5);
      setTitle('');
      setComment('');
      setPhotos([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddPhoto = () => {
    if (!photoUrl.trim()) return;
    setPhotos([...photos, photoUrl.trim()]);
    setPhotoUrl('');
  };

  const handleRemovePhoto = (idx) => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) {
      toast.error('Please enter a review headline and comment.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        rating,
        cleanlinessRating,
        foodRating,
        safetyRating,
        wifiRating,
        locationRating,
        title,
        comment,
        photos,
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            {initialData ? 'Edit Review' : 'Student Review'}
          </span>
          <h2 className="text-xl font-extrabold text-gray-900 mt-2">
            Rate your experience at {hostelName}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Overall Rating */}
          <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2">
            <span className="text-xs font-bold uppercase text-amber-800 tracking-wider">Overall Rating</span>
            <RatingStars rating={rating} size={28} interactive={true} onChange={setRating} showLabel={false} />
            <span className="text-sm font-bold text-amber-900">{rating} out of 5 Stars</span>
          </div>

          {/* Sub Criteria Ratings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">🧹 Cleanliness</label>
              <RatingStars rating={cleanlinessRating} size={16} interactive={true} onChange={setCleanlinessRating} />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">🍲 Food Quality</label>
              <RatingStars rating={foodRating} size={16} interactive={true} onChange={setFoodRating} />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">🛡️ Safety & Warden</label>
              <RatingStars rating={safetyRating} size={16} interactive={true} onChange={setSafetyRating} />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">⚡ Wi-Fi Speed</label>
              <RatingStars rating={wifiRating} size={16} interactive={true} onChange={setWifiRating} />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">📍 Location Convenience</label>
              <RatingStars rating={locationRating} size={16} interactive={true} onChange={setLocationRating} />
            </div>
          </div>

          {/* Headline Title */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Review Title / Headline *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Best PG for Christ University students!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Detailed Written Comment */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Detailed Written Experience *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe room condition, mess food quality, warden behavior, curfew timing, wifi stability..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Photos Upload / URL */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
              Attach Room / Hostel Photo URLs (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Paste image URL (https://...)"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddPhoto}
                className="px-4 py-2 text-xs font-semibold bg-gray-800 text-white rounded-xl hover:bg-gray-900"
              >
                Add Photo
              </button>
            </div>

            {photos.length > 0 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto">
                {photos.map((p, idx) => (
                  <div key={idx} className="relative group">
                    <img src={p} alt="attached" className="w-16 h-16 object-cover rounded-xl border" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors"
            >
              {submitting ? 'Publishing...' : initialData ? 'Update Review' : 'Submit Review'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ReviewModal;
