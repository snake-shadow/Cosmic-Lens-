import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GraphNode } from '../types';
import { Search } from 'lucide-react';

interface CosmicGraphProps {
  data: GraphNode[];
  onNodeClick: (node: GraphNode) => void;
  onNodeHover: (node: GraphNode | null) => void;
}

const MinimalTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/90 backdrop-blur-md border border-neon-blue/30 px-4 py-2 rounded shadow-[0_0_15px_rgba(0,243,255,0.2)] z-50 pointer-events-none">
        <p className="text-xs font-orbitron tracking-widest text-neon-blue uppercase">{data.type}</p>
        <p className="text-lg font-rajdhani font-bold text-white leading-none">{data.name}</p>
      </div>
    );
  }
  return null;
};

// GLOBAL DEFS COMPONENT
// Defining filters once here prevents the "distorted graphics" and black boxes.
const GraphDefs = () => (
  <defs>
    {/* Black Hole Glow */}
    <filter id="glow-bh" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    {/* Nebula Blur */}
    <filter id="nebula-blur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
    </filter>
    
    {/* General Star Glow */}
    <filter id="star-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
       <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    {/* Strong Pulse Glow */}
    <filter id="strong-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

const CustomShape = (props: any) => {
  const { cx, cy, fill, payload } = props;
  const type = payload?.type?.toLowerCase() || 'star';
  const size = payload?.z || 20;

  // --- BLACK HOLE / VOID ---
  if (type.includes('black hole') || type.includes('void')) {
    return (
      <g className="cursor-pointer group">
        {/* Accretion Disk */}
        <ellipse 
          cx={cx} cy={cy} rx={size / 1.5} ry={size / 4} 
          fill="none" stroke={fill} strokeWidth="2" 
          filter="url(#glow-bh)" opacity="0.9" 
        />
        {/* Event Horizon */}
        <circle cx={cx} cy={cy} r={size / 3} fill="#000" stroke={fill} strokeWidth="1" />
      </g>
    );
  }

  // --- GALAXY ---
  if (type.includes('galaxy')) {
    // Generate a pseudo-random rotation based on position so they don't all look identical
    const rotation = (cx + cy) % 360;
    return (
      <g className="cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
         <g transform={`rotate(${rotation}, ${cx}, ${cy})`}>
            <ellipse cx={cx} cy={cy} rx={size} ry={size / 3} fill={fill} opacity="0.4" transform={`rotate(45, ${cx}, ${cy})`} />
            <ellipse cx={cx} cy={cy} rx={size} ry={size / 3} fill={fill} opacity="0.4" transform={`rotate(135, ${cx}, ${cy})`} />
            <circle cx={cx} cy={cy} r={size / 5} fill="#fff" opacity="0.9" filter="url(#star-glow)" />
         </g>
      </g>
    );
  }

  // --- NEBULA ---
  if (type.includes('nebula') || type.includes('cloud')) {
     return (
       <g className="cursor-pointer">
         <circle cx={cx} cy={cy} r={size / 1.5} fill={fill} opacity="0.3" filter="url(#nebula-blur)" />
         <circle cx={cx} cy={cy} r={size / 2.5} fill={fill} opacity="0.5" filter="url(#nebula-blur)" />
         <circle cx={cx} cy={cy} r={2} fill="#fff" opacity="0.9" />
       </g>
     );
  }

  // --- PULSAR ---
  if (type.includes('pulsar') || type.includes('neutron')) {
    return (
      <g className="cursor-pointer">
        <circle cx={cx} cy={cy} r={size / 2} fill={fill} opacity={0.4} />
        <circle cx={cx} cy={cy} r={4} fill="#fff" filter="url(#strong-glow)" />
        <line x1={cx - size} y1={cy} x2={cx + size} y2={cy} stroke={fill} strokeWidth="1" transform={`rotate(45, ${cx}, ${cy})`} opacity="0.6" />
        <line x1={cx} y1={cy - size} x2={cx} y2={cy + size} stroke={fill} strokeWidth="1" transform={`rotate(45, ${cx}, ${cy})`} opacity="0.6" />
      </g>
    );
  }

  // --- DEFAULT STAR ---
  return (
    <g className="cursor-pointer hover:scale-125 transition-transform duration-300">
      <circle cx={cx} cy={cy} r={size / 3} fill={fill} opacity="0.8" filter="url(#star-glow)" />
      <circle cx={cx} cy={cy} r={size / 8} fill="#fff" />
    </g>
  );
};

const CosmicGraph: React.FC<CosmicGraphProps> = ({ data, onNodeClick, onNodeHover }) => {
  return (
    <div className="w-full h-full flex flex-col relative bg-space-900/40 rounded-2xl border border-white/5 backdrop-blur-md overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 z-10 flex-none absolute top-0 left-0 pointer-events-none">
        <h3 className="font-orbitron text-neon-blue/80 text-sm tracking-widest flex items-center gap-2 drop-shadow-md">
          <Search size={14} />
          SECTOR SCAN: DEEP FIELD
        </h3>
      </div>
        
      {/* Chart Area */}
      <div className="flex-1 w-full relative min-h-[400px]">
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <GraphDefs />
              <XAxis type="number" dataKey="x" name="Distance" hide domain={[-10, 110]} />
              <YAxis type="number" dataKey="y" name="Energy" hide domain={[-10, 110]} />
              <ZAxis type="number" dataKey="z" range={[60, 900]} />
              <Tooltip 
                content={<MinimalTooltip />} 
                cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.2)' }}
                isAnimationActive={false} // Improves hover performance significantly
              />
              <Scatter 
                name="Celestial Objects" 
                data={data} 
                onClick={(e: any) => onNodeClick(e.payload)} 
                onMouseEnter={(e: any) => {
                   if (e && e.payload) onNodeHover(e.payload);
                }}
                onMouseLeave={() => onNodeHover(null)}
                shape={<CustomShape />}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-5 -z-0" 
           style={{
             backgroundImage: 'linear-gradient(#4f4f4f 1px, transparent 1px), linear-gradient(90deg, #4f4f4f 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}>
      </div>
    </div>
  );
};

export default CosmicGraph;