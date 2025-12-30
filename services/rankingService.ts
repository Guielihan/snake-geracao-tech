import { RankingEntry } from '../types';

// Usar sempre a URL de produção para garantir que funcione
// Em desenvolvimento local, use 'npx vercel dev' para testar a API
const API_BASE_URL = 'https://snake-geracaotech.vercel.app/api';

export const rankingService = {
  // Salvar uma nova entrada no ranking
  async saveEntry(entry: RankingEntry): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/ranking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });

      if (!response.ok) {
        console.error('Failed to save ranking entry:', response.statusText);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving ranking entry:', error);
      return false;
    }
  },

  // Buscar todos os rankings
  async getRankings(): Promise<RankingEntry[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/ranking`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch rankings:', response.statusText);
        return [];
      }

      const data = await response.json();
      return data.rankings || [];
    } catch (error) {
      console.error('Error fetching rankings:', error);
      return [];
    }
  },
};

