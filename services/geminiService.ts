import { GoogleGenAI, Type } from "@google/genai";
import { CelestialData } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const modelName = 'gemini-2.5-flash';

export const fetchCelestialInfo = async (query: string): Promise<CelestialData> => {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Provide detailed astronomical data for the celestial object or concept: "${query}". 
      If the query is generic (like "black hole"), pick a specific famous one or describe the general concept with specific data examples.
      Map the object to abstract X (Distance/Age relation 0-100) and Y (Luminosity/Energy relation 0-100) coordinates for a scatter plot.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            type: { type: Type.STRING },
            distance: { type: Type.STRING, description: "Distance from Earth with units" },
            mass: { type: Type.STRING },
            temperature: { type: Type.STRING },
            description: { type: Type.STRING, description: "A comprehensive 2-sentence description" },
            funFact: { type: Type.STRING, description: "A surprising or mind-blowing fact" },
            discoveryYear: { type: Type.STRING },
            coordinates: {
              type: Type.OBJECT,
              properties: {
                x: { type: Type.NUMBER, description: "Value 0-100 representing distance or age" },
                y: { type: Type.NUMBER, description: "Value 0-100 representing luminosity or energy" }
              }
            }
          },
          required: ["name", "type", "distance", "mass", "temperature", "description", "funFact", "coordinates"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data returned");
    return JSON.parse(text) as CelestialData;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback data in case of error to keep UI alive
    return {
      name: "Unknown Anomaly",
      type: "Data Corrupted",
      distance: "Unknown",
      mass: "Undefined",
      temperature: "Absolute Zero",
      description: "Sensors could not lock onto the target. The cosmic interference is too strong.",
      funFact: "Even Gemini sometimes loses signal in the vastness of space.",
      discoveryYear: "N/A",
      coordinates: { x: 50, y: 50 }
    };
  }
};

export const fetchInterestingNodes = async (): Promise<any[]> => {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Generate a list of 25 diverse and interesting specific celestial objects for a star map scatter plot.
      The list MUST include a mix of:
      - Black Holes (e.g., Ton 618, Cygnus X-1)
      - Exoplanets (e.g., Kepler-22b, TRAPPIST-1e)
      - Nebulae (e.g., Cat's Eye, Butterfly)
      - Galaxies (e.g., Andromeda, Sombrero)
      - Pulsars/Neutron Stars
      - Quasars
      - Hypergiants
      
      Ensure every Name is unique. Do not list the same object twice.
      Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              type: { type: Type.STRING },
              x: { type: Type.NUMBER, description: "0-100" },
              y: { type: Type.NUMBER, description: "0-100" },
              z: { type: Type.NUMBER, description: "Size factor 10-60" },
              color: { type: Type.STRING, description: "Hex color code matching the object's visual spectral type" }
            }
          }
        }
      }
    });
    
    const rawNodes = JSON.parse(response.text || "[]");
    
    // Deduplicate nodes by name to prevent repeats like "Cat's Eye Nebula" appearing twice
    const uniqueNodes: any[] = [];
    const seenNames = new Set();
    
    for (const node of rawNodes) {
      if (!seenNames.has(node.name)) {
        seenNames.add(node.name);
        uniqueNodes.push(node);
      }
    }
    
    return uniqueNodes;

  } catch (e) {
    // robust fallback dataset
    return [
      { name: "Betelgeuse", type: "Red Supergiant", x: 20, y: 80, z: 40, color: "#ff4500" },
      { name: "Sirius B", type: "White Dwarf", x: 10, y: 20, z: 15, color: "#ffffff" },
      { name: "Sagittarius A*", type: "Supermassive Black Hole", x: 90, y: 90, z: 50, color: "#bc13fe" },
      { name: "Pillars of Creation", type: "Nebula", x: 60, y: 50, z: 45, color: "#00f3ff" },
      { name: "Crab Pulsar", type: "Pulsar", x: 75, y: 65, z: 20, color: "#00ff9d" },
      { name: "Andromeda", type: "Galaxy", x: 85, y: 30, z: 60, color: "#d8b4fe" },
      { name: "Kepler-186f", type: "Exoplanet", x: 40, y: 45, z: 18, color: "#34d399" },
      { name: "Ton 618", type: "Quasar", x: 95, y: 95, z: 55, color: "#fbbf24" },
      { name: "Horsehead Nebula", type: "Nebula", x: 55, y: 60, z: 42, color: "#f472b6" },
      { name: "Proxima Centauri", type: "Red Dwarf", x: 5, y: 10, z: 12, color: "#ef4444" },
      { name: "TRAPPIST-1e", type: "Exoplanet", x: 35, y: 55, z: 16, color: "#60a5fa" },
      { name: "Whirlpool Galaxy", type: "Galaxy", x: 80, y: 25, z: 58, color: "#818cf8" },
      { name: "Cygnus X-1", type: "Black Hole", x: 70, y: 85, z: 35, color: "#a855f7" },
      { name: "Vela Pulsar", type: "Pulsar", x: 65, y: 70, z: 18, color: "#22d3ee" },
      { name: "Oort Cloud", type: "Cometary Cloud", x: 15, y: 5, z: 50, color: "#94a3b8" }
    ];
  }
}
