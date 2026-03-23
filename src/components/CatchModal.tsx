import { motion, AnimatePresence } from 'framer-motion';
import { CaughtFish, RARITY_COLORS } from '@/lib/fishData';

interface Props {
  fish: CaughtFish | null;
  junk: { name: string; emoji: string; value: number } | null;
  visible: boolean;
  onDismiss: () => void;
}

export default function CatchModal({ fish, junk, visible, onDismiss }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
        >
          <motion.div
            className="card-fish rounded-2xl p-6 mx-4 max-w-sm w-full text-center"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 50 }}
            onClick={e => e.stopPropagation()}
          >
            {fish && (
              <>
                <motion.div
                  className="text-6xl mb-3"
                  animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                  transition={{ duration: 0.6 }}
                >
                  {fish.fish.emoji}
                </motion.div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                  {fish.fish.name}
                </h2>
                <p className={`font-display text-sm font-semibold uppercase tracking-wider mb-2 ${RARITY_COLORS[fish.fish.rarity]}`}>
                  {fish.fish.rarity}
                </p>
                <p className="text-muted-foreground text-sm mb-3">{fish.fish.description}</p>
                <div className="flex justify-center gap-4 text-sm">
                  <span className="text-foreground">⚖️ {fish.weight} kg</span>
                  <span className="text-gold">🪙 +{fish.fish.value}</span>
                </div>
              </>
            )}
            {junk && (
              <>
                <div className="text-5xl mb-3">{junk.emoji}</div>
                <h2 className="font-display text-xl font-bold text-foreground mb-1">{junk.name}</h2>
                <p className="text-muted-foreground text-sm mb-2">Not a fish, but something!</p>
                <span className="text-gold text-sm">🪙 +{junk.value}</span>
              </>
            )}
            <button
              onClick={onDismiss}
              className="mt-4 w-full btn-cast text-primary-foreground font-display font-bold py-2 rounded-xl transition-all active:scale-95"
            >
              Continue Fishing
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
