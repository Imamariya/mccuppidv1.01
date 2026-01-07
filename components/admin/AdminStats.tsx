
import React from 'react';
import { AdminStats as StatsType } from '../../services/adminService';

interface AdminStatsProps {
  stats: StatsType | null;
}

const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  const items = [
    { label: 'Total Users', value: stats?.totalUsers ?? '...', icon: '👥', color: 'text-blue-500' },
    { label: 'Pending Verifications', value: stats?.pendingVerifications ?? '...', icon: '⏳', color: 'text-yellow-500' },
    { label: 'Verified Users', value: stats?.verifiedUsers ?? '...', icon: '✅', color: 'text-emerald-500' },
    { label: 'Reported Users', value: stats?.reportedUsers ?? '...', icon: '🚩', color: 'text-red-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <div key={item.label} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{item.label}</p>
              <h3 className="text-white text-3xl font-bold mt-2">{item.value}</h3>
            </div>
            <span className="text-2xl">{item.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
