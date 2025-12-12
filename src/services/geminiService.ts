import { GoogleGenAI, Type } from "@google/genai";
import { CelestialData, GraphNode } from "../types";

// --- MOCK DATA FOR SAFE MODE ---
// This ensures the app works beautifully even without an API key (e.g. on public demo)

const MOCK_NODES: GraphNode[] = [
  { name: "Betelgeuse", type: "Red Supergiant", x: 20, y: 80, z: 40, color: "#ff4500", distance: "642 LY", description: "A red supergiant nearing the end of its life, expected to go supernova." },
  { name: "Sirius B", type: "White Dwarf", x: 10, y: 20, z: 15, color: "#ffffff", distance: "8.6 LY", description: "The faint white dwarf companion to the brightest star in the night sky." },
  { name: "Sagittarius A*", type: "Supermassive Black Hole", x: 90, y: 90, z: 50, color: "#bc13fe", distance: "26,000 LY", description: "The monster at the heart of the Milky Way, holding the galaxy together." },
  { name: "Pillars of Creation", type: "Nebula", x: 60, y: 50, z: 45, color: "#00f3ff", distance: "7,000 LY", description: "Iconic elephant trunks of interstellar gas and dust in the Eagle Nebula." },
  { name: "Crab Pulsar", type: "Pulsar", x: 75, y: 65, z: 20, color: "#00ff9d", distance: "6,500 LY", description: "A neutron star spinning 30 times per second, remnant of a supernova." },
  { name: "Andromeda", type: "Galaxy", x: 85, y: 30, z: 60, color: "#d8b4fe", distance: "2.5M LY", description: "Our Milky Way's largest neighbor, on a collision course with us." },
  { name: "Kepler-186f", type: "Exoplanet", x: 40, y: 45, z: 18, color: "#34d399", distance: "582 LY", description: "The first Earth-size planet found in the habitable zone of another star." },
  { name: "Ton 618", type: "Quasar", x: 95, y: 95, z: 55, color: "#fbbf24", distance: "10.4B LY", description: "An ultramassive black hole powering one of the brightest objects in the universe." },
  { name: "Horsehead Nebula", type: "Nebula", x: 55, y: 60, z: 42, color: "#f472b6", distance: "1,375 LY", description: "A dark nebula in Orion that famously resembles a horse's head." },
  { name: "Proxima Centauri", type: "Red Dwarf", x: 5, y: 10, z: 12, color: "#ef4444", distance: "4.24 LY", description: "The closest known star to the Sun, a small, low-mass red dwarf." },
  { name: "TRAPPIST-1e", type: "Exoplanet", x: 35, y: 55, z: 16, color: "#60a5fa", distance: "39 LY", description: "One of seven Earth-sized planets in the TRAPPIST-1 system, likely rocky." },
  { name: "Whirlpool Galaxy", type: "Galaxy", x: 80, y: 25, z: 58, color: "#818cf8", distance: "23M LY", description: "A classic spiral galaxy interacting with a smaller companion galaxy." },
  { name: "Cygnus X-1", type: "Black Hole", x: 70, y: 85, z: 35, color: "#a855f7", distance: "6,070 LY", description: "The first black hole ever discovered, locking in a dance with a blue supergiant." },
  { name: "Vela Pulsar", type: "Pulsar", x: 65, y: 70, z: 18, color: "#22d3ee", distance: "959 LY", description: "A glitching pulsar that results from a massive supernova explosion." },
  { name: "Oort Cloud", type: "Cometary Cloud", x: 15, y: 5, z: 50, color: "#94a3b8", distance: "2,000 AU", description: "The theoretical shell of icy objects surrounding our entire solar system." },
  { name: "Alpha Centauri A", type: "Star", x: 8, y: 82, z: 25, color: "#FDB813", distance: "4.37 LY", description: "The primary star of the closest star system to our own." },
  { name: "Ring Nebula", type: "Nebula", x: 62, y: 45, z: 38, color: "#2E8B57", distance: "2,000 LY", description: "A planetary nebula formed by a shell of ionized gas expelled by a dying star." },
  { name: "Kepler-22b", type: "Exoplanet", x: 45, y: 50, z: 22, color: "#20B2AA", distance: "600 LY", description: "A possible water world orbiting in the habitable zone of a Sun-like star." },
  { name: "UY Scuti", type: "Hypergiant", x: 30, y: 95, z: 58, color: "#FF6347", distance: "9,500 LY", description: "One of the largest known stars by radius, engulfing Jupiter's orbit if placed here." },
  { name: "Halley's Comet", type: "Comet", x: 12, y: 5, z: 10, color: "#A9A9A9", distance: "Varies", description: "The most famous short-period comet, visible from Earth every 75-76 years." }
];

