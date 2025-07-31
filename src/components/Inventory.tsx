import { Character, Item } from '@/types/rpg';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Coins } from 'lucide-react';

interface InventoryProps {
  character: Character;
  onClose: () => void;
  onUpdateCharacter: (character: Character) => void;
}

const STARTER_ITEMS: Item[] = [
  {
    id: 'health-potion',
    name: 'Health Potion',
    type: 'potion',
    rarity: 'common',
    value: 25,
    description: 'Restores 50 health points.',
    stats: { health: 50 }
  },
  {
    id: 'mana-potion',
    name: 'Mana Potion',
    type: 'potion',
    rarity: 'common',
    value: 30,
    description: 'Restores 40 mana points.',
    stats: { mana: 40 }
  }
];

const getRarityColor = (rarity: Item['rarity']) => {
  switch (rarity) {
    case 'common': return 'bg-muted text-muted-foreground';
    case 'uncommon': return 'bg-energy/20 text-energy';
    case 'rare': return 'bg-mana/20 text-mana';
    case 'epic': return 'bg-magic/20 text-magic';
    case 'legendary': return 'bg-gold/20 text-gold';
    default: return 'bg-muted text-muted-foreground';
  }
};

export const Inventory = ({ character, onClose, onUpdateCharacter }: InventoryProps) => {
  // Add starter items if inventory is empty
  const inventory = character.inventory.length === 0 ? STARTER_ITEMS : character.inventory;

  const useItem = (item: Item) => {
    if (item.type !== 'potion') return;

    const updatedCharacter = { ...character };
    
    if (item.stats?.health) {
      updatedCharacter.stats.health = Math.min(
        updatedCharacter.stats.maxHealth,
        updatedCharacter.stats.health + item.stats.health
      );
    }
    
    if (item.stats?.mana) {
      updatedCharacter.stats.mana = Math.min(
        updatedCharacter.stats.maxMana,
        updatedCharacter.stats.mana + item.stats.mana
      );
    }

    // Remove item from inventory (except starter items for demo)
    if (!STARTER_ITEMS.find(startItem => startItem.id === item.id)) {
      updatedCharacter.inventory = updatedCharacter.inventory.filter(i => i.id !== item.id);
    }

    onUpdateCharacter(updatedCharacter);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="rpg-card w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl text-primary">Inventory</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Gold */}
          <div className="flex items-center gap-2 p-4 bg-gold/10 rounded-lg border border-gold/20">
            <Coins className="w-6 h-6 text-gold" />
            <span className="text-lg font-semibold text-gold">{character.gold} Gold</span>
          </div>

          {/* Equipment */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Equipment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-muted/30">
                <CardContent className="p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-2">Weapon</div>
                  <div className="text-muted-foreground italic">
                    {character.equipment.weapon?.name || 'None equipped'}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-2">Armor</div>
                  <div className="text-muted-foreground italic">
                    {character.equipment.armor?.name || 'None equipped'}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-2">Accessory</div>
                  <div className="text-muted-foreground italic">
                    {character.equipment.accessory?.name || 'None equipped'}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Items</h3>
            {inventory.length === 0 ? (
              <Card className="bg-muted/30">
                <CardContent className="p-6 text-center text-muted-foreground">
                  Your inventory is empty
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventory.map((item) => (
                  <Card key={item.id} className="bg-card/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{item.name}</h4>
                        <Badge className={getRarityColor(item.rarity)}>
                          {item.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gold">{item.value} Gold</span>
                        {item.type === 'potion' && (
                          <Button
                            size="sm"
                            onClick={() => useItem(item)}
                            className="rpg-button px-3 py-1 text-xs h-auto"
                          >
                            Use
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};