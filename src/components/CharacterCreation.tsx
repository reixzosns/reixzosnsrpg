import { useState } from 'react';
import { CHARACTER_CLASSES, type CharacterClass, type Character } from '@/types/rpg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sword, Wand2, Target } from 'lucide-react';

interface CharacterCreationProps {
  onCharacterCreate: (character: Character) => void;
}

const classIcons = {
  warrior: Sword,
  mage: Wand2,
  archer: Target
};

export const CharacterCreation = ({ onCharacterCreate }: CharacterCreationProps) => {
  const [selectedClass, setSelectedClass] = useState<CharacterClass>('warrior');
  const [characterName, setCharacterName] = useState('');

  const handleCreateCharacter = () => {
    if (!characterName.trim()) return;

    const classData = CHARACTER_CLASSES[selectedClass];
    const character: Character = {
      id: crypto.randomUUID(),
      name: characterName.trim(),
      class: selectedClass,
      level: 1,
      experience: 0,
      stats: {
        health: classData.baseStats.baseHealth,
        maxHealth: classData.baseStats.maxHealth,
        mana: classData.baseStats.baseMana,
        maxMana: classData.baseStats.maxMana,
        attack: classData.baseStats.attack,
        defense: classData.baseStats.defense,
        speed: classData.baseStats.speed
      },
      inventory: [],
      equipment: {},
      gold: 100
    };

    onCharacterCreate(character);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="rpg-card w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-primary mb-2">
            Create Your Hero
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Choose your class and begin your adventure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Character Name */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-primary">Hero Name</label>
            <Input
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="Enter your hero's name..."
              className="text-lg h-12"
            />
          </div>

          {/* Class Selection */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Choose Your Class</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(CHARACTER_CLASSES).map(([classKey, classData]) => {
                const Icon = classIcons[classKey as CharacterClass];
                const isSelected = selectedClass === classKey;
                
                return (
                  <Card
                    key={classKey}
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'rpg-glow border-primary bg-card/80' 
                        : 'hover:border-primary/50 hover:bg-card/60'
                    }`}
                    onClick={() => setSelectedClass(classKey as CharacterClass)}
                  >
                    <CardContent className="p-6 text-center space-y-4">
                      <Icon className={`w-12 h-12 mx-auto ${classData.color}`} />
                      <div>
                        <h4 className="text-xl font-bold text-primary">{classData.name}</h4>
                        <p className="text-muted-foreground text-sm mt-2">
                          {classData.description}
                        </p>
                      </div>
                      
                      {/* Stats Preview */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Health:</span>
                          <span className="text-health font-semibold">{classData.baseStats.baseHealth}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mana:</span>
                          <span className="text-mana font-semibold">{classData.baseStats.baseMana}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Attack:</span>
                          <span className="text-primary font-semibold">{classData.baseStats.attack}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Defense:</span>
                          <span className="text-silver font-semibold">{classData.baseStats.defense}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Speed:</span>
                          <span className="text-energy font-semibold">{classData.baseStats.speed}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Create Button */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={handleCreateCharacter}
              disabled={!characterName.trim()}
              className="rpg-button text-lg px-8 py-4 h-auto"
            >
              Begin Adventure
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};