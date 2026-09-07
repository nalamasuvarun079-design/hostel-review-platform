import React, { useState, useEffect } from 'react';
import AdminStats from '../components/Admin/AdminStats';
import AdminHostelModal from '../components/Admin/AdminHostelModal';
import AdminReports from '../components/Admin/AdminReports';
import AdminUsers from '../components/Admin/AdminUsers';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { adminAPI, hostelAPI, reviewAPI } from '../services/api';
import { Shield, Plus, Edit, Trash2, Building2, Flag, Users, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({});
  const [hostels, setHostels] = useState([]);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('hostels'); // 'hostels', 'reports', 'users'
  const [isHostelModalOpen, setIsHostelModalOpen] = useState(false);
  const [editingHostel, setEditingHostel] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, hostelsRes, reportsRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        hostelAPI.getAll(),
        adminAPI.getReports(),
        adminAPI.getUsers(),
      ]);

      setStats(statsRes.data);
      setHostels(hostelsRes.data);
      setReports(reportsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error('Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateOrUpdateHostel = async (formData) => {
    try {
      if (editingHostel) {
        await hostelAPI.update(editingHostel._id, formData);
        toast.success('Hostel updated successfully!');
      } else {
        await hostelAPI.create(formData);
        toast.success('New Hostel created successfully!');
      }
      setIsHostelModalOpen(false);
      setEditingHostel(null);
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Hostel save operation failed');
    }
  };

  const handleDeleteHostel = async (hostelId) => {
    if (!window.confirm('Are you sure you want to delete this hostel and all associated reviews?')) return;
    try {
      await hostelAPI.delete(hostelId);
      toast.success('Hostel deleted successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to delete hostel');
    }
  };

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      toast.success('User role updated!');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleReportAction = async (reportId, status) => {
    try {
      await adminAPI.handleReport(reportId, status);
      toast.success(`Report status marked as ${status}`);
      fetchDashboardData();
    } catch (error) {
      toast.error('Report action failed');
    }
  };

  const handleDeleteReviewFromReport = async (reviewId) => {
    try {
      await reviewAPI.delete(reviewId);
      toast.success('Inappropriate review removed from platform');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading admin analytics & moderation controls..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full flex items-center gap-1 w-fit">
            <Shield size={14} /> Admin Moderation Panel
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
            Platform Statistics & Management
          </h1>
        </div>

        <button
          onClick={fetchDashboardData}
          className="p-2.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <AdminStats stats={stats} />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('hostels')}
          className={`pb-3 text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'hostels' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'
          }`}
        >
          <Building2 size={16} /> Manage Hostels ({hostels.length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'reports' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'
          }`}
        >
          <Flag size={16} /> Moderation Reports ({reports.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-bold border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'users' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'
          }`}
        >
          <Users size={16} /> Platform Users ({users.length})
        </button>
      </div>

      {/* TAB 1: Hostels CRUD */}
      {activeTab === 'hostels' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-lg">All Registered Hostels</h3>
            <button
              onClick={() => {
                setEditingHostel(null);
                setIsHostelModalOpen(true);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
            >
              <Plus size={16} /> Add New Hostel
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase border-b">
                  <tr>
                    <th className="p-4">Hostel</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">College Proximity</th>
                    <th className="p-4">Monthly Rent</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {hostels.map((h) => (
                    <tr key={h._id} className="hover:bg-gray-50/50">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={h.photos?.[0] || ''}
                          alt={h.name}
                          className="w-10 h-10 rounded-lg object-cover border"
                        />
                        <div>
                          <p className="font-bold text-gray-900">{h.name}</p>
                          <span className="text-[10px] text-gray-400 uppercase">{h.genderType}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{h.area}, {h.city}</td>
                      <td className="p-4 text-gray-600">{h.nearestCollege} ({h.distanceFromCollege} km)</td>
                      <td className="p-4 font-bold text-indigo-600">₹{h.monthlyRent?.min?.toLocaleString()}</td>
                      <td className="p-4 font-bold text-gray-800">⭐ {h.ratings?.overall || 0} ({h.reviewCount})</td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => {
                            setEditingHostel(h);
                            setIsHostelModalOpen(true);
                          }}
                          className="p-1.5 text-gray-500 hover:text-blue-600 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteHostel(h._id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Reports */}
      {activeTab === 'reports' && (
        <AdminReports
          reports={reports}
          onHandleReport={handleReportAction}
          onDeleteReview={handleDeleteReviewFromReport}
        />
      )}

      {/* TAB 3: Users */}
      {activeTab === 'users' && (
        <AdminUsers users={users} onRoleChange={handleUserRoleChange} />
      )}

      {/* Hostel Form Modal */}
      <AdminHostelModal
        isOpen={isHostelModalOpen}
        onClose={() => setIsHostelModalOpen(false)}
        onSubmit={handleCreateOrUpdateHostel}
        initialData={editingHostel}
      />

    </div>
  );
};

export default AdminDashboardPage;
