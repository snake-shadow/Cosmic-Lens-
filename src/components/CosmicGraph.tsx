import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { GraphNode } from '../types';

interface CosmicGraphProps {
  data: GraphNode[];
  onNodeClick: (node: GraphNode) => void;
  onNodeHover: (node: GraphNode | null) => void;
}

// 1. Define Static Filters (Solved the flickering issue)
const SvgFilters = () => (
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="intense-glow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
);

// 2. Custom Shapes for Celestial Objects
const RenderShape = (props: any) => {
  const { cx, cy, fill, payload } = props;
  const type = payload.type.toLowerCase();
  const z = payload.z || 20;

  // BLACK HOLE
  if (type.includes('black hole')) {
    return (
      <g className="cursor-pointer hover:scale-110 transition-transform">
        <circle cx={cx} cy={cy} r={z / 2} fill="#000" stroke={fill} strokeWidth="2" filter="url(#intense-glow)" />
        <circle cx={cx} cy={cy} r={z / 2 + 5} fill="none" stroke={fill} strokeWidth="1" strokeDasharray="4 2" opacity="0.7">
          <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="10s" repeatCount="indefinite" />
        </circle>
      </g>
    );
  }

  // PULSAR / NEUTRON STAR
  if (type.includes('pulsar') || type.includes('neutron')) {
    return (
      <g className="cursor-pointer">
        <circle cx={cx} cy={cy} r={z / 3} fill="#fff" filter="url(#glow)" />
        <line x1={cx - z} y1={cy - z} x2={cx + z} y2={cy + z} stroke={fill} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <line x1={cx + z} y1={cy - z} x2={cx - z} y2={cy + z} stroke={fill} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <circle cx={cx} cy={cy} r={z} fill="none" stroke={fill} opacity="0.3">
           <animate attributeName="r" values={`${z};${z*1.5};${z}`} dur="1s" repeatCount="indefinite" />
           <animate attributeName="opacity" values="0.3;0;0.3" dur="1s" repeatCount="indefinite" />
        </circle>
      </g>
    );
  }

  // PLANET / EXOPLANET
  if (type.includes('planet') || type.includes('earth')) {
    return (
      <g className="cursor-pointer">
        <circle cx={cx} cy={cy} r={z / 2.5} fill={fill} />
        <ellipse cx={cx} cy={cy} rx={z / 1.5} ry={z / 4} fill="none" stroke={fill} strokeWidth="1" transform={`rotate(-15, ${cx}, ${cy})`} opacity="0.6" />
      </g>
    );
  }

  // DEFAULT STAR / NEBULA
  return (
    <g className="cursor-pointer">
      <circle cx={cx} cy={cy} r={z / 3} fill={fill} filter="url(#glow)" opacity="0.9">
         <animate attributeName="opacity" values="0.9;0.4;0.9" dur={`${Math.random() * 2 + 2}s`} repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cy} r={z / 6} fill="#fff" />
    </g>
  );
};

const CosmicGraph: React.FC<CosmicGraphProps> = ({ data, onNodeClick, onNodeHover }) => {
  return (
    <div className="w-full h-full relative" onMouseLeave={() => onNodeHover(null)}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <SvgFilters />
          <XAxis type="number" dataKey="x" hide domain={['dataMin - 5', 'dataMax + 5']} />
          <YAxis type="number" dataKey="y" hide domain={['dataMin - 5', 'dataMax + 5']} />
          <ZAxis type="number" dataKey="z" range={[60, 600]} />
          
          <Tooltip 
            cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.3)' }}
            content={() => null} // Disable default tooltip, using HUD instead
          />
          
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