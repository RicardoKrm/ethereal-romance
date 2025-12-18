
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const prompts = [
  "Escribe una frase poética sobre cómo nuestro amor galopa como un corcel incansable sobre un campo de pétalos de sakura, ignorando la distancia. Máximo 15 palabras.",
  "Escribe una frase sobre la confianza como las raíces profundas de un cerezo y la lealtad de un espíritu de caballo que siempre vuelve a ti. Máximo 15 palabras.",
  "Escribe una frase sobre nuestras palabras como pétalos al viento de glicinas, volando hacia tu alma en el lomo de un suspiro. Máximo 15 palabras.",
  "Escribe una frase sobre la paciencia de esperar la primavera para florecer juntos, con la nobleza y fuerza de un caballo fiel. Máximo 15 palabras.",
  "Escribe una frase sobre un futuro donde cabalgamos libres entre bosques de sakuras eternas, sin mapas ni fronteras. Máximo 15 palabras.",
  "Escribe una frase final sobre nuestra unión eterna: un galope infinito en un jardín que nunca deja de florecer para nosotros. Máximo 15 palabras."
];

export const generateLoveStep = async (step: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompts[step] + " En español muy romántico y poético.",
      config: {
        temperature: 1.0,
      }
    });
    return response.text || "Nuestro amor es el mapa que guía mis pasos hacia ti.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "La distancia es solo una prueba de lo lejos que puede viajar nuestro amor.";
  }
};
