
import React, { useState } from 'react';

interface AdminActionModalProps {
  title: string;
  message: string;
  requireReason?: boolean;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
}

const AdminActionModal: React.FC<AdminActionModalProps> = ({ title, message, requireReason, onConfirm, onCancel }) => {
  const [reason, setReason] = useState('');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-in">
        <h2 className="text-white text-xl font-bold mb-2">{title}</h2>
        <p className="text-zinc-400 text-sm mb-6">{message}</p>
        
        {requireReason && (
          <textarea 
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for this action..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white text-sm focus:border-emerald-500 outline-none mb-6 min-h-[100px] resize-none"
          />
        )}

        <div className="flex gap-4">
          <button 
            onClick={() => onConfirm(requireReason ? reason : undefined)}
            disabled={requireReason && !reason.trim()}
            className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all tracking-widest disabled:opacity-30"
          >
            CONFIRM
          </button>
          <button 
            onClick={onCancel}
            className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-bold rounded-xl transition-all tracking-widest"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminActionModal;
