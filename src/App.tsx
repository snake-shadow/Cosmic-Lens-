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
             color: data.type.toLowerCase().includes('pulsar') ? '#00ff9d' : '#4da6ff',
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
    <div className="relative w-screen h-screen overflow-hidden font-sans bg-brand-dark selection:bg-brand-blue selection:text-white">
      <Background />
      
      {/* --- LAYER 1: THE UNIVERSE (Full Screen) --- */}
      <div className="absolute inset-0 z-0">
         {graphLoading ? (
            <div className="w-full h-full flex items-center justify-center flex-col">
               <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
               <p className="mt-6 font-display text-sm tracking-widest text-brand-blue/80 animate-pulse uppercase">Booting Cosmic Engine...</p>
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
           {/* Custom Gemini-style Logo */}
           <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute w-full h-full bg-gradient-to-tr from-brand-blue to-brand-purple opacity-20 blur-lg rounded-full"></div>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white relative z-10 gemini-sparkle">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="url(#logo-gradient)" />
                <defs>
                  <linearGradient id="logo-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4da6ff" />
                    <stop offset="1" stopColor="#9d4dff" />
                  </linearGradient>
                </defs>
              </svg>
           </div>
           
           <div>
             <h1 className="font-display font-bold text-2xl tracking-tight text-white leading-none">Cosmic<span className="text-brand-blue font-light">Lens</span></h1>
             <div className="flex items-center gap-2 mt-1">
                <span className={`w-1.5 h-1.5 rounded-full ${connectionStatus === 'ONLINE' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'bg-red-400'}`}></span>
                <span className="text-[10px] font-medium text-gray-400 tracking-wide uppercase">{connectionStatus}</span>
             </div>
           </div>
        </div>
      </div>

      {/* Top Right: User / Settings Placeholder (adds to the 'App' feel) */}
      <div className="absolute top-6 right-6 z-20 hidden md:flex items-center gap-3">
         <div className="glass-panel px-3 py-1.5 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-purple"></span>
            <span className="text-xs font-medium text-gray-300">Playground v2.1</span>
         </div>
      </div>

      {/* Right Side: Floating HUD Card */}
      <div className="absolute top-24 right-6 bottom-24 z-20 w-80 pointer-events-none flex flex-col justify-start">
         <HUD node={hoveredNode} status={connectionStatus} />
      </div>

      {/* Bottom Center: The "Omnibar" */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
        <form onSubmit={handleSearch} className="w-full max-w-2xl pointer-events-auto">
           <div className="glass-input rounded-full p-1.5 flex items-center shadow-2xl relative group">
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple opacity-0 group-hover:opacity-10 transition-opacity blur-xl"></div>
              
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent text-brand-blue">
                 <Sparkles size={18} />
              </div>
              
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask Cosmic Lens anything (e.g., 'Compare Earth and Mars')..." 
                className="flex-1 bg-transparent border-none text-white text-base px-2 focus:ring-0 focus:outline-none font-sans placeholder-gray-500 h-10"
              />
              
              <button 
                type="submit"
                disabled={!searchQuery.trim()}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${searchQuery.trim() ? 'bg-brand-blue text-black rotate-0 opacity-100 hover:bg-white' : 'bg-white/5 text-gray-500 -rotate-90 opacity-50'}`}
              >
                {searchQuery.trim() ? <SendHorizontal size={18} /> : <Zap size={18} />}
              </button>
           </div>
           
           <div className="text-center mt-3">
              <p className="text-[10px] text-gray-500 font-medium tracking-wide">
                POWERED BY GOOGLE GEMINI 2.5 • EXPLORE RESPONSIBLY
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