import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GraphNode } from '../types';
import { Search } from 'lucide-react';

interface CosmicGraphProps {
  data: GraphNode[];
  onNodeClick: (node: GraphNode) => void;
  onNodeHover?: (node: GraphNode | null) => void;
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

// Global filter definition to prevent re-rendering flicker and duplicate IDs
const GraphDefs = () => (
  <defs>
    <filter id="glow-master" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="strong-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="5" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="blur-generic">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
    </filter>
  </defs>
);

const CustomShape = (props: any) => {
  const { cx, cy, fill, payload } = props;
  const type = payload?.type?.toLowerCase() || 'star';
  const size = payload?.z || 20;

  // --- BLACK HOLE ---
  if (type.includes('black hole') || type.includes('void')) {
    return (
      <g className="cursor-pointer group">
        <circle cx={cx} cy={cy} r={size / 2} fill="#000" stroke={fill} strokeWidth="2" filter="url(#strong-glow)" />
        <circle cx={cx} cy={cy} r={size / 2.5} fill="#000" />
      </g>
    );
  }

  // --- PULSAR ---
  if (type.includes('pulsar') || type.includes('neutron')) {
    return (
      <g className="cursor-pointer">
        <circle cx={cx} cy={cy} r={size / 2.5} fill={fill} filter="url(#glow-master)">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="0.5s" repeatCount="indefinite" />
        </circle>
        <circle cx={cx} cy={cy} r={size / 5} fill="#fff" />
        {/* Jets */}
        <line x1={cx - size} y1={cy} x2={cx + size} y2={cy} stroke={fill} strokeWidth="1" opacity="0.6" transform={`rotate(45, ${cx}, ${cy})`} />
        <line x1={cx} y1={cy - size} x2={cx} y2={cy + size} stroke={fill} strokeWidth="1" opacity="0.6" transform={`rotate(45, ${cx}, ${cy})`} />
      </g>
    );
  }

  // --- NEBULA ---
  if (type.includes('nebula') || type.includes('cloud')) {
     return (
       <g className="cursor-pointer hover:brightness-150 transition-all duration-500">
         <circle cx={cx - 5} cy={cy - 2} r={size / 2} fill={fill} opacity="0.4" filter="url(#blur-generic)" />
         <circle cx={cx + 5} cy={cy + 3} r={size / 2.5} fill={fill} opacity="0.3" filter="url(#blur-generic)" />
         <circle cx={cx} cy={cy} r={size / 3} fill="#fff" opacity="0.2" filter="url(#blur-generic)" />
         <circle cx={cx - 2} cy={cy - 2} r={1} fill="#fff" opacity="0.8" />
         <circle cx={cx + 3} cy={cy + 2} r={1} fill="#fff" opacity="0.8" />
       </g>
     );
  }

  // --- GALAXY ---
  if (type.includes('galaxy')) {
    return (
      <g className="cursor-pointer hover:brightness-125 transition-all">
        <ellipse cx={cx} cy={cy} rx={size} ry={size/3} fill={fill} opacity="0.2" transform={`rotate(45, ${cx}, ${cy})`} />
        <ellipse cx={cx} cy={cy} rx={size} ry={size/3} fill={fill} opacity="0.2" transform={`rotate(135, ${cx}, ${cy})`} />
        <circle cx={cx} cy={cy} r={size/4} fill="#fff" filter="url(#glow-master)" />
      </g>
    );
  }

  // --- DEFAULT STAR ---
  return (
    <g className="cursor-pointer hover:scale-150 transition-transform duration-200">
      <circle cx={cx} cy={cy} r={size / 3} fill={fill} opacity="0.8" filter="url(#glow-master)" />
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
        
      {/* Chart Area - Enforced Height & Padding */}
      <div className="flex-1 w-full relative min-h-[500px]">
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
              <GraphDefs />
              <XAxis type="number" dataKey="x" name="Distance" hide domain={['dataMin - 10', 'dataMax + 10']} />
              <YAxis type="number" dataKey="y" name="Energy" hide domain={['dataMin - 10', 'dataMax + 10']} />
              <ZAxis type="number" dataKey="z" range={[50, 600]} />
              <Tooltip 
                content={<MinimalTooltip />} 
                cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.2)' }}
                isAnimationActive={false} 
              />
              <Scatter 
                name="Celestial Objects" 
                data={data} 
                onClick={(e: any) => onNodeClick(e.payload)} 
                onMouseEnter={(e: any) => {
                   if (e && e.payload && onNodeHover) onNodeHover(e.payload);
                }}
                onMouseLeave={() => {
                   if (onNodeHover) onNodeHover(null);
                }}
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