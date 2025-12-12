import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Database } from 'lucide-react';
import Background from './components/Background';
import CosmicGraph from './components/CosmicGraph';
import InfoPanel from './components/InfoPanel';
import HUD from './components/HUD';
import { fetchCelestialInfo, fetchInterestingNodes, checkApiConnection } from './services/geminiService';
import { CelestialData, GraphNode } from './types';

const App: React.FC = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeData, setActiveData] = useState<CelestialData | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Graph & HUD State
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [graphLoading, setGraphLoading] = useState(true);

  // Initialization
  useEffect(() => {
    const init = async () => {
      const isOnline = await checkApiConnection();
      setConnectionStatus(isOnline ? 'online' : 'offline');

      const nodes = await fetchInterestingNodes();
      setGraphNodes(nodes);
      setGraphLoading(false);
    };
    init();
  }, []);

  // Handlers
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    performSearch(searchQuery);
  };

  const performSearch = async (query: string) => {
    setLoading(true);
    setIsPanelOpen(true); // Open modal for full details
    const data = await fetchCelestialInfo(query);
    setActiveData(data);
    
    // Add to graph if it has coords
    if (data.coordinates) {
      setGraphNodes(prev => {
        // Prevent duplicates
        if (prev.find(n => n.name === data.name)) return prev;
        return [...prev, {
          name: data.name,
          type: data.type,
          x: data.coordinates.x,
          y: data.coordinates.y,
          z: 40,
          color: '#ffffff', // Default for user searches
          description: data.description,
          distance: data.distance
        }];
      });
    }
    setLoading(false);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden font-rajdhani flex flex-col bg-space-900">
      <Background />
      <div className="scanlines fixed inset-0 z-50 pointer-events-none opacity-20"></div>

      {/* --- TOP BAR --- */}
      <header className="flex-none h-16 flex items-center justify-between px-6 border-b border-white/10 bg-black/40 backdrop-blur-md z-30">
        <div className="flex items-center gap-4">
           <div className="w-8 h-8 rounded bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
             <Sparkles size={16} className="text-white" />
           </div>
           <div>
             <h1 className="font-orbitron font-bold text-xl tracking-wider text-white">COSMIC<span className="text-neon-blue">LENS</span></h1>
             <p className="text-[10px] text-gray-400 tracking-[0.3em]">INTERSTELLAR EXPLORER v2.0</p>
           </div>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="relative w-96 hidden md:block">
           <Search className="absolute left-3 top-2.5 text-neon-blue w-4 h-4" />
           <input 
             type="text" 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="Search database..." 
             className="w-full bg-black/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:border-neon-blue focus:outline-none transition-colors font-orbitron"
           />
        </form>
      </header>

      {/* --- MAIN DASHBOARD --- */}
      <main className="flex-1 flex overflow-hidden relative z-10">
        
        {/* LEFT: COSMIC MAP */}
        <div className="flex-1 relative bg-grid-pattern">
          {graphLoading ? (
            <div className="absolute inset-0 flex items-center justify-center flex-col">
               <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
               <p className="mt-4 font-orbitron text-neon-blue animate-pulse">CALIBRATING SENSORS...</p>
            </div>
          ) : (
            <CosmicGraph 
              data={graphNodes} 
              onNodeClick={(node) => performSearch(node.name)}
              onNodeHover={setHoveredNode} 
            />
          )}
          
          {/* Map Overlay Stats */}
          <div className="absolute bottom-4 left-6 pointer-events-none">
            <h3 className="text-xs font-orbitron text-gray-500">SECTOR: DEEP_FIELD_ALPHA</h3>
            <p className="text-xs font-mono text-neon-purple">OBJECTS: {graphNodes.length}</p>
          </div>
        </div>

        {/* RIGHT: HUD (Sidebar) */}
        <aside className="w-96 holo-panel border-l border-white/10 flex-none z-20">
           <HUD node={hoveredNode} status={connectionStatus} />
        </aside>

      </main>

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