import { GoogleGenAI, Type } from "@google/genai";
import { CelestialData, GraphNode } from "../types";

// --- PROCEDURAL GENERATION HELPERS (The "Infinite" Engine) ---
const hashCode = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

const CELESTIAL_TYPES = ["Exoplanet", "Nebula", "Supergiant", "Neutron Star", "Black Hole", "Quasar", "Galaxy"];
const COLORS = ["#00f3ff", "#bc13fe", "#ff0099", "#00ff9d", "#FDB813", "#ff4500", "#ffffff"];

const generateProceduralData = (name: string): CelestialData => {
  const seed = hashCode(name);
  const typeIndex = seed % CELESTIAL_TYPES.length;
  const colorIndex = seed % COLORS.length;
  
  const type = CELESTIAL_TYPES[typeIndex];
  const distVal = (seed % 5000) + 4;
  const massVal = (seed % 100) / 10;
  
  return {
    name: name.charAt(0).toUpperCase() + name.slice(1),
    type: type,
    distance: `${distVal.toLocaleString()} Light Years`,
    mass: `${massVal} Solar Masses`,
    temperature: `${(seed % 20000) + 200} K`,
    description: `A distinct ${type.toLowerCase()} located in the outer rim of the sector. Sensors indicate strong ${colorIndex % 2 === 0 ? 'magnetic' : 'gravitational'} anomalies consistent with high-energy output.`,
    funFact: `Simulations suggest this object emits a unique frequency that sounds like ${['bells', 'drums', 'silence', 'static'][seed % 4]} when converted to audio.`,
    discoveryYear: `${1950 + (seed % 75)}`,
    coordinates: {
      x: seed % 100,
      y: (seed * 13) % 100
    },
    isSimulated: true
  };
};

// --- MOCK DATA ---
// Spread across 0-100 x/y to prevent clustering
const MOCK_NODES: GraphNode[] = [
  { name: "Betelgeuse", type: "Red Supergiant", x: 15, y: 85, z: 40, color: "#ff4500", distance: "642 LY", description: "A red supergiant nearing the end of its life, expected to go supernova." },
  { name: "Sirius B", type: "White Dwarf", x: 5, y: 15, z: 15, color: "#ffffff", distance: "8.6 LY", description: "The faint white dwarf companion to the brightest star in the night sky." },
  { name: "Sagittarius A*", type: "Supermassive Black Hole", x: 92, y: 92, z: 50, color: "#bc13fe", distance: "26,000 LY", description: "The monster at the heart of the Milky Way, holding the galaxy together." },
  { name: "Pillars of Creation", type: "Nebula", x: 50, y: 40, z: 45, color: "#00f3ff", distance: "7,000 LY", description: "Iconic elephant trunks of interstellar gas and dust in the Eagle Nebula." },
  { name: "Crab Pulsar", type: "Pulsar", x: 80, y: 60, z: 20, color: "#00ff9d", distance: "6,500 LY", description: "A neutron star spinning 30 times per second, remnant of a supernova." },
  { name: "Andromeda", type: "Galaxy", x: 88, y: 20, z: 60, color: "#d8b4fe", distance: "2.5M LY", description: "Our Milky Way's largest neighbor, on a collision course with us." },
  { name: "Kepler-186f", type: "Exoplanet", x: 30, y: 35, z: 18, color: "#34d399", distance: "582 LY", description: "The first Earth-size planet found in the habitable zone of another star." },
  { name: "Ton 618", type: "Quasar", x: 98, y: 88, z: 55, color: "#fbbf24", distance: "10.4B LY", description: "An ultramassive black hole powering one of the brightest objects in the universe." },
  { name: "Horsehead Nebula", type: "Nebula", x: 60, y: 70, z: 42, color: "#f472b6", distance: "1,375 LY", description: "A dark nebula in Orion that famously resembles a horse's head." },
  { name: "Proxima Centauri", type: "Red Dwarf", x: 2, y: 5, z: 12, color: "#ef4444", distance: "4.24 LY", description: "The closest known star to the Sun, a small, low-mass red dwarf." },
  { name: "TRAPPIST-1e", type: "Exoplanet", x: 25, y: 55, z: 16, color: "#60a5fa", distance: "39 LY", description: "One of seven Earth-sized planets in the TRAPPIST-1 system, likely rocky." },
  { name: "Whirlpool Galaxy", type: "Galaxy", x: 75, y: 10, z: 58, color: "#818cf8", distance: "23M LY", description: "A classic spiral galaxy interacting with a smaller companion galaxy." },
  { name: "Cygnus X-1", type: "Black Hole", x: 65, y: 90, z: 35, color: "#a855f7", distance: "6,070 LY", description: "The first black hole ever discovered, locking in a dance with a blue supergiant." },
  { name: "Vela Pulsar", type: "Pulsar", x: 55, y: 80, z: 18, color: "#22d3ee", distance: "959 LY", description: "A glitching pulsar that results from a massive supernova explosion." },
  { name: "Oort Cloud", type: "Cometary Cloud", x: 10, y: 2, z: 50, color: "#94a3b8", distance: "2,000 AU", description: "The theoretical shell of icy objects surrounding our entire solar system." },
  { name: "Alpha Centauri A", type: "Star", x: 8, y: 75, z: 25, color: "#FDB813", distance: "4.37 LY", description: "The primary star of the closest star system to our own." },
  { name: "Ring Nebula", type: "Nebula", x: 45, y: 50, z: 38, color: "#2E8B57", distance: "2,000 LY", description: "A planetary nebula formed by a shell of ionized gas expelled by a dying star." },
  { name: "Kepler-22b", type: "Exoplanet", x: 38, y: 45, z: 22, color: "#20B2AA", distance: "600 LY", description: "A possible water world orbiting in the habitable zone of a Sun-like star." },
  { name: "UY Scuti", type: "Hypergiant", x: 20, y: 95, z: 58, color: "#FF6347", distance: "9,500 LY", description: "One of the largest known stars by radius, engulfing Jupiter's orbit if placed here." },
  { name: "Halley's Comet", type: "Comet", x: 12, y: 25, z: 10, color: "#A9A9A9", distance: "Varies", description: "The most famous short-period comet, visible from Earth every 75-76 years." },
  { name: "3C 273", type: "Quasar", x: 85, y: 95, z: 52, color: "#FFD700", distance: "2.4B LY", description: "The first quasar ever to be identified." },
  { name: "Helix Nebula", type: "Nebula", x: 52, y: 58, z: 40, color: "#FF4500", distance: "650 LY", description: "A large planetary nebula often referred to as the 'Eye of God'." },
  { name: "Voyager 1", type: "Probe", x: 18, y: 12, z: 8, color: "#cccccc", distance: "162 AU", description: "The farthest human-made object from Earth." },
  { name: "Gliese 581c", type: "Exoplanet", x: 32, y: 65, z: 15, color: "#8A2BE2", distance: "20 LY", description: "A super-Earth orbiting a red dwarf star." },
  { name: "Large Magellanic Cloud", type: "Galaxy", x: 70, y: 25, z: 55, color: "#FF69B4", distance: "163k LY", description: "A satellite galaxy of the Milky Way." }
];

