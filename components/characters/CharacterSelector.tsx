'use client';

import { useState } from 'react';
import { Character } from '@/types/character';
import { DEFAULT_CHARACTERS } from '@/data/characters';
import { CharacterCard } from './CharacterCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { nanoid } from 'nanoid';

interface CharacterSelectorProps {
  selectedCharacters: Character[];
  onSelectionChange: (characters: Character[]) => void;
  minSelection?: number;
  maxSelection?: number;
}

export function CharacterSelector({
  selectedCharacters,
  onSelectionChange,
  minSelection = 2,
  maxSelection = 20,
}: CharacterSelectorProps) {
  const [customName, setCustomName] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [allCharacters, setAllCharacters] = useState<Character[]>(DEFAULT_CHARACTERS);

  const toggleCharacter = (character: Character) => {
    const isSelected = selectedCharacters.some((c) => c.id === character.id);

    if (isSelected) {
      onSelectionChange(selectedCharacters.filter((c) => c.id !== character.id));
    } else {
      if (selectedCharacters.length < maxSelection) {
        onSelectionChange([...selectedCharacters, character]);
      }
    }
  };

  const addCustomCharacter = () => {
    if (!customName.trim()) return;

    const newCharacter: Character = {
      id: nanoid(),
      name: customName.trim(),
      description: customDescription.trim() || undefined,
      isCustom: true,
    };

    setAllCharacters([...allCharacters, newCharacter]);
    onSelectionChange([...selectedCharacters, newCharacter]);
    setCustomName('');
    setCustomDescription('');
  };

  const isSelected = (character: Character) =>
    selectedCharacters.some((c) => c.id === character.id);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Seleccionar Personajes
          </h2>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {selectedCharacters.length} seleccionados (mín: {minSelection})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {allCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              selected={isSelected(character)}
              onSelect={() => toggleCharacter(character)}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
        <h3 className="text-md font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
          Agregar Personaje Personalizado
        </h3>
        <div className="space-y-3">
          <Input
            placeholder="Nombre del personaje"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
          />
          <Input
            placeholder="Descripción (opcional)"
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
          />
          <Button
            onClick={addCustomCharacter}
            variant="secondary"
            disabled={!customName.trim()}
            className="w-full"
          >
            Agregar Personaje
          </Button>
        </div>
      </div>
    </div>
  );
}
