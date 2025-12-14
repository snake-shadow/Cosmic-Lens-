import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { GraphNode } from '../types';
import { Search } from 'lucide-react';

interface CosmicGraphProps {
  data: GraphNode[];
  onNodeClick: (node: GraphNode) => void;
  onNodeHover: (node: GraphNode | null) => void;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/90 backdrop-blur-md border border-cyan-400/30 p-3 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.3)] z-50">
        <p className="font-display text-cyan-400 text-lg font-bold">{data.name}</p>
        <p className="font-mono text-gray-300 text-sm">{data.type}</p>
        <div className="text-xs text-gray-500 mt-1 font-mono">Click to analyze</div>
      </div>
    );
  }
  return null;
};

const RenderShape = (props: any) => {
  const { cx, cy, fill, payload } = props;
  const type = payload.type.toLowerCase();
  const z = Math.max(12, payload.z); 

  const groupStyle = { cursor: 'pointer' };
  const hoverClass = "hover:brightness-150 transition-[filter] duration-300";

  // --- BLACK HOLE ---
  if (type.includes('black hole')) {
    return (
      <g style={groupStyle} className={hoverClass}>
        <ellipse cx={cx} cy={cy} rx={z * 0.9} ry={z * 0.35} fill={fill} opacity="0.4" transform={`rotate(-15, ${cx}, ${cy})`} filter="blur(2px)" />
        <ellipse cx={cx} cy={cy} rx={z * 0.8} ry={z * 0.3} stroke={fill} strokeWidth="2" fill="none" transform={`rotate(-15, ${cx}, ${cy})`} />
        <circle cx={cx} cy={cy} r={z * 0.35} fill="#000" stroke="#fff" strokeWidth="0.5" />
      </g>
    );
  }

  // --- PULSAR ---
  if (type.includes('pulsar') || type.includes('neutron')) {
    return (
      <g style={groupStyle} className={hoverClass}>
        <line x1={cx - z*1.2} y1={cy} x2={cx + z*1.2} y2={cy} stroke={fill} strokeWidth="1.5" strokeOpacity="0.8" />
        <line x1={cx} y1={cy - z*1.2} x2={cx} y2={cy + z*1.2} stroke={fill} strokeWidth="1.5" strokeOpacity="0.8" />
        <circle cx={cx} cy={cy} r={z * 0.6} fill={fill} opacity="0.5" filter="blur(3px)" />
        <circle cx={cx} cy={cy} r={4} fill="#fff" />
      </g>
    );
  }

  // --- PLANET ---
  if (type.includes('planet') || type.includes('earth')) {
    return (
      <g style={groupStyle} className={hoverClass}>
        <ellipse cx={cx} cy={cy} rx={z * 0.9} ry={z * 0.25} fill="none" stroke={fill} strokeWidth="1.5" transform={`rotate(-25, ${cx}, ${cy})`} opacity="0.8" />
        <circle cx={cx} cy={cy} r={z * 0.4} fill={fill} />
        <path d={`M ${cx} ${cy - z*0.4} A ${z*0.4} ${z*0.4} 0 0 1 ${cx} ${cy + z*0.4} A ${z*0.4} ${z*0.4} 0 0 0 ${cx} ${cy - z*0.4}`} fill="black" opacity="0.4" />
      </g>
    );
  }

  // --- NEBULA ---
  if (type.includes('nebula') || type.includes('galaxy')) {
    return (
      <g style={groupStyle} className={hoverClass}>
         <circle cx={cx} cy={cy} r={z * 0.8} fill={fill} opacity="0.15" filter="blur(4px)" />
         <circle cx={cx - 3} cy={cy - 3} r={z * 0.5} fill={fill} opacity="0.25" filter="blur(2px)" />
         <circle cx={cx + 3} cy={cy + 2} r={z * 0.5} fill={fill} opacity="0.25" filter="blur(2px)" />
         <circle cx={cx} cy={cy} r={2.5} fill="#fff" opacity="0.9" />
      </g>
    );
  }

  return (
    <g style={groupStyle} className={hoverClass}>
      <circle cx={cx} cy={cy} r={z * 0.6} fill={fill} opacity="0.3" filter="blur(2px)" />
      <circle cx={cx} cy={cy} r={z * 0.35} fill={fill} opacity="0.6" />
      <circle cx={cx} cy={cy} r={z * 0.2} fill="#fff" />
    </g>
  );
};

const CosmicGraph: React.FC<CosmicGraphProps> = ({ data, onNodeClick, onNodeHover }) => {
  return (
    <div className="w-full h-full relative bg-transparent overflow-hidden">
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 pointer-events-none z-0" 
           style={{
             backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
             backgroundSize: '40px 40px',
             opacity: 0.5
           }}>
      </div>
      
      <div className="absolute top-4 left-4 z-10 pointer-events-none opacity-60">
        <h3 className="font-display text-white text-xs tracking-widest flex items-center gap-2">
            <Search size={14} className="text-cyan-400"/>
            SECTOR SCAN: DEEP FIELD
        </h3>
      </div>

      <div className="absolute inset-0 z-0 py-12 px-4">
        {/* Full height wrapper */}
        <div className="w-full h-full min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis type="number" dataKey="x" hide domain={[-5, 105]} />
              <YAxis type="number" dataKey="y" hide domain={[-5, 105]} />
              <ZAxis type="number" dataKey="z" range={[80, 800]} />
              
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '4 4', stroke: 'rgba(34, 211, 238, 0.3)', strokeWidth: 1 }} />
              
              <Scatter 
                name="Cosmic Objects" 
                data={data} 
                shape={<RenderShape />}
                onClick={(e: any) => onNodeClick(e.payload)}
                onMouseEnter={(e: any) => onNodeHover(e.payload)}
                onMouseLeave={() => onNodeHover(null)}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CosmicGraph;