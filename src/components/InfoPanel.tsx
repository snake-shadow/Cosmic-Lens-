import React from 'react';
import { CelestialData } from '../types';
import { X, Globe, Thermometer, Weight, Ruler, AlertTriangle, Sparkles } from 'lucide-react';

interface InfoPanelProps {
  data: CelestialData | null;
  onClose: () => void;
  loading: boolean;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ data, onClose, loading }) => {
  if (!data && !loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm transition-all animate-enter">
      <div className={`relative w-full max-w-3xl glass-panel rounded-3xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl`}>
        
        {/* Header Area */}
        <div className="p-8 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {loading ? (
                 <div className="h-10 w-64 bg-white/5 animate-pulse rounded-lg mb-2"></div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
                      {data?.name}
                    </h2>
                    {data?.isSimulated && (
                       <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 p-1.5 rounded-full" title="Simulated Data">
                          <AlertTriangle size={16} />
                       </span>
                    )}
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-semibold uppercase tracking-wide border border-brand-blue/20">
                    {data?.type}
                  </span>
                </>
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8 bg-brand-dark/50">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-medium text-brand-purple animate-pulse">Establishing Deep Space Uplink...</p>
             </div>
          ) : data ? (
            <>
              {/* Primary Description */}
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-gray-300 leading-relaxed font-light">
                  {data.description}
                </p>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Distance", value: data.distance, icon: Ruler, color: "text-brand-blue" },
                  { label: "Mass", value: data.mass, icon: Weight, color: "text-brand-purple" },
                  { label: "Temp", value: data.temperature, icon: Thermometer, color: "text-rose-400" },
                  { label: "Discovered", value: data.discoveryYear, icon: Globe, color: "text-yellow-400" },
                ].map((stat, i) => (
                  <div key={i} className="bg-brand-surface p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className={`flex items-center gap-2 ${stat.color} mb-2`}>
                      <stat.icon size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{stat.label}</span>
                    </div>
                    <p className="font-display font-semibold text-white truncate text-base" title={stat.value}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Fun Fact Card */}
              <div className="relative group overflow-hidden rounded-2xl">
                 <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/20 to-brand-blue/20 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                 <div className="relative p-6 border border-white/10 bg-white/[0.02] backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-3 text-brand-text">
                       <Sparkles size={16} className="text-yellow-300" />
                       <h3 className="text-xs font-bold uppercase tracking-widest text-white/70">Did you know?</h3>
                    </div>
                    <p className="text-white font-medium italic leading-relaxed">
                      "{data.funFact}"
                    </p>
                 </div>
              </div>
              
              {data.isSimulated && (
                <p className="text-xs text-center text-gray-600 pt-4">
                  * Data simulated for demonstration purposes. Connect API Key for live results.
                </p>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;