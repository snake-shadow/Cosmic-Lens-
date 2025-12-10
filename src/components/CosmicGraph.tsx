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
      <div className="bg-black/80 backdrop-blur-sm border border-white/20 px-2 py-1 rounded text-xs font-orbitron tracking-wider text-white">
        {data.name}
      </div>
    );
  }
  return null;
};

const CustomShape = (props: any) => {
  const { cx, cy, fill, payload } = props;
  const type = payload.type ? payload.type.toLowerCase() : '';
  const size = payload.z;

  // --- BLACK HOLE ---
  if (type.includes('black hole') || type.includes('void')) {
    return (
      <g className="cursor-pointer hover:brightness-150 transition-all duration-300 group">
        <defs>
          <filter id="glow-bh" x="-50%" y="-50%" width="200%" height="200%">
             <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
             <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
             </feMerge>
          </filter>
        </defs>
        {/* Accretion Disk */}
        <ellipse cx={cx} cy={cy} rx={size / 1.5} ry={size / 4} fill="none" stroke={fill} strokeWidth="2" className="animate-pulse-slow" transform={`rotate(-15, ${cx}, ${cy})`} filter="url(#glow-bh)" opacity="0.8" />
        <ellipse cx={cx} cy={cy} rx={size / 1.5} ry={size / 4} fill="none" stroke="#fff" strokeWidth="0.5" transform={`rotate(-15, ${cx}, ${cy})`} opacity="0.5" />
        
        {/* Event Horizon */}
        <circle cx={cx} cy={cy} r={size / 3} fill="#000" stroke={fill} strokeWidth="1" />
        <circle cx={cx} cy={cy} r={size / 3.5} fill="#000" />
      </g>
    );
  }

  // --- GALAXY ---
  if (type.includes('galaxy')) {
    return (
      <g className="cursor-pointer hover:brightness-125 transition-all duration-300">
         <g className="animate-spin" style={{ transformOrigin: `${cx}px ${cy}px`, animationDuration: '20s', animationTimingFunction: 'linear' }}>
            {/* Spiral Arms approximation */}
            <ellipse cx={cx} cy={cy} rx={size / 1.2} ry={size / 3} fill={fill} opacity="0.3" transform={`rotate(45, ${cx}, ${cy})`} />
            <ellipse cx={cx} cy={cy} rx={size / 1.2} ry={size / 3} fill={fill} opacity="0.3" transform={`rotate(135, ${cx}, ${cy})`} />
            {/* Core */}
            <circle cx={cx} cy={cy} r={size / 4} fill="#fff" opacity="0.8" filter="blur(2px)" />
         </g>
      </g>
    );
  }

  // --- NEBULA ---
  if (type.includes('nebula') || type.includes('cloud')) {
     return (
       <g className="cursor-pointer hover:brightness-150 transition-all duration-500">
         <defs>
           <filter id={`blur-${cx}-${cy}`}>
             <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
           </filter>
         </defs>
         <circle cx={cx - 5} cy={cy - 2} r={size / 2} fill={fill} opacity="0.4" filter={`url(#blur-${cx}-${cy})`} />
         <circle cx={cx + 5} cy={cy + 3} r={size / 2.5} fill={fill} opacity="0.3" filter={`url(#blur-${cx}-${cy})`} />
         <circle cx={cx} cy={cy} r={size / 3} fill="#fff" opacity="0.2" filter={`url(#blur-${cx}-${cy})`} />
         {/* Stars inside nebula */}
         <circle cx={cx - 2} cy={cy - 2} r={1} fill="#fff" opacity="0.8" />
         <circle cx={cx + 3} cy={cy + 2} r={1} fill="#fff" opacity="0.8" />
       </g>
     );
  }

  // --- PULSAR ---
  if (type.includes('pulsar') || type.includes('neutron')) {
    return (
      <g className="cursor-pointer hover:brightness-150 transition-all duration-300">
         {/* Rapid pulse effect for pulsar */}
        <circle cx={cx} cy={cy} r={size / 1.5} fill={fill} opacity={0.3} className="animate-ping" style={{ animationDuration: '0.8s' }} />
        <circle cx={cx} cy={cy} r={size / 4} fill="#fff" opacity={1} />
        {/* Beams */}
        <g className="animate-spin origin-center" style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDuration: '4s', animationTimingFunction: 'linear' }}>
             <rect x={cx - size/1.2} y={cy - 1} width={size * 1.6} height={2} fill={fill} rx={1} />
             <rect x={cx - 1} y={cy - size/1.2} width={2} height={size * 1.6} fill={fill} rx={1} />
        </g>
      </g>
    );
  }

  // --- EXOPLANET / PLANET ---
  if (type.includes('planet') || type.includes('earth') || type.includes('neptune')) {
     return (
        <g className="cursor-pointer hover:brightness-125 transition-all">
           {/* Ring */}
           <ellipse cx={cx} cy={cy} rx={size / 1.5} ry={size / 5} fill="none" stroke={fill} strokeWidth="1.5" transform={`rotate(-20, ${cx}, ${cy})`} opacity="0.7" />
           {/* Planet Body */}
           <circle cx={cx} cy={cy} r={size / 2.5} fill={fill} />
           {/* Shadow effect */}
           <path d={`M ${cx} ${cy - size/2.5} A ${size/2.5} ${size/2.5} 0 0 1 ${cx} ${cy + size/2.5} A ${size/2.5} ${size/2.5} 0 0 0 ${cx} ${cy - size/2.5}`} fill="#000" opacity="0.3" />
        </g>
     );
  }

   // --- QUASAR ---
   if (type.includes('quasar')) {
    return (
       <g className="cursor-pointer hover:brightness-150 transition-all">
          {/* Jets with High Energy Flickering Animation */}
          <line x1={cx - size} y1={cy - size} x2={cx + size} y2={cy + size} stroke={fill} strokeWidth="2" opacity="0.6">
            <animate attributeName="stroke-opacity" values="0.3;1;0.3" dur="0.2s" repeatCount="indefinite" />
            <animate attributeName="stroke-width" values="1;3;1" dur="0.3s" repeatCount="indefinite" />
          </line>
          <line x1={cx - size} y1={cy - size} x2={cx + size} y2={cy + size} stroke="#fff" strokeWidth="0.5" opacity="0.8">
             <animate attributeName="opacity" values="0.5;1;0.5" dur="0.1s" repeatCount="indefinite" />
          </line>
          
          {/* Active Nucleus */}
          <circle cx={cx} cy={cy} r={size / 2} fill={fill} filter="blur(2px)" opacity="0.8" />
          <circle cx={cx} cy={cy} r={size / 4} fill="#fff" />
          
          {/* Rotating Lens flare / Accretion effect */}
          <g>
            <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="20s" repeatCount="indefinite" />
            <line x1={cx - size*1.5} y1={cy} x2={cx + size*1.5} y2={cy} stroke={fill} strokeWidth="0.5" opacity="0.3" />
            <line x1={cx} y1={cy - size*1.5} x2={cx} y2={cy + size*1.5} stroke={fill} strokeWidth="0.5" opacity="0.3" />
            <line x1={cx - size} y1={cy - size} x2={cx + size} y2={cy + size} stroke={fill} strokeWidth="0.5" opacity="0.2" transform={`rotate(45, ${cx}, ${cy})`} />
            <line x1={cx + size} y1={cy - size} x2={cx - size} y2={cy + size} stroke={fill} strokeWidth="0.5" opacity="0.2" transform={`rotate(45, ${cx}, ${cy})`} />
          </g>
       </g>
    );
 }

  // --- DEFAULT STAR ---
  return (
    <g className="cursor-pointer hover:brightness-150 transition-all duration-300">
      <circle cx={cx} cy={cy} r={size / 3} fill={fill} opacity={0.6} className="animate-pulse-slow" />
      <circle cx={cx} cy={cy} r={size / 6} fill="#fff" opacity={0.9} />
      {/* Glow effect */}
      <circle cx={cx} cy={cy} r={size / 2} fill={fill} opacity={0.2} filter="blur(4px)" />
    </g>
  );
};

