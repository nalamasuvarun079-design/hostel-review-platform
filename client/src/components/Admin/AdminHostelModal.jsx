import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminHostelModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    genderType: 'Co-ed',
    address: '',
    city: '',
    area: '',
    nearestCollege: '',
    distanceFromCollege: 1.0,
    coordinates: { lat: 28.6139, lng: 77.2090 },
    monthlyRent: { min: 8000, max: 15000 },
    facilities: ['Wi-Fi', 'AC', 'Mess Food', 'Laundry', 'CCTV', 'Power Backup'],
    foodDetails: {
      available: true,
      type: 'Veg & Non-Veg',
      description: '3 meals daily + Sunday Special Feast',
      includedInRent: true,
    },
    wifiDetails: { available: true, speedMbps: 100 },
    acDetails: { acAvailable: true },
    rules: ['Curfew at 10:30 PM', 'No smoking or alcohol on premises', 'Biometric entry'],
    contact: {
      ownerName: 'Manager Name',
      phone: '+91 98765 43210',
      email: 'contact@hostel.com',
      whatsapp: '919876543210',
    },
    photos: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
    ],
  });

  const [newPhoto, setNewPhoto] = useState('');
  const [newFacility, setNewFacility] = useState('');
  const [newRule, setNewRule] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const addPhoto = () => {
    if (!newPhoto.trim()) return;
    setFormData((prev) => ({ ...prev, photos: [...prev.photos, newPhoto.trim()] }));
    setNewPhoto('');
  };

  const removePhoto = (idx) => {
    setFormData((prev) => ({ ...prev, photos: prev.photos.filter((_, i) => i !== idx) }));
  };

  const addFacility = () => {
    if (!newFacility.trim()) return;
    setFormData((prev) => ({ ...prev, facilities: [...prev.facilities, newFacility.trim()] }));
    setNewFacility('');
  };

  const removeFacility = (idx) => {
    setFormData((prev) => ({ ...prev, facilities: prev.facilities.filter((_, i) => i !== idx) }));
  };

  const addRule = () => {
    if (!newRule.trim()) return;
    setFormData((prev) => ({ ...prev, rules: [...prev.rules, newRule.trim()] }));
    setNewRule('');
  };

  const removeRule = (idx) => {
    setFormData((prev) => ({ ...prev, rules: prev.rules.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.city || !formData.nearestCollege) {
      toast.error('Please fill in essential required fields');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-extrabold text-gray-900 mb-6">
          {initialData ? 'Edit Hostel' : 'Add New Hostel'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
          
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Hostel Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full p-2.5 bg-gray-50 border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Gender Type *</label>
              <select
                value={formData.genderType}
                onChange={(e) => handleChange('genderType', e.target.value)}
                className="w-full p-2.5 bg-gray-50 border rounded-xl"
              >
                <option value="Boys">Boys</option>
                <option value="Girls">Girls</option>
                <option value="Co-ed">Co-ed</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Description *</label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full p-2.5 bg-gray-50 border rounded-xl"
              />
            </div>
          </div>

          {/* Location & College */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full p-2.5 bg-gray-50 border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Area / Locality *</label>
              <input
                type="text"
                required
                value={formData.area}
                onChange={(e) => handleChange('area', e.target.value)}
                className="w-full p-2.5 bg-gray-50 border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Nearest College *</label>
              <input
                type="text"
                required
                value={formData.nearestCollege}
                onChange={(e) => handleChange('nearestCollege', e.target.value)}
                className="w-full p-2.5 bg-gray-50 border rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Full Street Address *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full p-2.5 bg-gray-50 border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Distance to College (KM)</label>
              <input
                type="number"
                step="0.1"
                value={formData.distanceFromCollege}
                onChange={(e) => handleChange('distanceFromCollege', Number(e.target.value))}
                className="w-full p-2.5 bg-gray-50 border rounded-xl"
              />
            </div>
          </div>

          {/* Map Coordinates & Rent */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 border-t pt-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={formData.coordinates?.lat || 28.6139}
                onChange={(e) => handleNestedChange('coordinates', 'lat', Number(e.target.value))}
                className="w-full p-2.5 bg-gray-50 border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={formData.coordinates?.lng || 77.2090}
                onChange={(e) => handleNestedChange('coordinates', 'lng', Number(e.target.value))}
                className="w-full p-2.5 bg-gray-50 border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Min Rent (₹)</label>
              <input
                type="number"
                value={formData.monthlyRent?.min || 8000}
                onChange={(e) => handleNestedChange('monthlyRent', 'min', Number(e.target.value))}
                className="w-full p-2.5 bg-gray-50 border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Max Rent (₹)</label>
              <input
                type="number"
                value={formData.monthlyRent?.max || 15000}
                onChange={(e) => handleNestedChange('monthlyRent', 'max', Number(e.target.value))}
                className="w-full p-2.5 bg-gray-50 border rounded-xl"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={formData.contact?.phone || ''}
                onChange={(e) => handleNestedChange('contact', 'phone', e.target.value)}
                className="w-full p-2.5 bg-gray-50 border rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Email / WhatsApp</label>
              <input
                type="text"
                value={formData.contact?.email || ''}
                onChange={(e) => handleNestedChange('contact', 'email', e.target.value)}
                className="w-full p-2.5 bg-gray-50 border rounded-xl"
              />
            </div>
          </div>

          {/* Facilities List */}
          <div className="border-t pt-4">
            <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Facilities Badges</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add facility (e.g. Laundry, Gym)..."
                value={newFacility}
                onChange={(e) => setNewFacility(e.target.value)}
                className="flex-1 p-2 bg-gray-50 border rounded-xl text-xs"
              />
              <button type="button" onClick={addFacility} className="px-3 py-1 bg-gray-800 text-white text-xs rounded-xl">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.facilities?.map((f, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-lg">
                  {f}
                  <button type="button" onClick={() => removeFacility(i)} className="text-red-500 hover:text-red-700">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Hostel Rules */}
          <div className="border-t pt-4">
            <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Hostel Rules</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add rule (e.g. Curfew at 10 PM)..."
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                className="flex-1 p-2 bg-gray-50 border rounded-xl text-xs"
              />
              <button type="button" onClick={addRule} className="px-3 py-1 bg-gray-800 text-white text-xs rounded-xl">
                Add
              </button>
            </div>
            <ul className="space-y-1">
              {formData.rules?.map((r, i) => (
                <li key={i} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-lg">
                  <span>• {r}</span>
                  <button type="button" onClick={() => removeRule(i)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={13} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Photo URLs */}
          <div className="border-t pt-4">
            <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Photos (Image URLs)</label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={newPhoto}
                onChange={(e) => setNewPhoto(e.target.value)}
                className="flex-1 p-2 bg-gray-50 border rounded-xl text-xs"
              />
              <button type="button" onClick={addPhoto} className="px-3 py-1 bg-blue-600 text-white text-xs rounded-xl">
                Add Photo
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.photos?.map((p, i) => (
                <div key={i} className="relative">
                  <img src={p} alt="Hostel" className="w-16 h-16 object-cover rounded-lg border" />
                  <button type="button" onClick={() => removePhoto(i)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-5 py-2 text-xs font-bold text-gray-600">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">
              {initialData ? 'Save Changes' : 'Create Hostel'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default AdminHostelModal;
