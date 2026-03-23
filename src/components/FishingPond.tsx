import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GamePhase } from '@/hooks/useGameState';

interface Props {
  phase: GamePhase;
  onReel: () => void;
  onMiss: () => void;
}

export default function FishingPond({ phase, onReel, onMiss }: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (phase === 'hooked') {
      timerRef.current = setTimeout(() => onMiss(), 2500);
      return () => clearTimeout(timerRef.current);
    }
  }, [phase, onMiss]);

  const handleTap = () => {
    if (phase === 'hooked') {
      clearTimeout(timerRef.current);
      onReel();
    }
  };

  return (
    <div
      className="relative w-full flex-1 overflow-hidden ocean-gradient cursor-pointer select-none"
      onClick={handleTap}
      onTouchStart={handleTap}
    >
      {/* Stars / sky */}
      <div className="absolute inset-0 top-0 h-[30%]">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-foreground/40"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
        <div className="absolute top-4 right-8 w-12 h-12 rounded-full bg-secondary/30 shadow-lg shadow-secondary/20" />
      </div>

      {/* Water surface line */}
      <div className="absolute left-0 right-0 top-[35%] h-1 bg-ocean-light/40" />

      {/* Underwater area */}
      <div className="absolute left-0 right-0 top-[35%] bottom-0 water-surface opacity-80" />

      {/* Bubbles */}
      <AnimatePresence>
        {(phase === 'waiting' || phase === 'hooked') && (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={`bubble-${i}`}
                className="absolute w-2 h-2 rounded-full border border-ocean-light/50"
                initial={{ y: 0, opacity: 0, x: 0 }}
                animate={{
                  y: -80,
                  opacity: [0, 0.8, 0],
                  x: Math.sin(i) * 20,
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.4,
                  repeat: Infinity,
                }}
                style={{
                  left: `${45 + Math.random() * 10}%`,
                  top: '55%',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Fishing line */}
      <AnimatePresence>
        {(phase === 'casting' || phase === 'waiting' || phase === 'hooked' || phase === 'reeling') && (
          <motion.div
            className="absolute left-1/2 w-[2px] bg-foreground/60"
            initial={{ top: '20%', height: 0 }}
            animate={{
              top: '20%',
              height: phase === 'reeling' ? '10%' : '40%',
            }}
            exit={{ height: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Hook / bobber */}
      <AnimatePresence>
        {(phase === 'waiting' || phase === 'hooked') && (
          <motion.div
            className={`absolute left-1/2 -translate-x-1/2 text-2xl ${phase === 'hooked' ? '' : 'animate-bobbing'}`}
            style={{ top: '34%' }}
            animate={phase === 'hooked' ? {
              y: [0, -8, 4, -6, 2, -4],
              rotate: [0, -10, 10, -5, 5, 0],
            } : {}}
            transition={phase === 'hooked' ? { duration: 0.5, repeat: Infinity } : {}}
          >
            🎣
          </motion.div>
        )}
      </AnimatePresence>

      {/* HOOK! indicator */}
      <AnimatePresence>
        {phase === 'hooked' && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-[25%]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 1], opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <div className="bg-secondary px-4 py-2 rounded-full font-display text-lg font-bold text-secondary-foreground shadow-lg animate-pulse">
              TAP NOW! 🐟
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swimming fish in background */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`bgfish-${i}`}
          className="absolute text-xl opacity-30"
          style={{ top: `${50 + i * 15}%` }}
          animate={{ x: ['calc(-10vw)', 'calc(110vw)'] }}
          transition={{
            duration: 12 + i * 4,
            delay: i * 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          🐟
        </motion.div>
      ))}

      {/* Bottom seaweed */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-around text-3xl opacity-40">
        {['🌿', '🪸', '🌿', '🪨', '🌿', '🪸'].map((e, i) => (
          <span key={i} className="animate-bobbing" style={{ animationDelay: `${i * 0.3}s` }}>
            {e}
          </span>
        ))}
      </div>
    </div>
  );
}