const CosmicGraph: React.FC<CosmicGraphProps> = ({ data, onNodeClick, onNodeHover }) => {
  return (
    <div className="w-full h-full flex flex-col relative bg-space-900/30 rounded-2xl border border-white/5 backdrop-blur-sm overflow-hidden">
      {/* Header - Fixed Height */}
      <div className="p-4 z-10 flex-none absolute top-0 left-0 pointer-events-none">
        <h3 className="font-orbitron text-white/70 text-sm tracking-widest flex items-center gap-2">
          <Search size={14} className="text-neon-purple"/>
          SECTOR SCAN: DEEP FIELD
        </h3>
      </div>
        
      {/* Chart Area - Flex Grow */}
      <div className="flex-1 w-full relative min-h-0">
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis type="number" dataKey="x" name="Distance" hide domain={[0, 100]} />
              <YAxis type="number" dataKey="y" name="Energy" hide domain={[0, 100]} />
              <ZAxis type="number" dataKey="z" range={[100, 1200]} />
              <Tooltip content={<MinimalTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#ffffff33' }} />
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
      <div className="absolute inset-0 pointer-events-none opacity-10 -z-0" 
           style={{
             backgroundImage: 'linear-gradient(#4f4f4f 1px, transparent 1px), linear-gradient(90deg, #4f4f4f 1px, transparent 1px)',
             backgroundSize: '50px 50px'
           }}>
      </div>
    </div>
  );
};

export default CosmicGraph;
