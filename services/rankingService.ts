import { RankingEntry } from '../types';

// Usar sempre a URL de produção para garantir que funcione
// Em desenvolvimento local, use 'npx vercel dev' para testar a API
const API_BASE_URL = 'https://snake-geracaotech.vercel.app/api';

export const rankingService = {
  // Salvar uma nova entrada no ranking
  async saveEntry(entry: RankingEntry): Promise<boolean> {
    try {
      console.log('Salvando entrada no ranking:', entry);
      const response = await fetch(`${API_BASE_URL}/ranking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to save ranking entry:', response.status, response.statusText, errorText);
        return false;
      }

      const result = await response.json();
      console.log('Entrada salva com sucesso:', result);
      return true;
    } catch (error) {
      console.error('Error saving ranking entry:', error);
      return false;
    }
  },

  // Buscar todos os rankings
  async getRankings(): Promise<RankingEntry[]> {
    try {
      console.log('Buscando rankings de:', API_BASE_URL);
      const response = await fetch(`${API_BASE_URL}/ranking`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch rankings:', response.status, response.statusText, errorText);
        return [];
      }

      const data = await response.json();
      console.log('Rankings recebidos:', data.rankings?.length || 0, 'entradas');
      return data.rankings || [];
    } catch (error) {
      console.error('Error fetching rankings:', error);
      return [];
    }
  },

  // Limpar todo o ranking
  async clearRankings(): Promise<boolean> {
    try {
      console.log('Limpando ranking...');
      const response = await fetch(`${API_BASE_URL}/ranking`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to clear ranking:', response.status, response.statusText, errorText);
        return false;
      }

      const result = await response.json();
      console.log('Ranking limpo com sucesso:', result);
      return true;
    } catch (error) {
      console.error('Error clearing ranking:', error);
      return false;
    }
  },
};