const MOCK_DETAILS_LOOKUP: Record<string, CelestialData> = {
  "Sagittarius A*": {
    name: "Sagittarius A*",
    type: "Supermassive Black Hole",
    distance: "26,000 Light Years",
    mass: "4 Million Suns",
    temperature: "N/A (Accretion: 10M K)",
    description: "The supermassive black hole at the Galactic Center of the Milky Way. It is a compact radio source and the anchor around which our entire galaxy rotates.",
    funFact: "Time passes significantly slower near its event horizon due to extreme gravitational time dilation.",
    discoveryYear: "1974",
    coordinates: { x: 90, y: 90 },
    isSimulated: true
  },
  "Ton 618": {
    name: "Ton 618",
    type: "Hyperluminous Quasar",
    distance: "10.4 Billion Light Years",
    mass: "66 Billion Suns",
    temperature: "Trillions of Degrees",
    description: "One of the most massive black holes ever found, powering a quasar that outshines entire galaxies combined. Its accretion disk is larger than our solar system.",
    funFact: "It is so bright that we can see it from over 10 billion light years away.",
    discoveryYear: "1957",
    coordinates: { x: 95, y: 95 },
    isSimulated: true
  },
  "Betelgeuse": {
    name: "Betelgeuse",
    type: "Red Supergiant",
    distance: "642.5 Light Years",
    mass: "11-19 Suns",
    temperature: "3,500 K",
    description: "A colossal red supergiant in the constellation Orion. It is nearing the end of its life and is expected to explode as a supernova within the next 100,000 years.",
    funFact: "If placed in our solar system, its surface would extend beyond the orbit of Jupiter.",
    discoveryYear: "Prehistoric",
    coordinates: { x: 20, y: 80 },
    isSimulated: true
  },
  "Pillars of Creation": {
    name: "Pillars of Creation",
    type: "Nebula Region",
    distance: "7,000 Light Years",
    mass: "200 Suns (Gas)",
    temperature: "10,000 K",
    description: "Elephant trunks of interstellar gas and dust in the Eagle Nebula. They are in the process of creating new stars, while simultaneously being eroded by the light from nearby massive stars.",
    funFact: "They may have already been destroyed by a supernova, but the light showing the destruction won't reach Earth for another millennium.",
    discoveryYear: "1995 (Hubble)",
    coordinates: { x: 60, y: 50 },
    isSimulated: true
  },
  "Kepler-22b": {
    name: "Kepler-22b",
    type: "Exoplanet (Super-Earth)",
    distance: "600 Light Years",
    mass: "Unknown (~2.4 Earth Radii)",
    temperature: "262 K (-11°C)",
    description: "The first transiting exoplanet found to orbit within the habitable zone of a sun-like star. It might be an ocean world covered entirely by water.",
    funFact: "A year on Kepler-22b lasts about 290 days, very similar to Earth's year.",
    discoveryYear: "2011",
    coordinates: { x: 45, y: 50 },
    isSimulated: true
  }
};

const GENERIC_MOCK_RESPONSE: CelestialData = {
  name: "Cosmic Anomaly",
  type: "Data Not Found",
  distance: "Unknown",
  mass: "Undefined",
  temperature: "N/A",
  description: "The application is running in 'Offline Mode' and this specific object could not be found in the local database. Please connect a valid Gemini API key to unlock the full universal database.",
  funFact: "When offline, this app can only display a limited set of pre-cached celestial objects.",
  discoveryYear: "N/A",
  coordinates: { x: 50, y: 50 },
  isSimulated: true
};

// --- GEMINI SERVICE ---

const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey.startsWith("AIza")) {
  ai = new GoogleGenAI({ apiKey });
}

export const isApiConfigured = () => !!ai;

const modelName = 'gemini-2.5-flash';

// Helper to simulate network delay for realism in Mock Mode
const simulateDelay = async () => new Promise(resolve => setTimeout(resolve, 800));

export const fetchCelestialInfo = async (query: string): Promise<CelestialData> => {
  // 1. Fallback to Mock Data if no API key is present
  if (!ai || !apiKey) {
    await simulateDelay();
    // Try exact match
    if (MOCK_DETAILS_LOOKUP[query]) return MOCK_DETAILS_LOOKUP[query];
    
    // Try partial match
    const partial = Object.keys(MOCK_DETAILS_LOOKUP).find(k => k.toLowerCase().includes(query.toLowerCase()));
    if (partial) return MOCK_DETAILS_LOOKUP[partial];

    // Try finding in node list
    const node = MOCK_NODES.find(n => n.name.toLowerCase().includes(query.toLowerCase()));
    if (node) {
        return {
            ...GENERIC_MOCK_RESPONSE,
            name: node.name,
            type: node.type,
            distance: node.distance || "Unknown",
            description: node.description || GENERIC_MOCK_RESPONSE.description,
            coordinates: { x: node.x, y: node.y },
            isSimulated: true
        };
    }
    
    // Generic
    return { ...GENERIC_MOCK_RESPONSE, name: query.toUpperCase() };
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
    console.error("Gemini API Error (Fallback to Mock):", error);
    // If API limit reached or error, fall back to mock
    await simulateDelay();
    return { ...GENERIC_MOCK_RESPONSE, name: query, description: "Connection to Deep Space Network (AI) interrupted. Displaying simulation data." };
  }
};

export const fetchInterestingNodes = async (): Promise<GraphNode[]> => {
  // 1. Return safe mock nodes if no key
  if (!ai || !apiKey) {
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
      - Pulsars/Neutron Stars
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
              distance: { type: Type.STRING, description: "Short distance string e.g. '400 LY'" },
              description: { type: Type.STRING, description: "One short intriguing sentence about this object" },
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
    return rawNodes;

  } catch (e) {
    console.error("Gemini API Error (Nodes Fallback):", e);
    return MOCK_NODES;
  }
}