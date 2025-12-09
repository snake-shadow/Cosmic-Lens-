import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Rocket } from 'lucide-react';
import Background from './components/Background';
import CosmicGraph from './components/CosmicGraph';
import InfoPanel from './components/InfoPanel';
import { fetchCelestialInfo, fetchInterestingNodes } from './services/geminiService';
import { CelestialData, GraphNode } from './types';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeData, setActiveData] = useState<CelestialData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [graphLoading, setGraphLoading] = useState(true);

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
           color: data.type.toLowerCase().includes('pulsar') ? '#00ff9d' : '#00f3ff'
         }
       ]);
    }
    
    setLoading(false);
  };

  const handleNodeClick = (node: GraphNode) => {
    initiateSearch(node.name);
  };

  return (
    <div className="relative min-h-screen text-white font-rajdhani overflow-hidden selection:bg-neon-pink selection:text-white">
      <Background />

      <div className="container mx-auto px-4 py-8 relative z-10 flex flex-col h-screen max-h-screen">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 animate-float">
          <div className="flex items-center gap-3">
             <div className="bg-neon-blue/20 p-2 rounded-lg border border-neon-blue/50">
                <Rocket className="text-neon-blue" size={32} />
             </div>
             <div>
                <h1 className="text-4xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-purple">
                  COSMIC LENS
                </h1>
                <p className="text-neon-purple text-sm tracking-[0.3em] opacity-80 uppercase">Interactive Explorer</p>
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
              placeholder="Search for anomaly (e.g., 'Magnetar', 'Kepler-22b')..."
              className="w-full bg-space-800/50 backdrop-blur-md border border-neon-blue/30 text-white pl-12 pr-4 py-3 rounded-full focus:outline-none focus:border-neon-blue focus:shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all font-orbitron text-sm tracking-wide"
            />
          </form>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-center justify-center relative w-full overflow-hidden">
          
          <div className="w-full h-full flex flex-col gap-6">
            <div className="flex justify-between items-end px-2">
                <h2 className="font-orbitron text-xl text-white/80">Local Cluster Visualization</h2>
                <div className="text-xs text-white/40 font-mono">
                    STATS: {graphNodes.length} OBJECTS TRACKED
                </div>
            </div>

            {graphLoading ? (
                 <div className="flex-1 w-full bg-space-900/30 rounded-2xl border border-white/5 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center">
                         <div className="w-12 h-12 border-2 border-neon-purple border-t-transparent rounded-full animate-spin mb-4"></div>
                         <p className="font-orbitron text-sm tracking-widest text-neon-purple animate-pulse">SCANNING SECTOR...</p>
                    </div>
                 </div>
            ) : (
                <div className="flex-1 w-full relative min-h-[400px]">
                    <CosmicGraph data={graphNodes} onNodeClick={handleNodeClick} />
                </div>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4">
                 {['Stars', 'Nebulae', 'Black Holes', 'Pulsars'].map((category) => (
                     <button 
                        key={category}
                        onClick={() => initiateSearch(category)}
                        className="bg-space-800/40 hover:bg-neon-blue/10 border border-white/10 hover:border-neon-blue/50 p-4 rounded-xl transition-all group text-left"
                     >
                        <h3 className="font-orbitron text-neon-blue group-hover:text-white transition-colors">{category}</h3>
                        <p className="text-xs text-gray-400 mt-1">View database entries</p>
                     </button>
                 ))}
            </div>
            
             {/* Bottom Instructional Text */}
             <div className="w-full text-center pb-2 pointer-events-none">
                <p className="font-orbitron text-xs text-neon-blue/60 tracking-[0.2em] animate-pulse">
                   HOVER YOUR MOUSE TO EXPLORE THE UNIVERSE
                </p>
             </div>
          </div>
        </main>
      </div>

      {/* Detail Panel Overlay */}
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