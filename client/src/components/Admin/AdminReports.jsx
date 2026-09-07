import React from 'react';
import { ShieldAlert, CheckCircle, XCircle, Trash2 } from 'lucide-react';

const AdminReports = ({ reports = [], onHandleReport, onDeleteReview }) => {
  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-gray-500 border border-gray-100">
        <CheckCircle className="mx-auto text-emerald-500 mb-2" size={32} />
        <p className="font-bold text-gray-800">No pending reports</p>
        <p className="text-xs">All submitted reviews are clear and compliant!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((rep) => (
        <div key={rep._id} className="bg-white rounded-2xl border border-red-100 p-5 shadow-sm space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-red-600">
              <ShieldAlert size={16} />
              <span>Reported Review (Reason: "{rep.reason}")</span>
            </div>
            <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
              rep.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
            }`}>
              {rep.status}
            </span>
          </div>

          {rep.review && (
            <div className="bg-gray-50 p-4 rounded-xl text-xs space-y-2 border border-gray-200">
              <p className="font-bold text-gray-900">{rep.review.title}</p>
              <p className="text-gray-700 italic">"{rep.review.comment}"</p>
              <p className="text-gray-400">
                Posted by: <b>{rep.review.user?.name || 'User'}</b> on Hostel: <b>{rep.review.hostel?.name || 'Hostel'}</b>
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => onHandleReport(rep._id, 'dismissed')}
              className="px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-1"
            >
              <XCircle size={14} />
              Dismiss Report
            </button>
            {rep.review && (
              <button
                onClick={() => {
                  onDeleteReview(rep.review._id || rep.review);
                  onHandleReport(rep._id, 'resolved');
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-red-600 text-white hover:bg-red-700 rounded-lg flex items-center gap-1"
              >
                <Trash2 size={14} />
                Delete Inappropriate Review
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminReports;
