import React, { useState, useEffect } from 'react';
import { Sparkles, SendHorizontal, Zap } from 'lucide-react';
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
      try {
        const status = await checkApiConnection();
        if (status.success) {
          setConnectionStatus('SYSTEM ONLINE');
          setIsSimulated(false);
        } else {
          console.warn("API Connection issue, switching to simulation:", status.message);
          setConnectionStatus('SIMULATION MODE');
          setIsSimulated(true);
        }

        const nodes = await Promise.race([
          fetchInterestingNodes(),
          new Promise<GraphNode[]>(resolve => setTimeout(() => resolve([]), 3000))
        ]);
        setGraphNodes(nodes);
      } catch (error) {
        console.warn('Graph load failed, using empty graph:', error);
        setConnectionStatus('SIMULATION MODE');
        setGraphNodes([]);
      } finally {
        setGraphLoading(false);
      }
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
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#050508'
    }}>
      <Background />
      
      {/* LAYER 1: UNIVERSE (Z-0) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
         {graphLoading ? (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}>
               <div style={{
                 width: '64px',
                 height: '64px',
                 border: '4px solid #00f3ff',
                 borderTopColor: 'transparent',
                 borderRadius: '50%',
                 animation: 'spin 1s linear infinite',
                 boxShadow: '0 0 30px rgba(0,243,255,0.4)'
               }}></div>
               <p style={{
                 marginTop: '24px',
                 fontSize: '14px',
                 letterSpacing: '0.3em',
                 color: '#00f3ff',
                 animation: 'pulse 2s infinite',
                 textTransform: 'uppercase',
                 fontWeight: 'bold'
               }}>Initializing Cosmic Engine...</p>
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
      
      {/* Top Left: Logo - INLINE STYLES */}
      <div style={{
        position: 'absolute',
        top: '24px',
        left: '24px',
        zIndex: 20,
        pointerEvents: 'none',
        userSelect: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <div style={{
             position: 'relative',
             width: '48px',
             height: '48px',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center'
           }}>
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: '#00f3ff',
                opacity: 0.2,
                filter: 'blur(20px)',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }}></div>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{
                position: 'relative',
                zIndex: 10,
                filter: 'drop-shadow(0 0 8px rgba(0,243,255,0.8))'
              }}>
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
             <h1 style={{
               fontFamily: '"Space Grotesk", sans-serif',
               fontWeight: 'bold',
               fontSize: '48px',
               letterSpacing: '-0.05em',
               lineHeight: 1,
               display: 'flex',
               flexDirection: 'column'
             }}>
                <span style={{ color: '#00f3ff', textShadow: '0 0 10px rgba(0, 243, 255, 0.6)' }}>COSMIC</span>
                <span style={{ color: '#ffffff', fontWeight: 300 }}>LENS</span>
             </h1>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  boxShadow: '0 0 8px currentColor',
                  animation: 'pulse 2s infinite',
                  backgroundColor: isSimulated ? '#facc15' : '#00ff9d'
                }}></span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 'bold',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  opacity: 0.9,
                  color: isSimulated ? '#facc15' : '#00ff9d'
                }}>
                  {connectionStatus}
                </span>
             </div>
           </div>
        </div>
      </div>

      {/* Right: HUD */}
      <div style={{
        position: 'absolute',
        top: '112px',
        right: '24px',
        bottom: '128px',
        zIndex: 20,
        width: '320px',
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start'
      }}>
         <HUD node={hoveredNode} status={connectionStatus} />
      </div>

      {/* Bottom: Omnibar - INLINE GLASS EFFECT */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: 0,
        right: 0,
        zIndex: 30,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 16px',
        pointerEvents: 'none'
      }}>
        <form onSubmit={handleSearch} style={{
          width: '100%',
          maxWidth: '672px',
          pointerEvents: 'auto',
          transform: 'translateY(0)',
          transition: 'transform 0.3s'
        }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} 
           onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
           <div style={{
             background: 'rgba(255,255,255,0.05)',
             backdropFilter: 'blur(20px)',
             border: '1px solid rgba(0,243,255,0.2)',
             borderRadius: '50px',
             padding: '8px',
             display: 'flex',
             alignItems: 'center',
             position: 'relative',
             transition: 'all 0.3s'
           }}>
              
              <div style={{
                position: 'relative',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,243,255,0.1)',
                color: '#00f3ff',
                transition: 'all 0.3s'
              }}>
                 <Sparkles size={20} style={{ filter: 'drop-shadow(0 0 5px currentColor)' }} />
              </div>
              
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask the Universe... (e.g. 'Show me a Quasar')" 
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '20px',
                  padding: '0 16px',
                  outline: 'none',
                  fontFamily: 'sans-serif'
                }}
              />
              
              <button 
                type="submit"
                disabled={!searchQuery.trim()}
                style={{
                  position: 'relative',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                  background: searchQuery.trim() ? 
                    'linear-gradient(135deg, #00f3ff, #00ff9d)' : 
                    'rgba(255,255,255,0.05)',
                  color: searchQuery.trim() ? 'black' : '#9ca3af',
                  opacity: searchQuery.trim() ? 1 : 0.5,
                  transform: searchQuery.trim() ? 'rotate(0deg)' : 'rotate(-90deg)'
                }}
              >
                {searchQuery.trim() ? <SendHorizontal size={20} fill="currentColor" /> : <Zap size={20} />}
              </button>
           </div>
           
           <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <p style={{
                fontSize: '10px',
                color: '#00f3ff',
                fontWeight: 'bold',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                opacity: 0.8
              }}>
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
