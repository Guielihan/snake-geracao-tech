import React, { useState, useEffect, useCallback, useRef } from 'react';
import { UserProfile, GameStatus, Coordinate, Direction, Difficulty, RankingEntry } from '../types';
import { GRID_SIZE, getRandomCoordinate, checkCollision } from '../utils/gameUtils';
import { playSound } from '../utils/audioUtils';
import { rankingService } from '../services/rankingService';

interface SnakeGameProps {
  user: UserProfile;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  life: number;
}

// Hook for game loop interval
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const DIFFICULTY_CONFIG = {
  [Difficulty.EASY]: { label: 'Fácil', desc: 'Lento e relaxante', baseSpeed: 200, speedMultiplier: 0, color: 'text-green-500 dark:text-green-400 border-green-500' },
  [Difficulty.MEDIUM]: { label: 'Médio', desc: 'Acelera gradualmente', baseSpeed: 150, speedMultiplier: 2, color: 'text-cyan-500 dark:text-cyan-400 border-cyan-500' },
  [Difficulty.HARD]: { label: 'Difícil', desc: 'Rápido desde o início', baseSpeed: 100, speedMultiplier: 4, color: 'text-purple-500 dark:text-purple-400 border-purple-600' },
  [Difficulty.EXTREME]: { label: 'Extremo', desc: 'Velocidade insana', baseSpeed: 60, speedMultiplier: 5, color: 'text-red-600 dark:text-red-500 border-red-600' },
};

