import React from 'react';
import { CelestialData } from '../types';
import { X, Globe, Thermometer, Weight, Ruler } from 'lucide-react';

interface InfoPanelProps {
  data: CelestialData | null;
  onClose: () => void;
  loading: boolean;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ data, onClose, loading }) => {
  if (!data && !loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-500">
      <div className="relative w-full max-w-2xl bg-space-800/90 border border-neon-blue/30 rounded-2xl shadow-[0_0_50px_rgba(188,19,254,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-start bg-gradient-to-r from-space-700/50 to-transparent">
          <div>
            {loading ? (
               <div className="h-8 w-48 bg-white/10 animate-pulse rounded"></div>
            ) : (
              <>
                <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
                  {data?.name}
                </h2>
                <p className="text-neon-pink font-rajdhani text-xl mt-1 tracking-wide uppercase">{data?.type}</p>
              </>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
                <p className="font-orbitron text-neon-blue animate-pulse">Establishing Uplink...</p>
             </div>
          ) : data ? (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-space-900/50 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2 text-neon-blue mb-1">
                    <Ruler size={14} />
                    <span className="text-xs font-orbitron">DISTANCE</span>
                  </div>
                  <p className="font-rajdhani font-semibold text-lg">{data.distance}</p>
                </div>
                <div className="bg-space-900/50 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2 text-neon-purple mb-1">
                    <Weight size={14} />
                    <span className="text-xs font-orbitron">MASS</span>
                  </div>
                  <p className="font-rajdhani font-semibold text-lg truncate" title={data.mass}>{data.mass}</p>
                </div>
                <div className="bg-space-900/50 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2 text-neon-pink mb-1">
                    <Thermometer size={14} />
                    <span className="text-xs font-orbitron">TEMP</span>
                  </div>
                  <p className="font-rajdhani font-semibold text-lg">{data.temperature}</p>
                </div>
                <div className="bg-space-900/50 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2 text-yellow-400 mb-1">
                    <Globe size={14} />
                    <span className="text-xs font-orbitron">DISCOVERED</span>
                  </div>
                  <p className="font-rajdhani font-semibold text-lg">{data.discoveryYear}</p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gradient-to-br from-white/5 to-transparent p-5 rounded-xl border border-white/5">
                <h3 className="font-orbitron text-white text-lg mb-2">Analysis</h3>
                <p className="font-rajdhani text-lg leading-relaxed text-gray-300">
                  {data.description}
                </p>
              </div>

              {/* Fun Fact */}
              <div className="relative overflow-hidden group">
                <div className="absolute inset-0 bg-neon-purple/20 blur-xl group-hover:bg-neon-purple/30 transition-all"></div>
                <div className="relative bg-space-900/80 p-5 rounded-xl border border-neon-purple/50">
                  <h3 className="font-orbitron text-neon-purple text-sm mb-2 uppercase tracking-widest">Anomaly Detected</h3>
                  <p className="font-rajdhani text-white italic text-lg">
                    "{data.funFact}"
                  </p>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;