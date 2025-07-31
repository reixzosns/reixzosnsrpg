import { useState } from 'react';
import { Character, Battle } from '@/types/rpg';
import { CharacterCreation } from './CharacterCreation';
import { CharacterStats } from './CharacterStats';
import { GameMenu } from './GameMenu';
import { BattleSystem, createRandomBattle } from './BattleSystem';
import { Inventory } from './Inventory';
import { toast } from 'sonner';

type GameState = 'character-creation' | 'menu' | 'battle' | 'inventory';

export const RPGGame = () => {
  const [gameState, setGameState] = useState<GameState>('character-creation');
  const [character, setCharacter] = useState<Character | null>(null);
  const [currentBattle, setCurrentBattle] = useState<Battle | null>(null);

  const handleCharacterCreate = (newCharacter: Character) => {
    setCharacter(newCharacter);
    setGameState('menu');
    toast.success(`Welcome, ${newCharacter.name}! Your adventure begins now.`);
  };

  const handleStartBattle = () => {
    if (!character) return;
    
    const battle = createRandomBattle(character);
    setCurrentBattle(battle);
    setGameState('battle');
  };

  const handleBattleEnd = (victory: boolean, rewards?: { gold: number; experience: number }) => {
    if (!character) return;

    if (victory && rewards) {
      const updatedCharacter = { ...character };
      updatedCharacter.gold += rewards.gold;
      updatedCharacter.experience += rewards.experience;
      
      // Level up logic
      const expNeeded = updatedCharacter.level * 100;
      if (updatedCharacter.experience >= expNeeded) {
        updatedCharacter.level += 1;
        updatedCharacter.experience -= expNeeded;
        
        // Increase stats on level up
        updatedCharacter.stats.maxHealth += 10;
        updatedCharacter.stats.health = updatedCharacter.stats.maxHealth;
        updatedCharacter.stats.maxMana += 5;
        updatedCharacter.stats.mana = updatedCharacter.stats.maxMana;
        updatedCharacter.stats.attack += 2;
        updatedCharacter.stats.defense += 1;
        updatedCharacter.stats.speed += 1;
        
        toast.success(`Level up! ${updatedCharacter.name} is now level ${updatedCharacter.level}!`);
      }
      
      setCharacter(updatedCharacter);
    } else {
      // Reset health on defeat
      const updatedCharacter = { ...character };
      updatedCharacter.stats.health = updatedCharacter.stats.maxHealth;
      updatedCharacter.stats.mana = updatedCharacter.stats.maxMana;
      setCharacter(updatedCharacter);
    }

    setCurrentBattle(null);
    setGameState('menu');
  };

  const handleUpdateCharacter = (updatedCharacter: Character) => {
    setCharacter(updatedCharacter);
  };

  if (gameState === 'character-creation') {
    return <CharacterCreation onCharacterCreate={handleCharacterCreate} />;
  }

  if (!character) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Character Stats - Always visible */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <CharacterStats character={character} />
          </div>
          
          <div className="lg:col-span-3">
            {gameState === 'menu' && (
              <GameMenu
                character={character}
                onStartBattle={handleStartBattle}
                onOpenInventory={() => setGameState('inventory')}
              />
            )}
            
            {gameState === 'battle' && currentBattle && (
              <BattleSystem
                battle={currentBattle}
                onBattleEnd={handleBattleEnd}
                onUpdateCharacter={handleUpdateCharacter}
              />
            )}
          </div>
        </div>
      </div>

      {/* Inventory Modal */}
      {gameState === 'inventory' && (
        <Inventory
          character={character}
          onClose={() => setGameState('menu')}
          onUpdateCharacter={handleUpdateCharacter}
        />
      )}
    </div>
  );
};