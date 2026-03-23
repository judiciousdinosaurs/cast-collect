import { motion, AnimatePresence } from 'framer-motion';
import { CaughtFish, FISH_TYPES, RARITY_BG, RARITY_COLORS } from '@/lib/fishData';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  collection: CaughtFish[];
  totalCaught: number;
}

export default function DiaryPanel({ open, onClose, collection, totalCaught }: Props) {
  const uniqueFish = new Set(collection.map(c => c.fish.id));
  const bestCatches = FISH_TYPES.map(ft => {
    const catches = collection.filter(c => c.fish.id === ft.id);
    if (catches.length === 0) return null;
    const best = catches.reduce((a, b) => a.weight > b.weight ? a : b);
    return { type: ft, count: catches.length, bestWeight: best.weight };
  }).filter(Boolean);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-40 bg-background/95 backdrop-blur-md overflow-y-auto"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25 }}
        >
          <div className="p-4 max-w-lg mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="font-display text-2xl font-bold text-foreground">📖 Fish Diary</h1>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-2">
                <X size={24} />
              </button>
            </div>

            <div className="flex gap-3 mb-4">
              <div className="card-fish rounded-xl px-4 py-2 flex-1 text-center">
                <div className="font-display text-xl font-bold text-primary">{totalCaught}</div>
                <div className="text-muted-foreground text-xs">Total Caught</div>
              </div>
              <div className="card-fish rounded-xl px-4 py-2 flex-1 text-center">
                <div className="font-display text-xl font-bold text-accent">{uniqueFish.size}</div>
                <div className="text-muted-foreground text-xs">Species</div>
              </div>
              <div className="card-fish rounded-xl px-4 py-2 flex-1 text-center">
                <div className="font-display text-xl font-bold text-secondary">
                  {Math.round((uniqueFish.size / FISH_TYPES.length) * 100)}%
                </div>
                <div className="text-muted-foreground text-xs">Complete</div>
              </div>
            </div>

            <div className="space-y-2">
              {FISH_TYPES.map(ft => {
                const entry = bestCatches.find(b => b?.type.id === ft.id);
                const discovered = !!entry;
                return (
                  <div
                    key={ft.id}
                    className={`card-fish rounded-xl p-3 ${discovered ? RARITY_BG[ft.rarity] : 'opacity-40'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{discovered ? ft.emoji : '❓'}</span>
                      <div className="flex-1">
                        <div className="font-display font-semibold text-foreground">
                          {discovered ? ft.name : '???'}
                        </div>
                        <div className={`text-xs ${RARITY_COLORS[ft.rarity]}`}>
                          {ft.rarity.toUpperCase()}
                        </div>
                      </div>
                      {entry && (
                        <div className="text-right text-sm">
                          <div className="text-foreground">🏆 {entry.bestWeight} kg</div>
                          <div className="text-muted-foreground">×{entry.count}</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
