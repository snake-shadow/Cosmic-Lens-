import React, { useState, useEffect } from 'react';
import { Search, Sparkles, SendHorizontal, Zap } from 'lucide-react';
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
        setConnectionStatus('SYSTEM ONLINE');
        setIsSimulated(false);
      } else {
        console.warn("API Connection issue, switching to simulation:", status.message);
        setConnectionStatus('SIMULATION MODE');
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
             z: 30, 
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
    <div className="relative w-screen h-screen overflow-hidden bg-[#050508]">
      <Background />
      
      {/* LAYER 1: UNIVERSE (Z-0) */}
      <div className="absolute inset-0 z-0">
         {graphLoading ? (
            <div className="w-full h-full flex items-center justify-center flex-col">
               <div className="w-16 h-16 border-4 border-[#00f3ff] border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(0,243,255,0.4)]"></div>
               <p className="mt-6 font-display text-sm tracking-[0.3em] text-neon-blue animate-pulse uppercase">Initializing Cosmic Engine...</p>
            </div>
         ) : (
            <CosmicGraph 
              data={graphNodes} 
              onNodeClick={handleNodeClick}
              onNodeHover={setHoveredNode} 
            />
         )}
      </div>

      {/* LAYER 2: UI OVERLAYS (Z-20+) */}
      
      {/* Top Left: Logo */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none select-none">
        <div className="flex items-center gap-4">
           {/* Logo Icon */}
           <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute w-full h-full bg-[#00f3ff] opacity-20 blur-xl rounded-full animate-pulse"></div>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="relative z-10 gemini-sparkle filter drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="url(#logo-gradient)" />
                <defs>
                  <linearGradient id="logo-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00f3ff" />
                    <stop offset="1" stopColor="#00ff9d" />
                  </linearGradient>
                </defs>
              </svg>
           </div>
           
           <div>
             {/* STRICTLY ENFORCED COLORS via style prop to fix black text bug */}
             <h1 className="font-bold text-3xl tracking-wide leading-none flex flex-col sm:block" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                <span style={{ color: '#00f3ff', textShadow: '0 0 10px rgba(0, 243, 255, 0.6)' }} className="mr-2">COSMIC</span>
                <span style={{ color: '#ffffff' }} className="font-light">LENS</span>
             </h1>
             <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] animate-pulse ${isSimulated ? 'bg-yellow-400 text-yellow-400' : 'bg-[#00ff9d] text-[#00ff9d]'}`}></span>
                <span className={`text-[10px] font-bold tracking-widest uppercase opacity-90 ${isSimulated ? 'text-yellow-400' : 'text-[#00ff9d]'}`}>
                  {connectionStatus}
                </span>
             </div>
           </div>
        </div>
      </div>

      {/* Top Right: Status Badge */}
      <div className="absolute top-6 right-6 z-20 hidden md:flex items-center gap-3">
         <div className="glass-panel-neon px-4 py-2 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#bc13fe] animate-pulse"></span>
            <span className="text-xs font-bold text-white tracking-wide font-display">
               {isSimulated ? 'SIMULATION V2.1' : 'LIVE UPLINK V2.1'}
            </span>
         </div>
      </div>

      {/* Right: HUD */}
      <div className="absolute top-28 right-6 bottom-32 z-20 w-80 pointer-events-none flex flex-col justify-start">
         <HUD node={hoveredNode} status={connectionStatus} />
      </div>

      {/* Bottom: Omnibar */}
      <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
        <form onSubmit={handleSearch} className="w-full max-w-2xl pointer-events-auto transform transition-transform duration-300 hover:-translate-y-1">
           <div className="glass-panel-neon rounded-full p-2 flex items-center relative group transition-all duration-300">
              
              <div className="relative w-12 h-12 rounded-full flex items-center justify-center bg-[#00f3ff]/10 text-[#00f3ff] group-focus-within:text-[#00ff9d] transition-colors">
                 <Sparkles size={20} className="filter drop-shadow-[0_0_5px_currentColor]" />
              </div>
              
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask the Universe... (e.g. 'Show me a Quasar')" 
                className="relative flex-1 bg-transparent border-none text-white text-lg px-4 focus:ring-0 focus:outline-none font-sans placeholder-gray-400 h-12"
              />
              
              <button 
                type="submit"
                disabled={!searchQuery.trim()}
                className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${searchQuery.trim() ? 'bg-gradient-to-tr from-[#00f3ff] to-[#00ff9d] text-black shadow-[0_0_20px_rgba(0,243,255,0.4)] rotate-0 opacity-100' : 'bg-white/5 text-gray-500 -rotate-90 opacity-50'}`}
              >
                {searchQuery.trim() ? <SendHorizontal size={20} fill="currentColor" /> : <Zap size={20} />}
              </button>
           </div>
           
           <div className="text-center mt-4">
              <p className="text-[10px] text-neon-blue font-bold tracking-[0.2em] uppercase opacity-80">
                 {isSimulated ? 'Using Neural Simulation Database' : 'Powered by Gemini 2.5 Flash'}
              </p>
           </div>
        </form>
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