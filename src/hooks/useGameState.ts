import { useState, useCallback } from 'react';
import { CaughtFish, catchRandomFish, getJunkCatch } from '@/lib/fishData';

export type GamePhase = 'idle' | 'casting' | 'waiting' | 'hooked' | 'reeling' | 'caught' | 'junk';

interface JunkItem { name: string; emoji: string; value: number; }

interface GameState {
  phase: GamePhase;
  coins: number;
  totalCaught: number;
  collection: CaughtFish[];
  lastCatch: CaughtFish | null;
  lastJunk: JunkItem | null;
  level: number;
  xp: number;
}

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('fishing-diary-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, phase: 'idle' as GamePhase, lastCatch: null, lastJunk: null };
      } catch { /* ignore */ }
    }
    return {
      phase: 'idle' as GamePhase,
      coins: 0,
      totalCaught: 0,
      collection: [],
      lastCatch: null,
      lastJunk: null,
      level: 1,
      xp: 0,
    };
  });

  const save = useCallback((s: GameState) => {
    localStorage.setItem('fishing-diary-state', JSON.stringify({
      coins: s.coins,
      totalCaught: s.totalCaught,
      collection: s.collection,
      level: s.level,
      xp: s.xp,
    }));
  }, []);

  const xpForLevel = (lvl: number) => lvl * 50;

  const cast = useCallback(() => {
    setState(s => ({ ...s, phase: 'casting' }));

    setTimeout(() => {
      setState(s => ({ ...s, phase: 'waiting' }));
    }, 800);

    const waitTime = 1500 + Math.random() * 3000;
    setTimeout(() => {
      setState(s => {
        if (s.phase === 'waiting') return { ...s, phase: 'hooked' };
        return s;
      });
    }, 800 + waitTime);
  }, []);

  const reel = useCallback(() => {
    setState(s => {
      if (s.phase !== 'hooked') return s;
      return { ...s, phase: 'reeling' };
    });

    setTimeout(() => {
      setState(s => {
        const junk = getJunkCatch();
        if (junk) {
          const newState = {
            ...s,
            phase: 'junk' as GamePhase,
            coins: s.coins + junk.value,
            lastJunk: junk,
            lastCatch: null,
          };
          save(newState);
          return newState;
        }

        const caught = catchRandomFish();
        let newXp = s.xp + caught.fish.value;
        let newLevel = s.level;
        while (newXp >= xpForLevel(newLevel)) {
          newXp -= xpForLevel(newLevel);
          newLevel++;
        }

        const newState = {
          ...s,
          phase: 'caught' as GamePhase,
          coins: s.coins + caught.fish.value,
          totalCaught: s.totalCaught + 1,
          collection: [caught, ...s.collection],
          lastCatch: caught,
          lastJunk: null,
          level: newLevel,
          xp: newXp,
        };
        save(newState);
        return newState;
      });
    }, 600);
  }, [save]);

  const dismiss = useCallback(() => {
    setState(s => ({ ...s, phase: 'idle', lastCatch: null, lastJunk: null }));
  }, []);

  const missedFish = useCallback(() => {
    setState(s => ({ ...s, phase: 'idle' }));
  }, []);

  return { ...state, cast, reel, dismiss, missedFish, xpForLevel };
}
