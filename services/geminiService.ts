import { GoogleGenerativeAI } from "@google/generative-ai";
import { UserProfile } from "../types";

// Initialize Gemini Client only if API key is available
let genAI: GoogleGenerativeAI | null = null;
const MODEL_NAME = "gemini-1.5-flash";

try {
  // Get API key from environment variables
  // Vercel/Vite uses import.meta.env for environment variables
  // @ts-ignore - import.meta.env is available in Vite
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;
  if (apiKey && typeof apiKey === 'string' && apiKey.trim() !== '' && apiKey !== 'undefined') {
    genAI = new GoogleGenerativeAI(apiKey);
  }
} catch (error) {
  console.warn("Gemini API key not configured. AI features will be disabled.");
}

export const generatePlayerTitle = async (profile: UserProfile): Promise<string> => {
  // Return fallback if API is not configured
  if (!genAI) {
    return `${profile.nickname} o Bravo`;
  }

  try {
    const prompt = `
      Crie um título de jogador de videogame curto, épico e divertido (máximo 4 palavras) para este usuário:
      Apelido: ${profile.nickname}
      Idade: ${profile.age}
      Gênero: ${profile.gender}
      
      O título deve ser em Português. Exemplo: "O Destruidor de Pixels", "A Víbora Veloz".
      Retorne apenas o texto do título.
    `;

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text?.trim() || `${profile.nickname} o Jogador`;
  } catch (error) {
    console.error("Error generating title:", error);
    return `${profile.nickname} o Bravo`;
  }
};

export const generateGameCommentary = async (
  profile: UserProfile, 
  score: number, 
  event: 'start' | 'game_over' | 'high_score'
): Promise<string> => {
  // Return fallback if API is not configured
  if (!genAI) {
    return event === 'start' ? "Prepare-se..." : "Tente novamente!";
  }

  try {
    let context = "";
    if (event === 'start') {
      context = "O jogador acabou de entrar na arena. Dê uma frase de encorajamento curta ou um aviso ameaçador.";
    } else if (event === 'game_over') {
      context = `O jogador perdeu com uma pontuação de ${score}. Dê um comentário sarcástico ou consolador, dependendo de quão baixa ou alta foi a pontuação (Score alto é > 10).`;
    }

    const prompt = `
      Você é um narrador de e-sports futurista e carismático.
      Jogador: ${profile.nickname} (${profile.title || 'Iniciante'})
      Contexto: ${context}
      
      Responda em Português do Brasil. Máximo de 2 frases curtas.
    `;

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text?.trim() || (event === 'start' ? "Boa sorte!" : "Fim de jogo!");
  } catch (error) {
    console.error("Error generating commentary:", error);
    return event === 'start' ? "Prepare-se..." : "Tente novamente!";
  }
};
