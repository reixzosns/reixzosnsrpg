import { Character } from '@/types/rpg';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Zap, Sword, Shield, Gauge, Coins } from 'lucide-react';

interface CharacterStatsProps {
  character: Character;
}

export const CharacterStats = ({ character }: CharacterStatsProps) => {
  const healthPercent = (character.stats.health / character.stats.maxHealth) * 100;
  const manaPercent = (character.stats.mana / character.stats.maxMana) * 100;
  const expToNextLevel = character.level * 100;
  const expPercent = (character.experience / expToNextLevel) * 100;

  return (
    <Card className="rpg-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-primary">{character.name}</span>
          <span className="text-sm text-muted-foreground">Lv. {character.level}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-health" />
              <span className="text-sm font-medium">Health</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {character.stats.health}/{character.stats.maxHealth}
            </span>
          </div>
          <div className="stat-bar">
            <div 
              className="stat-bar-fill health-bar" 
              style={{ width: `${healthPercent}%` }}
            />
          </div>
        </div>

        {/* Mana */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-mana" />
              <span className="text-sm font-medium">Mana</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {character.stats.mana}/{character.stats.maxMana}
            </span>
          </div>
          <div className="stat-bar">
            <div 
              className="stat-bar-fill mana-bar" 
              style={{ width: `${manaPercent}%` }}
            />
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Experience</span>
            <span className="text-sm text-muted-foreground">
              {character.experience}/{expToNextLevel}
            </span>
          </div>
          <div className="stat-bar">
            <div 
              className="stat-bar-fill energy-bar" 
              style={{ width: `${expPercent}%` }}
            />
          </div>
        </div>

        {/* Combat Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-2">
            <Sword className="w-4 h-4 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Attack</div>
              <div className="font-semibold">{character.stats.attack}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-silver" />
            <div>
              <div className="text-xs text-muted-foreground">Defense</div>
              <div className="font-semibold">{character.stats.defense}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-energy" />
            <div>
              <div className="text-xs text-muted-foreground">Speed</div>
              <div className="font-semibold">{character.stats.speed}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-gold" />
            <div>
              <div className="text-xs text-muted-foreground">Gold</div>
              <div className="font-semibold text-gold">{character.gold}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};