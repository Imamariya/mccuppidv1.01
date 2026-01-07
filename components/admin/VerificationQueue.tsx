
import React from 'react';
import { VerificationRequest } from '../../services/adminService';

interface VerificationQueueProps {
  queue: VerificationRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const VerificationQueue: React.FC<VerificationQueueProps> = ({ queue, onApprove, onReject }) => {
  if (queue.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 p-12 rounded-2xl text-center">
        <p className="text-zinc-500 italic">No pending verifications at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {queue.map((req) => (
        <div key={req.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col md:flex-row">
          {/* Photos */}
          <div className="md:w-1/3 flex p-4 gap-2 overflow-x-auto bg-black/20">
             <div className="shrink-0 space-y-2">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block text-center">Selfie (Private)</span>
                <img src={req.verification_selfie_url} className="w-32 h-44 object-cover rounded-xl border border-emerald-500/50" alt="Selfie" />
             </div>
             <div className="shrink-0 space-y-2">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block text-center">Profile Photo</span>
                <img src={req.profile_images[0]} className="w-32 h-44 object-cover rounded-xl border border-zinc-800" alt="Profile" />
             </div>
          </div>

          {/* Details */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-white text-xl font-bold">{req.name}, {req.age}</h3>
                <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-full">{req.gender}</span>
              </div>
              <p className="text-emerald-500 text-xs font-bold mt-1">{req.relationship_type}</p>
              <p className="text-zinc-500 text-sm mt-4">{req.email}</p>
            </div>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => onApprove(req.id)}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors text-sm tracking-widest"
              >
                APPROVE
              </button>
              <button 
                onClick={() => onReject(req.id)}
                className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-red-400 font-bold rounded-xl transition-colors text-sm tracking-widest border border-red-500/20"
              >
                REJECT
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VerificationQueue;
