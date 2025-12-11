import { GoogleGenAI } from "@google/genai";
import { Drone, WeatherData, Alert } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeRiskProtocol = async (
  drones: Drone[],
  weather: WeatherData,
  alerts: Alert[]
): Promise<string> => {
  try {
    const prompt = `
      You are the AI Safety Officer for NordicFlight Ops.
      Current Telemetry:
      - Weather: Wind ${weather.windSpeed} m/s ${weather.windDirection}, Temp ${weather.temp}C.
      - Compliance Score: 72 (Hazardous).
      - Active Alerts: ${alerts.map(a => `${a.code}: ${a.message} (${a.severity})`).join('; ')}
      - Drones: ${drones.map(d => `${d.callsign} Bat:${d.battery}% Stat:${d.status}`).join('; ')}

      EAGLE-03 is in a CRITICAL state with Battery Imbalance and high wind exposure.
      
      Provide a concise, 3-bullet point tactical executive summary for the Flight Controller. 
      Focus on immediate risk mitigation and RTH (Return To Home) verification. 
      Use industrial, authoritative language.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "UNABLE TO GENERATE ANALYSIS.";
  } catch (error) {
    console.error("Gemini Analysis Failed", error);
    return "SYSTEM ERROR: UNABLE TO CONNECT TO AI SAFETY MODULE.";
  }
};
