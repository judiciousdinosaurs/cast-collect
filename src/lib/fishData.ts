export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export interface FishType {
  id: string;
  name: string;
  emoji: string;
  rarity: Rarity;
  minWeight: number;
  maxWeight: number;
  value: number;
  description: string;
}

export interface CaughtFish {
  fish: FishType;
  weight: number;
  caughtAt: Date;
  id: string;
}

export const FISH_TYPES: FishType[] = [
  { id: 'sardine', name: 'Sardine', emoji: '🐟', rarity: 'common', minWeight: 0.1, maxWeight: 0.5, value: 5, description: 'A tiny silver fish. Great in groups!' },
  { id: 'mackerel', name: 'Mackerel', emoji: '🐠', rarity: 'common', minWeight: 0.5, maxWeight: 2, value: 10, description: 'Striped and speedy swimmer.' },
  { id: 'bass', name: 'Sea Bass', emoji: '🐡', rarity: 'common', minWeight: 1, maxWeight: 5, value: 15, description: 'The bread and butter of fishing.' },
  { id: 'trout', name: 'Rainbow Trout', emoji: '🎏', rarity: 'uncommon', minWeight: 1, maxWeight: 8, value: 30, description: 'Beautiful rainbow scales shimmer in sunlight.' },
  { id: 'salmon', name: 'Salmon', emoji: '🍣', rarity: 'uncommon', minWeight: 3, maxWeight: 12, value: 45, description: 'Leaps upstream with incredible strength.' },
  { id: 'tuna', name: 'Bluefin Tuna', emoji: '🦈', rarity: 'uncommon', minWeight: 10, maxWeight: 50, value: 80, description: 'A powerful ocean predator.' },
  { id: 'swordfish', name: 'Swordfish', emoji: '⚔️', rarity: 'rare', minWeight: 20, maxWeight: 100, value: 200, description: 'Its sword-like bill cuts through water.' },
  { id: 'octopus', name: 'Octopus', emoji: '🐙', rarity: 'rare', minWeight: 5, maxWeight: 30, value: 150, description: 'Eight arms of pure intelligence.' },
  { id: 'jellyfish', name: 'Moon Jellyfish', emoji: '🪼', rarity: 'rare', minWeight: 0.5, maxWeight: 3, value: 120, description: 'Ethereal and glowing in moonlight.' },
  { id: 'whale', name: 'Baby Whale', emoji: '🐋', rarity: 'legendary', minWeight: 100, maxWeight: 500, value: 500, description: 'A gentle giant of the deep!' },
  { id: 'seahorse', name: 'Golden Seahorse', emoji: '🌊', rarity: 'legendary', minWeight: 0.05, maxWeight: 0.2, value: 800, description: 'Mythically rare. Brings good fortune.' },
  { id: 'coelacanth', name: 'Coelacanth', emoji: '🦴', rarity: 'legendary', minWeight: 30, maxWeight: 90, value: 1000, description: 'A living fossil from ancient seas.' },
];

const RARITY_WEIGHTS: Record<Rarity, number> = {
  common: 60,
  uncommon: 25,
  rare: 12,
  legendary: 3,
};

export const RARITY_COLORS: Record<Rarity, string> = {
  common: 'text-ocean-light',
  uncommon: 'text-accent',
  rare: 'text-purple-400',
  legendary: 'text-pink-400',
};

export const RARITY_BG: Record<Rarity, string> = {
  common: 'rarity-common',
  uncommon: 'rarity-uncommon',
  rare: 'rarity-rare',
  legendary: 'rarity-legendary',
};

export function catchRandomFish(): CaughtFish {
  const totalWeight = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
  let roll = Math.random() * totalWeight;
  let selectedRarity: Rarity = 'common';

  for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS) as [Rarity, number][]) {
    roll -= weight;
    if (roll <= 0) { selectedRarity = rarity; break; }
  }

  const candidates = FISH_TYPES.filter(f => f.rarity === selectedRarity);
  const fish = candidates[Math.floor(Math.random() * candidates.length)];
  const weight = +(fish.minWeight + Math.random() * (fish.maxWeight - fish.minWeight)).toFixed(2);

  return {
    fish,
    weight,
    caughtAt: new Date(),
    id: crypto.randomUUID(),
  };
}

export function getJunkCatch(): { name: string; emoji: string; value: number } | null {
  if (Math.random() < 0.15) {
    const junk = [
      { name: 'Old Boot', emoji: '👢', value: 1 },
      { name: 'Tin Can', emoji: '🥫', value: 1 },
      { name: 'Seaweed', emoji: '🌿', value: 2 },
      { name: 'Treasure Chest', emoji: '💎', value: 50 },
      { name: 'Message in a Bottle', emoji: '🍾', value: 15 },
    ];
    return junk[Math.floor(Math.random() * junk.length)];
  }
  return null;
}
