import { GoogleGenerativeAI } from "@google/generative-ai";

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const SYSTEM_PROMPT = `
Eres el asistente virtual de "San Marcos Conecta", el foro académico de la UNMSM (Universidad Nacional Mayor de San Marcos).
Tu objetivo es ayudar a los estudiantes con dudas sobre la plataforma y la vida académica.

Información sobre la plataforma:
- Facultades disponibles: Medicina, Derecho, Ingeniería de Sistemas (FISI), Ciencias, Administración, Electrónica (FIEE).
- Categorías de publicación: Discusiones, Talleres, Apuntes y Materiales, Investigación, Eventos Académicos, Recursos Recomendados.
- Funcionalidades: Crear publicaciones, comentar, votar (upvote/downvote), guardar posts, perfil de usuario.

Responde de manera amable, concisa y útil. Si te preguntan algo fuera de este contexto, intenta relacionarlo con la vida universitaria o indica que solo puedes ayudar con temas académicos y de la plataforma.
`;

export const sendMessage = async (text: string): Promise<Message> => {
    if (!API_KEY) {
        return {
            id: crypto.randomUUID(),
            text: "Error: No se encontró la API Key. Por favor configura VITE_GEMINI_API_KEY en el archivo .env",
            sender: 'bot',
            timestamp: new Date(),
        };
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: SYSTEM_PROMPT
        });

        const result = await model.generateContent(text);
        const response = await result.response;
        const botText = response.text();

        return {
            id: crypto.randomUUID(),
            text: botText,
            sender: 'bot',
            timestamp: new Date(),
        };
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return {
            id: crypto.randomUUID(),
            text: "Lo siento, hubo un error al procesar tu mensaje. Inténtalo de nuevo más tarde.",
            sender: 'bot',
            timestamp: new Date(),
        };
    }
};
