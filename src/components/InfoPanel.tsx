import React from 'react';
import { CelestialData } from '../types';
import { X, Globe, Thermometer, Weight, Ruler, Sparkles } from 'lucide-react';

interface InfoPanelProps {
  data: CelestialData | null;
  onClose: () => void;
  loading: boolean;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ data, onClose, loading }) => {
  if (!data && !loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm transition-all animate-enter">
      <div className={`relative w-full max-w-3xl glass-panel rounded-3xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl bg-[#0f111a]/90`}>
        
        {/* Header Area */}
        <div className="p-8 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {loading ? (
                 <div className="h-10 w-64 bg-white/5 animate-pulse rounded-lg mb-2"></div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
                      {data?.name}
                    </h2>
                    {data?.isSimulated && (
                       <span className="bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-mono tracking-widest text-amber-500 uppercase">
                          Simulated Data
                       </span>
                    )}
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wide border border-cyan-500/20 font-mono">
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
        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-medium text-fuchsia-400 animate-pulse font-mono">Establishing Deep Space Uplink...</p>
             </div>
          ) : data ? (
            <>
              {/* Primary Description */}
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-gray-300 leading-relaxed font-light font-sans">
                  {data.description}
                </p>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Distance", value: data.distance, icon: Ruler, color: "text-cyan-400" },
                  { label: "Mass", value: data.mass, icon: Weight, color: "text-fuchsia-400" },
                  { label: "Temp", value: data.temperature, icon: Thermometer, color: "text-rose-400" },
                  { label: "Discovered", value: data.discoveryYear, icon: Globe, color: "text-amber-400" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className={`flex items-center gap-2 ${stat.color} mb-2`}>
                      <stat.icon size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono">{stat.label}</span>
                    </div>
                    <p className="font-display font-semibold text-white truncate text-base" title={stat.value}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Fun Fact Card */}
              <div className="relative group overflow-hidden rounded-2xl border border-white/10">
                 <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-900/20 to-cyan-900/20 opacity-50"></div>
                 <div className="relative p-6 bg-white/[0.02] backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-3">
                       <Sparkles size={16} className="text-amber-300" />
                       <h3 className="text-xs font-bold uppercase tracking-widest text-white/70 font-mono">Did you know?</h3>
                    </div>
                    <p className="text-white font-medium italic leading-relaxed font-sans">
                      "{data.funFact}"
                    </p>
                 </div>
              </div>
              
              {data.isSimulated && (
                <div className="text-center pt-2">
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                    * Connection Offline. Displaying generated simulation.
                    </p>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;