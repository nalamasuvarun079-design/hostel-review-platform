import React from 'react';
import { User, Shield, GraduationCap } from 'lucide-react';

const AdminUsers = ({ users = [], onRoleChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Email</th>
              <th className="p-4">College</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50/50">
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                    alt={u.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-bold text-gray-900">{u.name}</span>
                </td>
                <td className="p-4 text-gray-600">{u.email}</td>
                <td className="p-4 text-gray-600">{u.college || 'N/A'}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold uppercase ${
                    u.role === 'admin' ? 'bg-indigo-50 text-indigo-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {u.role === 'admin' ? <Shield size={12} /> : <GraduationCap size={12} />}
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {u.role === 'student' ? (
                    <button
                      onClick={() => onRoleChange(u._id, 'admin')}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100"
                    >
                      Make Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => onRoleChange(u._id, 'student')}
                      className="px-3 py-1 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200"
                    >
                      Demote to Student
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
