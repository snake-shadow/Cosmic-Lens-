export interface CelestialData {
  name: string;
  type: string;
  distance: string; // e.g., "4.2 Light Years"
  mass: string;
  temperature: string;
  description: string;
  funFact: string;
  discoveryYear: string;
  coordinates: {
    x: number; // Abstract value for graph plotting (e.g., distance)
    y: number; // Abstract value for graph plotting (e.g., luminosity/mass)
  };
}

export interface GraphNode {
  name: string;
  type: string;
  x: number;
  y: number;
  z: number; // Size/Importance
  color: string;
}