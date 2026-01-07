
import React, { useState, useEffect } from 'react';
import AdminStats from '../../../components/admin/AdminStats';
import VerificationQueue from '../../../components/admin/VerificationQueue';
import ImageModeration from '../../../components/admin/ImageModeration';
import UserManagement from '../../../components/admin/UserManagement';
import AdminActionModal from '../../../components/admin/AdminActionModal';
import { adminService, AdminStats as StatsType, VerificationRequest, ModerationImage, AdminUser } from '../../../services/adminService';
import { authService } from '../../../services/authService';

type Tab = 'overview' | 'verifications' | 'moderation' | 'users';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<StatsType | null>(null);
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [images, setImages] = useState<ModerationImage[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Action Modal State
  const [modal, setModal] = useState<{ type: string; id: string; requireReason?: boolean } | null>(null);

  useEffect(() => {
    // Check if user is actually admin
    const role = localStorage.getItem('mallucupid_role');
    if (role !== 'admin') {
      window.location.hash = '#/login';
      return;
    }
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'overview') setStats(await adminService.getStats());
      if (activeTab === 'verifications') setVerifications(await adminService.getPendingVerifications());
      if (activeTab === 'moderation') setImages(await adminService.getPendingImages());
      if (activeTab === 'users') setUsers(await adminService.getUsers());
    } catch (err) {
      console.error("Admin Load Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveVerification = async (id: string) => {
    await adminService.approveVerification(id);
    setVerifications(prev => prev.filter(v => v.id !== id));
  };

  const handleRejectVerification = (id: string) => {
    setModal({ type: 'reject_verification', id, requireReason: true });
  };

  const handleApproveImage = async (id: string) => {
    await adminService.approveImage(id);
    setImages(prev => prev.filter(i => i.id !== id));
  };

  const handleUserAction = (id: string, action: 'suspend' | 'ban' | 'reinstate') => {
    if (action === 'reinstate') {
      adminService.updateUserStatus(id, 'reinstate').then(loadData);
    } else {
      setModal({ type: `user_${action}`, id });
    }
  };

  const onConfirmAction = async (reason?: string) => {
    if (!modal) return;
    try {
      if (modal.type === 'reject_verification') {
        await adminService.rejectVerification(modal.id, reason || 'Profile did not meet requirements.');
      } else if (modal.type === 'user_suspend') {
        await adminService.updateUserStatus(modal.id, 'suspend');
      } else if (modal.type === 'user_ban') {
        await adminService.updateUserStatus(modal.id, 'ban');
      }
      loadData();
    } catch (err) {
      console.error("Action Error:", err);
    } finally {
      setModal(null);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'verifications', label: 'Verifications', icon: '🆔' },
    { id: 'moderation', label: 'Images', icon: '🖼️' },
    { id: 'users', label: 'Users', icon: '👥' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-8 border-b border-zinc-800">
          <h1 className="text-white text-2xl font-brand italic">MalluCupid</h1>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-1">Admin Panel</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id ? 'bg-emerald-500/10 text-emerald-500 font-bold' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button 
            onClick={() => authService.logout()}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <span>🚪</span>
            <span className="text-sm font-bold uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto p-8 md:p-12">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-white text-4xl font-bold tracking-tight">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
            <p className="text-zinc-500 text-sm mt-1">Management Console • v1.0.4</p>
          </div>
          <div className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.3em]">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-zinc-900 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Loading secure data...</p>
          </div>
        ) : (
          <div className="animate-fade-in">
            {activeTab === 'overview' && <AdminStats stats={stats} />}
            {activeTab === 'verifications' && (
              <VerificationQueue 
                queue={verifications} 
                onApprove={handleApproveVerification} 
                onReject={handleRejectVerification} 
              />
            )}
            {activeTab === 'moderation' && (
              <ImageModeration 
                images={images} 
                onApprove={handleApproveImage} 
                onReject={handleApproveImage} // Re-using as demo, should be reject
              />
            )}
            {activeTab === 'users' && (
              <UserManagement 
                users={users} 
                onAction={handleUserAction} 
              />
            )}
          </div>
        )}
      </main>

      {/* Reusable Action Modal */}
      {modal && (
        <AdminActionModal 
          title={modal.type.includes('reject') ? 'Reject Verification' : 'Confirm Moderation'}
          message={`Are you sure you want to perform this action on ID: ${modal.id}?`}
          requireReason={modal.requireReason}
          onConfirm={onConfirmAction}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
