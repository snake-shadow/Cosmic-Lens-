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
  const [connectionStatus, setConnectionStatus] = useState<string>('Initializing...');
  const [graphLoading, setGraphLoading] = useState(true);

  // Initial Data Load
  useEffect(() => {
    const init = async () => {
      // 1. Check Connection
      const status = await checkApiConnection();
      setConnectionStatus(status.message);

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
    
    // Add searched item to graph dynamically if it has coords
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
             z: 30, // Default size
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
    <div className="relative w-screen h-screen overflow-hidden font-sans bg-brand-dark selection:bg-brand-blue selection:text-black">
      <Background />
      
      {/* --- LAYER 1: THE UNIVERSE (Full Screen) --- */}
      <div className="absolute inset-0 z-0">
         {graphLoading ? (
            <div className="w-full h-full flex items-center justify-center flex-col">
               <div className="w-16 h-16 border-4 border-brand-blue border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(0,243,255,0.4)]"></div>
               <p className="mt-6 font-display text-sm tracking-[0.3em] text-brand-blue animate-pulse uppercase">Initializing Cosmic Engine...</p>
            </div>
         ) : (
            <CosmicGraph 
              data={graphNodes} 
              onNodeClick={handleNodeClick}
              onNodeHover={setHoveredNode} 
            />
         )}
      </div>

      {/* --- LAYER 2: UI OVERLAYS (Professional Floating UI) --- */}
      
      {/* Top Left: Brand / Logo Area */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none select-none">
        <div className="flex items-center gap-4">
           {/* Custom Gemini-style Logo - Restored Electric Gradients */}
           <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute w-full h-full bg-gradient-to-tr from-brand-blue to-brand-green opacity-40 blur-xl rounded-full animate-pulse-slow"></div>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white relative z-10 gemini-sparkle filter drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
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
             <h1 className="font-display font-bold text-3xl tracking-wide text-white leading-none">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-green filter drop-shadow-[0_0_8px_rgba(0,243,255,0.3)]">COSMIC</span>
                <span className="font-light ml-1">LENS</span>
             </h1>
             <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${connectionStatus === 'ONLINE' ? 'bg-brand-green shadow-[0_0_10px_#00ff9d]' : 'bg-red-500 shadow-[0_0_10px_red]'}`}></span>
                <span className="text-[10px] font-medium text-brand-blue tracking-widest uppercase opacity-80">{connectionStatus}</span>
             </div>
           </div>
        </div>
      </div>

      {/* Top Right: User / Settings Placeholder */}
      <div className="absolute top-6 right-6 z-20 hidden md:flex items-center gap-3">
         <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 border-brand-blue/30 shadow-[0_0_15px_rgba(0,243,255,0.1)]">
            <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse"></span>
            <span className="text-xs font-bold text-white tracking-wide">PLAYGROUND V2.1</span>
         </div>
      </div>

      {/* Right Side: Floating HUD Card */}
      <div className="absolute top-28 right-6 bottom-32 z-20 w-80 pointer-events-none flex flex-col justify-start">
         <HUD node={hoveredNode} status={connectionStatus} />
      </div>

      {/* Bottom Center: The "Omnibar" - Restored Electric Look */}
      <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
        <form onSubmit={handleSearch} className="w-full max-w-2xl pointer-events-auto transform transition-transform duration-300 hover:-translate-y-1">
           <div className="glass-input rounded-full p-2 flex items-center shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative group border-brand-blue/30">
              
              {/* Dynamic Glow Background */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-blue via-brand-purple to-brand-green opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
              
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-brand-blue/10 text-brand-blue group-focus-within:text-brand-green transition-colors">
                 <Sparkles size={20} className="filter drop-shadow-[0_0_5px_currentColor]" />
              </div>
              
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask the Universe... (e.g. 'Show me a Quasar')" 
                className="flex-1 bg-transparent border-none text-white text-lg px-4 focus:ring-0 focus:outline-none font-sans placeholder-gray-500 h-12"
              />
              
              <button 
                type="submit"
                disabled={!searchQuery.trim()}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${searchQuery.trim() ? 'bg-gradient-to-tr from-brand-blue to-brand-green text-black shadow-[0_0_20px_rgba(0,243,255,0.4)] rotate-0 opacity-100' : 'bg-white/5 text-gray-600 -rotate-90 opacity-50'}`}
              >
                {searchQuery.trim() ? <SendHorizontal size={20} fill="currentColor" /> : <Zap size={20} />}
              </button>
           </div>
           
           <div className="text-center mt-4">
              <p className="text-[10px] text-brand-blue/60 font-bold tracking-[0.2em] uppercase text-shadow-glow">
                Powered by Gemini 2.5 Flash
              </p>
           </div>
        </form>
      </div>

      {/* MODAL: Full Data View */}
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