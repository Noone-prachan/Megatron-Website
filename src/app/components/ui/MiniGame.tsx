import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play, Trophy, LogIn } from "lucide-react";
import { api } from "../../../lib/api";
import { useLockBodyScroll } from "../../../hooks/useLockBodyScroll";

interface ScoreEntry {
  id: string;
  username: string;
  avatar: string;
  score: number;
  date: string;
}

interface MiniGameProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MiniGame({ isOpen, onClose }: MiniGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useLockBodyScroll(isOpen);

  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [leaderboard, setLeaderboard] = useState<ScoreEntry[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("auth_token"));

  // Physics constants
  const GRAVITY = 0.15;
  const JUMP_STRENGTH = -4;
  const PIPE_SPEED = 2.5;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 250;
  const PIPE_SPAWN_FRAMES = 160;

  // Game state
  const gameState = useRef({
    ball: { x: 100, y: 300, dy: 0, radius: 20, rotation: 0 },
    pipes: [] as { x: number, topHeight: number, bottomHeight: number, passed: boolean }[],
    frames: 0,
    canvasDimensions: { width: 400, height: 600 },
    score: 0 // Keep score in ref for immediate access in loop
  });

  const animationRef = useRef<number>();
  const loopIdRef = useRef<number>(0);
  const logoImage = useRef<HTMLImageElement>();

  useEffect(() => {
    const img = new Image();
    img.src = "/images/megatronlogo.png";
    logoImage.current = img;
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsLoggedIn(!!localStorage.getItem("auth_token"));
      fetchLeaderboard();
      setTimeout(handleResize, 100);
      window.addEventListener('resize', handleResize);
    } else {
      setIsPlaying(false);
      setGameOver(false);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isOpen]);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.getLeaderboard();
      if (res.success) {
        setLeaderboard(res.leaderboard);
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
    }
  };

  const handleResize = () => {
    if (!containerRef.current || !canvasRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    
    canvasRef.current.width = clientWidth;
    canvasRef.current.height = clientHeight;
    gameState.current.canvasDimensions = { width: clientWidth, height: clientHeight };
  };

  const startGame = () => {
    handleResize();
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    
    const { width, height } = gameState.current.canvasDimensions;
    const isMobile = width < 600;
    
    gameState.current = {
      ...gameState.current,
      ball: { 
        x: isMobile ? width * 0.25 : width * 0.3, 
        y: height / 2, 
        dy: 0, 
        radius: isMobile ? 18 : 24, 
        rotation: 0 
      },
      pipes: [],
      frames: 0,
      score: 0
    };
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Generate a unique ID for this specific game session
    loopIdRef.current = Date.now() + Math.random();
    
    gameLoop(loopIdRef.current);
  };

  const submitScore = async (finalScore: number) => {
    if (!isLoggedIn || finalScore === 0) return;
    setIsSubmitting(true);
    try {
      await api.submitScore(finalScore);
      await fetchLeaderboard();
    } catch (error) {
      console.error("Failed to submit score", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const jump = () => {
    if (!isPlaying) return;
    gameState.current.ball.dy = JUMP_STRENGTH;
  };

  const gameLoop = (currentLoopId: number) => {
    // Bulletproof check: If this loop is no longer the active loop, DIE immediately.
    if (loopIdRef.current !== currentLoopId) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { width, height } = gameState.current.canvasDimensions;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const { ball, pipes } = gameState.current;

    // Apply Gravity
    ball.dy += GRAVITY;
    ball.y += ball.dy;
    
    // Rotation based on velocity
    ball.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, ball.dy * 0.1));

    // Spawn pipes
    gameState.current.frames++;
    if (gameState.current.frames % PIPE_SPAWN_FRAMES === 0) {
      const minHeight = 50;
      const maxHeight = height - PIPE_GAP - minHeight;
      const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
      const bottomHeight = height - PIPE_GAP - topHeight;
      
      pipes.push({
        x: width,
        topHeight,
        bottomHeight,
        passed: false
      });
    }

    let didCollide = false;

    // Floor / Ceiling collision
    if (ball.y + ball.radius >= height || ball.y - ball.radius <= 0) {
      didCollide = true;
    }

    // Process pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
      const pipe = pipes[i];
      pipe.x -= PIPE_SPEED;

      // Collision detection (AABB vs Circle)
      // Top pipe
      if (
        ball.x + ball.radius > pipe.x &&
        ball.x - ball.radius < pipe.x + PIPE_WIDTH &&
        ball.y - ball.radius < pipe.topHeight
      ) {
        didCollide = true;
      }
      
      // Bottom pipe
      if (
        ball.x + ball.radius > pipe.x &&
        ball.x - ball.radius < pipe.x + PIPE_WIDTH &&
        ball.y + ball.radius > height - pipe.bottomHeight
      ) {
        didCollide = true;
      }

      // Score
      if (pipe.x + PIPE_WIDTH < ball.x - ball.radius && !pipe.passed) {
        pipe.passed = true;
        gameState.current.score++;
        setScore(gameState.current.score);
      }

      // Remove off-screen pipes
      if (pipe.x + PIPE_WIDTH < 0) {
        pipes.splice(i, 1);
      }
    }

    // Drawing
    
    // Draw Pipes (Neon Cyan style)
    pipes.forEach(pipe => {
      // Create a gradient for pipes
      const topGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
      topGradient.addColorStop(0, '#0ea5e9'); // light blue
      topGradient.addColorStop(1, '#0284c7'); // darker blue
      
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.fillStyle = topGradient;
      
      // Draw top pipe
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      // Draw top pipe cap
      ctx.fillRect(pipe.x - 4, pipe.topHeight - 20, PIPE_WIDTH + 8, 20);

      // Draw bottom pipe
      ctx.fillRect(pipe.x, height - pipe.bottomHeight, PIPE_WIDTH, pipe.bottomHeight);
      // Draw bottom pipe cap
      ctx.fillRect(pipe.x - 4, height - pipe.bottomHeight, PIPE_WIDTH + 8, 20);
    });

    ctx.shadowBlur = 0; // Reset shadow

    // Draw Logo Bird
    if (logoImage.current?.complete) {
      ctx.save();
      ctx.translate(ball.x, ball.y);
      
      ctx.shadowColor = "#ec4899"; // pink glow
      ctx.shadowBlur = 15;
      
      ctx.beginPath();
      ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#111"; // Dark backdrop
      ctx.fill();
      ctx.clip(); 

      ctx.rotate(ball.rotation);
      ctx.drawImage(
        logoImage.current, 
        -ball.radius, 
        -ball.radius, 
        ball.radius * 2, 
        ball.radius * 2
      );
      ctx.restore();
      
      // Border ring
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }

    if (didCollide) {
      loopIdRef.current = 0; // kill loop explicitly
      setGameOver(true);
      setIsPlaying(false);
      
      const finalScore = gameState.current.score;
      if (finalScore > 0) submitScore(finalScore);
      return; 
    }

    animationRef.current = requestAnimationFrame(() => gameLoop(currentLoopId));
  };

  const handleDiscordLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/discord`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 lg:p-12">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-[#13141c]/95 border border-white/10 rounded-3xl shadow-2xl w-full max-w-[1400px] h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="w-full flex justify-between items-center p-4 border-b border-white/5 bg-white/5 shrink-0 z-10">
              <div className="flex items-center gap-3">
                <img src="/images/megatronlogo.png" alt="Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                <div>
                  <h2 className="font-black text-xl text-white tracking-tighter uppercase leading-none">Flappy Megatron</h2>
                  <p className="text-xs text-blue-400 font-bold tracking-widest">GLOBAL LEADERBOARD EDITION</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors text-white/70"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
              
              {/* Game Area (Left) */}
              <div 
                className="flex-1 relative bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat overflow-hidden cursor-pointer select-none" 
                ref={containerRef}
                onClick={jump}
              >
                {/* Overlay to darken background */}
                <div className="absolute inset-0 bg-black/70"></div>
                
                {/* Score HUD during play */}
                {isPlaying && (
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none drop-shadow-2xl">
                    <p className="text-8xl font-black text-white outline-text tracking-tighter" style={{ WebkitTextStroke: '3px black' }}>{score}</p>
                  </div>
                )}
                
                <canvas
                  ref={canvasRef}
                  className="relative z-10 w-full h-full touch-none"
                />

                {/* Start Screen Overlay */}
                {!isPlaying && !gameOver && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
                    <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                      <img src="/images/megatronlogo.png" alt="Logo" className="w-16 h-16 animate-bounce" />
                    </div>
                    <h3 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">Flappy Megatron</h3>
                    <p className="text-lg text-white/80 mb-8 font-medium bg-black/40 px-6 py-2 rounded-full border border-white/10">Tap or Click anywhere to jump!</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); startGame(); }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-xl py-4 px-12 rounded-full flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all active:scale-95 hover:scale-105"
                    >
                      <Play className="w-6 h-6" fill="currentColor" /> PLAY NOW
                    </button>
                  </div>
                )}

                {/* Game Over Screen Overlay */}
                {!isPlaying && gameOver && (
                  <div className="absolute inset-0 bg-red-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
                    <h3 className="text-6xl font-black text-white mb-2 tracking-tighter drop-shadow-lg" style={{ WebkitTextStroke: '2px black' }}>GAME OVER</h3>
                    <div className="bg-black/40 border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-sm shadow-2xl">
                       <p className="text-sm font-bold text-white/50 uppercase tracking-widest mb-1">Final Score</p>
                       <p className="text-6xl font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]">{score}</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <button 
                        onClick={(e) => { e.stopPropagation(); startGame(); }}
                        className="bg-white text-black font-black py-4 px-8 rounded-xl flex items-center justify-center transition-all active:scale-95 hover:bg-gray-200"
                      >
                        PLAY AGAIN
                      </button>
                      
                      {!isLoggedIn && score > 0 && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDiscordLogin(); }}
                          className="bg-[#5865F2] text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 hover:bg-[#4752C4] shadow-lg"
                        >
                          <LogIn className="w-5 h-5" /> LOGIN TO SAVE SCORE
                        </button>
                      )}
                    </div>
                    
                    {isSubmitting && <p className="text-blue-400 font-bold animate-pulse bg-blue-500/10 px-4 py-2 rounded-full">Submitting to leaderboard...</p>}
                    {isLoggedIn && !isSubmitting && score > 0 && <p className="text-green-400 font-bold bg-green-500/10 px-4 py-2 rounded-full">Score submitted successfully!</p>}
                  </div>
                )}
              </div>

              {/* Leaderboard Area */}
              <div className="w-full lg:w-[400px] xl:w-[450px] bg-[#1a1b26] border-t lg:border-t-0 lg:border-l border-white/10 shrink-0 flex flex-col h-[300px] lg:h-full relative z-40">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
                  <h3 className="font-black text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" /> GLOBAL TOP 10
                  </h3>
                  <button onClick={(e) => { e.stopPropagation(); fetchLeaderboard(); }} className="text-xs font-bold text-white/40 hover:text-white transition-colors">
                    REFRESH
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
                  {leaderboard.length === 0 ? (
                    <div className="text-center p-8 text-white/30 font-bold flex flex-col items-center">
                      <Trophy className="w-12 h-12 mb-3 opacity-20" />
                      <p>No scores yet.<br/>Be the first to claim #1!</p>
                    </div>
                  ) : (
                    leaderboard.map((entry, index) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={index} 
                        className={`flex items-center gap-3 p-3 rounded-xl border ${
                          index === 0 ? 'bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]' :
                          index === 1 ? 'bg-gray-400/10 border-gray-400/30' :
                          index === 2 ? 'bg-amber-700/10 border-amber-700/30' :
                          'bg-white/5 border-transparent hover:bg-white/10'
                        } transition-colors`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black shrink-0 ${
                          index === 0 ? 'bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.5)]' :
                          index === 1 ? 'bg-gray-300 text-black' :
                          index === 2 ? 'bg-amber-700 text-white' :
                          'bg-black/30 text-white/50'
                        }`}>
                          #{index + 1}
                        </div>
                        
                        <img 
                          src={entry.avatar ? `https://cdn.discordapp.com/avatars/${entry.id}/${entry.avatar}.png` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.id}`}
                          alt={entry.username}
                          className="w-10 h-10 rounded-full object-cover shrink-0 bg-black/50"
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.id}`; }}
                        />
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white truncate">{entry.username}</p>
                          <p className="text-xs text-white/40">{new Date(entry.date).toLocaleDateString()}</p>
                        </div>
                        
                        <div className="text-right shrink-0">
                          <p className={`font-black text-xl ${index === 0 ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]' : 'text-white'}`}>
                            {entry.score}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
                
                {!isLoggedIn && (
                  <div className="p-4 border-t border-white/5 bg-blue-500/5">
                    <p className="text-sm text-center text-white/60 mb-3">You must be logged in to appear on the leaderboard.</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDiscordLogin(); }}
                      className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
                    >
                      <LogIn className="w-5 h-5" /> Login with Discord
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
