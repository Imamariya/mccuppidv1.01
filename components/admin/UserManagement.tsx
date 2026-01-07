
import React from 'react';
import { AdminUser } from '../../services/adminService';

// Extending type for admin view to include plan
interface AdminUserWithPlan extends AdminUser {
  plan?: 'free' | 'pro';
  expires_at?: string;
}

interface UserManagementProps {
  users: AdminUserWithPlan[];
  onAction: (userId: string, action: 'suspend' | 'ban' | 'reinstate') => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onAction }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 bg-black/20 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Verification</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-white">{user.name}</div>
                  <div className="text-xs text-zinc-500">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                    user.plan === 'pro' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {user.plan || 'Free'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                    user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
                    user.status === 'Suspended' ? 'bg-yellow-500/10 text-yellow-500' :
                    user.status === 'Banned' ? 'bg-red-500/10 text-red-500' :
                    'bg-zinc-800 text-zinc-400'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {user.is_verified ? (
                    <span className="text-emerald-500 text-xs">Verified</span>
                  ) : (
                    <span className="text-zinc-600 text-xs">Unverified</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {user.status === 'Suspended' || user.status === 'Banned' ? (
                    <button onClick={() => onAction(user.id, 'reinstate')} className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest hover:underline">Reinstate</button>
                  ) : (
                    <>
                      <button onClick={() => onAction(user.id, 'suspend')} className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest hover:underline">Suspend</button>
                      <button onClick={() => onAction(user.id, 'ban')} className="text-red-500 text-[10px] font-bold uppercase tracking-widest hover:underline">Ban</button>
                    </>
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

export default UserManagement;
