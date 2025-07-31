import { useState, useEffect } from 'react';
import { Battle, Enemy, Character } from '@/types/rpg';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sword, Shield, Zap, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface BattleSystemProps {
  battle: Battle;
  onBattleEnd: (victory: boolean, rewards?: { gold: number; experience: number }) => void;
  onUpdateCharacter: (character: Character) => void;
}

const ENEMIES: Enemy[] = [
  {
    id: 'goblin',
    name: 'Goblin Warrior',
    level: 1,
    stats: { health: 40, maxHealth: 40, attack: 8, defense: 3, speed: 6 },
    gold: 15,
    loot: []
  },
  {
    id: 'orc',
    name: 'Orc Berserker',
    level: 2,
    stats: { health: 60, maxHealth: 60, attack: 12, defense: 5, speed: 4 },
    gold: 25,
    loot: []
  },
  {
    id: 'skeleton',
    name: 'Skeleton Mage',
    level: 2,
    stats: { health: 35, maxHealth: 35, attack: 15, defense: 2, speed: 8 },
    gold: 30,
    loot: []
  }
];

export const BattleSystem = ({ battle, onBattleEnd, onUpdateCharacter }: BattleSystemProps) => {
  const [currentBattle, setCurrentBattle] = useState<Battle>(battle);
  const [isProcessing, setIsProcessing] = useState(false);

  const addToLog = (message: string) => {
    setCurrentBattle(prev => ({
      ...prev,
      log: [...prev.log, message]
    }));
  };

  const calculateDamage = (attacker: { attack: number }, defender: { defense: number }) => {
    const baseDamage = attacker.attack;
    const defense = defender.defense;
    const damage = Math.max(1, baseDamage - Math.floor(defense / 2) + Math.floor(Math.random() * 5));
    return damage;
  };

  const playerAttack = () => {
    if (isProcessing || currentBattle.currentTurn !== 'player') return;

    setIsProcessing(true);
    const damage = calculateDamage(currentBattle.player.stats, currentBattle.enemy.stats);
    
    setCurrentBattle(prev => {
      const newEnemy = {
        ...prev.enemy,
        stats: {
          ...prev.enemy.stats,
          health: Math.max(0, prev.enemy.stats.health - damage)
        }
      };

      addToLog(`${prev.player.name} attacks ${prev.enemy.name} for ${damage} damage!`);

      if (newEnemy.stats.health <= 0) {
        const rewards = {
          gold: newEnemy.gold,
          experience: newEnemy.level * 25
        };
        
        setTimeout(() => {
          toast.success(`Victory! Gained ${rewards.gold} gold and ${rewards.experience} experience!`);
          onBattleEnd(true, rewards);
        }, 1000);

        return {
          ...prev,
          enemy: newEnemy,
          isActive: false
        };
      }

      return {
        ...prev,
        enemy: newEnemy,
        currentTurn: 'enemy'
      };
    });

    setTimeout(() => setIsProcessing(false), 500);
  };

  const playerDefend = () => {
    if (isProcessing || currentBattle.currentTurn !== 'player') return;

    setIsProcessing(true);
    addToLog(`${currentBattle.player.name} takes a defensive stance!`);
    
    setCurrentBattle(prev => ({
      ...prev,
      currentTurn: 'enemy'
    }));

    setTimeout(() => setIsProcessing(false), 500);
  };

  const playerMagicAttack = () => {
    if (isProcessing || currentBattle.currentTurn !== 'player' || currentBattle.player.stats.mana < 10) return;

    setIsProcessing(true);
    const damage = Math.floor(calculateDamage(currentBattle.player.stats, currentBattle.enemy.stats) * 1.5);
    
    setCurrentBattle(prev => {
      const newPlayer = {
        ...prev.player,
        stats: {
          ...prev.player.stats,
          mana: Math.max(0, prev.player.stats.mana - 10)
        }
      };

      const newEnemy = {
        ...prev.enemy,
        stats: {
          ...prev.enemy.stats,
          health: Math.max(0, prev.enemy.stats.health - damage)
        }
      };

      addToLog(`${prev.player.name} casts a magic spell for ${damage} damage!`);

      if (newEnemy.stats.health <= 0) {
        const rewards = {
          gold: newEnemy.gold,
          experience: newEnemy.level * 25
        };
        
        setTimeout(() => {
          toast.success(`Victory! Gained ${rewards.gold} gold and ${rewards.experience} experience!`);
          onBattleEnd(true, rewards);
        }, 1000);

        return {
          ...prev,
          player: newPlayer,
          enemy: newEnemy,
          isActive: false
        };
      }

      return {
        ...prev,
        player: newPlayer,
        enemy: newEnemy,
        currentTurn: 'enemy'
      };
    });

    setTimeout(() => setIsProcessing(false), 500);
  };

  useEffect(() => {
    if (currentBattle.currentTurn === 'enemy' && currentBattle.isActive && !isProcessing) {
      const timer = setTimeout(() => {
        setIsProcessing(true);
        const damage = calculateDamage(currentBattle.enemy.stats, currentBattle.player.stats);
        
        setCurrentBattle(prev => {
          const newPlayer = {
            ...prev.player,
            stats: {
              ...prev.player.stats,
              health: Math.max(0, prev.player.stats.health - damage)
            }
          };

          addToLog(`${prev.enemy.name} attacks ${prev.player.name} for ${damage} damage!`);

          if (newPlayer.stats.health <= 0) {
            setTimeout(() => {
              toast.error('Defeat! You have fallen in battle.');
              onBattleEnd(false);
            }, 1000);

            return {
              ...prev,
              player: newPlayer,
              isActive: false
            };
          }

          onUpdateCharacter(newPlayer);

          return {
            ...prev,
            player: newPlayer,
            currentTurn: 'player'
          };
        });

        setTimeout(() => setIsProcessing(false), 500);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [currentBattle.currentTurn, currentBattle.isActive, isProcessing]);

  const playerHealthPercent = (currentBattle.player.stats.health / currentBattle.player.stats.maxHealth) * 100;
  const enemyHealthPercent = (currentBattle.enemy.stats.health / currentBattle.enemy.stats.maxHealth) * 100;
  const playerManaPercent = (currentBattle.player.stats.mana / currentBattle.player.stats.maxMana) * 100;

  return (
    <div className="space-y-6">
      {/* Battle Arena */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Player */}
        <Card className="rpg-card">
          <CardHeader>
            <CardTitle className="text-primary">{currentBattle.player.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm">Health</span>
                <span className="text-sm">{currentBattle.player.stats.health}/{currentBattle.player.stats.maxHealth}</span>
              </div>
              <div className="stat-bar">
                <div className="stat-bar-fill health-bar" style={{ width: `${playerHealthPercent}%` }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm">Mana</span>
                <span className="text-sm">{currentBattle.player.stats.mana}/{currentBattle.player.stats.maxMana}</span>
              </div>
              <div className="stat-bar">
                <div className="stat-bar-fill mana-bar" style={{ width: `${playerManaPercent}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enemy */}
        <Card className="rpg-card">
          <CardHeader>
            <CardTitle className="text-destructive">{currentBattle.enemy.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm">Health</span>
                <span className="text-sm">{currentBattle.enemy.stats.health}/{currentBattle.enemy.stats.maxHealth}</span>
              </div>
              <div className="stat-bar">
                <div className="stat-bar-fill health-bar" style={{ width: `${enemyHealthPercent}%` }} />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Level {currentBattle.enemy.level} • {currentBattle.enemy.gold} Gold
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      {currentBattle.isActive && currentBattle.currentTurn === 'player' && (
        <Card className="rpg-card">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={playerAttack}
                disabled={isProcessing}
                className="rpg-button h-14"
              >
                <Sword className="w-5 h-5 mr-2" />
                Attack
              </Button>
              <Button
                onClick={playerMagicAttack}
                disabled={isProcessing || currentBattle.player.stats.mana < 10}
                className="rpg-button-magic h-14"
              >
                <Zap className="w-5 h-5 mr-2" />
                Magic Attack (10 MP)
              </Button>
              <Button
                onClick={playerDefend}
                disabled={isProcessing}
                variant="outline"
                className="h-14"
              >
                <Shield className="w-5 h-5 mr-2" />
                Defend
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Battle Log */}
      <Card className="rpg-card">
        <CardHeader>
          <CardTitle className="text-lg">Battle Log</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-32">
            <div className="space-y-1">
              {currentBattle.log.map((entry, index) => (
                <div key={index} className="text-sm text-muted-foreground">
                  {entry}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export const createRandomBattle = (player: Character): Battle => {
  const randomEnemy = ENEMIES[Math.floor(Math.random() * ENEMIES.length)];
  const enemy: Enemy = {
    ...randomEnemy,
    id: crypto.randomUUID(),
    stats: { ...randomEnemy.stats }
  };

  return {
    player,
    enemy,
    currentTurn: player.stats.speed >= enemy.stats.speed ? 'player' : 'enemy',
    isActive: true,
    log: [`A wild ${enemy.name} appears!`]
  };
};