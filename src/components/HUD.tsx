import React from 'react';
import { GraphNode } from '../types';
import { Radar, Target, Wifi } from 'lucide-react';

interface HUDProps {
  node: GraphNode | null;
}

const HUD: React.FC<HUDProps> = ({ node }) => {
  return (
    <div className="hidden md:flex flex-col w-80 h-full bg-space-900/40 border-l border-white/10 backdrop-blur-md relative overflow-hidden transition-all duration-300">
      {/* HUD Header */}
      <div className="p-4 border-b border-neon-blue/20 bg-black/20 flex justify-between items-center">
        <div className="flex items-center gap-2 text-neon-blue">
          <Radar size={18} className="animate-spin-slow" style={{ animationDuration: '4s' }} />
          <span className="font-orbitron text-xs tracking-widest">SCANNER ACTIVE</span>
        </div>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-neon-blue rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-neon-blue rounded-full animate-pulse delay-75"></div>
          <div className="w-1 h-1 bg-neon-blue rounded-full animate-pulse delay-150"></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 flex flex-col relative">
        {/* Animated Background Grid in HUD */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ 
            backgroundImage: 'radial-gradient(circle, #00f3ff 1px, transparent 1px)', 
            backgroundSize: '20px 20px' 
          }}
        ></div>

        {node ? (
          <div className="relative z-10 flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Object Header */}
            <div>
              <p className="text-neon-purple font-rajdhani text-sm uppercase tracking-wider mb-1 flex items-center gap-2">
                 <Target size={12} /> LOCKED ON
              </p>
              <h2 className="text-3xl font-orbitron text-white leading-tight shadow-neon">{node.name}</h2>
              <div className="h-0.5 w-1/2 bg-gradient-to-r from-neon-blue to-transparent mt-2"></div>
            </div>

            {/* Visual Indicator (Mock Spectrum) */}
            <div className="flex gap-1 h-2 w-full my-2 opacity-80">
               {Array.from({ length: 20 }).map((_, i) => (
                   <div 
                    key={i} 
                    className="flex-1 rounded-sm transition-all duration-500" 
                    style={{ 
                        backgroundColor: node.color, 
                        opacity: Math.random() * 0.5 + 0.3,
                        height: `${Math.random() * 100}%` 
                    }}
                   ></div>
               ))}
            </div>

            {/* Key Data */}
            <div className="grid grid-cols-1 gap-3">
               <div className="bg-space-800/50 p-3 border-l-2 border-neon-blue rounded-r-lg">
                  <span className="block text-xs text-gray-400 font-orbitron">CLASSIFICATION</span>
                  <span className="text-lg text-neon-blue font-rajdhani font-semibold">{node.type}</span>
               </div>
               
               {node.distance && (
                 <div className="bg-space-800/50 p-3 border-l-2 border-neon-purple rounded-r-lg">
                    <span className="block text-xs text-gray-400 font-orbitron">DISTANCE</span>
                    <span className="text-lg text-neon-purple font-rajdhani font-semibold">{node.distance}</span>
                 </div>
               )}
            </div>

            {/* Description Box */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl mt-2 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-1">
                 <div className="w-2 h-2 border-t border-r border-white/30"></div>
               </div>
               <div className="absolute bottom-0 left-0 p-1">
                 <div className="w-2 h-2 border-b border-l border-white/30"></div>
               </div>
               
               <p className="font-rajdhani text-gray-200 text-lg leading-relaxed">
                  {node.description || "Analyzing composition... High energy readings detected. Precise data unavailable."}
               </p>
            </div>
            
            <div className="mt-auto text-xs text-center text-gray-500 font-mono pt-4">
               COORDS: {node.x.toFixed(2)} | {node.y.toFixed(2)} | {node.z}
            </div>

          </div>
        ) : (
          // Idle State
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-neon-blue/20 blur-xl rounded-full animate-pulse"></div>
                <Wifi size={64} className="text-neon-blue animate-pulse" />
            </div>
            <h3 className="font-orbitron text-xl text-white mb-2">SYSTEM IDLE</h3>
            <p className="font-rajdhani text-sm max-w-[200px]">
              Hover over celestial objects in the Deep Field to analyze signature.
            </p>
          </div>
        )}
      </div>
      
      {/* Decorative Footer */}
      <div className="h-1 w-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink"></div>
    </div>
  );
};

export default HUD;
