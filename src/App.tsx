import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Rocket, Database } from 'lucide-react';
import Background from './components/Background';
import CosmicGraph from './components/CosmicGraph';
import InfoPanel from './components/InfoPanel';
import HUD from './components/HUD';
import { fetchCelestialInfo, fetchInterestingNodes, isApiConfigured } from './services/geminiService';
import { CelestialData, GraphNode } from './types';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeData, setActiveData] = useState<CelestialData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [graphLoading, setGraphLoading] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(isApiConfigured());

    const loadInitialGraph = async () => {
      const nodes = await fetchInterestingNodes();
      setGraphNodes(nodes);
      setGraphLoading(false);
    };
    loadInitialGraph();
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
       setGraphNodes(prev => [
         ...prev, 
         {
           name: data.name,
           type: data.type,
           x: data.coordinates.x,
           y: data.coordinates.y,
           z: 40,
           color: data.type.toLowerCase().includes('pulsar') ? '#00ff9d' : '#00f3ff',
           description: data.description,
           distance: data.distance
         }
       ]);
    }
    
    setLoading(false);
  };

  const handleNodeClick = (node: GraphNode) => {
    initiateSearch(node.name);
  };

  return (
    <div className="relative min-h-screen text-white font-rajdhani overflow-hidden selection:bg-neon-pink selection:text-white flex flex-col">
      <Background />

      {/* Header */}
      <header className="flex-none container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-float z-20">
        <div className="flex items-center gap-3">
            <div className="bg-neon-blue/10 p-2 rounded-lg border border-neon-blue/40 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
              <Rocket className="text-neon-blue" size={24} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-purple drop-shadow-sm">
                COSMIC LENS
              </h1>
              {/* Status Indicator */}
              <div className="flex items-center gap-2 mt-1">
                {isOnline ? (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></div>
                    <span className="text-[10px] font-orbitron text-green-400 tracking-wider">UPLINK ESTABLISHED</span>
                  </>
                ) : (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_5px_#f59e0b]"></div>
                    <span className="text-[10px] font-orbitron text-amber-400 tracking-wider">ARCHIVE MODE (OFFLINE)</span>
                  </>
                )}
              </div>
            </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full max-w-md relative group">
          <button 
            type="submit"
            className="absolute left-2 top-1.5 bg-neon-blue/10 hover:bg-neon-blue/80 text-neon-blue hover:text-black p-1.5 rounded-full transition-all z-10"
          >
            <Sparkles size={16} />
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isOnline ? "Query Galactic Database..." : "Search Archives (Simulation Mode)..."}
            className="w-full bg-space-800/40 backdrop-blur-md border border-white/10 focus:border-neon-blue/60 text-white pl-12 pr-4 py-2.5 rounded-full focus:outline-none focus:shadow-[0_0_20px_rgba(0,243,255,0.2)] transition-all font-orbitron text-sm tracking-wide"
          />
        </form>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden relative z-10 px-4 pb-4 gap-4">
        
        {/* Left: Graph */}
        <main className="flex-1 flex flex-col relative min-w-0 bg-black/20 rounded-2xl border border-white/5 backdrop-blur-sm p-1">
          {graphLoading ? (
            <div className="flex-1 flex items-center justify-center">
               <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Database size={20} className="text-neon-blue/50" />
                    </div>
                  </div>
                  <p className="font-orbitron text-xs tracking-[0.3em] text-neon-blue animate-pulse">INITIALIZING...</p>
               </div>
            </div>
          ) : (
            <div className="flex-1 w-full h-full relative flex flex-col">
              <CosmicGraph 
                data={graphNodes} 
                onNodeClick={handleNodeClick} 
                onNodeHover={setHoveredNode} 
              />
              
              {/* Quick Filters */}
              <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide pointer-events-auto z-10">
                 {['Stars', 'Nebulae', 'Black Holes', 'Exoplanets', 'Pulsars'].map((category) => (
                    <button 
                      key={category}
                      onClick={() => initiateSearch(category)}
                      className="whitespace-nowrap bg-black/60 hover:bg-neon-blue/20 border border-white/20 hover:border-neon-blue/60 px-3 py-1.5 rounded text-[10px] font-orbitron text-gray-300 hover:text-white backdrop-blur-md transition-all"
                    >
                      {category}
                    </button>
                 ))}
              </div>
            </div>
          )}
        </main>

        {/* Right: HUD (Desktop Only) */}
        <HUD node={hoveredNode} />
      
      </div>

      {/* Detail Overlay */}
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