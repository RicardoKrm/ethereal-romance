
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateAllLoveSteps = async (): Promise<string[]> => {
  const prompt = `Escribe 6 frases poéticas cortas (máximo 15 palabras cada una) para un regalo romántico. 
  Deben seguir este orden y temática:
  1. El inicio de nuestro viaje (metáfora de potros y sakuras).
  2. La distancia no detiene nuestro galope (pétalos y kilómetros).
  3. Palabras al viento (crines al aire y flores blancas).
  4. Promesa de florecer juntos (caballo noble volviendo a casa).
  5. Sueños compartidos (campo infinito de glicinas).
  6. Invitación a una unión eterna (galope sobre pétalos).
  
  Devuelve las frases en un array de strings en español, muy tierno y sin comillas.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 1.0,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    
    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    return new Array(6).fill("Nuestro amor florece en la distancia.");
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      "Nuestro amor galopa libre entre los primeros brotes de sakura.",
      "Cada kilómetro es un pétalo que cae esperando nuestro encuentro.",
      "Mis susurros viajan veloces como crines al viento hacia ti.",
      "Prometo florecer a tu lado con la nobleza de un corazón fiel.",
      "En mis sueños, galopamos juntos por campos de paz infinita.",
      "Unamos nuestras vidas en un galope eterno sobre pétalos de amor."
    ];
  }
};

// Mantenemos la función antigua por compatibilidad si fuera necesario, pero ya no se usará en App.tsx
export const generateLoveStep = async (step: number): Promise<string> => {
  return "Deprecated: Use generateAllLoveSteps instead.";
};
