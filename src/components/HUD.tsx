import React from 'react';
import { GraphNode } from '../types';
import { Scan, Activity, Database, AlertCircle } from 'lucide-react';

interface HUDProps {
  node: GraphNode | null;
  status: string;
}

const HUD: React.FC<HUDProps> = ({ node, status }) => {
  return (
    <div className="w-full h-full flex flex-col p-4 relative overflow-hidden">
      {/* HUD Background Decorations */}
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-neon-blue/30 rounded-tr-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-neon-blue/30 rounded-br-3xl pointer-events-none"></div>
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2 text-neon-blue">
          <Activity size={18} className="animate-pulse" />
          <span className="font-orbitron text-sm tracking-widest">ANALYSIS_DECK_01</span>
        </div>
        <div className="font-mono text-xs text-gray-400">
           STATUS: <span className={status === 'online' ? "text-green-400" : "text-yellow-400"}>{status.toUpperCase()}</span>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        {node ? (
          <div className="animate-in slide-in-from-right duration-300 fade-in flex flex-col h-full">
            {/* Object Title */}
            <div className="mb-6 relative">
              <div className="absolute -left-4 top-1 w-1 h-full bg-neon-purple/50"></div>
              <p className="font-orbitron text-xs text-neon-purple tracking-widest uppercase mb-1">TARGET LOCKED</p>
              <h1 className="font-rajdhani font-bold text-5xl text-white text-glow-blue leading-none">{node.name}</h1>
              <div className="mt-2 flex items-center gap-2">
                 <span className="px-2 py-0.5 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-xs font-mono rounded">{node.type}</span>
                 {node.distance && <span className="px-2 py-0.5 bg-white/5 border border-white/20 text-gray-300 text-xs font-mono rounded">{node.distance}</span>}
              </div>
            </div>

            {/* Simulated Data Stream */}
            <div className="bg-black/40 border border-white/10 rounded-lg p-4 mb-4 flex-1 overflow-hidden relative">
               <div className="scanlines absolute inset-0 opacity-20 pointer-events-none"></div>
               <p className="font-rajdhani text-lg leading-relaxed text-gray-200">
                 {node.description || "Data fragments retrieved. High-energy signature detected. Further analysis required."}
               </p>
               
               {/* Decorative Fake Code */}
               <div className="mt-6 font-mono text-[10px] text-green-500/50 leading-tight select-none">
                  {`> ACCESSING RECORD ${node.x.toFixed(0)}-${node.y.toFixed(0)}`} <br/>
                  {`> SPECTRAL ANALYSIS: ${node.color.toUpperCase()}`} <br/>
                  {`> GRAVITATIONAL LENSING: DETECTED`} <br/>
                  {`> ...`}
               </div>
            </div>

            {/* Coordinates / Footer */}
            <div className="mt-auto grid grid-cols-3 gap-2 font-mono text-xs text-gray-500 border-t border-white/10 pt-4">
               <div>
                  <span className="block text-gray-700">X-POS</span>
                  {node.x.toFixed(4)}
               </div>
               <div>
                  <span className="block text-gray-700">Y-POS</span>
                  {node.y.toFixed(4)}
               </div>
               <div>
                  <span className="block text-gray-700">MASS</span>
                  EST. {node.z}
               </div>
            </div>
          </div>
        ) : (
          /* IDLE STATE */
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
            <Scan size={80} className="text-neon-blue animate-spin-slow mb-4" />
            <h2 className="font-orbitron text-xl text-white">SCANNER IDLE</h2>
            <p className="font-rajdhani mt-2 max-w-xs mx-auto">
              Hover cursor over sectors in the main view to initiate data stream.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HUD;