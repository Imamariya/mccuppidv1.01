
import React, { useState } from 'react';
import { SearchFilters } from '../../services/filterService';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onSave: (filters: SearchFilters) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, filters, onSave }) => {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-zinc-950 border-t sm:border border-zinc-900 rounded-t-[2.5rem] sm:rounded-3xl p-8 w-full max-w-md shadow-2xl flex flex-col space-y-8 pb-12 sm:pb-8">
        <header className="flex justify-between items-center">
          <h2 className="text-white text-2xl font-bold tracking-tight">Discovery Filters</h2>
          <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto space-y-8 pr-2">
          {/* Distance */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Maximum Distance</label>
              <span className="text-emerald-500 font-bold text-sm">{localFilters.distance} km</span>
            </div>
            <input 
              type="range" 
              min="10" max="200" step="5"
              value={localFilters.distance}
              onChange={(e) => setLocalFilters({...localFilters, distance: parseInt(e.target.value)})}
              className="w-full accent-emerald-500 bg-zinc-900 h-1.5 rounded-full appearance-none"
            />
          </div>

          {/* Age Range */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Age Range</label>
              <span className="text-emerald-500 font-bold text-sm">{localFilters.ageRange[0]} - {localFilters.ageRange[1]}</span>
            </div>
            <div className="flex space-x-4">
               <input 
                type="number" 
                value={localFilters.ageRange[0]}
                onChange={(e) => setLocalFilters({...localFilters, ageRange: [parseInt(e.target.value), localFilters.ageRange[1]]})}
                className="w-1/2 bg-zinc-900 border border-zinc-800 text-white p-3 rounded-xl text-sm"
               />
               <input 
                type="number" 
                value={localFilters.ageRange[1]}
                onChange={(e) => setLocalFilters({...localFilters, ageRange: [localFilters.ageRange[0], parseInt(e.target.value)]})}
                className="w-1/2 bg-zinc-900 border border-zinc-800 text-white p-3 rounded-xl text-sm"
               />
            </div>
          </div>

          {/* Verified Toggle */}
          <div className="flex justify-between items-center p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
            <div>
              <p className="text-white text-sm font-bold">Verified Only</p>
              <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest mt-0.5">Show only trusted profiles</p>
            </div>
            <button 
              onClick={() => setLocalFilters({...localFilters, verifiedOnly: !localFilters.verifiedOnly})}
              className={`w-12 h-6 rounded-full transition-all relative ${localFilters.verifiedOnly ? 'bg-emerald-500' : 'bg-zinc-800'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${localFilters.verifiedOnly ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <button 
          onClick={() => onSave(localFilters)}
          className="w-full py-4 bg-premium-green text-white font-black text-sm tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
        >
          APPLY FILTERS
        </button>
      </div>
    </div>
  );
};

export default FilterModal;
