import React, { useState, useEffect } from 'react';
import { RankingEntry } from '../types';
import { playSound } from '../utils/audioUtils';
import { rankingService } from '../services/rankingService';

import { UserProfile } from '../types';

interface RankingProps {
  onBack: () => void;
  currentUser?: UserProfile | null;
}

// Lista de nicknames autorizados para limpar o ranking (apenas desenvolvedor)
const ADMIN_NICKNAMES = ['guielihan', 'Guielihan', 'GUIELIHAN'];

export const Ranking: React.FC<RankingProps> = ({ onBack, currentUser }) => {
  const [data, setData] = useState<RankingEntry[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  
  // Verificar se o usuário atual é administrador
  // Verifica tanto o usuário logado quanto o perfil salvo no localStorage
  const checkAdmin = () => {
    if (currentUser && ADMIN_NICKNAMES.includes(currentUser.nickname)) {
      return true;
    }
    // Verificar também no localStorage caso o usuário tenha acessado o ranking sem estar logado
    try {
      const savedProfile = localStorage.getItem('snake_last_profile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.nickname && ADMIN_NICKNAMES.includes(parsed.nickname)) {
          return true;
        }
      }
    } catch (e) {
      // Ignorar erros de parsing
    }
    return false;
  };
  
  const isAdmin = checkAdmin();

  useEffect(() => {
    // Carregar dados do backend (ranking global)
    const loadData = async () => {
      try {
        const rankings = await rankingService.getRankings();
        // Ordenar e limitar a top 15 para exibição
        const sorted = rankings.sort((a, b) => b.score - a.score).slice(0, 15);
        setData(sorted);
        
        // Trigger entrance animation
        setTimeout(() => {
          setIsVisible(true);
          playSound.fanfare();
        }, 100);
      } catch (e) {
        console.error("Error loading rankings:", e);
        setData([]);
        setTimeout(() => {
          setIsVisible(true);
        }, 100);
      }
    };
    
    loadData();

    // Atualizar ranking a cada 5 segundos para manter sincronizado
    const interval = setInterval(() => {
      loadData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleShare = () => {
    let text = "🏆 *Ranking Oficial - Snake G.T 3.0* 🏆\n\n";

    if (data.length > 0) {
      text += "🔥 *Top Jogadores:*\n";
      // Get top 5 or less
      data.slice(0, 5).forEach((entry, index) => {
        const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `ea ${index + 1}º`;
        text += `${medal} ${entry.nickname} — ${entry.score} 🍎\n`;
      });
    } else {
      text += "O ranking está vazio! Seja o primeiro a conquistar o topo.\n";
    }

    text += "\n🐍 Jogue agora e mostre sua habilidade!";

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getAvatarColor = (gender: string) => {
    const g = gender.toLowerCase();
    if (g === 'masculino') {
      return 'bg-blue-500';
    } else if (g === 'feminino') {
      return 'bg-pink-500';
    } else {
      return 'bg-orange-400';
    }
  };

  const getInitials = (name: string) => {
    if (!name || name.length === 0) return '??';
    if (name.length === 1) return name.toUpperCase() + name.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const handleClearRanking = async () => {
    if (!confirm('⚠️ ATENÇÃO: Esta ação irá apagar TODOS os dados do ranking permanentemente!\n\nTem certeza que deseja continuar?')) {
      return;
    }

    if (!confirm('⚠️ ÚLTIMA CONFIRMAÇÃO:\n\nIsso não pode ser desfeito. Todos os rankings serão perdidos.\n\nDeseja realmente limpar o ranking?')) {
      return;
    }

    setIsClearing(true);
    try {
      const success = await rankingService.clearRankings();
      if (success) {
        playSound.fanfare();
        setData([]);
        alert('✅ Ranking limpo com sucesso!');
      } else {
        throw new Error('Falha ao limpar ranking');
      }
    } catch (error) {
      console.error('Error clearing ranking:', error);
      alert('❌ Erro ao limpar ranking. Tente novamente.');
    } finally {
      setIsClearing(false);
    }
  };

  const [first, second, third, ...rest] = data;

  return (
    // Main container set to h-screen to force scroll within children
    <main className="w-full max-w-md mx-auto h-screen flex flex-col relative bg-gray-100 dark:bg-[#0a0a0f] transition-colors duration-300 overflow-hidden" aria-label="Ranking de Jogadores">
      
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0) translateY(50px); opacity: 0; }
          60% { transform: scale(1.1) translateY(-10px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes sunburst {
          0% { transform: rotate(0deg); opacity: 0; }
          20% { opacity: 0.2; }
          100% { transform: rotate(360deg); opacity: 0.2; }
        }
        .animate-pop-in {
          animation: popIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0; /* Initial state before animation starts */
        }
      `}</style>

      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-green-500/10 to-transparent pointer-events-none z-0"></div>

      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 pt-6 sm:pt-8 pb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <button 
            onClick={() => { playSound.click(); onBack(); }}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-800 dark:text-white"
          >
            <span className="material-symbols-rounded text-3xl font-bold">arrow_back_ios_new</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">Geração Tech 3.0</h1>
            <p className="text-[10px] sm:text-xs font-bold text-green-600 dark:text-green-500 uppercase tracking-wider mt-1">Ranking dos Alunos</p>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button 
                onClick={() => { playSound.click(); handleClearRanking(); }}
                disabled={isClearing}
                className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-gray-800 dark:text-white group disabled:opacity-50 disabled:cursor-not-allowed"
                title="Limpar Ranking (Administrador)"
              >
                <span className="material-symbols-rounded text-2xl group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  {isClearing ? 'hourglass_empty' : 'delete_sweep'}
                </span>
              </button>
            )}
            <button 
              onClick={() => { playSound.click(); handleShare(); }}
              className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-gray-800 dark:text-white group"
              title="Compartilhar no WhatsApp"
            >
              <span className="material-symbols-rounded text-2xl group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">share</span>
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-2">
          <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm dark:bg-white/5 border border-black/5 dark:border-white/10 px-4 py-1.5 rounded-full shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse-red"></span>
            <span className="text-xs font-bold text-gray-800 dark:text-gray-300 tracking-wide">AO VIVO</span>
          </div>
        </div>
      </header>

      {/* EMPTY STATE */}
      {data.length === 0 ? (
        <section className={`flex-1 flex flex-col items-center justify-center z-10 p-8 text-center transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} aria-label="Estado vazio do ranking">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <span className="material-symbols-rounded text-5xl text-gray-400">trophy</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Hall da Fama Vazio</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-[250px] leading-relaxed">
            A arena está silenciosa... Seja o primeiro jogador a entrar para a história!
          </p>
          <button 
            onClick={onBack}
            className="mt-8 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-500/30 transition-all transform hover:scale-105"
          >
            JOGAR AGORA
          </button>
        </section>
      ) : (
        <>
          {/* Podium */}
          <section className="relative z-10 px-2 sm:px-4 py-4 sm:py-6 grid grid-cols-3 gap-1 sm:gap-2 items-end mb-4 flex-shrink-0">
            
            {/* Second Place */}
            <div className={`flex flex-col items-center order-1 ${isVisible ? 'animate-pop-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              {second && (
                <>
                  <div className="relative mb-2 group">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 border-2 sm:border-4 border-slate-300 bg-white dark:bg-gray-800 shadow-lg relative z-10 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                       <div className={`w-full h-full rounded-full flex items-center justify-center ${getAvatarColor(second.gender)}`}>
                          <span className="font-bold text-white text-base sm:text-xl">
                            {getInitials(second.nickname)}
                          </span>
                       </div>
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-200 text-gray-800 text-xs font-bold py-0.5 px-2 rounded-full border-2 border-white dark:border-gray-800 shadow-sm z-20">
                      #2
                    </div>
                  </div>
                  <h3 className="font-bold text-sm mt-3 text-gray-800 dark:text-gray-100 truncate w-full text-center">{second.nickname}</h3>
                  <div className="flex items-center text-xs font-medium text-green-600 dark:text-green-400 mt-1">
                    <span>{second.score}</span>
                    <span className="ml-1">🍎</span>
                  </div>
                </>
              )}
            </div>

            {/* First Place */}
            <div className={`flex flex-col items-center order-2 -translate-y-4 ${isVisible ? 'animate-pop-in' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
              {first && (
                <>
                  <div className="relative mb-2 group">
                    {/* Sunburst effect behind 1st place */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] bg-[conic-gradient(from_0deg,transparent_0_20deg,rgba(251,191,36,0.2)_20deg_40deg,transparent_40deg_60deg,rgba(251,191,36,0.2)_60deg_80deg,transparent_80deg_100deg,rgba(251,191,36,0.2)_100deg_120deg,transparent_120deg_140deg,rgba(251,191,36,0.2)_140deg_160deg,transparent_160deg_180deg,rgba(251,191,36,0.2)_180deg_200deg,transparent_200deg_220deg,rgba(251,191,36,0.2)_220deg_240deg,transparent_240deg_260deg,rgba(251,191,36,0.2)_260deg_280deg,transparent_280deg_300deg,rgba(251,191,36,0.2)_300deg_320deg,transparent_320deg_340deg,rgba(251,191,36,0.2)_340deg_360deg)] rounded-full z-0 animate-[sunburst_10s_linear_infinite]"></div>
                    
                    <div className="absolute inset-0 bg-amber-400/40 blur-xl rounded-full animate-pulse"></div>
                    
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 border-[3px] sm:border-[5px] border-amber-400 bg-white dark:bg-gray-800 shadow-xl relative z-10 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                       <div className={`w-full h-full rounded-full flex items-center justify-center ${getAvatarColor(first.gender)}`}>
                          <span className="font-bold text-white text-2xl sm:text-3xl">
                            {getInitials(first.nickname)}
                          </span>
                       </div>
                    </div>
                    
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl animate-bounce">👑</div>

                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-400 text-gray-900 text-sm font-extrabold py-1 px-3 rounded-full border-2 border-white dark:border-gray-800 shadow-sm z-20">
                      #1
                    </div>
                  </div>
                  <h3 className="font-bold text-base mt-4 text-amber-500 truncate w-full text-center">{first.nickname}</h3>
                  <div className="flex items-center text-sm font-bold text-green-600 dark:text-green-400 mt-1">
                    <span>{first.score}</span>
                    <span className="ml-1">🍎</span>
                  </div>
                </>
              )}
            </div>

            {/* Third Place */}
            <div className={`flex flex-col items-center order-3 ${isVisible ? 'animate-pop-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
              {third && (
                <>
                  <div className="relative mb-2 group">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 border-2 sm:border-4 border-amber-700 bg-white dark:bg-gray-800 shadow-lg relative z-10 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                       <div className={`w-full h-full rounded-full flex items-center justify-center ${getAvatarColor(third.gender)}`}>
                          <span className="font-bold text-white text-base sm:text-xl">
                            {getInitials(third.nickname)}
                          </span>
                       </div>
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-700 text-white text-xs font-bold py-0.5 px-2 rounded-full border-2 border-white dark:border-gray-800 shadow-sm z-20">
                      #3
                    </div>
                  </div>
                  <h3 className="font-bold text-sm mt-3 text-gray-800 dark:text-gray-100 truncate w-full text-center">{third.nickname}</h3>
                  <div className="flex items-center text-xs font-medium text-green-600 dark:text-green-400 mt-1">
                    <span>{third.score}</span>
                    <span className="ml-1">🍎</span>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* List - Added flex-1 and overflow-y-auto to enable scrolling */}
          <section className="flex-1 px-2 sm:px-4 pb-20 relative z-10 space-y-2 sm:space-y-3 overflow-y-auto scrollbar-hide">
            {rest.map((player, index) => {
              const bgClass = getAvatarColor(player.gender);
              // Staggered animation for list items
              const delay = `${(index * 0.1) + 0.6}s`;
              
              return (
                <div 
                  key={index + player.timestamp} 
                  className={`flex items-center p-3 bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 transition-all duration-700 transform hover:scale-[1.01] hover:bg-white/80 dark:hover:bg-gray-800 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
                  style={{ transitionDelay: delay }}
                >
                  <span className="w-8 text-center text-gray-400 font-bold text-lg">{index + 4}</span>
                  
                  <div className={`w-10 h-10 rounded-full overflow-hidden ml-2 mr-4 flex-shrink-0 flex items-center justify-center ${bgClass} shadow-inner`}>
                    <span className="text-white font-bold text-sm">
                      {getInitials(player.nickname)}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm sm:text-base text-gray-800 dark:text-gray-100 truncate">{player.nickname}</h4>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 sm:space-x-3 mt-0.5">
                      <div className="flex items-center text-xs font-medium text-green-600 dark:text-green-400">
                        <span className="material-symbols-rounded text-[14px] mr-1">nutrition</span>
                        {player.score}
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <span className="material-symbols-rounded text-[14px] mr-1">schedule</span>
                        {player.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className={`flex flex-col items-center justify-center pt-6 pb-4 transition-opacity duration-700 delay-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-xs font-medium text-gray-400 dark:text-gray-600 mb-1">Desenvolvido por</span>
              <div className="flex items-center space-x-1.5 text-gray-600 dark:text-green-400">
                <span className="material-symbols-rounded text-base">code</span>
                <span className="font-semibold text-sm">guielihan</span>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
};