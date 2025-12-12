import React from 'react';
import { GraphNode } from '../types';
import { Crosshair, Radio, Activity, Radar, Scan } from 'lucide-react';

interface HUDProps {
  node: GraphNode | null;
  status: string;
}

const HUD: React.FC<HUDProps> = ({ node, status }) => {
  // STANDBY MODE: Balances the visual layout when no node is selected
  if (!node) {
     return (
        <div className="pointer-events-auto w-full animate-enter opacity-70 hover:opacity-100 transition-opacity duration-500">
           <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/10"></div>
              
              <div className="flex flex-col gap-4">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-400">
                       <Scan size={16} className="animate-pulse" />
                       <span className="text-xs font-bold tracking-widest uppercase">Scanner Active</span>
                    </div>
                    <Activity size={16} className="text-neon-blue animate-pulse-slow" />
                 </div>
                 
                 <div className="h-32 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/20">
                    <div className="text-center">
                       <Radar size={32} className="text-white/20 mx-auto mb-2 animate-spin-slow" />
                       <p className="text-[10px] text-gray-500 font-mono mt-2">WAITING FOR TARGET LOCK...</p>
                    </div>
                 </div>

                 <div className="flex justify-between text-[10px] font-mono text-gray-600 border-t border-white/5 pt-2">
                    <span>SYS: {status}</span>
                    <span>RELAY: ACTIVE</span>
                 </div>
              </div>
           </div>
        </div>
     );
  }

  // ACTIVE MODE: Shows details when hovering a node
  return (
    <div className="pointer-events-auto w-full animate-enter">
      <div className="glass-panel rounded-3xl p-6 relative overflow-hidden group hover:bg-white/[0.05] transition-colors shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        
        {/* Decorative Header Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00f3ff] via-[#bc13fe] to-transparent opacity-80"></div>

        {/* Header */}
        <div className="flex justify-between items-start mb-5">
           <div>
              <div className="flex items-center gap-1.5 text-[#00f3ff] mb-1.5">
                 <Crosshair size={12} strokeWidth={3} />
                 <span className="text-[10px] font-bold tracking-wider uppercase opacity-80 animate-pulse">Target Lock Acquired</span>
              </div>
              <h2 className="font-display font-bold text-3xl text-white leading-tight drop-shadow-md">{node.name}</h2>
           </div>
           <div className="flex flex-col items-end">
             <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-semibold text-gray-200 uppercase tracking-wide shadow-sm">
               {node.type}
             </span>
           </div>
        </div>

        {/* Content */}
        <div className="space-y-5">
           <div className="text-sm font-sans text-gray-300 leading-relaxed border-l-2 border-[#bc13fe]/50 pl-3">
              {node.description || "Analyzing deep space signature..."}
           </div>

           <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#050508]/50 rounded-xl p-3 border border-white/10">
                 <span className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Distance</span>
                 <span className="text-sm font-medium text-[#00f3ff] truncate block">
                    {node.distance || "Calculated..."}
                 </span>
              </div>
              <div className="bg-[#050508]/50 rounded-xl p-3 border border-white/10">
                 <span className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Mass Est.</span>
                 <span className="text-sm font-medium text-white block">
                    {node.z} <span className="text-gray-500 text-xs">Solar Masses</span>
                 </span>
              </div>
           </div>
           
           <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                 <Radio size={14} className="text-[#bc13fe] animate-pulse" />
                 <span className="text-[10px] text-gray-400 font-medium">LIVE TELEMETRY</span>
              </div>
              <span className="font-mono text-[10px] text-[#00ff9d]">
                X:{node.x.toFixed(1)} Y:{node.y.toFixed(1)}
              </span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HUD;