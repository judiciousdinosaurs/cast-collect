import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import FishingPond from '@/components/FishingPond';
import GameHUD from '@/components/GameHUD';
import CatchModal from '@/components/CatchModal';
import DiaryPanel from '@/components/DiaryPanel';

export default function Index() {
  const game = useGameState();
  const [diaryOpen, setDiaryOpen] = useState(false);

  const showModal = game.phase === 'caught' || game.phase === 'junk';

  return (
    <div className="h-dvh w-full flex flex-col relative overflow-hidden">
      <FishingPond
        phase={game.phase}
        onReel={game.reel}
        onMiss={game.missedFish}
      />
      <GameHUD
        coins={game.coins}
        level={game.level}
        xp={game.xp}
        xpMax={game.xpForLevel(game.level)}
        totalCaught={game.totalCaught}
        phase={game.phase}
        onOpenDiary={() => setDiaryOpen(true)}
        onCast={game.cast}
      />
      <CatchModal
        fish={game.lastCatch}
        junk={game.lastJunk}
        visible={showModal}
        onDismiss={game.dismiss}
      />
      <DiaryPanel
        open={diaryOpen}
        onClose={() => setDiaryOpen(false)}
        collection={game.collection}
        totalCaught={game.totalCaught}
      />
    </div>
  );
}