export const SnakeGame: React.FC<SnakeGameProps> = ({ user, onLogout, isDarkMode, toggleTheme }) => {
  // Game State
  const [snake, setSnake] = useState<Coordinate[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Coordinate>({ x: 5, y: 5 });
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [isPaused, setIsPaused] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);
  
  // Tutorial State
  const [tutorialStep, setTutorialStep] = useState(0);
  
  // Animation States
  const [countdown, setCountdown] = useState(3);
  const [shake, setShake] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [screenFlash, setScreenFlash] = useState(false);
  
  // Movement Refs
  const moveQueue = useRef<Direction[]>([]);
  const currentDirection = useRef<Direction>(Direction.RIGHT); 
  const lastProcessedDirection = useRef<Direction>(Direction.RIGHT); 

  // Touch Control Refs
  const touchStart = useRef<Coordinate | null>(null);

  // Initialize & High Score
  useEffect(() => {
    const initData = async () => {
      const stored = localStorage.getItem('snake_highscore');
      if (stored) setHighScore(parseInt(stored, 10));
    };
    initData();
  }, []); 

  // Check for Level Up (Every 50 points)
  useEffect(() => {
    if (score > 0 && score % 50 === 0 && status === GameStatus.PLAYING) {
       playSound.levelUp();
       addFloatingText(10, 2, "NÍVEL UP!");
    }
  }, [score, status]);

  // Check for new record during gameplay
  useEffect(() => {
    if (status === GameStatus.PLAYING && score > highScore && score > 0) {
      if (!isNewRecord) setIsNewRecord(true);
      setHighScore(score);
      localStorage.setItem('snake_highscore', score.toString());
    }
  }, [score, highScore, status, isNewRecord]);

  // Countdown Logic
  useEffect(() => {
    if (status === GameStatus.COUNTDOWN) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            playSound.start();
            setStatus(GameStatus.PLAYING);
            return 3;
          }
          playSound.countdown();
          return prev - 1;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [status]);

  // Visual Effects Loop (Particles & Floating Text)
  useEffect(() => {
    let animationFrame: number | null = null;
    
    const updateEffects = () => {
      // Particles
      setParticles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        life: p.life - 0.05
      })).filter(p => p.life > 0));

      // Floating Texts
      setFloatingTexts(prev => prev.map(t => ({
        ...t,
        y: t.y - 0.5, // Float up
        life: t.life - 0.02
      })).filter(t => t.life > 0));

      animationFrame = requestAnimationFrame(updateEffects);
    };

    if (particles.length > 0 || floatingTexts.length > 0) {
      animationFrame = requestAnimationFrame(updateEffects);
    }
    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [particles.length, floatingTexts.length]);

  const tryStartGame = () => {
      playSound.click();
      const hasSeenTutorial = localStorage.getItem('snake_tutorial_seen');
      if (!hasSeenTutorial) {
          setStatus(GameStatus.TUTORIAL);
          setTutorialStep(1);
      } else {
          startCountdown();
      }
  };

  const nextTutorialStep = () => {
      playSound.click();
      if (tutorialStep < 3) {
          setTutorialStep(s => s + 1);
      } else {
          playSound.success();
          localStorage.setItem('snake_tutorial_seen', 'true');
          setStatus(GameStatus.IDLE);
          startCountdown();
      }
  };

  const startCountdown = () => {
    const initialSnake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    setSnake(initialSnake);
    setFood(getRandomCoordinate(initialSnake));
    
    currentDirection.current = Direction.RIGHT;
    lastProcessedDirection.current = Direction.RIGHT;
    moveQueue.current = [];
    setParticles([]);
    setFloatingTexts([]);
    setIsNewRecord(false);
    
    setScore(0);
    setIsPaused(false);
    setCountdown(3);
    playSound.countdown();
    setStatus(GameStatus.COUNTDOWN);
  };

  const spawnParticles = (x: number, y: number, color: string) => {
    const newParticles: Particle[] = [];
    // Convert grid coordinates to percentage coordinates (0-100%)
    const centerX = ((x + 0.5) / GRID_SIZE) * 100;
    const centerY = ((y + 0.5) / GRID_SIZE) * 100;
    
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      newParticles.push({
        id: Math.random(),
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * 0.2, // Reduced velocity for better visual
        vy: Math.sin(angle) * 0.2,
        life: 1.0,
        color
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  const addFloatingText = (x: number, y: number, text: string) => {
    // Convert grid coordinates to percentage coordinates (0-100%)
    const centerX = ((x + 0.5) / GRID_SIZE) * 100;
    const centerY = (y / GRID_SIZE) * 100;
    setFloatingTexts(prev => [...prev, {
      id: Math.random(),
      x: centerX,
      y: centerY,
      text,
      life: 1.0
    }]);
  };

  const togglePause = () => {
    if (status === GameStatus.PLAYING) {
      playSound.click();
      setIsPaused(!isPaused);
    }
  };

  const saveToRanking = async () => {
    // Only save if score > 0
    if (score === 0) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const newEntry: RankingEntry = {
      nickname: user.nickname,
      score: score,
      gender: user.gender,
      timestamp: timeString,
      date: Date.now()
    };

    // Salvar no backend (ranking global)
    await rankingService.saveEntry(newEntry);
  };

  const gameOver = () => {
    playSound.die();
    setShake(true);
    setTimeout(() => setShake(false), 500);
    
    saveToRanking();

    setStatus(GameStatus.GAME_OVER);
    // Double check storage for highscore
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snake_highscore', score.toString());
    }
  };

  const isValidTurn = (current: Direction, next: Direction) => {
    if (next === Direction.UP && current === Direction.DOWN) return false;
    if (next === Direction.DOWN && current === Direction.UP) return false;
    if (next === Direction.LEFT && current === Direction.RIGHT) return false;
    if (next === Direction.RIGHT && current === Direction.LEFT) return false;
    if (next === current) return false;
    return true;
  };

  const queueMove = (newDir: Direction) => {
    const lastScheduled = moveQueue.current.length > 0 
      ? moveQueue.current[moveQueue.current.length - 1] 
      : lastProcessedDirection.current;

    if (isValidTurn(lastScheduled, newDir)) {
      if (moveQueue.current.length < 3) {
        moveQueue.current.push(newDir);
        playSound.move();
      }
    }
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space' || e.key.toLowerCase() === 'p') {
      if (status === GameStatus.PLAYING) togglePause();
      return;
    }

    if (status !== GameStatus.PLAYING || isPaused) return;

    switch (e.key) {
      case 'ArrowUp': queueMove(Direction.UP); break;
      case 'ArrowDown': queueMove(Direction.DOWN); break;
      case 'ArrowLeft': queueMove(Direction.LEFT); break;
      case 'ArrowRight': queueMove(Direction.RIGHT); break;
      case 'w': queueMove(Direction.UP); break;
      case 's': queueMove(Direction.DOWN); break;
      case 'a': queueMove(Direction.LEFT); break;
      case 'd': queueMove(Direction.RIGHT); break;
    }
  }, [status, isPaused]);

  // Touch Handlers for Mobile Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (status !== GameStatus.PLAYING || isPaused) return;
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current || status !== GameStatus.PLAYING || isPaused) return;
    if (e.cancelable) e.preventDefault();

    const touchCurrent = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };

    const diffX = touchCurrent.x - touchStart.current.x;
    const diffY = touchCurrent.y - touchStart.current.y;
    const absDiffX = Math.abs(diffX);
    const absDiffY = Math.abs(diffY);
    const threshold = 15; 

    if (Math.max(absDiffX, absDiffY) > threshold) {
      if (absDiffX > absDiffY) {
        if (diffX > 0) queueMove(Direction.RIGHT);
        else queueMove(Direction.LEFT);
      } else {
        if (diffY > 0) queueMove(Direction.DOWN);
        else queueMove(Direction.UP);
      }
      touchStart.current = touchCurrent;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const moveSnake = () => {
    if (isPaused) return;

    if (moveQueue.current.length > 0) {
      currentDirection.current = moveQueue.current.shift() as Direction;
    }
    lastProcessedDirection.current = currentDirection.current;

    const head = { ...snake[0] };
    switch (currentDirection.current) {
      case Direction.UP: head.y -= 1; break;
      case Direction.DOWN: head.y += 1; break;
      case Direction.LEFT: head.x -= 1; break;
      case Direction.RIGHT: head.x += 1; break;
    }

    if (checkCollision(head, snake)) {
      gameOver();
      return;
    }

    const newSnake = [head, ...snake];
    
    if (head.x === food.x && head.y === food.y) {
      playSound.eat();
      setScore(s => s + 10); // Changed to +10 for more exciting score
      setFood(getRandomCoordinate(newSnake));
      spawnParticles(head.x, head.y, '#4ade80');
      addFloatingText(head.x, head.y, '+10');
      setScreenFlash(true);
      setTimeout(() => setScreenFlash(false), 100);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const config = DIFFICULTY_CONFIG[difficulty];
  const calculatedSpeed = Math.max(50, config.baseSpeed - (score * 0.1 * config.speedMultiplier));
  
  useInterval(
    moveSnake, 
    (status === GameStatus.PLAYING && !isPaused) ? calculatedSpeed : null
  );

  // Progress Bar Logic
  // Assuming levels are every 50 points for visual progress
  const progressPercent = Math.min(100, (score % 50) / 50 * 100);
  const currentLevel = Math.floor(score / 50) + 1;

  return (
    <section className="flex flex-col items-center min-h-screen w-full bg-gray-100 dark:bg-[#0a0a0f] text-gray-900 dark:text-gray-100 p-4 overflow-hidden touch-none select-none font-sans transition-colors duration-300" aria-label="Jogo da Cobrinha">
      
      {/* Header */}
      <header 
        className="flex flex-col gap-2 mb-4 bg-white/80 dark:bg-gray-900/80 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl backdrop-blur-md transition-colors duration-300"
        style={{ width: 'min(90vw, 500px)' }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2 sm:gap-0">
            <div className="flex items-center flex-1 min-w-0 mr-2 w-full sm:w-auto">
            {/* Logout Button (Left Side) */}
            <button 
                onClick={() => { playSound.click(); onLogout(); }}
                className="mr-3 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors flex-shrink-0"
                title="Sair"
            >
                <svg className="w-5 h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            </button>

            <div className="overflow-hidden">
                <h2 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Jogador</h2>
                <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-cyan-500 dark:from-green-400 dark:to-cyan-400 text-sm md:text-lg leading-tight truncate">
                {user.nickname}
                </div>
            </div>
            </div>
            
            <div className="flex items-center gap-3 md:gap-8 flex-shrink-0">
            <button 
                onClick={() => { playSound.click(); toggleTheme(); }}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors hidden xs:block"
            >
                {isDarkMode ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
            </button>

            <div className="text-right hidden md:block">
                <h2 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Recorde</h2>
                <div className={`font-bold text-lg md:text-xl font-mono ${isNewRecord ? 'text-green-500 scale-110' : 'text-yellow-600 dark:text-yellow-500'} transition-all drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]`}>{highScore}</div>
            </div>
            <div className="text-right">
                <h2 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Pontos</h2>
                <div className="font-bold text-lg md:text-xl font-mono text-gray-800 dark:text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{score}</div>
            </div>
            
            <button 
                onClick={togglePause}
                className={`ml-1 p-3 rounded-lg border transition-all active:scale-95 shadow-md ${
                isPaused 
                ? 'bg-yellow-100 dark:bg-yellow-500/20 border-yellow-400 dark:border-yellow-500 text-yellow-600 dark:text-yellow-400' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                disabled={status !== GameStatus.PLAYING}
            >
                {isPaused ? (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                ) : (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
                )}
            </button>
            </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex items-center relative">
             <div 
               className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500 ease-out"
               style={{ width: `${progressPercent}%` }}
             ></div>
             {/* Sparkle at end of progress */}
             <div 
                className="absolute h-3 w-3 bg-white rounded-full blur-[2px] opacity-70 transition-all duration-500"
                style={{ left: `calc(${progressPercent}% - 6px)` }}
             ></div>
        </div>
        <div className="flex justify-between text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-0.5">
            <span>Nível {currentLevel}</span>
            <span className="hidden sm:inline">Próximo: {currentLevel * 50}</span>
            <span className="sm:hidden">→ {currentLevel * 50}</span>
        </div>
      </header>

      {/* Game Board Container */}
      <section 
        className={`relative bg-gray-200 dark:bg-gray-900 rounded-xl border-4 ${shake ? 'border-red-500 translate-x-1' : (screenFlash ? 'border-green-400' : 'border-gray-300 dark:border-gray-800')} shadow-2xl overflow-hidden touch-none transition-all duration-100`}
        style={{
          width: 'min(90vw, 90vh, 500px)',
          height: 'min(90vw, 90vh, 500px)',
          boxShadow: isDarkMode ? '0 0 40px rgba(0,0,0,0.6)' : '0 10px 30px rgba(0,0,0,0.1)'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        aria-label="Tabuleiro do Jogo"
      >
        {/* Game Grid */}
        <div 
          className="absolute inset-0"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isFood = food.x === x && food.y === y;
            
            const snakeIndex = snake.findIndex(s => s.x === x && s.y === y);
            const isSnakeHead = snakeIndex === 0;
            const isSnakeBody = snakeIndex > 0;
            const isSnakeTail = snakeIndex === snake.length - 1;

            return (
              <div key={i} className="relative w-full h-full">
                {/* Subtle Grid Lines */}
                <div className="absolute inset-0 border-[0.5px] border-gray-300/50 dark:border-gray-800/30"></div>

                {isFood && (
                  <div className="absolute inset-1.5 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,1)] animate-[pulse_1s_infinite] scale-[1.1] transition-transform z-10">
                     <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full opacity-60"></div>
                  </div>
                )}
                
                {isSnakeHead && (
                  <div 
                    className="absolute inset-0 z-20 bg-green-500 dark:bg-green-400 rounded-md shadow-[0_0_20px_rgba(74,222,128,0.8)] flex items-center justify-center scale-110"
                    style={{
                      transform: 
                        `scale(1.1) ` + 
                        (lastProcessedDirection.current === Direction.RIGHT ? 'rotate(0deg)' :
                        lastProcessedDirection.current === Direction.DOWN ? 'rotate(90deg)' :
                        lastProcessedDirection.current === Direction.LEFT ? 'rotate(180deg)' :
                        'rotate(-90deg)')
                    }}
                  >
                    <div className="absolute right-1 top-1 w-1.5 h-1.5 bg-black/80 rounded-full"></div>
                    <div className="absolute right-1 bottom-1 w-1.5 h-1.5 bg-black/80 rounded-full"></div>
                  </div>
                )}
                
                {isSnakeBody && (
                  // Connected Look: Slightly larger scale to overlap gaps
                  <div 
                    className={`absolute inset-0 bg-green-600 dark:bg-green-500 opacity-90 scale-105 z-10 ${
                      isSnakeTail ? 'rounded-full scale-90' : 'rounded-sm'
                    }`} 
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Particles Overlay */}
        {particles.map((p) => (
           <div 
             key={p.id}
             className="absolute w-2 h-2 rounded-full pointer-events-none"
             style={{
                backgroundColor: p.color,
                left: `${p.x}%`,
                top: `${p.y}%`,
                opacity: p.life,
                transform: 'translate(-50%, -50%)'
             }}
           />
        ))}

        {/* Floating Texts Overlay */}
        {floatingTexts.map((t) => (
           <div 
             key={t.id}
             className="absolute pointer-events-none font-bold text-green-500 text-lg z-50 shadow-black drop-shadow-md"
             style={{
                left: `${t.x}%`,
                top: `${t.y}%`,
                opacity: t.life,
                transform: 'translate(-50%, -50%)'
             }}
           >
             {t.text}
           </div>
        ))}

        {/* --- OVERLAYS --- */}

        {/* TUTORIAL OVERLAY */}
        {status === GameStatus.TUTORIAL && (
            <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl max-w-xs border border-green-500/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                    
                    <div className="mb-4">
                        <span className="material-symbols-rounded text-5xl text-green-500 animate-bounce">
                            {tutorialStep === 1 ? 'touch_app' : tutorialStep === 2 ? 'nutrition' : 'skull'}
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {tutorialStep === 1 ? "Controles" : tutorialStep === 2 ? "Objetivo" : "Cuidado"}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        {tutorialStep === 1 && "Use as setas do teclado ou deslize o dedo na tela para mudar a direção."}
                        {tutorialStep === 2 && "Coma as maçãs para crescer e ganhar pontos. Cada maçã vale 10 pontos!"}
                        {tutorialStep === 3 && "Não bata nas paredes nem no seu próprio corpo, ou o jogo acaba."}
                    </p>

                    <div className="flex gap-2 justify-center">
                         {/* Step dots */}
                         {[1,2,3].map(step => (
                             <div key={step} className={`w-2 h-2 rounded-full ${step === tutorialStep ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                         ))}
                    </div>

                    <button 
                        onClick={nextTutorialStep}
                        className="mt-6 w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all transform active:scale-95"
                    >
                        {tutorialStep === 3 ? "ENTENDI, VAMOS JOGAR!" : "PRÓXIMO"}
                    </button>
                </div>
            </div>
        )}

        {/* IDLE */}
        {status === GameStatus.IDLE && (
          <div className="absolute inset-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 transition-colors duration-300">
            <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-cyan-500 dark:from-green-400 dark:to-cyan-400 font-bold mb-6 tracking-[0.2em] uppercase text-sm">Dificuldade</h3>
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-8">
              {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => { playSound.click(); setDifficulty(diff); }}
                  className={`p-3 rounded-lg border transition-all text-left group relative overflow-hidden ${
                    difficulty === diff 
                      ? `${DIFFICULTY_CONFIG[diff].color} bg-gray-100 dark:bg-gray-900 shadow-lg` 
                      : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-white dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="font-bold text-sm relative z-10">{DIFFICULTY_CONFIG[diff].label}</div>
                  <div className="text-[10px] opacity-70 group-hover:opacity-100 transition-opacity relative z-10">
                    {DIFFICULTY_CONFIG[diff].desc}
                  </div>
                </button>
              ))}
            </div>
            
            <button 
              onClick={tryStartGame}
              className="w-full max-w-xs bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl text-xl shadow-[0_0_30px_rgba(22,163,74,0.4)] transition-all hover:scale-105 active:scale-95"
            >
              JOGAR
            </button>
            <div className="mt-4 text-xs text-gray-400 dark:text-gray-600 animate-pulse hidden lg:block">
               Use as setas do teclado para mover
            </div>
            <div className="mt-4 text-xs text-gray-400 dark:text-gray-600 animate-pulse hidden sm:block lg:hidden">
               Deslize o dedo ou use as setas
            </div>
            <div className="mt-4 text-xs text-gray-400 dark:text-gray-600 animate-pulse sm:hidden">
               Deslize o dedo para controlar
            </div>
          </div>
        )}

        {/* COUNTDOWN */}
        {status === GameStatus.COUNTDOWN && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 dark:bg-black/40">
            <div className="text-8xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-bounce pixel-font">
              {countdown}
            </div>
          </div>
        )}

        {/* PAUSE */}
        {status === GameStatus.PLAYING && isPaused && (
          <div className="absolute inset-0 z-30 bg-white/40 dark:bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <div className="text-4xl font-black text-gray-900 dark:text-white tracking-widest pixel-font animate-pulse drop-shadow-lg">
              PAUSE
            </div>
          </div>
        )}

        {/* GAME OVER */}
        {status === GameStatus.GAME_OVER && (
          <section className="absolute inset-0 z-30 bg-red-100/90 dark:bg-red-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center transition-colors duration-300" aria-label="Tela de Game Over">
            <h2 className="text-3xl md:text-4xl font-bold text-red-600 dark:text-white mb-2 pixel-font drop-shadow-[0_0_10px_rgba(255,0,0,0.5)] whitespace-nowrap">GAME OVER</h2>
            <div className="bg-white/60 dark:bg-black/40 p-6 rounded-xl mb-8 border border-red-200 dark:border-red-500/30 w-full max-w-[200px]">
              <p className="text-red-800 dark:text-red-300 text-xs uppercase tracking-widest mb-1">Score</p>
              <p className="text-4xl font-mono font-bold text-red-900 dark:text-white">{score}</p>
              {isNewRecord && (
                <div className="text-xs text-green-600 dark:text-green-400 font-bold mt-1 animate-pulse">NOVO RECORDE!</div>
              )}
            </div>
            <button 
              onClick={() => { playSound.click(); onLogout(); }}
              className="bg-white text-red-900 font-bold py-3 px-10 rounded-full text-lg shadow-xl hover:bg-gray-50 transition transform hover:scale-105 active:scale-95 border border-red-200"
            >
              MENU
            </button>
          </section>
        )}
      </section>

      <footer className="mt-6 text-xs font-mono text-gray-400 dark:text-gray-600 opacity-75">
        dev: guielihan
      </footer>
    </section>
  );
};