import React, { useState, useEffect } from 'react';
import { Sparkles, SendHorizontal, Zap, Rocket } from 'lucide-react';
import Background from './components/Background';
import CosmicGraph from './components/CosmicGraph';
import InfoPanel from './components/InfoPanel';
import HUD from './components/HUD';
import { fetchCelestialInfo, fetchInterestingNodes, checkApiConnection } from './services/geminiService';
import { CelestialData, GraphNode } from './types';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeData, setActiveData] = useState<CelestialData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('INITIALIZING...');
  const [isSimulated, setIsSimulated] = useState(false);
  const [graphLoading, setGraphLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // 1. Check Connection
      const status = await checkApiConnection();
      
      if (status.success) {
        setConnectionStatus('ONLINE');
        setIsSimulated(false);
      } else {
        // SHOW THE ACTUAL ERROR REASON (e.g. "KEY REJECTED", "QUOTA EXCEEDED")
        setConnectionStatus(status.message);
        setIsSimulated(true);
      }

      // 2. Fetch Nodes
      const nodes = await fetchInterestingNodes();
      setGraphNodes(nodes);
      setGraphLoading(false);
    };
    init();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    initiateSearch(searchQuery);
  };

  const initiateSearch = async (query: string) => {
    setLoading(true);
    setIsPanelOpen(true);
    const data = await fetchCelestialInfo(query);
    setActiveData(data);
    
    if (data.coordinates) {
       setGraphNodes(prev => {
         if (prev.find(n => n.name === data.name)) return prev;
         return [
           ...prev, 
           {
             name: data.name,
             type: data.type,
             x: data.coordinates.x,
             y: data.coordinates.y,
             z: 35, // Highlight size
             color: data.type.toLowerCase().includes('pulsar') ? '#00ff9d' : '#00f3ff',
             description: data.description,
             distance: data.distance
           }
         ];
       });
    }
    setLoading(false);
  };

  const handleNodeClick = (node: GraphNode) => {
    initiateSearch(node.name);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050508] text-slate-200 selection:bg-fuchsia-500 selection:text-white scanlines font-display">
      <Background />
      
      {/* LAYER 1: INTERACTIVE UNIVERSE (Z-0) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
         {graphLoading ? (
            <div className="flex flex-col items-center justify-center pointer-events-none">
               <div className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(34,211,238,0.4)]"></div>
               <p className="mt-8 font-display text-sm tracking-[0.4em] text-cyan-400 animate-pulse uppercase">Initializing Stellar Cartography...</p>
            </div>
         ) : (
            <div className="w-full h-full animate-enter">
               <CosmicGraph 
                  data={graphNodes} 
                  onNodeClick={handleNodeClick}
                  onNodeHover={setHoveredNode} 
               />
            </div>
         )}
      </div>

      {/* LAYER 2: UI OVERLAYS (Z-20+) */}
      
      {/* Top Left: Logo & Status */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none select-none">
        <div className="flex items-center gap-4">
           {/* Logo Icon */}
           <div className="bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)]">
               <Rocket className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" size={28} />
           </div>
           
           <div>
             <h1 className="font-bold text-3xl tracking-wide leading-none flex flex-col sm:block drop-shadow-lg font-display">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-fuchsia-500">COSMIC LENS</span>
             </h1>
             <div className="flex items-center gap-2 mt-1">
                <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] animate-pulse ${isSimulated ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                <span className={`text-[10px] font-bold tracking-[0.2em] uppercase opacity-90 font-mono ${isSimulated ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {connectionStatus}
                </span>
             </div>
           </div>
        </div>
      </div>

      {/* Top Right: Version Badge */}
      <div className="absolute top-6 right-6 z-20 hidden md:flex items-center gap-3 pointer-events-none">
         <div className="glass-panel-neon px-4 py-2 rounded-full flex items-center gap-3 bg-black/40 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-pulse"></span>
            <span className="text-xs font-bold text-white tracking-widest font-display opacity-80">
               {isSimulated ? 'SIMULATION V2.1' : 'LIVE UPLINK V2.1'}
            </span>
         </div>
      </div>

      {/* Right: HUD Panel */}
      <div className="absolute top-28 right-6 bottom-32 z-20 w-80 pointer-events-none flex flex-col justify-start">
         <HUD node={hoveredNode} status={connectionStatus} />
      </div>

      {/* Bottom: Search Omnibar */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex flex-col items-center px-4 pointer-events-none gap-3">
        <form onSubmit={handleSearch} className="w-full max-w-2xl pointer-events-auto transform transition-transform duration-300 hover:-translate-y-1">
           <div className="glass-panel-neon rounded-full p-1.5 flex items-center relative group transition-all duration-300 focus-within:ring-1 focus-within:ring-cyan-400/50 bg-black/60">
              
              <div className="relative w-12 h-12 rounded-full flex items-center justify-center text-cyan-400">
                 <Sparkles size={20} className="filter drop-shadow-[0_0_5px_currentColor]" />
              </div>
              
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask the Universe... (e.g. 'Show me a Quasar')" 
                className="relative flex-1 bg-transparent border-none text-white text-lg px-2 focus:ring-0 focus:outline-none font-mono placeholder-gray-400 h-12 tracking-wide"
              />
              
              <button 
                type="submit"
                disabled={!searchQuery.trim()}
                className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${searchQuery.trim() ? 'bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)] rotate-0 opacity-100' : 'bg-white/5 text-gray-500 -rotate-90 opacity-50'}`}
              >
                {searchQuery.trim() ? <SendHorizontal size={20} fill="currentColor" /> : <Zap size={20} />}
              </button>
           </div>
        </form>

        <p className="text-[10px] text-cyan-400 font-bold tracking-[0.2em] uppercase opacity-60 font-display animate-pulse pointer-events-none">
            {isSimulated ? 'Using Neural Simulation Database' : 'Powered by Gemini 2.5 Flash'}
        </p>
      </div>

      {isPanelOpen && (
        <InfoPanel 
          data={activeData} 
          loading={loading} 
          onClose={() => setIsPanelOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;