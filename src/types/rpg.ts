export type CharacterClass = 'warrior' | 'mage' | 'archer';

export interface Character {
  id: string;
  name: string;
  class: CharacterClass;
  level: number;
  experience: number;
  stats: {
    health: number;
    maxHealth: number;
    mana: number;
    maxMana: number;
    attack: number;
    defense: number;
    speed: number;
  };
  inventory: Item[];
  equipment: Equipment;
  gold: number;
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'potion' | 'misc';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  value: number;
  description: string;
  stats?: {
    attack?: number;
    defense?: number;
    health?: number;
    mana?: number;
  };
}

export interface Equipment {
  weapon?: Item;
  armor?: Item;
  accessory?: Item;
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  stats: {
    health: number;
    maxHealth: number;
    attack: number;
    defense: number;
    speed: number;
  };
  gold: number;
  loot: Item[];
}

export interface Battle {
  player: Character;
  enemy: Enemy;
  currentTurn: 'player' | 'enemy';
  isActive: boolean;
  log: string[];
}

export const CHARACTER_CLASSES: Record<CharacterClass, {
  name: string;
  description: string;
  baseStats: Omit<Character['stats'], 'health' | 'mana'> & { baseHealth: number; baseMana: number };
  color: string;
}> = {
  warrior: {
    name: 'Warrior',
    description: 'A strong melee fighter with high defense and health.',
    baseStats: {
      baseHealth: 120,
      baseMana: 30,
      maxHealth: 120,
      maxMana: 30,
      attack: 15,
      defense: 12,
      speed: 8
    },
    color: 'text-destructive'
  },
  mage: {
    name: 'Mage',
    description: 'A powerful spellcaster with high mana and magical abilities.',
    baseStats: {
      baseHealth: 80,
      baseMana: 100,
      maxHealth: 80,
      maxMana: 100,
      attack: 18,
      defense: 6,
      speed: 10
    },
    color: 'text-magic'
  },
  archer: {
    name: 'Archer',
    description: 'A swift ranged fighter with balanced stats and high speed.',
    baseStats: {
      baseHealth: 100,
      baseMana: 60,
      maxHealth: 100,
      maxMana: 60,
      attack: 14,
      defense: 9,
      speed: 14
    },
    color: 'text-energy'
  }
};