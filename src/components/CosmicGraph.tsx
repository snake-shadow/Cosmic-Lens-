import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { GraphNode } from '../types';

interface CosmicGraphProps {
  data: GraphNode[];
  onNodeClick: (node: GraphNode) => void;
  onNodeHover: (node: GraphNode | null) => void;
}

// 1. Refined Filters
const SvgFilters = () => (
  <defs>
    <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
);

// 2. Minimalist Shapes
const RenderShape = (props: any) => {
  const { cx, cy, fill, payload } = props;
  const type = payload.type.toLowerCase();
  const z = Math.max(10, payload.z); // Ensure minimum touch target

  // BLACK HOLE - Subtle Void
  if (type.includes('black hole')) {
    return (
      <g className="cursor-pointer hover:scale-125 transition-transform duration-500">
        <circle cx={cx} cy={cy} r={z / 2 + 4} fill="rgba(0,0,0,0.8)" stroke={fill} strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={z / 2} fill="#000" />
      </g>
    );
  }

  // PULSAR - Minimal Cross
  if (type.includes('pulsar')) {
    return (
      <g className="cursor-pointer hover:scale-125 transition-transform duration-500">
        <circle cx={cx} cy={cy} r={4} fill="#fff" />
        <line x1={cx - z} y1={cy} x2={cx + z} y2={cy} stroke={fill} strokeWidth="1" strokeOpacity="0.6" />
        <line x1={cx} y1={cy - z} x2={cx} y2={cy + z} stroke={fill} strokeWidth="1" strokeOpacity="0.6" />
        <circle cx={cx} cy={cy} r={z} fill={fill} fillOpacity="0.2" />
      </g>
    );
  }

  // PLANET - Solid Circle with Ring
  if (type.includes('planet') || type.includes('earth')) {
    return (
      <g className="cursor-pointer hover:scale-125 transition-transform duration-500">
        <circle cx={cx} cy={cy} r={z / 2.5} fill={fill} />
        <ellipse cx={cx} cy={cy} rx={z / 1.5} ry={z / 5} fill="none" stroke={fill} strokeWidth="1" transform={`rotate(-20, ${cx}, ${cy})`} opacity="0.6" />
      </g>
    );
  }

  // STAR - Soft Glow
  return (
    <g className="cursor-pointer hover:scale-150 transition-transform duration-300">
      <circle cx={cx} cy={cy} r={z / 3} fill={fill} filter="url(#soft-glow)" opacity="0.8" />
      <circle cx={cx} cy={cy} r={2} fill="#fff" />
    </g>
  );
};

const CosmicGraph: React.FC<CosmicGraphProps> = ({ data, onNodeClick, onNodeHover }) => {
  return (
    <div className="w-full h-full relative" onMouseLeave={() => onNodeHover(null)}>
      
      {/* Background Grid - Very Subtle */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{
             backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 60, right: 60, bottom: 60, left: 60 }}>
          <SvgFilters />
          <XAxis type="number" dataKey="x" hide domain={['dataMin - 10', 'dataMax + 10']} />
          <YAxis type="number" dataKey="y" hide domain={['dataMin - 10', 'dataMax + 10']} />
          <ZAxis type="number" dataKey="z" range={[80, 800]} />
          
          <Tooltip content={() => null} cursor={{ strokeDasharray: '4 4', stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 1 }} />
          
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
  );
};

export default CosmicGraph;