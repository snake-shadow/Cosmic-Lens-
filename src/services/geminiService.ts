import { GoogleGenAI, Type } from "@google/genai";
import { CelestialData, GraphNode } from "../types";

// Initialize Gemini
// Check if key exists and isn't a placeholder
const apiKey = process.env.API_KEY;
const isKeyValid = apiKey && apiKey.length > 10 && !apiKey.startsWith("YOUR_");

let ai: GoogleGenAI | null = null;
if (isKeyValid) {
  ai = new GoogleGenAI({ apiKey: apiKey! });
}

const modelName = 'gemini-2.5-flash';

export const isApiConfigured = () => !!ai;

// --- MOCK DATA / FALLBACKS ---
const MOCK_NODES: GraphNode[] = [
  { name: "Betelgeuse", type: "Red Supergiant", x: 20, y: 80, z: 40, color: "#ff4500", distance: "642 LY" },
  { name: "Sagittarius A*", type: "Supermassive Black Hole", x: 90, y: 90, z: 50, color: "#bc13fe", distance: "26,000 LY" },
  { name: "Pillars of Creation", type: "Nebula", x: 60, y: 50, z: 45, color: "#00f3ff", distance: "7,000 LY" },
  { name: "Andromeda", type: "Galaxy", x: 85, y: 30, z: 60, color: "#d8b4fe", distance: "2.5M LY" },
  { name: "Ton 618", type: "Quasar", x: 95, y: 95, z: 55, color: "#fbbf24", distance: "10.4B LY" },
  { name: "Kepler-22b", type: "Exoplanet", x: 45, y: 50, z: 22, color: "#20B2AA", distance: "600 LY" },
];

const GENERIC_MOCK_RESPONSE: CelestialData = {
  name: "Cosmic Anomaly",
  type: "Data Not Found",
  distance: "Unknown",
  mass: "Undefined",
  temperature: "N/A",
  description: "The application is running in 'Offline Mode' (or API quota exceeded) and this specific object could not be found in the local cache.",
  funFact: "Connect a valid Gemini API key to unlock the full universal database.",
  discoveryYear: "N/A",
  coordinates: { x: 50, y: 50 },
  isSimulated: true
};

// Helper for offline delays
const simulateDelay = async () => new Promise(resolve => setTimeout(resolve, 800));

export const fetchCelestialInfo = async (query: string): Promise<CelestialData> => {
  // 1. Offline Mode
  if (!ai) {
    await simulateDelay();
    // Simple mock lookup for demo purposes
    const lowerQ = query.toLowerCase();
    if (lowerQ.includes("betelgeuse")) return { ...GENERIC_MOCK_RESPONSE, name: "Betelgeuse", type: "Red Supergiant", distance: "642 LY", description: "A red supergiant nearing supernova.", isSimulated: true };
    if (lowerQ.includes("sagittarius")) return { ...GENERIC_MOCK_RESPONSE, name: "Sagittarius A*", type: "Black Hole", distance: "26,000 LY", description: "Supermassive black hole at the galactic center.", isSimulated: true };
    
    return { ...GENERIC_MOCK_RESPONSE, name: query.toUpperCase(), description: "System Offline. Unable to retrieve deep space telemetry for this object." };
  }

  // 2. Online Mode
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Provide detailed astronomical data for the celestial object or concept: "${query}". 
      
      CRITICAL INSTRUCTIONS:
      1. If the object is hypothetical (e.g., '3I/Atlas', 'Planet Nine') or does not officially exist yet, explicitly label its 'type' as 'Hypothetical' or 'Theoretical' and explain why in the description.
      2. If the query is generic (like "black hole"), pick a specific famous one or describe the general concept.
      3. Map the object to abstract X (Distance/Age relation 0-100) and Y (Luminosity/Energy relation 0-100) coordinates.
      
      Return valid JSON matching the schema.`,
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
    console.error("Gemini API Error:", error);
    await simulateDelay();
    return {
      ...GENERIC_MOCK_RESPONSE,
      name: query, 
      description: "Connection to Deep Space Network (AI) interrupted. Displaying simulation data.",
      isSimulated: true
    };
  }
};

export const fetchInterestingNodes = async (): Promise<GraphNode[]> => {
  if (!ai) return MOCK_NODES;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Generate a list of 20 diverse celestial objects for a star map scatter plot.
      Include: Black Holes, Exoplanets, Nebulae, Galaxies, Pulsars, Quasars.
      Ensure unique names. Return JSON.`,
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
    return rawNodes;

  } catch (e) {
    console.error("Gemini API Error (Nodes):", e);
    return MOCK_NODES;
  }
}