import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { GraphNode } from '../types';
import { Search } from 'lucide-react';

interface CosmicGraphProps {
  data: GraphNode[];
  onNodeClick: (node: GraphNode) => void;
  onNodeHover: (node: GraphNode | null) => void;
}

const RenderShape = (props: any) => {
  const { cx, cy, fill, payload } = props;
  const type = payload.type.toLowerCase();
  const z = Math.max(12, payload.z); // Slightly larger minimum size

  // --- BLACK HOLE ---
  if (type.includes('black hole')) {
    return (
      <g className="cursor-pointer hover:scale-125 transition-transform duration-500">
        {/* Accretion Disk Glow */}
        <ellipse cx={cx} cy={cy} rx={z * 0.8} ry={z * 0.3} fill={fill} opacity="0.3" transform={`rotate(-15, ${cx}, ${cy})`} />
        <ellipse cx={cx} cy={cy} rx={z * 0.7} ry={z * 0.25} stroke={fill} strokeWidth="2" fill="none" transform={`rotate(-15, ${cx}, ${cy})`} />
        
        {/* Event Horizon (Black) */}
        <circle cx={cx} cy={cy} r={z * 0.3} fill="#000" stroke="#fff" strokeWidth="0.5" />
      </g>
    );
  }

  // --- PULSAR / NEUTRON STAR ---
  if (type.includes('pulsar') || type.includes('neutron')) {
    return (
      <g className="cursor-pointer hover:scale-125 transition-transform duration-500">
        {/* Cross Flare */}
        <line x1={cx - z} y1={cy} x2={cx + z} y2={cy} stroke={fill} strokeWidth="1" strokeOpacity="0.8" />
        <line x1={cx} y1={cy - z} x2={cx} y2={cy + z} stroke={fill} strokeWidth="1" strokeOpacity="0.8" />
        
        {/* Core Glow */}
        <circle cx={cx} cy={cy} r={z * 0.5} fill={fill} opacity="0.4" />
        <circle cx={cx} cy={cy} r={3} fill="#fff" />
      </g>
    );
  }

  // --- PLANET / EXOPLANET ---
  if (type.includes('planet') || type.includes('earth')) {
    return (
      <g className="cursor-pointer hover:scale-125 transition-transform duration-500">
        {/* Ring */}
        <ellipse cx={cx} cy={cy} rx={z * 0.8} ry={z * 0.2} fill="none" stroke={fill} strokeWidth="1.5" transform={`rotate(-25, ${cx}, ${cy})`} opacity="0.7" />
        {/* Planet Body */}
        <circle cx={cx} cy={cy} r={z * 0.35} fill={fill} />
        {/* Shadow */}
        <path d={`M ${cx} ${cy - z*0.35} A ${z*0.35} ${z*0.35} 0 0 1 ${cx} ${cy + z*0.35} A ${z*0.35} ${z*0.35} 0 0 0 ${cx} ${cy - z*0.35}`} fill="black" opacity="0.3" />
      </g>
    );
  }

  // --- NEBULA / GALAXY ---
  if (type.includes('nebula') || type.includes('galaxy')) {
    return (
      <g className="cursor-pointer hover:scale-125 transition-transform duration-500">
         {/* Cloud Layers */}
         <circle cx={cx} cy={cy} r={z * 0.6} fill={fill} opacity="0.2" />
         <circle cx={cx - 2} cy={cy - 2} r={z * 0.4} fill={fill} opacity="0.3" />
         <circle cx={cx + 2} cy={cy + 2} r={z * 0.4} fill={fill} opacity="0.3" />
         {/* Core */}
         <circle cx={cx} cy={cy} r={2} fill="#fff" opacity="0.8" />
      </g>
    );
  }

  // --- STANDARD STAR ---
  return (
    <g className="cursor-pointer hover:scale-150 transition-transform duration-300">
      {/* Outer Glow (Layered for intensity) */}
      <circle cx={cx} cy={cy} r={z * 0.5} fill={fill} opacity="0.2" />
      <circle cx={cx} cy={cy} r={z * 0.3} fill={fill} opacity="0.4" />
      {/* Core */}
      <circle cx={cx} cy={cy} r={z * 0.15} fill="#fff" />
    </g>
  );
};

const CosmicGraph: React.FC<CosmicGraphProps> = ({ data, onNodeClick, onNodeHover }) => {
  return (
    <div className="w-full h-full relative bg-transparent overflow-hidden">
      
      {/* Grid Lines - stronger visibility */}
      <div className="absolute inset-0 pointer-events-none z-0" 
           style={{
             backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
             backgroundSize: '50px 50px',
             opacity: 0.3
           }}>
      </div>

      {/* Header Overlay */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
          <h3 className="font-display text-brand-blue text-xs tracking-[0.2em] flex items-center gap-2 drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]">
              <Search size={12} className="text-brand-green"/>
              SECTOR SCAN: DEEP FIELD
          </h3>
      </div>

      <div className="absolute inset-0 z-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
          <ScatterChart margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
            <XAxis type="number" dataKey="x" hide domain={['dataMin - 10', 'dataMax + 10']} />
            <YAxis type="number" dataKey="y" hide domain={['dataMin - 10', 'dataMax + 10']} />
            <ZAxis type="number" dataKey="z" range={[60, 600]} />
            
            <Tooltip content={() => null} cursor={{ strokeDasharray: '4 4', stroke: 'rgba(0, 243, 255, 0.5)', strokeWidth: 1 }} />
            
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
  );
};

export default CosmicGraph;