// Clean the key: remove quotes if present, trim whitespace
const rawApiKey = process.env.API_KEY;
const apiKey = rawApiKey ? rawApiKey.replace(/["']/g, "").trim() : "";
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const isApiConfigured = () => !!ai;

const modelName = 'gemini-2.5-flash';

const simulateDelay = async () => new Promise(resolve => setTimeout(resolve, 600));

// NEW: Explicitly check connection validity and return reason
export interface ConnectionResult {
  success: boolean;
  message: string;
}

export const checkApiConnection = async (): Promise<ConnectionResult> => {
  if (!apiKey) {
     console.log("App running in SIMULATION MODE (No API Key provided)");
     return { success: false, message: "KEY MISSING" };
  }
  
  if (!ai) {
    return { success: false, message: "CLIENT ERROR" };
  }

  try {
    // Attempt a very cheap generation to verify key validity and quota
    await ai.models.generateContent({
      model: modelName,
      contents: "ping",
    });
    return { success: true, message: "ONLINE" };
  } catch (e: any) {
    console.warn("API Connection Check Failed:", e);
    
    // Determine if it's a quota issue or something else
    const errorMsg = e.message || e.toString();
    
    if (errorMsg.includes('429') || errorMsg.includes('quota')) {
       return { success: false, message: "QUOTA EXCEEDED" };
    }
    if (errorMsg.includes('403') || errorMsg.includes('key') || errorMsg.includes('permission')) {
        return { success: false, message: "KEY REJECTED" };
    }
    if (errorMsg.includes('404') || errorMsg.includes('not found')) {
        return { success: false, message: "MODEL ERROR" };
    }
    return { success: false, message: "CONNECTION FAILED" };
  }
};

export const fetchCelestialInfo = async (query: string): Promise<CelestialData> => {
  // 1. Fallback to Procedural Mock Data if no API key is present
  if (!ai) {
    await simulateDelay();
    const knownNode = MOCK_NODES.find(n => n.name.toLowerCase().includes(query.toLowerCase()));
    if (knownNode) {
      return {
        name: knownNode.name,
        type: knownNode.type,
        distance: knownNode.distance || "Unknown",
        mass: "Unknown",
        temperature: "Unknown",
        description: knownNode.description || "No description available.",
        funFact: "Recorded in the local star atlas.",
        discoveryYear: "Unknown",
        coordinates: { x: knownNode.x, y: knownNode.y },
        isSimulated: true
      };
    }
    return generateProceduralData(query);
  }

  // 2. Real API Call
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
    const data = JSON.parse(text) as CelestialData;
    return { ...data, isSimulated: false };

  } catch (error) {
    console.error("Gemini API Error (Fallback):", error);
    await simulateDelay();
    return generateProceduralData(query);
  }
};

export const fetchInterestingNodes = async (): Promise<GraphNode[]> => {
  if (!ai) {
    return MOCK_NODES;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Generate a list of 25 diverse and interesting specific celestial objects for a star map scatter plot.
      The list MUST include a mix of:
      - Black Holes
      - Exoplanets
      - Nebulae
      - Galaxies
      - Pulsars
      - Quasars
      
      Ensure every Name is unique.
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
              distance: { type: Type.STRING },
              description: { type: Type.STRING },
              x: { type: Type.NUMBER },
              y: { type: Type.NUMBER },
              z: { type: Type.NUMBER },
              color: { type: Type.STRING }
            }
          }
        }
      }
    });
    
    const rawNodes = JSON.parse(response.text || "[]");
    return rawNodes.length > 0 ? rawNodes : MOCK_NODES;

  } catch (e) {
    console.error("Gemini API Error (Nodes):", e);
    return MOCK_NODES;
  }
}