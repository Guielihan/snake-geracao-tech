import type { VercelRequest, VercelResponse } from '@vercel/node';

// Definir o tipo aqui para evitar problemas de import
interface RankingEntry {
  nickname: string;
  score: number;
  gender: string;
  timestamp: string;
  date: number;
}

const RANKING_KEY = 'snake_global_rankings';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Tente usar Vercel KV se disponível
    // @vercel/kv lê automaticamente as variáveis de ambiente padrão
    let kv: any = null;
    try {
      const kvModule = await import('@vercel/kv');
      kv = kvModule.kv;
    } catch (e) {
      // Vercel KV não disponível - será tratado abaixo
      console.log('Vercel KV not available:', e);
    }

    if (req.method === 'POST') {
      const entry: RankingEntry = req.body;

      // Validação básica
      if (!entry.nickname || typeof entry.score !== 'number' || entry.score <= 0) {
        return res.status(400).json({ error: 'Invalid entry data' });
      }

      // Adicionar entrada
      const newEntry: RankingEntry = {
        ...entry,
        date: entry.date || Date.now(),
      };

      if (kv) {
        // Usar Vercel KV para persistência global
        let rankings: RankingEntry[] = (await kv.get(RANKING_KEY)) || [];
        rankings.push(newEntry);
        rankings.sort((a, b) => b.score - a.score);
        rankings = rankings.slice(0, 100); // Manter top 100
        await kv.set(RANKING_KEY, rankings);
        return res.status(200).json({ success: true, entry: newEntry });
      } else {
        // Vercel KV não configurado - retornar erro informativo
        return res.status(503).json({ 
          error: 'Database not configured',
          message: 'Por favor, configure Vercel KV no painel da Vercel para habilitar ranking global.'
        });
      }
    }

    if (req.method === 'GET') {
      if (kv) {
        // Buscar rankings do Vercel KV
        let rankings: RankingEntry[] = (await kv.get(RANKING_KEY)) || [];
        // Ordenar e retornar top 50
        const topRankings = rankings
          .sort((a, b) => b.score - a.score)
          .slice(0, 50);
        return res.status(200).json({ rankings: topRankings });
      } else {
        // Vercel KV não configurado - retornar array vazio
        return res.status(200).json({ rankings: [] });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in ranking API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
