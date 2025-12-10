import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Rocket } from 'lucide-react';
import Background from './components/Background';
import CosmicGraph from './components/CosmicGraph';
import InfoPanel from './components/InfoPanel';
import HUD from './components/HUD';
import { fetchCelestialInfo, fetchInterestingNodes } from './services/geminiService';
import { CelestialData, GraphNode } from './types';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeData, setActiveData] = useState<CelestialData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [graphLoading, setGraphLoading] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);

  // Initial Data Load
  useEffect(() => {
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
    
    // Add searched item to graph dynamically if it has coords
    if (data.coordinates) {
       setGraphNodes(prev => [
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
       ]);
    }
    
    setLoading(false);
  };

  const handleNodeClick = (node: GraphNode) => {
    // We still support click for deep dives if user wants more than the HUD offers
    initiateSearch(node.name);
  };

  return (
    <div className="relative min-h-screen text-white font-rajdhani overflow-hidden selection:bg-neon-pink selection:text-white flex flex-col">
      <Background />

      {/* Header - Fixed Top */}
      <header className="flex-none container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-float z-20">
        <div className="flex items-center gap-3">
            <div className="bg-neon-blue/20 p-2 rounded-lg border border-neon-blue/50">
              <Rocket className="text-neon-blue" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-purple">
                COSMIC LENS
              </h1>
            </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full max-w-md relative group">
          <button 
            type="submit"
            className="absolute left-2 top-1.5 bg-neon-blue/20 hover:bg-neon-blue text-neon-blue hover:text-black p-1.5 rounded-full transition-all z-10"
          >
            <Sparkles size={16} />
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search database..."
            className="w-full bg-space-800/50 backdrop-blur-md border border-neon-blue/30 text-white pl-12 pr-4 py-2 rounded-full focus:outline-none focus:border-neon-blue focus:shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all font-orbitron text-sm tracking-wide"
          />
        </form>
      </header>

      {/* Main Layout - Split View */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Left/Center - Graph Area */}
        <main className="flex-1 flex flex-col p-4 relative min-w-0">
          
          {graphLoading ? (
                <div className="flex-1 w-full bg-space-900/30 rounded-2xl border border-white/5 backdrop-blur-sm flex items-center justify-center">
                  <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-2 border-neon-purple border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="font-orbitron text-sm tracking-widest text-neon-purple animate-pulse">SCANNING SECTOR...</p>
                  </div>
                </div>
          ) : (
              <div className="flex-1 w-full relative h-full flex flex-col gap-4">
                  <CosmicGraph 
                    data={graphNodes} 
                    onNodeClick={handleNodeClick} 
                    onNodeHover={setHoveredNode} 
                  />
                  
                  {/* Category Filter Quick Links */}
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {['Stars', 'Nebulae', 'Black Holes', 'Exoplanets'].map((category) => (
                        <button 
                          key={category}
                          onClick={() => initiateSearch(category)}
                          className="whitespace-nowrap bg-space-800/60 hover:bg-neon-blue/20 border border-white/10 hover:border-neon-blue/50 px-4 py-2 rounded-lg transition-all text-xs font-orbitron text-neon-blue hover:text-white"
                        >
                          {category}
                        </button>
                    ))}
                  </div>

                  {/* Instructional Overlay */}
                  <div className="absolute bottom-16 left-0 w-full text-center pointer-events-none md:hidden">
                    <p className="font-orbitron text-[10px] text-neon-blue/60 tracking-[0.2em] animate-pulse bg-black/40 inline-block px-2 rounded">
                      TAP NODES TO SCAN
                    </p>
                  </div>
              </div>
          )}
        </main>

        {/* Right - HUD Panel */}
        <HUD node={hoveredNode} />
      
      </div>

      {/* Detail Panel Overlay (Only for Deep Dives/Search) */}
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
