import { Character } from '@/types/rpg';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sword, Package, Settings, Trophy } from 'lucide-react';

interface GameMenuProps {
  character: Character;
  onStartBattle: () => void;
  onOpenInventory: () => void;
}

export const GameMenu = ({ character, onStartBattle, onOpenInventory }: GameMenuProps) => {
  return (
    <Card className="rpg-card">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-primary">Adventure Awaits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={onStartBattle}
            className="rpg-button h-16 text-lg"
          >
            <Sword className="w-6 h-6 mr-3" />
            Enter Battle
          </Button>
          
          <Button
            onClick={onOpenInventory}
            variant="outline"
            className="h-16 text-lg"
          >
            <Package className="w-6 h-6 mr-3" />
            Inventory
          </Button>
          
          <Button
            variant="outline"
            className="h-16 text-lg"
            disabled
          >
            <Trophy className="w-6 h-6 mr-3" />
            Quests (Coming Soon)
          </Button>
          
          <Button
            variant="outline"
            className="h-16 text-lg"
            disabled
          >
            <Settings className="w-6 h-6 mr-3" />
            Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};