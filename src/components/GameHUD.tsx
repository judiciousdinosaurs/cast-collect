import { GamePhase } from '@/hooks/useGameState';

interface Props {
  coins: number;
  level: number;
  xp: number;
  xpMax: number;
  totalCaught: number;
  phase: GamePhase;
  onOpenDiary: () => void;
  onCast: () => void;
}

export default function GameHUD({ coins, level, xp, xpMax, totalCaught, phase, onOpenDiary, onCast }: Props) {
  const canCast = phase === 'idle';

  return (
    <>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="card-fish rounded-xl px-3 py-1.5 flex items-center gap-2">
            <span className="text-sm">🪙</span>
            <span className="font-display font-bold text-secondary text-sm">{coins}</span>
          </div>
          <div className="card-fish rounded-xl px-3 py-1.5">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-display font-bold text-primary">Lv.{level}</span>
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(xp / xpMax) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={onOpenDiary}
          className="card-fish rounded-xl px-3 py-1.5 flex items-center gap-2 hover:border-primary/50 transition-colors active:scale-95"
        >
          <span className="text-sm">📖</span>
          <span className="font-display font-semibold text-foreground text-sm">{totalCaught}</span>
        </button>
      </div>

      {/* Cast button */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-4 flex justify-center">
        <button
          onClick={onCast}
          disabled={!canCast}
          className={`btn-cast font-display font-bold text-lg text-primary-foreground px-8 py-3 rounded-2xl transition-all active:scale-95 ${
            !canCast ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105'
          }`}
        >
          {phase === 'idle' && '🎣 Cast Line'}
          {phase === 'casting' && '🌊 Casting...'}
          {phase === 'waiting' && '⏳ Waiting...'}
          {phase === 'hooked' && '‼️ TAP THE WATER!'}
          {phase === 'reeling' && '🔄 Reeling in...'}
          {(phase === 'caught' || phase === 'junk') && '✨ Nice!'}
        </button>
      </div>
    </>
  );
}
