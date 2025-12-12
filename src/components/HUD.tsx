import React from 'react';
import { GraphNode } from '../types';
import { Crosshair, Radio, Activity } from 'lucide-react';

interface HUDProps {
  node: GraphNode | null;
  status: string;
}

const HUD: React.FC<HUDProps> = ({ node, status }) => {
  if (!node) return null;

  return (
    <div className="pointer-events-auto w-full animate-enter">
      <div className="glass-panel rounded-3xl p-6 relative overflow-hidden group hover:bg-white/[0.02] transition-colors">
        
        {/* Decorative Header Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-blue via-brand-purple to-transparent opacity-60"></div>

        {/* Header */}
        <div className="flex justify-between items-start mb-5">
           <div>
              <div className="flex items-center gap-1.5 text-brand-blue mb-1.5">
                 <Crosshair size={12} strokeWidth={3} />
                 <span className="text-[10px] font-bold tracking-wider uppercase opacity-80">Target Lock</span>
              </div>
              <h2 className="font-display font-bold text-3xl text-white leading-tight">{node.name}</h2>
           </div>
           <div className="flex flex-col items-end">
             <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-gray-300 uppercase tracking-wide">
               {node.type}
             </span>
           </div>
        </div>

        {/* Content */}
        <div className="space-y-5">
           <div className="text-sm font-sans text-gray-400 leading-relaxed border-l-2 border-brand-purple/30 pl-3">
              {node.description || "Waiting for deep scan analysis..."}
           </div>

           <div className="grid grid-cols-2 gap-3">
              <div className="bg-brand-surface rounded-xl p-3 border border-white/5">
                 <span className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Distance</span>
                 <span className="text-sm font-medium text-brand-blue truncate block">
                    {node.distance || "Unknown"}
                 </span>
              </div>
              <div className="bg-brand-surface rounded-xl p-3 border border-white/5">
                 <span className="block text-[10px] text-gray-500 font-bold uppercase mb-1">Mass Est.</span>
                 <span className="text-sm font-medium text-white block">
                    {node.z} <span className="text-gray-600 text-xs">Solar Masses</span>
                 </span>
              </div>
           </div>
           
           <div className="pt-4 border-t border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                 <Radio size={14} className="text-brand-purple animate-pulse" />
                 <span className="text-[10px] text-gray-500 font-medium">LIVE TELEMETRY</span>
              </div>
              <span className="font-mono text-[10px] text-gray-600">
                {node.x.toFixed(2)} / {node.y.toFixed(2)}
              </span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HUD;